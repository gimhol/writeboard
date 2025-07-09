import { Gaia } from "../../mgr/Gaia"
import { IRect } from "../../utils/IRect"
import { IVector } from "../../utils/IVector"
import { Shape, ShapeData } from "../base"
import { ShapeEnum } from "../ShapeEnum"
import { PenData } from "./Data"

export class ShapePen extends Shape<PenData> {
  static is(shape: Shape<ShapeData>): shape is ShapePen {
    return shape.type === ShapeEnum.Pen && shape.type === shape.data.type
  }

  private _lineFactor = 0.5
  private _smoothFactor = 0.5
  private _path2D = new Path2D()
  private prev_t: IVector | undefined
  private prev_dot: IVector | undefined

  constructor(data: Partial<PenData>) {
    super(data, PenData)
    let x, y: number
    for (let i = 0; i < this.data.coords.length; i += 2) {
      x = this.data.coords[i]
      y = this.data.coords[i + 1]
      if (i === 0)
        this.updatePath(x, y, 'first')
      else if (i >= this.data.coords.length - 2)
        this.updatePath(x, y, 'last')
      else
        this.updatePath(x, y)
    }
  }
  override merge(data: Partial<PenData>) {
    const prev = this.data.copy()
    this.beginDirty(prev)
    const startIdx = this.data.coords.length
    this.data.merge(data)
    const endIdx = this.data.coords.length - 1
    if (startIdx !== endIdx) {
      let x, y: number
      for (let i = startIdx; i <= endIdx; i += 2) {
        x = this.data.coords[i]
        y = this.data.coords[i + 1]
        if (i === 0)
          this.updatePath(x, y, 'first')
        else if (!this.data.editing && i === endIdx)
          this.updatePath(x, y, 'last')
        else
          this.updatePath(x, y)
      }
    }
    this.endDirty(prev)
  }

  private updatePath(x: number, y: number, type?: 'first' | 'last') {
    if (this.prev_dot === undefined) {
      this.prev_dot = { x, y }
      this._path2D.moveTo(x, y)
    }
    if (type === 'first')
      return
    const { x: prev_x, y: prev_y } = this.prev_dot
    if (this.prev_t === undefined) {
      this.prev_t = {
        x: x - (x - prev_x) * this._lineFactor,
        y: y - (y - prev_y) * this._lineFactor
      }
      this._path2D.lineTo(this.prev_t.x, this.prev_t.y)
    }
    const { x: prev_t_x, y: prev_t_y } = this.prev_t
    const t_x_0 = prev_x + (x - prev_x) * this._lineFactor
    const t_y_0 = prev_y + (y - prev_y) * this._lineFactor
    const t_x_1 = x - (x - prev_x) * this._lineFactor
    const t_y_1 = y - (y - prev_y) * this._lineFactor
    const c_x_0 = prev_t_x + (prev_x - prev_t_x) * this._smoothFactor // 第一控制点x坐标
    const c_y_0 = prev_t_y + (prev_y - prev_t_y) * this._smoothFactor // 第一控制点y坐标
    const c_x_1 = prev_x + (t_x_0 - prev_x) * (1 - this._smoothFactor) // 第二控制点x坐标
    const c_y_1 = prev_y + (t_y_0 - prev_y) * (1 - this._smoothFactor) // 第二控制点y坐标
    this._path2D.bezierCurveTo(c_x_0, c_y_0, c_x_1, c_y_1, t_x_0, t_y_0)

    if (type === 'last') {
      delete this.prev_t
      delete this.prev_dot
      this._path2D.lineTo(x, y)
    } else {
      this.prev_t = { x: t_x_1, y: t_y_1 }
      this.prev_dot = { x, y }
    }
  }

  appendDot(dot: IVector, type?: 'first' | 'last') {
    const coords = this.data.coords
    const prevY: number | undefined = coords[coords.length - 1]
    const prevX: number | undefined = coords[coords.length - 2]
    if (prevY === dot.y && prevX === dot.x && type !== 'last')
      return
    this.data.add_coords([dot.x, dot.y])
    const geo = this.data.src_rect
    this.updatePath(dot.x, dot.y, type)
    this.geo(geo.x, geo.y, geo.w, geo.h)
    this.endDirty()
  }

  applyCoords(coords: number[]) {
    for (let i = 0; i < coords.length; i += 2) {
      const t = i === 0 ? 'first' : i == coords.length - 2 ? 'last' : void 0
      this.appendDot({ x: coords[i], y: coords[i + 1] }, t)
    }
  }
  applyDots(dots: IVector[]) {
    for (let i = 0; i < dots.length; ++i) {
      const t = i === 0 ? 'first' : i == dots.length - 1 ? 'last' : void 0
      this.appendDot(dots[i], t)
    }
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.visible)
      return;
    const d = this.data;
    if (d.lineWidth && d.strokeStyle) {
      this.beginDraw(ctx)
      ctx.translate(
        - this.data.src_rect.x,
        - this.data.src_rect.y
      )
      ctx.lineCap = d.lineCap
      ctx.lineDashOffset = d.lineDashOffset || 0
      ctx.lineJoin = d.lineJoin
      ctx.lineWidth = d.lineWidth || 0
      ctx.miterLimit = d.miterLimit || 0
      ctx.strokeStyle = d.strokeStyle
      ctx.setLineDash(d.lineDash)
      ctx.stroke(this._path2D)
      this.endDraw(ctx)
    }
    super.render(ctx);
  }
}

Gaia.registerShape(ShapeEnum.Pen, () => new PenData, d => new ShapePen(d))