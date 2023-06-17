import { WhiteBoardEvent } from "../event"
import { IFactory, IShapesMgr } from "../mgr"
import { Shape, ShapeData } from "../shape/base"
import { ITool, ToolEnum, ToolType } from "../tools"
import { IDot, IRect, Rect } from "../utils"
import { ILayerInits, Layer } from "./Layer"

export interface BoardOptions {
  layers?: ILayerInits[]
  width?: number
  height?: number
  toolType?: ToolType
}
export interface IPointerEventHandler { (ev: PointerEvent): void }

const Tag = '[Board]'
export class Board implements IShapesMgr {
  private _factory: IFactory
  private _toolType: ToolType = ToolEnum.Pen
  private _layers = new Map<string, Layer>();
  private _shapesMgr: IShapesMgr
  private _mousedown = false
  private _tools: { [key in ToolEnum | string]?: ITool } = {}
  private _tool: ITool | undefined
  private _selects: Shape[] = []
  private _eventEmitter = document.createElement('div');
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
      layer.onscreen.addEventListener('pointerdown', this.pointerdown)
      layer.onscreen.addEventListener('pointermove', this.pointermove)
      layer.onscreen.addEventListener('pointerup', this.pointerup)
      layer.onscreen.addEventListener('contextmenu', e => { e.preventDefault(); e.stopPropagation() })
      this._layers.set(layer.info.id, layer)
    } else {
      layer = this.factory.newLayer(layer);
      this.addLayer(layer);
    }
    return true;
  }
  removeLayer(layerId: string): boolean {
    if (this._layers.has(layerId)) {
      console.error(`[WhiteBoard] removeLayer(): layer not found! id = ${layerId}`)
      return false;
    }
    const layer = this._layers.get(layerId)!;
    layer.onscreen.removeEventListener('pointerdown', this.pointerdown)
    layer.onscreen.removeEventListener('pointermove', this.pointermove)
    layer.onscreen.removeEventListener('pointerup', this.pointerup)
    layer.onscreen.removeEventListener('contextmenu', e => { e.preventDefault(); e.stopPropagation() })
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
  constructor(factory: IFactory, options: BoardOptions) {
    this._factory = factory;
    this._shapesMgr = this._factory.newShapesMgr();

    options.width && (this._width = options.width)
    options.height && (this._height = options.height)
    options.toolType && (this._toolType = options.toolType)

    const layers: ILayerInits[] = options.layers ?? []
    if (!layers.length) {
      layers.push({
        info: {
          id: factory.newLayerId(),
          name: factory.newLayerName(),
        },
        onscreen: document.createElement('canvas')
      })
    }
    layers.forEach(v => this.addLayer(v))



    this.editLayer(layers[0].info.id);

    this._dirty = { x: 0, y: 0, w: this.width, h: this.height }
    this.render()
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
      w: this.width,
      h: this.height,
      shapes: this.shapes().map(v => v.data)
    }
  }
  toJsonStr(): string {
    return JSON.stringify(this.toJson())
  }
  fromJson(jobj: any) {
    this.removeAll();
    this._layers.forEach(layer => {
      layer.onscreen.width = jobj.w
      layer.onscreen.height = jobj.h
    })
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

  addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLDivElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  addEventListener(arg0: any, arg1: any, arg2: any): void {
    return this._eventEmitter.addEventListener(arg0, arg1, arg2);
  }


  removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLDivElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
  removeEventListener(arg0: any, arg1: any, arg2: any): void {
    return this._eventEmitter.removeEventListener(arg0, arg1, arg2);
  }
  dispatchEvent(e: CustomEvent<any>): boolean {
    return this._eventEmitter.dispatchEvent(e)
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
    if (this._toolType === to) return
    const from = this._toolType
    this._toolType = to
    this.dispatchEvent(WhiteBoardEvent.toolChanged({ operator: this._operator, from, to }))
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
    const e = WhiteBoardEvent.shapesAdded({
      operator: this._operator,
      shapeDatas: shapes.map(v => v.data.copy())
    })
    this.dispatchEvent(e)
    return ret
  }
  remove(...shapes: Shape[]) {
    if (!shapes.length) return 0
    const ret = this._shapesMgr.remove(...shapes)
    shapes.forEach(item => {
      this.markDirty(item.boundingRect())
      item.board = undefined
    })
    const e = WhiteBoardEvent.shapesRemoved({
      operator: this._operator,
      shapeDatas: shapes.map(v => v.data.copy())
    })
    this.dispatchEvent(e)
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
    const layer = this.layer();
    const ele = layer.onscreen;
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
    this._mousedown = true;
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

    this._layers.forEach(layer => {
      layer.ctx.clearRect(dirty.x, dirty.y, dirty.w, dirty.h)
      layer.octx.clearRect(dirty.x, dirty.y, dirty.w, dirty.h)
    })

    this._shapesMgr.shapes().forEach(v => {
      const br = v.boundingRect()
      const layer = this._layers.get(v.data.layer)
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