import {
  BaseEvent,
  Emitter, EventMap,
  ICallback,
  IEmitter, IObserver, Listener, Observer,
  ShapesAddedEvent, ShapesRemovedEvent, ToolChangedEvent
} from "../event"
import { IFactory, IShapesMgr } from "../mgr"
import { Shape, ShapeData } from "../shape/base"
import { ITool, ToolEnum, ToolType } from "../tools"
import { IDot, IRect, Rect } from "../utils"
const Tag = '[WhiteBoard]'

export interface ILayerInfoInit {
  readonly name: string;
}
export interface ILayerOptions {
  readonly info: ILayerInfoInit;
  readonly onscreen: HTMLCanvasElement;
}

export interface ILayerInfo {
  name: string;
}
export interface ILayer {
  info: ILayerInfo;
  onscreen: HTMLCanvasElement;
  offscreen: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  octx: CanvasRenderingContext2D;
}
export interface WhiteBoardOptions {
  layers: ILayerOptions[]
  width?: number
  height?: number
  toolType?: ToolType
}
export interface IPointerEventHandler { (ev: PointerEvent): void }
export class WhiteBoard implements IObserver, IEmitter, IShapesMgr {
  private _factory: IFactory
  private _toolType: ToolType = ToolEnum.Pen
  private _layers: ILayer[];
  private _currentLayer?: ILayer;
  private _layerMap: { [x in string]: ILayer | undefined } = {}
  private _shapesMgr: IShapesMgr
  private _mousedown = false
  private _tools: { [key in ToolEnum | string]?: ITool } = {}
  private _tool: ITool | undefined
  private _selects: Shape[] = []
  private _eventsObserver = new Observer()
  private _eventEmitter = new Emitter()
  private _operator = 'whiteboard'
  get width() {
    return this._layers[0].onscreen.width;
  }
  set width(v: number) {
    for (let i = 0; i < this._layers.length; ++i) {
      this._layers[i].onscreen.width = v;
      this._layers[i].offscreen.width = v;
    }
  }
  get height() {
    return this._layers[0].offscreen.height;
  }
  set height(v: number) {
    for (let i = 0; i < this._layers.length; ++i) {
      this._layers[i].onscreen.height = v;
      this._layers[i].offscreen.height = v;
    }
  }
  setCurrentLayer(idx: number): boolean {
    if (idx < 0) { return false }
    if (idx > this._layers.length - 1) { return false }
    for (let i = 0; i < this._layers.length; ++i) {
      this._layers[i].onscreen.style.pointerEvents = 'none'
    }
    this._currentLayer = this._layers[idx];
    this._currentLayer.onscreen.style.pointerEvents = ''
    return true;
  }
  constructor(factory: IFactory, options: WhiteBoardOptions) {
    this._factory = factory
    this._shapesMgr = this._factory.newShapesMgr()
    this._layers = options.layers.map(v => {
      const onscreen = v.onscreen;
      const offscreen = document.createElement('canvas')
      offscreen.width = onscreen.width;
      offscreen.height = onscreen.height;
      const ret: ILayer = {
        info: { ...v.info },
        onscreen,
        offscreen,
        ctx: onscreen.getContext('2d')!,
        octx: offscreen.getContext('2d')!
      };
      this._layerMap[ret.info.name] = ret
      return ret;
    })

    if (options.width) {
      this.width = options.width;
    }
    if (options.height) {
      this.height = options.height;
    }
    this._dirty = { x: 0, y: 0, w: this.onscreen()!.width, h: this.onscreen()!.height }

    for (let i = 0; i < this._layers.length; ++i) {
      this.listenTo(this._layers[i].onscreen, 'pointerdown', this.pointerdown)
      this.listenTo(this._layers[i].onscreen, 'pointermove', this.pointermove)
      this.listenTo(this._layers[i].onscreen, 'pointerup', this.pointerup)
      this._layers[i].onscreen.addEventListener('contextmenu', e => { e.preventDefault(); e.stopPropagation() })
    }
    this.setCurrentLayer(0);
    this.render()


    if (options.toolType) {
      this.toolType = options.toolType;
    }
  }

  finds(ids: string[]): Shape[] {
    return this._shapesMgr.finds(ids)
  }
  find(id: string): Shape | undefined {
    return this._shapesMgr.find(id)
  }
  toJson(): any {
    return {
      x: 0, y: 0,
      w: this._layers[0].onscreen.width,
      h: this._layers[0].onscreen.height,
      shapes: this.shapes().map(v => v.data)
    }
  }
  toJsonStr(): string {
    return JSON.stringify(this.toJson())
  }
  fromJson(jobj: any) {
    this.removeAll()
    this._layers[0].onscreen.width = jobj.w
    this._layers[0].onscreen.height = jobj.h
    this._layers[0].onscreen.width = jobj.w
    this._layers[0].onscreen.height = jobj.h
    const shapes = jobj.shapes.map((v: ShapeData) => this.factory.newShape(v))
    this.add(...shapes)
  }
  fromJsonStr(json: string) {
    this.fromJson(JSON.parse(json))
  }
  shapes(): Shape<ShapeData>[] {
    return this._shapesMgr.shapes()
  }
  exists(...items: Shape<ShapeData>[]): number {
    return this._shapesMgr.exists(...items)
  }
  hit(rect: IRect): Shape<ShapeData> | undefined {
    return this._shapesMgr.hit(rect)
  }
  hits(rect: IRect): Shape<ShapeData>[] {
    return this._shapesMgr.hits(rect)
  }
  addEventListener<K extends keyof EventMap>(type: K, callback: (e: EventMap[K]) => any): Listener;
  addEventListener(type: string, callback: ICallback): Listener {
    return this._eventEmitter.addEventListener(type, callback);
  }
  removeEventListener<K extends keyof EventMap>(type: K, callback: (e: EventMap[K]) => any): void;
  removeEventListener(type: string, callback: ICallback): void {
    return this._eventEmitter.removeEventListener(type, callback);
  }
  dispatchEvent(e: BaseEvent): void {
    return this._eventEmitter.dispatchEvent(e);
  }
  on<K extends keyof EventMap>(type: K, callback: (evt: EventMap[K]) => any): () => void;
  on(type: string, callback: ICallback) {
    return this._eventEmitter.on(type, callback);
  }
  once<K extends keyof EventMap>(type: K, callback: (evt: EventMap[K]) => any): () => void;
  once(type: string, callback: ICallback) {
    return this._eventEmitter.once(type, callback);
  }
  emit(e: BaseEvent): void {
    return this._eventEmitter.emit(e)
  }

  listenTo<K extends keyof GlobalEventHandlersEventMap>(target: EventTarget, type: K, callback: (e: GlobalEventHandlersEventMap[K]) => any): () => void;
  listenTo(target: EventTarget, type: string, callback: (e: Event) => void): () => void;
  listenTo(target: Emitter, type: string, callback: ICallback): () => void;
  listenTo(target: Emitter | EventTarget, type: string, callback: ICallback | ((e: Event) => void)): () => void;
  listenTo(target: Emitter | EventTarget, type: string, callback: ICallback | ((e: Event) => void)) {
    return this._eventsObserver.listenTo(target, type, callback)
  }

  destory() { return this._eventsObserver.destory() }

  get factory() { return this._factory }
  set factory(v) { this._factory = v }
  currentLayer(): ILayer {
    return this._currentLayer!;
  }
  ctx(idx: number = 0): CanvasRenderingContext2D | null | undefined {
    return this.onscreen(idx)?.getContext('2d');
  }
  octx(idx: number = 0): CanvasRenderingContext2D | null | undefined {
    return this.offscreen(idx)?.getContext('2d')
  }
  onscreen(idx: number = 0): HTMLCanvasElement | undefined {
    return this._layers[idx].onscreen;
  }
  offscreen(idx: number = 0): HTMLCanvasElement | undefined {
    return this._layers[idx].offscreen;
  }

  get toolType() { return this._toolType }
  set toolType(v) { this.setToolType(v) }
  setToolType(to: ToolType) {
    if (this._toolType === to) return
    const from = this._toolType
    this._toolType = to
    this.emit(new ToolChangedEvent(this._operator, { from, to }))
  }
  get selects() {
    return this._selects
  }
  set selects(v) {
    this._selects.forEach(v => v.selected = false)
    this._selects = v
    this._selects.forEach(v => v.selected = true)
  }
  add(...shapes: Shape[]) {
    if (!shapes.length) return 0
    const ret = this._shapesMgr.add(...shapes)
    shapes.forEach(item => {
      item.board = this
      if (item.selected) this._selects.push(item)
      this.markDirty(item.boundingRect())

    })
    const e = new ShapesAddedEvent(this._operator, { shapeDatas: shapes.map(v => v.data.copy()) })
    this.emit(e)
    return ret
  }
  remove(...shapes: Shape[]) {
    if (!shapes.length) return 0
    const ret = this._shapesMgr.remove(...shapes)
    shapes.forEach(item => {
      this.markDirty(item.boundingRect())
      item.board = undefined
    })
    const e = new ShapesRemovedEvent(this._operator, { shapeDatas: shapes.map(v => v.data.copy()) })
    this.emit(e)
    return ret
  }
  removeAll() {
    return this.remove(...this._shapesMgr.shapes())
  }
  removeSelected() {
    this.remove(...this._selects)
    this._selects = []
  }
  selectAll() {
    this.selects = [...this._shapesMgr.shapes()]
  }
  deselect() {
    this.selects = []
  }
  selectAt(rect: IRect): Shape[] {
    const ret = this._shapesMgr.hits(rect)
    this.selects = ret
    return ret
  }
  selectNear(rect: IRect): Shape | undefined {
    const ret = this._shapesMgr.hit(rect)
    this.selects = ret ? [ret] : []
    return ret
  }
  getDot(ev: MouseEvent | PointerEvent): IDot {
    const ele = this._layers[0].onscreen;
    const sw = ele.width / ele.offsetWidth
    const sh = ele.height / ele.offsetHeight
    const { pressure = 0.5 } = ev as any
    return {
      x: Math.floor(sw * ev.offsetX),
      y: Math.floor(sh * ev.offsetY),
      p: pressure
    }
  }
  get tools() { return this._tools }
  get tool() {
    const toolType = this._toolType
    if (!this._tool || this._tool.type !== toolType) {
      this._tool?.end()
      this._tool = this._factory.newTool(toolType)
      if (this._tool) {
        this._tool.board = this
        this._tools[toolType] = this._tool
        this._tool.start()
      }
    }
    return this._tool
  }

  pointerdown: IPointerEventHandler = (e) => {
    if (e.button !== 0) {
      e.preventDefault()
      e.stopPropagation()
      return
    }
    this._mousedown = true
    this.tool?.pointerDown(this.getDot(e))
  }

  pointermove: IPointerEventHandler = (e) => {
    if (this._mousedown)
      this.tool?.pointerDraw(this.getDot(e))
    else
      this.tool?.pointerMove(this.getDot(e))
  }
  pointerup: IPointerEventHandler = (e) => {
    this._mousedown = false
    this.tool?.pointerUp(this.getDot(e))
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

    for (let i = 0; i < this._layers.length; ++i) {
      this._layers[i].ctx.clearRect(dirty.x, dirty.y, dirty.w, dirty.h)
      this._layers[i].octx.clearRect(dirty.x, dirty.y, dirty.w, dirty.h)
    }
    this._shapesMgr.shapes().forEach(v => {
      const br = v.boundingRect()
      const layer = this._layerMap[v.data.layer]
      if (Rect.hit(br, dirty) && layer) v.render(layer.octx)
    })
    this.tool?.render(this.currentLayer().octx)

    for (let i = 0; i < this._layers.length; ++i) {
      const { ctx, offscreen } = this._layers[i]
      ctx.drawImage(
        offscreen,
        dirty.x, dirty.y, dirty.w, dirty.h,
        dirty.x, dirty.y, dirty.w, dirty.h
      )
    }

    delete this._dirty
  }
}