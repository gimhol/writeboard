import { ShapeData } from "./Data"
import { Board } from "../../board/Board"
import { IRect, Rect } from "../../utils/Rect"
import { ShapeType } from "../ShapeEnum"

export class Shape<D extends ShapeData = ShapeData> {
  private _data: D
  private _board?: Board
  constructor(data: D) {
    this._data = data
  }
  get data(): D { return this._data as D }
  get type(): ShapeType { return this._data.type }
  get board(): Board | undefined { return this._board }
  set board(v: Board | undefined) { this._board = v }
  get visible(): boolean {
    return !!this._data.visible
  }
  set visible(v: boolean) {
    if (!!this._data.visible === v) return
    this._data.visible = v
    this.markDirty()
  }

  get editing(): boolean { return !!this._data.editing }
  set editing(v: boolean) {
    if (!!this._data.editing === v) return
    this._data.editing = v
    this.markDirty()
  }
  get selected(): boolean { return !!this._data.selected }
  set selected(v: boolean) {
    if (!!this._data.selected === v) return
    this._data.selected = v
    this.markDirty()
  }
  merge(data: Partial<ShapeData>) {
    this.markDirty()
    this.data.merge(data)
    this.markDirty()
  }
  markDirty(rect: IRect = this.boundingRect()) {
    this.board?.markDirty(rect)
  }
  move(x: number, y: number) {
    if (x === this._data.x && y === this._data.y)
      return
    this.markDirty()
    this._data.x = x
    this._data.y = y
    this.markDirty()
  }

  resize(w: number, h: number) {
    if (w === this._data.w && h === this._data.h)
      return
    this.markDirty()
    this._data.w = w
    this._data.h = h
    this.markDirty()
  }
  getGeo() {
    return new Rect(
      this._data.x,
      this._data.y,
      this._data.w,
      this._data.h
    )
  }
  geo(x: number, y: number, w: number, h: number): void {
    if (x === this._data.x &&
      y === this._data.y &&
      w === this._data.w &&
      h === this._data.h)
      return
    this.markDirty()
    this._data.x = x
    this._data.y = y
    this._data.w = w
    this._data.h = h
    this.markDirty()
  }

  moveBy(x: number, y: number) {
    this.markDirty()
    this._data.x += x
    this._data.y += y
    this.markDirty()
  }

  resizeBy(w: number, h: number) {
    this.markDirty()
    this._data.w += w
    this._data.h += h
    this.markDirty()
  }

  geoBy(x: number, y: number, w: number, h: number) {
    this.markDirty()
    this._data.x += x
    this._data.y += y
    this._data.w += w
    this._data.h += h
    this.markDirty()
  }

  render(ctx: CanvasRenderingContext2D) {
    if (!this.visible) return
    if (this.selected) {
      // 虚线其实相当损耗性能
      let lineWidth = 1
      let halfLineW = lineWidth / 2
      ctx.lineWidth = lineWidth
      const { x, y, w, h } = this.boundingRect()
      ctx.beginPath()
      ctx.rect(x + halfLineW, y + halfLineW, w - lineWidth, h - lineWidth)
      ctx.closePath()
      ctx.strokeStyle = 'white'
      ctx.setLineDash([])
      ctx.stroke()
      ctx.strokeStyle = 'black'
      ctx.setLineDash([lineWidth * 4])
      ctx.stroke()
    }
  }

  drawingRect(): IRect {
    const d = this._data
    const drawOffset = (d.lineWidth % 2) ? 0.5 : 0
    return {
      x: Math.floor(d.x) + drawOffset,
      y: Math.floor(d.y) + drawOffset,
      w: Math.floor(d.w),
      h: Math.floor(d.h)
    }
  }

  boundingRect(): IRect {
    const d = this.data
    const offset = (d.lineWidth % 2) ? 1 : 0
    return {
      x: Math.floor(d.x - d.lineWidth / 2),
      y: Math.floor(d.y - d.lineWidth / 2),
      w: Math.ceil(d.w + d.lineWidth + offset),
      h: Math.ceil(d.h + d.lineWidth + offset)
    }
  }
}

