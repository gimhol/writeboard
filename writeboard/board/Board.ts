import { EventEnum, Events } from "../event"
import { IFactory, IHitPredicate, IShapesMgr } from "../mgr"
import { TextTool } from "../shape"
import { IShapeData, Shape } from "../shape/base"
import { ITool, ToolEnum, ToolType } from "../tools"
import { IDot, IRect, IVector, Rect } from "../utils"
import { IShapeDecoration } from "./IShapeDecoration"
import type { ISnapshot } from "./ISnapshot"
import { ILayerInits, Layer } from "./Layer"
const { floor, ceil, min, max } = Math;
/**
 * 事件发射选项：true = 用 board.whoami 作为操作者；对象形式可指定操作者与事务 id
 *
 * Emit options: `true` uses board.whoami as the actor; the object form also carries the
 * transaction id (`tx`), which lets the ActionQueue merge one gesture into one record.
 */
export type EmitOpts = boolean | { operator: string, tx?: string }
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
  private _selectorPrev: ToolType | undefined = void 0
  private _secondary = false

  readonly shapeDecoration: IShapeDecoration;

  /**
   * 是否允许用户拉伸图形
   * 
   * @type {boolean}
   */
  shapeResizble: boolean = true;

  /**
   * 是否允许用户旋转图形
   *
   * @type {boolean}
   */
  shapeRotatable: boolean = true;

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

  private read_emit_opts = (opts: EmitOpts | null | undefined, fn: (operator: string, tx?: string) => any) => {
    if (!opts) return;
    const operator = typeof opts === 'boolean' ? this.whoami : opts.operator;
    fn(operator, typeof opts === 'boolean' ? void 0 : opts.tx)
  }

  set_world_rect(to: IRect, opts?: EmitOpts) {
    if (Rect.equal(this._world, to)) return;
    const form = this._world.pure();
    this._world.x = to.x;
    this._world.y = to.y;
    this._world.w = to.w;
    this._world.h = to.h;
    this.markViewDirty();
    /** 滚动时自绘光标要继续钉在指针的屏幕位置上：按世界坐标偏移反向修正 */
    const indicator = this._tool?.indicator;
    if (indicator?.visible) {
      const { x, y, w, h } = indicator.data;
      indicator.geo(x + form.x - to.x, y + form.y - to.y, w, h);
    }
    this.read_emit_opts(opts, (operator) => {
      this.emit(EventEnum.WorldRectChanged, { operator, form, to: this._world.pure() })
    })
  }

  set_viewport(to: IRect, opts?: EmitOpts) {
    if (Rect.equal(this._viewport, to)) return;
    const form = this._viewport.pure();
    /**
     * 视口原点没变时，画布内世界坐标的映射没变：画布上已有的内容在世界坐标里依然有效，
     * 所以改尺寸不整幅重绘，只把新露出来的那条带标脏（尺寸没长出来就一点不画）
     */
    const keep = form.x === to.x && form.y === to.y;
    const first = this._layers.values().next().value;
    const ow = first ? first.width : 0;
    const oh = first ? first.height : 0;
    this._viewport.read(to)
    this._layers.forEach(l => l.resize(this._viewport.w, this._viewport.h, keep));
    const nw = first ? first.width : 0;
    const nh = first ? first.height : 0;
    if (!keep) {
      this.markViewDirty();
    } else if (nw > ow || nh > oh) {
      // markDirty 只留包围盒，两个方向一起长出来时按整块算
      const both = nw > ow && nh > oh;
      const bx = both || nw <= ow ? 0 : ow;
      const by = both || nh <= oh ? 0 : oh;
      const bw = both || nw <= ow ? nw : nw - ow;
      const bh = both || nh <= oh ? nh : nh - oh;
      this.markDirty({
        x: bx - this._viewport.x - this._world.x,
        y: by - this._viewport.y - this._world.y,
        w: bw,
        h: bh
      })
    }
    this.read_emit_opts(opts, (operator) => {
      this.emit(EventEnum.ViewportChanged, { operator, form, to: this._viewport.pure() })
    })
  }

  scroll_by(x: number, y: number, opts?: EmitOpts): this {
    return this.scroll_to(
      -this.world.x + x,
      -this.world.y + y,
      opts
    );
  }

  /**
   * 添加图层
   *
   * @param {ILayerInits | Layer | undefined} layer 图层初始化参数 / 图层实例（缺省新建）
   * @param {EmitOpts} [opts] 事件发射选项
   * @return {boolean} 是否添加成功
   * @memberof Board
   */
  addLayer(layer: ILayerInits | Layer | undefined, opts?: EmitOpts): boolean {
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
      const l = layer;
      l.width = this.width;
      l.height = this.height;
      l.onscreen.style.pointerEvents = 'none';
      this._element.appendChild(l.onscreen);
      this._layers.set(l.info.id, l);
      this.read_emit_opts(opts, (operator) => {
        this.emit(EventEnum.LayerAdded, { operator, layer: l.info.pure() })
      })
      this.markViewDirty()
    } else {
      layer = this.factory.newLayer(layer);
      this.addLayer(layer);
    }
    return true;
  }

  /**
   * 标记整个视口为脏（触发重绘）
   *
   * @return {this} 便于链式调用
   * @memberof Board
   */
  markViewDirty(): this {
    this.markDirty({
      x: -this.world.x,
      y: -this.world.y,
      w: this.viewport.w,
      h: this.viewport.h
    })
    return this;
  }

  /**
   * 移除指定图层
   *
   * @param {string} layerId 图层ID
   * @param {EmitOpts} [opts] 事件发射选项
   * @return {boolean} 是否移除成功（不存在返回 false）
   * @memberof Board
   */
  removeLayer(layerId: string, opts?: EmitOpts): boolean {
    const layer = this._layers.get(layerId);
    if (!layer) {
      console.error(`[${Tag}::editLayer] removeLayer(): layer not found! id = ${layerId}`)
      return false;
    }
    this._layers.delete(layerId);
    this._element.removeChild(layer.onscreen);
    this.read_emit_opts(opts, operator => {
      this.emit(EventEnum.LayerRemoved, { operator, layer: layer.info.pure() });
    })
    return true;
  }

  /**
   * 切换当前编辑的图层
   *
   * @param {string} layerId 图层ID
   * @return {boolean} 是否切换成功（不存在返回 false）
   * @memberof Board
   */
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

  /**
   * 获取当前编辑的图层
   *
   * @return {Layer | undefined}
   * @memberof Board
   */
  layer(): Layer;

  /**
   * 获取图层
   *
   * @param {string} id 图层ID
   * @return {Layer | undefined}
   * @memberof Board
   */
  layer(id: string): Layer | undefined;
  layer(id: string = this._editingLayerId): Layer | undefined {
    return this._layers.get(id);
  }

  /**
   * 批量添加图层
   *
   * @param {ILayerInits[]} layers 图层初始化参数数组
   * @memberof Board
   */
  addLayers(layers: ILayerInits[]): void {
    if (!layers.length) return;
    layers.forEach(v => this.addLayer(v));
  }
  get layers(): Layer[] { return Array.from(this._layers.values()) }
  get element(): HTMLElement { return this._element }

  /** 画布在屏幕上的显示比例（CSS 像素 ÷ 设计单位）：窗口 / 舞台缩小时会小于 1 */
  get screenScale(): number {
    const w = this._viewport?.w || 0
    const cw = this._element ? this._element.getBoundingClientRect().width : 0
    if (w <= 0 || cw <= 0) return 1
    return cw / w
  }

  /**
   * 屏幕修正后的线宽（设计单位）：画布被缩小时设计单位的线会被等比缩小，
   * 选框等 1 设计单位的细线在小窗口里会细到看不见——这里保证它在屏幕上至少还有 minPx 像素
   */
  screenLineWidth(base: number = 1, minPx: number = 1): number {
    const s = this.screenScale
    return s > 0 ? Math.max(base, minPx / s) : base
  }
  constructor(factory: IFactory, options: BoardOptions) {
    this._factory = factory;
    this._shapesMgr = this._factory.newShapesMgr();
    this._element = options.element ?? document.createElement('div');
    this._own_element = !options.element;
    this.shapeDecoration = factory.newShapeDecoration(this)
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
    this._element.addEventListener('pointerleave', this._pointerleave);
    this._element.addEventListener('wheel', this._wheel);
    this._element.tabIndex = 0;
    this._element.style.outline = 'none';
    window.addEventListener('pointermove', this._pointermove);
    window.addEventListener('pointerup', this._pointerup);
    window.addEventListener('keydown', this._keydown);
  }

  /**
   * 按 id 查找图形
   *
   * @param {string} id 图形ID
   * @return {Shape | null} 图形（无则 null）
   * @memberof Board
   */
  find(id: string): Shape | null {
    return this._shapesMgr.find(id)
  }

  /**
   * 导出画布快照（尺寸 / 图层 / 图形数据）
   *
   * @return {ISnapshot} 快照数据
   * @memberof Board
   */
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

  /**
   * 载入画布快照（覆盖当前全部图层与图形）
   *
   * @param {ISnapshot} snapshot 快照数据
   * @memberof Board
   */
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

  /**
   * 导出画布快照 JSON
   *
   * @param {Function} [replacer] JSON.stringify 的 replacer
   * @param {string | number} [space] JSON.stringify 的 space（缩进）
   * @return {string} 快照 JSON
   * @memberof Board
   */
  toJson(replacer?: (this: any, key: string, value: any) => any, space?: string | number): string {
    return JSON.stringify(this.toSnapshot(), replacer, space)
  }

  /**
   * 载入画布快照 JSON（覆盖当前全部图层与图形）
   *
   * @param {string} json 快照 JSON
   * @memberof Board
   */
  fromJson(json: string) {
    this.fromSnapshot(JSON.parse(json))
  }

  /**
   * 全部图形（按 z 升序）
   *
   * @return {Shape[]}
   * @memberof Board
   */
  shapes(): Shape[] {
    return this._shapesMgr.shapes()
  }

  /**
   * 统计给定图形中已在画布上的数量（按图形 id 判定）
   *
   * @param {Shape[]} items 图形
   * @return {number} 已在画布上的图形数
   * @memberof Board
   */
  exists(items: Shape[]): number {
    return this._shapesMgr.exists(items)
  }

  /**
   * 命中检测：取区域内最上层的图形
   *
   * @param {IRect} rect 区域（世界坐标）
   * @param {IHitPredicate} [predicate] 筛选函数
   * @return {Shape | null} 命中的图形（无则 null）
   * @memberof Board
   */
  hit(rect: IRect, predicate?: IHitPredicate): Shape | null {
    return this._shapesMgr.hit(rect, predicate)
  }

  /**
   * 命中检测：取区域内的全部图形（自上而下）
   *
   * @param {IRect} rect 区域（世界坐标）
   * @param {IHitPredicate} [predicate] 筛选函数
   * @return {Shape[]} 命中的图形（自上而下排列）
   * @memberof Board
   */
  hits(rect: IRect, predicate?: IHitPredicate): Shape[] {
    return this._shapesMgr.hits(rect, predicate)
  }

  private _listeners = new Map<any, Set<((p: any) => any) & { once?: boolean }>>();

  /**
   * 监听事件（仅触发一次，触发后自动移除）
   *
   * @param {string | keyof Events.IDetailMap} type 事件类型
   * @param {Function} listener 事件回调
   * @return {() => void} 解绑函数
   * @memberof Board
   */
  once(type: string, listener: (data: Events.IBaseDetail) => any): () => void
  once<K extends keyof Events.IDetailMap>(type: K, listener: (data: Events.IDetailMap[K]) => any): () => void
  once<K extends keyof Events.IDetailMap>(type: K, listener: (data: Events.IDetailMap[K]) => any): () => void {
    const real_listener = (data: Events.IDetailMap[K]) => listener(data);
    real_listener.once = true;
    return this.on(type, real_listener);
  }

  /**
   * 监听事件
   *
   * @param {string | keyof Events.IDetailMap} type 事件类型
   * @param {Function} listener 事件回调
   * @return {() => void} 解绑函数
   * @memberof Board
   */
  on(type: string, listener: (data: Events.IBaseDetail) => any): () => void
  on<K extends keyof Events.IDetailMap>(type: K, listener: (data: Events.IDetailMap[K]) => any): () => void;
  on<K extends keyof Events.IDetailMap>(type: K, listener: (data: Events.IDetailMap[K]) => any): () => void {
    const set = this._listeners.get(type) ?? new Set();
    this._listeners.set(type, set)
    set.add(listener);
    return () => this.off(type, listener);
  }

  /**
   * 移除事件监听
   *
   * @param {string | keyof Events.IDetailMap} type 事件类型
   * @param {Function} listener 事件回调
   * @memberof Board
   */
  off<K extends keyof Events.IDetailMap>(type: K, listener: (data: Events.IDetailMap[K]) => any): void {
    const set = this._listeners.get(type)
    if (!set) return
    set.delete(listener)
    if (!set.size) this._listeners.delete(type)
    return;
  }

  /**
   * 触发事件
   *
   * @param {keyof Events.IDetailMap} k 事件类型
   * @param {Events.IEmit} detail 事件数据
   * @memberof Board
   */
  emit<K extends keyof Events.IDetailMap>(k: K, detail: Events.IEmit<Events.IDetailMap[K]>) {
    const set = this._listeners.get(k)
    if (!set) return;
    const onces = [];
    for (const l of set) {
      l({ timeStamp: Date.now(), type: k, ...detail })
      if (l.once) onces.push(l);
    };
    for (const l of onces) set.delete(l)
  }

  get factory() { return this._factory }
  set factory(v) { this._factory = v }

  /**
   * 当前编辑的图层屏幕画布的 2D 上下文
   *
   * @return {CanvasRenderingContext2D}
   * @memberof Board
   */
  ctx(): CanvasRenderingContext2D
  /**
   * 图层屏幕画布的 2D 上下文（缺省 = 当前编辑的图层）
   *
   * @param {string} layerId 图层ID
   * @return {CanvasRenderingContext2D | null | undefined}
   * @memberof Board
   */
  ctx(layerId: string): CanvasRenderingContext2D | null | undefined
  ctx(layerId: string = this._editingLayerId): CanvasRenderingContext2D | null | undefined {
    return this.onscreen(layerId)?.getContext('2d');
  }

  /**
   * 当前编辑的图层离屏画布的 2D 上下文
   *
   * @return {CanvasRenderingContext2D}
   * @memberof Board
   */
  octx(): CanvasRenderingContext2D
  /**
   * 图层离屏画布的 2D 上下文
   *
   * @param {string} layerId 图层ID
   * @return {CanvasRenderingContext2D | null | undefined}
   * @memberof Board
   */
  octx(layerId: string): CanvasRenderingContext2D | null | undefined
  octx(layerId: string = this._editingLayerId): CanvasRenderingContext2D | null | undefined {
    return this.offscreen(layerId)?.getContext('2d')
  }

  /**
   * 当前编辑图层屏幕画布
   *
   * @return {HTMLCanvasElement | undefined}
   * @memberof Board
   */
  onscreen(): HTMLCanvasElement;

  /**
   * 图层屏幕画布
   *
   * @param {string} layerId 图层ID
   * @return {HTMLCanvasElement | undefined}
   * @memberof Board
   */
  onscreen(layerId: string): HTMLCanvasElement | undefined;
  onscreen(layerId: string = this._editingLayerId): HTMLCanvasElement | undefined {
    return this.layer(layerId)?.onscreen;
  }

  /**
   * 当前编辑图层离屏画布
   *
   * @return {HTMLCanvasElement}
   * @memberof Board
   */
  offscreen(): HTMLCanvasElement;

  /**
   * 图层离屏画布
   *
   * @param {string} layerId 图层ID
   * @return {HTMLCanvasElement | undefined}
   * @memberof Board
   */
  offscreen(layerId: string): HTMLCanvasElement | undefined;
  offscreen(layerId: string = this._editingLayerId): HTMLCanvasElement | undefined {
    return this.layer(layerId)?.offscreen;
  }

  get toolType() { return this._toolType }
  set toolType(v) { this.setToolType(v) }
  /**
   * 切换当前工具（触发 ToolChanged 事件）
   *
   * @param {ToolType | undefined} to 工具类型（undefined = 无工具）
   * @memberof Board
   */
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
    if (to !== ToolEnum.Selector) this._selectorPrev = void 0
    this.emit(EventEnum.ToolChanged, {
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
  /**
   * 临时切换到选择工具：记住当前工具，选择被清空后自动切回
   *
   * 右键框选 / 全选等程序性选中都走它；用户主动切换到别的工具则作废记忆
   *
   * @memberof Board
   */
  tempSelect(): void {
    if (this._toolType !== ToolEnum.Selector) {
      this._selectorPrev = this._toolType
    }
    this.setToolType(ToolEnum.Selector)
  }
  private _restoreSelector(): void {
    if (this._selectorPrev === void 0 || this._selects.length) return
    const back = this._selectorPrev
    this._selectorPrev = void 0
    this.setToolType(back)
  }
  get selects() {
    return this._selects
  }
  /**
   * 添加图形
   *
   * @note 同 id 已存在的图形会被跳过（不重复添加）
   * @param {Shape[] | Shape} shapes 图形（单个或数组）
   * @param {EmitOpts} [opts] 事件发射选项
   * @return {number} 实际添加的图形数
   * @memberof Board
   */
  add(shapes: Shape[] | Shape, opts?: EmitOpts): number {
    shapes = Array.isArray(shapes) ? shapes : [shapes];
    if (!shapes.length) return 0;
    const ret = this._shapesMgr.add(shapes)
    shapes.forEach(item => {
      item.board = this
      const l = item.data.layer
      if (!l || !this._layers.has(l)) item.data.layer = this._editingLayerId
      if (item.selected) this._selects.push(item)
      this.markDirty(item.aabb())
    })
    this.read_emit_opts(opts, (operator, tx) => {
      this.emit(EventEnum.ShapesAdded, {
        operator,
        tx,
        shapeDatas: shapes.map(v => v.data.copy())
      })
    })
    return ret
  }

  /**
   * 移除图形
   *
   * @note 被移除的图形若处于选中状态，会先取消选择
   * @param {Shape[] | Shape} shapes 图形（单个或数组）
   * @param {EmitOpts} [opts] 事件发射选项
   * @return {number} 实际移除的图形数
   * @memberof Board
   */
  remove(shapes: Shape[] | Shape, opts?: EmitOpts): number {
    shapes = Array.isArray(shapes) ? shapes : [shapes];

    if (!shapes.length) return 0

    this.setSelects(this._selects.filter(a => !shapes.find(b => a === b)), opts);

    this.read_emit_opts(opts, (operator, tx) => {
      this.emit(EventEnum.ShapesRemoved, {
        operator,
        tx,
        shapeDatas: shapes.map(v => v.data)
      })
    })
    shapes.forEach(item => this.markDirty(item.aabb()))
    const ret = this._shapesMgr.remove(shapes);
    shapes.forEach(item => { item.board = void 0 })
    return ret
  }

  /**
   * 移除全部图形
   *
   * @param {EmitOpts} [emit] 事件发射选项
   * @return {number} 实际移除的图形数
   * @memberof Board
   */
  removeAll(emit?: EmitOpts): number {
    return this.remove(this._shapesMgr.shapes(), emit)
  }

  /**
   * 移除被选中的图形
   *
   * @note 锁定图形会被跳过
   * @param {EmitOpts} [emit] 事件发射选项
   * @memberof Board
   */
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

    /** 全部新选择的图形 */
    const selected_shapes = new Set(shapes);

    /** 全部新选择的组合ID */
    const selected_group_ids = new Set<string>();
    for (const shape of shapes) { if (shape.groupId) selected_group_ids.add(shape.groupId); }

    /** 确保组合的其他图形也被选择 */
    for (const group_id of selected_group_ids) {
      const shapes = this._shapesMgr.shapes_by_group(group_id);
      for (const shape of shapes) selected_shapes.add(shape)
    }

    /** 新的被选择图形 */
    const next_selecteds: Shape[] = []
    for (const shape of selected_shapes) {
      if (!shape.selected)
        next_selecteds.push(shape)
    }

    const next_desecteds = this._selects.filter(a => !next_selecteds.find(b => a === b))
    const affected = new Set(this._selects)
    selected_shapes.forEach(v => affected.add(v))
    next_desecteds.forEach(v => v.selected = false)
    next_selecteds.forEach(v => v.selected = true)
    this._selects = Array.from(selected_shapes)
    affected.forEach(v => this.markDirty(v.aabb()))

    this.read_emit_opts(opts, (operator) => {
      next_selecteds.length && this.emit(EventEnum.ShapesSelected, {
        operator,
        shapeDatas: next_selecteds.map(v => v.data)
      });
      next_desecteds.length && this.emit(EventEnum.ShapesDeselected, {
        operator,
        shapeDatas: next_desecteds.map(v => v.data)
      });
    })

    if (!this.lb_down && !this._mousebuttons[2]) this._restoreSelector()

    return [next_selecteds, next_desecteds]
  }

  /**
   * 屏幕坐标转世界坐标
   *
   * @param {number} x 屏幕坐标x
   * @param {number} y 屏幕坐标y
   * @return {[number, number]} 世界坐标
   * @memberof Board
   */
  map2world(x: number, y: number): [number, number] {
    const layer = this.layer();
    const ele = layer.onscreen;
    const { width: w, height: h, left, top } = ele.getBoundingClientRect()
    const sw = ele.width / w
    const sh = ele.height / h
    return [sw * (x - left) - this._world.x, sh * (y - top) - this._world.y]
  }

  /**
   * 鼠标/指针事件转世界坐标点
   *
   * @param {MouseEvent | PointerEvent} ev 鼠标/指针事件
   * @return {IDot} 世界坐标点（含压感，缺省 0.5）
   * @memberof Board
   */
  getDot(ev: MouseEvent | PointerEvent): IDot {
    const { pressure = 0.5 } = ev as any
    const [x, y] = this.map2world(ev.x, ev.y)
    return { x, y, p: pressure }
  }
  get tools() { return this._tools }
  get tool() { return this._tool }

  protected _customCursor: boolean = true
  /**
   * 是否由库自绘光标（默认 true）：关掉后工具不再画自己的指示器，交给浏览器原生光标
   *
   * Whether the library draws its own cursor (default `true`): when off, tools stop
   * drawing their indicator and the browser cursor is used instead.
   *
   * @default true
   */
  get customCursor(): boolean { return this._customCursor }
  set customCursor(v: boolean) {
    if (this._customCursor === v) return
    this._customCursor = v
    if (!v && this._tool?.indicator?.visible) this._tool.indicator.visible = false
  }

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
        const d: Events.IEmit<Events.IToolDetail> = { operator: this.whoami, tool: this.tool, ...dot }
        this.emit(EventEnum.ToolDown, d)
        if (this._toolType !== ToolEnum.Selector && this._selects.length) {
          this.deselect(true)
        }
        this.tool.pointerDown?.(dot)
        e.stopPropagation()
      }
    } else if (e.button === 1) {
      this._world_drag_start_pos = {
        x: -this._world.x + e.x,
        y: -this._world.y + e.y,
      }
      e.stopPropagation()
    } else if (e.button === 2) {
      e.preventDefault()
      e.stopPropagation()
      this.tempSelect()
      const tool = this.tool
      if (tool) {
        this._secondary = true
        tool.pointerDown?.(this.getDot(e), e.button)
      }
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
      const d: Events.IEmit<Events.IToolDetail> = { operator: this.whoami, tool: this.tool, ...dot }
      if (this._secondary) {
        this.tool.pointerDraw?.(dot)
      } else if (this.lb_down) {
        this.emit(EventEnum.ToolDraw, d)
        this.tool.pointerDraw?.(dot);
      } else if (!(e.target instanceof Node) || this._element.contains(e.target)) {
        this.emit(EventEnum.ToolMove, d)
        this.tool.pointerMove?.(dot)
      }
      e.stopPropagation();
    }
  }

  protected _pointerleave = () => {
    if (this.lb_down) return
    this.tool?.pointerLeave?.()
  }


  protected _pointerup = (e: PointerEvent) => {
    if (this._secondary && e.button === 2) {
      this._secondary = false
      this.tool?.pointerUp?.(this.getDot(e), e.button)
      this._restoreSelector()
    } else if (e.button == 0) {
      if (this.tool) {
        const dot = this.getDot(e)
        const d: Events.IEmit<Events.IToolDetail> = { operator: this.whoami, tool: this.tool, ...dot }
        this.emit(EventEnum.ToolUp, d)
        this.tool?.pointerUp?.(dot)
      }
      e.stopPropagation();
      this._restoreSelector()
    }
    this._mousebuttons[e.button] = 0
    if (e.button === 0 && e.target instanceof Node && !this._element.contains(e.target)) {
      this.tool?.pointerLeave?.()
    }
  }

  /**
   * 清除选择：ESC / Ctrl(Cmd)+Shift+A（输入框 / 文本编辑中不抢键）
   *
   * @protected
   * @memberof Board
   */
  protected _keydown = (e: KeyboardEvent) => {
    if (!this._selects.length || this.lb_down) return
    const target = e.target as HTMLElement | null
    if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target?.isContentEditable) return
    if (e.key === 'Escape') {
      this.deselect(true)
      return
    }
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
      e.preventDefault()
      this.deselect(true)
    }
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
    const requested = this._dirty
    if (!requested)
      return
    const first = this._layers.values().next().value
    if (!first) {
      delete this._dirty
      return
    }
    const tx = this._viewport.x + this._world.x
    const ty = this._viewport.y + this._world.y
    const { width: lw, height: lh } = first
    const x = max(requested.x, floor(-tx))
    const y = max(requested.y, floor(-ty))
    const w = min(requested.x + requested.w, ceil(lw - tx)) - x
    const h = min(requested.y + requested.h, ceil(lh - ty)) - y
    if (w <= 0 || h <= 0) {
      delete this._dirty
      return
    }
    const bx0 = max(0, floor(x + tx))
    const by0 = max(0, floor(y + ty))
    const bw = min(lw, ceil(x + tx + w)) - bx0
    const bh = min(lh, ceil(y + ty + h)) - by0
    if (bw <= 0 || bh <= 0) {
      delete this._dirty
      return
    }

    this._layers.forEach(layer => {
      const { octx } = layer
      octx.save()
      octx.clearRect(bx0, by0, bw, bh)
      octx.translate(tx, ty)
      octx.beginPath()
      octx.rect(bx0 - tx, by0 - ty, bw, bh)
      octx.clip()
    })

    const hit = { x: x - 2, y: y - 2, w: w + 4, h: h + 4 }
    this._shapesMgr.shapes().forEach(v => {
      const br = v.aabb();
      if (!Rect.hit(br, hit)) return;
      const layer = this._layers.get(v.data.layer || '');
      if (!layer) return;
      v.render(layer.octx)
    })
    this.tool?.render?.(this.layer().octx)
    this._layers.forEach(layer => {
      const { ctx, octx, offscreen } = layer
      ctx.clearRect(bx0, by0, bw, bh)
      ctx.drawImage(offscreen, bx0, by0, bw, bh, bx0, by0, bw, bh)
      octx.restore()
    })
    delete this._dirty
  }

  /**
   * 销毁画布（移除全部事件监听与图层；自建的元素一并移除）
   *
   * @memberof Board
   */
  destroy() {
    if (this._selectorPrev !== void 0) {
      const back = this._selectorPrev
      this._selectorPrev = void 0
      this.emit(EventEnum.ToolChanged, { operator: this._whoami, from: this._toolType, to: back })
    }
    this._element.removeEventListener('pointerdown', this._pointerdown);
    this._element.removeEventListener('pointerleave', this._pointerleave);
    this._element.removeEventListener('wheel', this._wheel);
    window.removeEventListener('pointermove', this._pointermove);
    window.removeEventListener('pointerup', this._pointerup);
    window.removeEventListener('keydown', this._keydown);
    this._layers.forEach(v => v.destroy())
    if (this._own_element) this._element.remove();
  }

  /**
   * @deprecated 拼写错误，请使用 destroy()
   * @deprecated misspelled, use destroy() instead
   */
  destory() { this.destroy(); }

  /**
   * 图形编组
   * 
   * @note 锁定图形会被跳过
   * @param {Shape[]} shapes 图形
   * @param {string} [groupId] 组合ID（缺省由工厂按图形生成）
   * @param {EmitOpts} [opts] 事件发射选项
   * @return {this} 便于链式调用
   * @memberof Board
   */
  group(shapes: Shape[], groupId: string = this.factory.newGroupId(shapes), opts?: EmitOpts): this {
    const changed_shapes: Shape[] = []
    const shapeDatas: [Readonly<Partial<IShapeData>>, Readonly<Partial<IShapeData>>][] = []
    for (const shape of shapes) {
      if (shape.locked) continue;
      const prev = { g: shape.groupId }
      shape.groupId = groupId
      shapeDatas.push([shape.data.copy(), prev] as const);
      changed_shapes.push(shape)
    }
    this.update_items_group(changed_shapes)
    this.read_emit_opts(opts, (operator) => {
      if (shapeDatas.length) this.emit(EventEnum.ShapesChanged, { operator, shapeDatas })
    })
    return this;
  }

  /**
   * 图形解组
   *
   * @param {Shape[]} shapes 图形
   * @param {EmitOpts} [opts] 事件发射选项
   * @return {this} 便于链式调用
   * @memberof Board
   */
  ungroup(shapes: Shape[], opts?: EmitOpts): this {
    return this.group(shapes, '', opts);
  }

  /**
   * 图形置顶
   *
   * @note 锁定图形会被跳过；图形间的相对次序不变
   * @param {Shape[]} shapes 图形
   * @param {EmitOpts} opts 事件发射选项
   * @return {this} 便于链式调用
   * @memberof Board
   */
  raise(shapes: Shape[], opts: EmitOpts): this {
    if (!shapes.length) return this;
    let zz = this._shapesMgr.maxZ()?.z ?? 0;
    this._shapesMgr.remove(shapes);
    shapes.sort((a, b) => a.z - b.z);
    if (opts) {
      const shapeDatas: [Readonly<Partial<IShapeData>>, Readonly<Partial<IShapeData>>][] = []
      for (let i = 0; i < shapes.length; ++i) {
        const shape = shapes[i];
        if (shape.locked) continue;
        const prev = { z: shape.data.z }
        shape.data.z = ++zz;
        shape.markDirty()
        shapeDatas.push([shape.data.copy(), prev] as const)
      }
      if (shapeDatas.length)
        this.read_emit_opts(opts, (operator) => {
          this.emit(EventEnum.ShapesChanged, { operator, shapeDatas })
        })
    } else {
      for (let i = 0; i < shapes.length; ++i) {
        const shape = shapes[i];
        if (shape.locked) continue;
        shape.data.z = ++zz
        shape.markDirty()
      }
    }
    this._shapesMgr.add(shapes);
    return this;
  }

  /**
   * 图形置底
   *
   * @note 锁定图形会被跳过；图形间的相对次序不变
   * @param {Shape[]} shapes 图形
   * @param {EmitOpts} opts 事件发射选项
   * @return {this} 便于链式调用
   * @memberof Board
   */
  sink(shapes: Shape[], opts: EmitOpts): this {
    if (!shapes.length) return this;
    let zz = this._shapesMgr.minZ()?.z ?? 0;
    this._shapesMgr.remove(shapes);
    shapes.sort((a, b) => a.z - b.z);
    if (opts) {
      const shapeDatas: [Readonly<Partial<IShapeData>>, Readonly<Partial<IShapeData>>][] = []
      for (let i = shapes.length - 1; i >= 0; --i) {
        const shape = shapes[i];
        if (shape.locked) continue;
        const prev = { z: shape.data.z }
        shape.data.z = --zz;
        shape.markDirty()
        shapeDatas.push([shape.data.copy(), prev] as const)
      }
      if (shapeDatas.length)
        this.read_emit_opts(opts, (operator) => {
          this.emit(EventEnum.ShapesChanged, { operator, shapeDatas })
        })
    } else {
      for (let i = shapes.length - 1; i >= 0; --i) {
        const shape = shapes[i];
        if (shape.locked) continue;
        shape.data.z = --zz
        shape.markDirty()
      }
    }
    this._shapesMgr.add(shapes);
    return this;
  }

  /**
   * 更新图形的分组索引
   *
   * @param {Shape[]} shapes 图形
   * @return {this} 便于链式调用
   * @memberof Board
   */
  update_items_group(shapes: Shape[]): this {
    this._shapesMgr.update_items_group(shapes);
    return this;
  }
}