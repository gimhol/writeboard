import { EventEnum, Events } from "../event"
import { IFactory, IHitPredicate, IShapesMgr } from "../mgr"
import { TextTool } from "../shape"
import { IShapeData, Shape, ShapeData } from "../shape/base"
import { ITool, ToolEnum, ToolType } from "../tools"
import { IDot, IRect, IVector, Rect } from "../utils"
import type { ISnapshot } from "./ISnapshot"
import { ILayerInits, Layer } from "./Layer"
const { floor, ceil } = Math;
export type EmitOpts = boolean | { operator: string }
export interface BoardOptions {
  element?: HTMLElement;
  layers?: ILayerInits[];
  width?: number;
  height?: number;
  scrollWidth?: number;
  scrollHeight?: number;
  toolType?: ToolType;
}
const Tag = 'Board'

export class Board {
  protected _factory: IFactory
  protected _toolType: ToolType | undefined = void 0
  protected _layers = new Map<string, Layer>();
  protected _shapesMgr: IShapesMgr
  protected _mousebuttons: { [x in number]?: number } = {}
  protected _tools = new Map<ToolEnum | string, ITool>()
  protected _tool: ITool | undefined
  protected _selects: Shape[] = []
  protected _element: HTMLElement;
  protected _own_element = false;
  protected _whoami = 'local'
  protected _editingLayerId: string = '';
  protected _viewport = new Rect(0, 0, 600, 600)
  protected _world = new Rect(0, 0, 1600, 1600)
  protected _world_drag_start_pos: IVector = { x: 0, y: 0 };

  get lb_down(): boolean { return !!this._mousebuttons[0] }
  get mb_down(): boolean { return !!this._mousebuttons[1] }
  get viewport(): Readonly<Rect> { return this._viewport; }
  get world(): Readonly<Rect> { return this._world; }
  get whoami() { return this._whoami }
  get width() { return this._viewport.w; }

  set width(v: number) {
    const rect = this._viewport.pure()
    rect.w = v;
    this.set_viewport(rect);
  }

  get height() { return this._viewport.h; }

  set height(v: number) {
    const rect = this._viewport.pure()
    rect.h = v;
    this.set_viewport(rect);
  }

  scroll_to(x: number, y: number, opts?: EmitOpts): this {
    const rect = this._world.pure();
    const { min, max } = Math
    rect.x = -max(min(x, this._world.w - this._viewport.w), 0);
    rect.y = -max(min(y, this._world.h - this._viewport.h), 0);
    this.set_world_rect(rect, opts);
    return this;
  }

  private read_emit_opts = (opts: EmitOpts | null | undefined, fn: (operator: string) => any) => {
    if (!opts) return;
    const operator = typeof opts === 'boolean' ? this.whoami : opts.operator;
    fn(operator)
  }

  set_world_rect(to: IRect, opts?: EmitOpts) {
    if (Rect.equal(this._world, to)) return;
    const form = this._world.pure();
    this._world.x = to.x;
    this._world.y = to.y;
    this._world.w = to.w;
    this._world.h = to.h;
    this.markViewDirty();
    this.read_emit_opts(opts, (operator) => {
      this.emitEvent(EventEnum.WorldRectChanged, { operator, form, to: this._world.pure() })
    })
  }

  set_viewport(to: IRect, opts?: EmitOpts) {
    if (Rect.equal(this._viewport, to)) return;
    const form = this._viewport.pure();
    this._viewport.read(to)
    this._layers.forEach(l => {
      l.width = this._viewport.w;
      l.width = this._viewport.h
    });
    this.markViewDirty();
    this.read_emit_opts(opts, (operator) => {
      this.emitEvent(EventEnum.ViewportChanged, { operator, form, to: this._viewport.pure() })
    })
  }

  scroll_by(x: number, y: number, opts?: EmitOpts): this {
    return this.scroll_to(
      -this.world.x + x,
      -this.world.y + y,
      opts
    );
  }

  addLayer(layer: ILayerInits | Layer | undefined): boolean {
    if (!layer) {
      layer = this.factory.newLayer();
      this.addLayer(layer);
      return true;
    }
    if (this._layers.has(layer.id)) {
      console.error(`[${Tag}] addLayer(): layerId already existed! id = ${layer.id}`)
      return false;
    }
    if (layer instanceof Layer) {
      layer.width = this.width;
      layer.height = this.height;
      layer.onscreen.style.pointerEvents = 'none';
      this._element.appendChild(layer.onscreen);
      this._layers.set(layer.info.id, layer);
      this.dispatchEvent(new CustomEvent(EventEnum.LayerAdded, { detail: layer.info.pure() }));
      this.markViewDirty()
    } else {
      layer = this.factory.newLayer(layer);
      this.addLayer(layer);
    }
    return true;
  }

  markViewDirty(): this {
    this.markDirty({
      x: -this.world.x,
      y: -this.world.y,
      w: this.viewport.w,
      h: this.viewport.h
    })
    return this;
  }

  removeLayer(layerId: string): boolean {
    const layer = this._layers.get(layerId);
    if (!layer) {
      console.error(`[${Tag}::editLayer] removeLayer(): layer not found! id = ${layerId}`)
      return false;
    }
    this._layers.delete(layerId);
    this._element.removeChild(layer.onscreen);
    this.dispatchEvent(new CustomEvent(EventEnum.LayerRemoved, { detail: layer.info.pure() }));
    return true;
  }

  editLayer(layerId: string): boolean {
    if (!this._layers.has(layerId)) {
      console.error(`[${Tag}::editLayer] editLayer(): layer not found! id = ${layerId}`)
      return false;
    }
    this._layers.forEach((layer, id) => {
      layer.onscreen.style.pointerEvents = id === layerId ? '' : 'none'
    })
    this._editingLayerId = layerId;
    return true;
  }

  layer(): Layer;
  layer(id: string): Layer | undefined;
  layer(id: string = this._editingLayerId): Layer | undefined {
    return this._layers.get(id);
  }

  addLayers(layers: ILayerInits[]): void {
    if (!layers.length) return;
    layers.forEach(v => this.addLayer(v));
  }
  get layers(): Layer[] { return Array.from(this._layers.values()) }
  get element(): HTMLElement { return this._element }
  constructor(factory: IFactory, options: BoardOptions) {
    this._factory = factory;
    this._shapesMgr = this._factory.newShapesMgr();
    this._element = options.element ?? document.createElement('div');
    this._own_element = !options.element;

    const {
      width = this._viewport.w,
      scrollWidth = width,

      height = this._viewport.h,
      scrollHeight = height,

      toolType = this._toolType,
    } = options;

    this._viewport.w = width
    this._world.w = scrollWidth
    this._viewport.h = height
    this._world.h = scrollHeight
    this._toolType = toolType

    const layers: ILayerInits[] = options.layers ?? []
    if (!layers.length) {
      layers.push({
        id: factory.newLayerId(),
        name: factory.newLayerName(),
      })
    }
    this.addLayers(layers);
    this.editLayer(layers[0].id)
    this._element.addEventListener('pointerdown', this._pointerdown);
    this._element.addEventListener('wheel', this._wheel);
    this._element.tabIndex = 0;
    this._element.style.outline = 'none';
    window.addEventListener('pointermove', this._pointermove);
    window.addEventListener('pointerup', this._pointerup);
  }

  find(id: string): Shape | null {
    return this._shapesMgr.find(id)
  }

  toSnapshot(): ISnapshot {
    return {
      v: 0,
      x: 0,
      y: 0,
      w: this.width,
      h: this.height,
      l: Array.from(this._layers.values()).map(v => v.info),
      s: this.shapes().map(v => v.data.wash())
    }
  }

  fromSnapshot(snapshot: ISnapshot) {
    this.removeAll(false);
    Array.from(this._layers.keys()).forEach((layerId) => this.removeLayer(layerId))
    if (snapshot.l.length) {
      this.addLayers(snapshot.l);
      this.editLayer(snapshot.l[0].id)
    }
    const shapes = snapshot.s.map((v: IShapeData) => this.factory.newShape(v))
    this.add(shapes, false);
  }
  toJson(replacer?: (this: any, key: string, value: any) => any, space?: string | number): string {
    return JSON.stringify(this.toSnapshot(), replacer, space)
  }
  fromJson(json: string) {
    this.fromSnapshot(JSON.parse(json))
  }
  shapes(): Shape<ShapeData>[] {
    return this._shapesMgr.shapes()
  }
  exists(...items: Shape<ShapeData>[]): number {
    return this._shapesMgr.exists(...items)
  }
  hit(rect: IRect, predicate?: IHitPredicate): Shape | null {
    return this._shapesMgr.hit(rect, predicate)
  }
  hits(rect: IRect, predicate?: IHitPredicate): Shape[] {
    return this._shapesMgr.hits(rect, predicate)
  }

  addEventListener<K extends keyof Events.EventMap>(type: K, listener: (this: HTMLDivElement, ev: Events.EventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  addEventListener(arg0: any, arg1: any, arg2: any): void {
    return this._element.addEventListener(arg0, arg1, arg2);
  }


  removeEventListener<K extends keyof Events.EventMap>(type: K, listener: (this: HTMLDivElement, ev: Events.EventMap[K]) => any, options?: boolean | EventListenerOptions): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
  removeEventListener(arg0: any, arg1: any, arg2: any): void {
    return this._element.removeEventListener(arg0, arg1, arg2);
  }

  dispatchEvent(e: CustomEvent<any>): boolean {
    return this._element.dispatchEvent(e)
  }
  emitEvent<K extends keyof Events.EventDetailMap>(k: K, detail: Events.EventDetailMap[K]) {
    return this.dispatchEvent(new CustomEvent(k, { detail }));
  }

  get factory() { return this._factory }
  set factory(v) { this._factory = v }

  ctx(): CanvasRenderingContext2D
  ctx(layerId: string): CanvasRenderingContext2D | null | undefined
  ctx(layerId: string = this._editingLayerId): CanvasRenderingContext2D | null | undefined {
    return this.onscreen(layerId)?.getContext('2d');
  }

  octx(): CanvasRenderingContext2D
  octx(layerId: string): CanvasRenderingContext2D | null | undefined
  octx(layerId: string = this._editingLayerId): CanvasRenderingContext2D | null | undefined {
    return this.offscreen(layerId)?.getContext('2d')
  }

  onscreen(): HTMLCanvasElement;
  onscreen(layerId: string): HTMLCanvasElement | undefined;
  onscreen(layerId: string = this._editingLayerId): HTMLCanvasElement | undefined {
    return this.layer(layerId)?.onscreen;
  }

  offscreen(): HTMLCanvasElement;
  offscreen(layerId: string): HTMLCanvasElement | undefined;
  offscreen(layerId: string = this._editingLayerId): HTMLCanvasElement | undefined {
    return this.layer(layerId)?.offscreen;
  }

  get toolType() { return this._toolType }
  set toolType(v) { this.setToolType(v) }
  setToolType(to: ToolType | undefined) {
    if (this._toolType === to) {
      /* 
      Note：
        使用选择器工具，双击文本编辑文本时，会切换至文本工具。
        这种情况下，文本编辑框失去焦点时，切回选择器工具。
        为了避免使用者在这种状态下，主动选择文本工具后，被切回选择器工具。
        这里将相关回调移除。
      */
      if (this._tool instanceof TextTool && this._tool.selectorCallback) {
        this._tool.editor.removeEventListener('blur', this._tool.selectorCallback);
      }
      return
    }
    const from = this._toolType
    this._toolType = to
    this.emitEvent(EventEnum.ToolChanged, {
      operator: this._whoami,
      from, to
    })

    this._tool?.end?.()
    if (!to) return;
    this._tool = this._factory.newTool(to)
    if (!this._tool) {
      console.error(`[${Tag}::setToolType] toolType not supported. got ${to}`,)
      return;
    }
    this._tool.board = this
    this._tools.set(to, this._tool)
    this._tool.start?.()

  }
  get selects() {
    return this._selects
  }
  add(shapes: Shape[] | Shape, opts?: EmitOpts): number {
    shapes = Array.isArray(shapes) ? shapes : [shapes];
    if (!shapes.length) return 0;
    const ret = this._shapesMgr.add(...shapes)
    shapes.forEach(item => {
      item.board = this
      if (item.selected) this._selects.push(item)
      this.markDirty(item.aabb())
    })
    this.read_emit_opts(opts, (operator) => {
      this.emitEvent(EventEnum.ShapesAdded, {
        operator,
        shapeDatas: shapes.map(v => v.data.copy())
      })
    })
    return ret
  }

  remove(shapes: Shape[] | Shape, opts?: EmitOpts): number {
    shapes = Array.isArray(shapes) ? shapes : [shapes];

    if (!shapes.length) return 0

    const remains = shapes.filter(a => !this.selects.find(b => a === b))
    this.setSelects(remains, opts);

    this.read_emit_opts(opts, (operator) => {
      this.emitEvent(EventEnum.ShapesRemoved, {
        operator,
        shapeDatas: shapes.map(v => v.data)
      })
    })
    shapes.forEach(item => this.markDirty(item.aabb()))
    const ret = this._shapesMgr.remove(...shapes);
    shapes.forEach(item => { item.board = void 0 })
    return ret
  }

  removeAll(emit?: EmitOpts): number {
    return this.remove(this._shapesMgr.shapes(), emit)
  }

  removeSelected(emit?: EmitOpts) {
    this.remove(this._selects.filter(v => !v.locked), emit);
    this._selects = []
  }

  /**
   * 全选图形
   *
   * @param {true} [emit] 是否发射事件
   * @return {Shape[]} 新选中的图形
   * @memberof Board
   */
  selectAll(emit?: EmitOpts): Shape[] {
    return this.setSelects([...this.shapes()], emit)[0];
  }

  /**
   * 取消选择
   * 
   * @param {true} [emit] 是否发射事件
   * @return {Shape[]} ？？？
   * @memberof Board
   */
  deselect(emit?: EmitOpts): Shape[] {
    return this.setSelects([], emit)[1];
  }

  /**
   * 选中指定区域内的图形，指定区域以外的会被取消选择
   *
   * @param {IRect} rect
   * @param {?EmitOpts} opts 事件发射选项
   * @param {?IHitPredicate} predicate 筛选函数
   * @return {[Shape[], Shape[]]} [新选中的图形的数组, 取消选择的图形的数组]
   * @memberof Board
   */
  selectAt(rect: IRect, opts?: EmitOpts, predicate?: IHitPredicate): [Shape[], Shape[]] {
    const hits = this._shapesMgr.hits(rect, predicate);
    return this.setSelects(hits, opts);
  }

  /**
   * 设置被选中的图形，原来被选中的图形数组将被取消选中
   *
   * @param {Shape[]} shapes 被选中的图形
   * @param {(EmitOpts)} [opts]
   * @return {[Shape[], Shape[]]} [被选中的图形数组， 取消选中的图形数组]
   * @memberof Board
   */
  setSelects(shapes: Shape[], opts?: EmitOpts): [Shape[], Shape[]] {
    const selecteds = shapes.filter(v => !v.selected);
    const desecteds = this._selects.filter(a => !shapes.find(b => a === b))
    desecteds.forEach(v => v.selected = false)
    selecteds.forEach(v => v.selected = true)
    this._selects = shapes

    this.read_emit_opts(opts, (operator) => {
      selecteds.length && this.emitEvent(EventEnum.ShapesSelected, {
        operator,
        shapeDatas: selecteds.map(v => v.data)
      });
      desecteds.length && this.emitEvent(EventEnum.ShapesDeselected, {
        operator,
        shapeDatas: desecteds.map(v => v.data)
      });
    })

    return [selecteds, desecteds]
  }

  map2world(x: number, y: number): [number, number] {
    const layer = this.layer();
    const ele = layer.onscreen;
    const { width: w, height: h, left, top } = ele.getBoundingClientRect()
    const sw = ele.width / w
    const sh = ele.height / h
    return [sw * (x - left) - this._world.x, sh * (y - top) - this._world.y]
  }
  getDot(ev: MouseEvent | PointerEvent): IDot {
    const { pressure = 0.5 } = ev as any
    const [x, y] = this.map2world(ev.x, ev.y)
    return { x, y, p: pressure }
  }
  get tools() { return this._tools }
  get tool() { return this._tool }

  /**
   * 鼠标滚动事件
   *
   * @protected
   * @param {WheelEvent} e
   * @memberof Board
   */
  protected _wheel = (e: WheelEvent) => {
    const sx = e.shiftKey ? e.deltaY : 0;
    const sy = e.shiftKey ? 0 : e.deltaY;
    this.scroll_by(sx, sy, true)
  }

  protected _pointerdown = (e: PointerEvent) => {
    this._mousebuttons[e.button] = 1
    if (e.button === 0) {
      if (!this.tool) {
        console.warn(`[${Tag}::_pointerdown] toolType not set`)
        return;
      }
      if (this.tool) {
        const dot = this.getDot(e)
        const d: Events.IToolDetail = { operator: this.whoami, tool: this.tool, ...dot }
        this.emitEvent(EventEnum.ToolDown, d)
        this.tool.pointerDown?.(dot)
        e.stopPropagation()
      }
    } else if (e.button === 1) {
      this._world_drag_start_pos = {
        x: -this._world.x + e.x,
        y: -this._world.y + e.y,
      }
      e.stopPropagation()
    } else {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  protected _pointermove = (e: PointerEvent) => {
    if (this.mb_down) {
      const { x, y } = this._world_drag_start_pos
      this.scroll_to(x - e.x, y - e.y, true)
    }
    if (this.tool) {
      const dot = this.getDot(e)
      const d: Events.IToolDetail = { operator: this.whoami, tool: this.tool, ...dot }
      if (this.lb_down) {
        this.emitEvent(EventEnum.ToolDraw, d)
        this.tool.pointerDraw?.(dot);
      } else {
        this.emitEvent(EventEnum.ToolMove, d)
        this.tool.pointerMove?.(dot)
      }
      e.stopPropagation();
    }
  }


  protected _pointerup = (e: PointerEvent) => {
    if (e.button == 0) {
      if (this.tool) {
        const dot = this.getDot(e)
        const d: Events.IToolDetail = { operator: this.whoami, tool: this.tool, ...dot }
        this.emitEvent(EventEnum.ToolUp, d)
        this.tool?.pointerUp?.(dot)
      }
      e.stopPropagation();
    }
    this._mousebuttons[e.button] = 0
  }

  private _dirty: Readonly<IRect> | undefined;

  /**
   * 标记脏矩形区域，将触发重绘
   * 若在重绘前，连续调用，将会将多个矩形合并一个大的矩形，并仅会触发一次重绘。
   * 
   * 脏矩形必须是整数，否则将导致画面有“脏东西”，所以传入浮点的矩形将被取整后再运算
   * 
   * @param {Readonly<IRect>} rect 新的脏矩形区域
   * @memberof Board
   */
  markDirty(rect: Readonly<IRect>): void {
    const requested = !this._dirty;
    const x = floor(rect.x)
    const y = floor(rect.y)
    const rr: IRect = { x, y, w: ceil(x + rect.w) - x, h: ceil(y + rect.h) - y }
    this._dirty = this._dirty ? Rect.bounds(this._dirty, rr) : rr
    requested && requestAnimationFrame(() => this.render())
  }

  /**
   * 绘制
   * 
   * @memberof Board
   */
  render(): void {
    const dirty = this._dirty
    if (!dirty)
      return

    this._layers.forEach(layer => {
      const { octx } = layer
      octx.save()
      octx.translate(
        this._viewport.x + this._world.x,
        this._viewport.y + this._world.y
      )
      octx.clearRect(dirty.x, dirty.y, dirty.w, dirty.h)
    })

    this._shapesMgr.shapes().forEach(v => {
      const br = v.aabb();
      if (!Rect.hit(br, dirty)) return;
      const layer = this._layers.get(v.data.layer || '');
      if (!layer) return;
      v.render(layer.octx)
    })
    this.tool?.render?.(this.layer().octx)
    this._layers.forEach(layer => {
      const { ctx, octx, offscreen } = layer
      ctx.save()
      const tx = this._viewport.x + this._world.x
      const ty = this._viewport.y + this._world.y
      ctx.translate(tx, ty)
      ctx.clearRect(
        dirty.x,
        dirty.y,
        dirty.w,
        dirty.h
      )
      ctx.drawImage(
        offscreen,
        dirty.x + tx,
        dirty.y + ty,
        dirty.w,
        dirty.h,
        dirty.x,
        dirty.y,
        dirty.w,
        dirty.h
      )
      ctx.restore()
      octx.restore()
    })
    delete this._dirty
  }

  destory() {
    this._element.removeEventListener('pointerdown', this._pointerdown);
    this._element.removeEventListener('wheel', this._wheel);
    window.removeEventListener('pointermove', this._pointermove);
    window.removeEventListener('pointerup', this._pointerup);

    this._layers.forEach(v => v.destory())
    if (this._own_element) this._element.remove();
  }
}