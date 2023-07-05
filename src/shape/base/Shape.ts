import { ShapeData } from "./Data"
import { Board } from "../../board/Board"
import { IRect, Rect } from "../../utils/Rect"
import { ShapeType } from "../ShapeEnum"
export enum ResizeDirection {
  None = 0,
  TopLeft,
  TopRight,
  BottomLeft,
  BottomRight,
}
export enum Resizable {
  None = 0,
  All = 1,
}
export class Shape<D extends ShapeData = ShapeData> {
  private _data: D;
  private _board?: Board;
  protected _resizable: Resizable = Resizable.None;
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

  get resizable(): Resizable { return this._resizable; }

  merge(data: Partial<ShapeData>): void {
    this.markDirty()
    this.data.merge(data)
    this.markDirty()
  }

  markDirty(rect?: IRect): void {
    rect = rect ?? this.boundingRect();
    this.board?.markDirty(rect)
  }

  move(x: number, y: number): void {
    if (x === this._data.x && y === this._data.y)
      return
    this.markDirty()
    this._data.x = x
    this._data.y = y
    this.markDirty()
  }

  resize(w: number, h: number): void {
    if (w === this._data.w && h === this._data.h)
      return
    this.markDirty()
    this._data.w = w
    this._data.h = h
    this.markDirty()
  }

  getGeo(): Rect {
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

  moveBy(x: number, y: number): void {
    this.markDirty()
    this._data.x += x
    this._data.y += y
    this.markDirty()
  }

  resizeBy(w: number, h: number): void {
    this.markDirty()
    this._data.w += w
    this._data.h += h
    this.markDirty()
  }

  geoBy(x: number, y: number, w: number, h: number): void {
    this.markDirty()
    this._data.x += x
    this._data.y += y
    this._data.w += w
    this._data.h += h
    this.markDirty()
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.visible) return
    if (this.selected) {
      // 虚线其实相当损耗性能
      const lineWidth = 1
      const halfLineW = lineWidth / 2
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

      if (this._resizable === Resizable.All) {
        ctx.fillStyle = 'white'
        ctx.setLineDash([]);
        const s = 5;
        const lx = x + halfLineW;
        const rx = x + w - s - halfLineW;
        const ty = y + halfLineW;
        const by = y + h - s - halfLineW;

        // top-left resizer
        ctx.beginPath()
        ctx.rect(lx, ty, s, s)
        ctx.fill()
        ctx.stroke()

        // top-right resizer
        ctx.beginPath()
        ctx.rect(rx, ty, s, s)
        ctx.fill()
        ctx.stroke()

        // bottom-left resizer
        ctx.beginPath()
        ctx.rect(lx, by, s, s)
        ctx.fill()
        ctx.stroke()

        // bottom-right resizer
        ctx.beginPath()
        ctx.rect(rx, by, s, s)
        ctx.fill()
        ctx.stroke()
      }
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

  resizeDirection(pointerX: number, pointerY: number): [ResizeDirection, Rect | undefined] {
    if (!this.selected || !this._resizable) {
      return [ResizeDirection.None, undefined];
    }
    const lineWidth = 1
    const halfLineW = lineWidth / 2
    const { x, y, w, h } = this.boundingRect();
    const s = 5;
    const lx = x + halfLineW;
    const rx = x + w - s - halfLineW;
    const ty = y + halfLineW;
    const by = y + h - s - halfLineW;
    const pos = { x: pointerX, y: pointerY }
    const rect = new Rect(0, 0, s, s);
    rect.moveTo(lx, ty)
    if (rect.hit(pos)) {
      return [ResizeDirection.TopLeft, rect];
    }
    rect.moveTo(rx, ty);
    if (rect.hit(pos)) {
      return [ResizeDirection.TopRight, rect];
    }
    rect.moveTo(lx, by);
    if (rect.hit(pos)) {
      return [ResizeDirection.BottomLeft, rect];
    }
    rect.moveTo(rx, by);
    if (rect.hit(pos)) {
      return [ResizeDirection.BottomRight, rect];
    }
    return [ResizeDirection.None, undefined]
  }
}

