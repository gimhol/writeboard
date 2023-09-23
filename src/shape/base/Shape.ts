import { ShapeData } from "./Data"
import { Board } from "../../board/Board"
import { IRect, Rect } from "../../utils/Rect"
import { ShapeType } from "../ShapeEnum"
export enum ResizeDirection {
  None = 0,
  Top = 'Top',
  Bottom = 'Bottom',
  Left = 'Left',
  Right = 'Right',
  TopLeft = 'TopLeft',
  TopRight = 'TopRight',
  BottomLeft = 'BottomLeft',
  BottomRight = 'BottomRight',
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
    if (this._data.editing === v) return
    this._data.editing = v
    this.markDirty()
  }
  get selected(): boolean { return !!this._data.selected }
  set selected(v: boolean) {
    if (this._data.selected === v) return
    this._data.selected = v
    this.markDirty()
  }

  get resizable(): Resizable { return this._resizable; }

  get locked(): boolean { return this._data.locked }
  set locked(v: boolean) {
    if (this._data.locked === v) return
    this._data.locked = v
    this.markDirty()
  }
  get ghost(): boolean { return this._data.ghost }
  set ghost(v: boolean) {
    if (this._data.ghost === v) return
    this._data.ghost = v
    this.markDirty()
  }

  get lineWidth(): number { return this._data.lineWidth }
  set lineWidth(v: number) {
    if (!this._data.needStroke) { return; }
    this.markDirty()
    this._data.lineWidth = Math.max(0, v);
    this.markDirty()
  }

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
  setGeo(rect: Rect): void {
    this.geo(rect.x, rect.y, rect.w, rect.h)
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
    const { ghost, locked } = this;
    if (this.selected && !ghost) {
      // 虚线其实相当损耗性能
      const lineWidth = locked ? 2 : 1
      const halfLineW = lineWidth / 2
      ctx.lineWidth = lineWidth
      const { x, y, w, h } = this.boundingRect()
      ctx.beginPath()
      ctx.rect(x + halfLineW, y + halfLineW, w - lineWidth, h - lineWidth)
      ctx.closePath()

      ctx.strokeStyle = locked ? '#ffffff88' : '#ffffff'
      ctx.setLineDash([])
      ctx.stroke()
      ctx.strokeStyle = locked ? '#00000088' : '#000000'
      ctx.setLineDash(locked ? [lineWidth * 8] : [lineWidth * 4])
      ctx.stroke()

      if (!locked && this._resizable === Resizable.All) {
        ctx.fillStyle = 'white'
        ctx.setLineDash([]);
        const {
          s, lx, rx, ty, by, mx, my,
        } = this.getResizerNumbers(x, y, w, h)

        // top resizer
        ctx.beginPath()
        ctx.rect(mx, ty, s, s)
        ctx.fill()
        ctx.stroke()

        // bottom resizer
        ctx.beginPath()
        ctx.rect(mx, by, s, s)
        ctx.fill()
        ctx.stroke()

        // left resizer
        ctx.beginPath()
        ctx.rect(lx, my, s, s)
        ctx.fill()
        ctx.stroke()

        // right resizer
        ctx.beginPath()
        ctx.rect(rx, my, s, s)
        ctx.fill()
        ctx.stroke()

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

  getResizerNumbers(x: number, y: number, w: number, h: number) {
    const lineWidth = 1
    const halfLineW = lineWidth / 2
    const s = 5;
    return {
      s,
      lx: x + halfLineW,
      rx: x + w - s - halfLineW,
      ty: y + halfLineW,
      by: y + h - s - halfLineW,
      mx: Math.floor(x + (w - s) / 2) - halfLineW,
      my: Math.floor(y + (h - s) / 2) - halfLineW,
    }
  }
  resizeDirection(pointerX: number, pointerY: number): [ResizeDirection, Rect | undefined] {
    if (!this.selected || !this._resizable || this.ghost || this.locked) {
      return [ResizeDirection.None, undefined];
    }
    const { x, y, w, h } = this.boundingRect();
    const { s, lx, rx, ty, by, mx, my } = this.getResizerNumbers(x, y, w, h)

    const pos = { x: pointerX, y: pointerY }
    const rect = new Rect(0, 0, s, s);

    rect.moveTo(mx, ty)
    if (rect.hit(pos)) {
      return [ResizeDirection.Top, rect];
    }
    rect.moveTo(mx, by);
    if (rect.hit(pos)) {
      return [ResizeDirection.Bottom, rect];
    }
    rect.moveTo(lx, my);
    if (rect.hit(pos)) {
      return [ResizeDirection.Left, rect];
    }
    rect.moveTo(rx, my);
    if (rect.hit(pos)) {
      return [ResizeDirection.Right, rect];
    }

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