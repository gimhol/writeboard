import { EventEnum, Events } from "../event"
import { IFactory, IShapesMgr } from "../mgr"
import { TextTool } from "../shape"
import { IShapeData, Shape, ShapeData } from "../shape/base"
import { ITool, ToolEnum, ToolType } from "../tools"
import { IDot, IRect, Rect } from "../utils"
import { ISnapshot } from "./ISnapshot"
import { ILayerInits, Layer } from "./Layer"

export interface BoardOptions {
  element?: HTMLElement;
  layers?: ILayerInits[]
  width?: number
  height?: number
  toolType?: ToolType
}
const Tag = '[Board]'

export class Board {
  private _factory: IFactory
  private _toolType: ToolType = ToolEnum.Pen
  private _layers = new Map<string, Layer>();
  private _shapesMgr: IShapesMgr
  private _mousedown = false
  private _tools: { [key in ToolEnum | string]?: ITool } = {}
  private _tool: ITool | undefined
  private _selects: Shape[] = []
  private _element: HTMLElement;
  private _operator = 'whiteboard'
  private _editingLayerId: string = '';
  private _width = 512;
  private _height = 512;

  get width() {
    return this._width;
  }
  set width(v: number) {
    this._width = v;
    this._layers.forEach(l => l.width = v);
  }
  get height() {
    return this._height;
  }
  set height(v: number) {
    this._height = v;
    this._layers.forEach(l => l.height = v);
  }

  addLayer(layer: ILayerInits | Layer): boolean {
    if (this._layers.has(layer.info.id)) {
      console.error(`[WhiteBoard] addLayer(): layerId already existed! id = ${layer.info.id}`)
      return false;
    }
    if (layer instanceof Layer) {
      layer.width = this.width;
      layer.height = this.height;
      layer.onscreen.style.pointerEvents = 'none';
      this._element.appendChild(layer.onscreen);
      this._layers.set(layer.info.id, layer);
      this.dispatchEvent(new CustomEvent(EventEnum.LayerAdded, { detail: layer }));
      this.markDirty({ x: 0, y: 0, w: this.width, h: this.height })
    } else {
      layer = this.factory.newLayer(layer);
      this.addLayer(layer);
    }
    return true;
  }
  removeLayer(layerId: string): boolean {
    const layer = this._layers.get(layerId);
    if (!layer) {
      console.error(`[WhiteBoard] removeLayer(): layer not found! id = ${layerId}`)
      return false;
    }
    this._layers.delete(layerId);
    this._element.removeChild(layer.onscreen);
    this.dispatchEvent(new CustomEvent(EventEnum.LayerRemoved, { detail: layer }));
    return true;
  }
  editLayer(layerId: string): boolean {
    if (!this._layers.has(layerId)) {
      console.error(`[WhiteBoard] editLayer(): layer not found! id = ${layerId}`)
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
    if (!layers.length) { return; }
    layers.forEach(v => this.addLayer(v));
    this.editLayer(layers[0].info.id);
  }
  get layers(): Layer[] { return Array.from(this._layers.values()) }

  constructor(factory: IFactory, options: BoardOptions) {
    this._factory = factory;
    this._shapesMgr = this._factory.newShapesMgr();
    this._element = options.element ?? document.createElement('div');

    options.width && (this._width = options.width)
    options.height && (this._height = options.height)
    options.toolType && (this._toolType = options.toolType)

    const layers: ILayerInits[] = options.layers ?? []
    if (!layers.length) {
      layers.push({
        info: {
          id: factory.newLayerId(),
          name: factory.newLayerName(),
        }
      })
    }
    this.addLayers(layers);

    this._element.addEventListener('pointerdown', this.pointerdown);
    this._element.tabIndex = 0;
    this._element.style.outline = 'none';
    window.addEventListener('pointermove', this.pointermove);
    window.addEventListener('pointerup', this.pointerup);
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
      s: this.shapes().map(v => v.data)
    }
  }

  fromSnapshot(snapshot: ISnapshot) {
    this.removeAll(false);
    Array.from(this._layers.keys()).forEach((layerId) => this.removeLayer(layerId))
    this.addLayers(snapshot.l.map(info => ({ info })));
    const shapes = snapshot.s.map((v: IShapeData) => this.factory.newShape(v))
    this.add(shapes, false);
  }
  toJson(): string {
    return JSON.stringify(this.toSnapshot())
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
  hit(rect: IRect): Shape<ShapeData> | null {
    return this._shapesMgr.hit(rect)
  }
  hits(rect: IRect): Shape<ShapeData>[] {
    return this._shapesMgr.hits(rect)
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
  setToolType(to: ToolType) {
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
      operator: this._operator,
      from, to
    })

    this._tool?.end()
    this._tool = this._factory.newTool(to)
    if (!this._tool) {
      console.error('toolType not supported. got ', to)
      return;
    }
    this._tool.board = this
    this._tools[to] = this._tool
    this._tool.start()

  }
  get selects() {
    return this._selects
  }

  add(shape: Shape, emit: boolean): number;
  add(shapes: Shape[], emit: boolean): number;
  add(arg0: Shape[] | Shape, emit: boolean): number {
    const shapes = Array.isArray(arg0) ? arg0 : [arg0];
    if (!shapes.length) return 0
    const ret = this._shapesMgr.add(...shapes)
    shapes.forEach(item => {
      item.board = this
      if (item.selected) this._selects.push(item)
      this.markDirty(item.boundingRect())
    })
    if (emit) {
      this.emitEvent(EventEnum.ShapesAdded, {
        isAction: false,
        shapeDatas: shapes.map(v => v.data.copy())
      })
    }

    return ret
  }

  remove(shape: Shape, emit: boolean): number;
  remove(shapes: Shape[], emit: boolean): number;
  remove(arg0: Shape[] | Shape, emit: boolean): number {
    const shapes = Array.isArray(arg0) ? arg0 : [arg0];
    if (!shapes.length) return 0
    this.setSelects(this.selects.filter(a => !shapes.find(b => a === b)), emit);

    if (emit) {
      const removeds = shapes.map(v => v.data);
      removeds.length && this.emitEvent(EventEnum.ShapesRemoved, {
        isAction: true, shapeDatas: removeds
      })
    }

    const ret = this._shapesMgr.remove(...shapes)
    shapes.forEach(item => {
      this.markDirty(item.boundingRect())
      item.board = undefined
    })

    return ret
  }

  removeAll(emit: boolean) {
    return this.remove(this._shapesMgr.shapes(), emit)
  }

  removeSelected(emit: boolean) {
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
  selectAll(emit: boolean): Shape[] {
    return this.setSelects([...this.shapes()], emit)[0];
  }

  /**
   * 取消选择
   * 
   * @param {true} [emit] 是否发射事件
   * @return {Shape[]} ？？？
   * @memberof Board
   */
  deselect(emit: boolean): Shape[] {
    return this.setSelects([], emit)[1];
  }

  /**
   * 选中指定区域内的图形，指定区域以外的会被取消选择
   *
   * @param {IRect} rect
   * @return {[Shape[], Shape[]]} [新选中的图形的数组, 取消选择的图形的数组]
   * @param {true} [emit] 是否发射事件
   * @memberof Board
   */
  selectAt(rect: IRect, emit: boolean): [Shape[], Shape[]] {
    const hits = this._shapesMgr.hits(rect);
    return this.setSelects(hits, emit);
  }

  setSelects(shapes: Shape[], emit: boolean): [Shape[], Shape[]] {
    const selecteds = shapes.filter(v => !v.selected);
    const desecteds = this._selects.filter(a => !shapes.find(b => a === b))
    desecteds.forEach(v => v.selected = false)
    selecteds.forEach(v => v.selected = true)
    this._selects = shapes
    if (emit) {
      selecteds.length && this.emitEvent(EventEnum.ShapesSelected, selecteds.map(v => v.data));
      desecteds.length && this.emitEvent(EventEnum.ShapesDeselected, desecteds.map(v => v.data));
    }
    return [selecteds, desecteds]
  }

  getDot(ev: MouseEvent | PointerEvent): IDot {
    const layer = this.layer();
    const ele = layer.onscreen;
    const { width: w, height: h, left, top } = ele.getBoundingClientRect()
    const sw = ele.width / w
    const sh = ele.height / h
    const { pressure = 0.5 } = ev as any
    return {
      x: Math.floor(sw * (ev.clientX - left)),
      y: Math.floor(sh * (ev.clientY - top)),
      p: pressure
    }
  }
  get tools() { return this._tools }
  get tool() { return this._tool }

  pointerdown = (e: PointerEvent) => {
    if (e.button !== 0) {
      e.preventDefault()
      e.stopPropagation()
      return
    }
    this._mousedown = true;
    this.tool?.pointerDown(this.getDot(e))
    e.stopPropagation();
  }

  pointermove = (e: PointerEvent) => {
    if (!this._mousedown) { return; }
    if (this._mousedown) {
      this.tool?.pointerDraw(this.getDot(e));
    } else {
      this.tool?.pointerMove(this.getDot(e))
    }
    e.stopPropagation();
  }

  pointerup = (e: PointerEvent) => {
    if (!this._mousedown) { return; }

    this._mousedown = false
    this.tool?.pointerUp(this.getDot(e))
    e.stopPropagation();
  }

  private _dirty: IRect | undefined
  markDirty(rect: IRect) {
    const requestRender = !this._dirty
    this._dirty = this._dirty ? Rect.bounds(this._dirty, rect) : rect
    requestRender && requestAnimationFrame(() => this.render())
  }
  render() {
    const dirty = this._dirty
    if (!dirty)
      return

    this._layers.forEach(layer => {
      layer.ctx.clearRect(dirty.x, dirty.y, dirty.w, dirty.h)
      layer.octx.clearRect(dirty.x, dirty.y, dirty.w, dirty.h)
    })

    this._shapesMgr.shapes().forEach(v => {
      const br = v.boundingRect();
      const layer = this._layers.get(v.data.layer);
      if (Rect.hit(br, dirty) && layer) v.render(layer.octx)
    })

    this.tool?.render(this.layer().octx)

    this._layers.forEach(layer => {
      const { ctx, offscreen } = layer
      ctx.drawImage(
        offscreen,
        dirty.x, dirty.y, dirty.w, dirty.h,
        dirty.x, dirty.y, dirty.w, dirty.h
      )
    })
    delete this._dirty
  }
}