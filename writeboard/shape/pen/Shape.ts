import { ShapeEnum } from "../ShapeEnum"
import { Gaia } from "../../mgr/Gaia"
import { Shape } from "../base"
import { ChangeType, PenData } from "./Data"
import { IRect } from "../../utils/Rect"
import { IVector } from "../../utils/Vector"
import { IDot } from "../../utils/Dot"

export class ShapePen extends Shape<PenData> {
  private _lineFactor = 0.5
  private _smoothFactor = 0.5
  private _srcGeo: IRect | null = null
  private _path2D = new Path2D()
  private prev_t: IVector | undefined
  private prev_dot: IVector | undefined
  constructor(data: Partial<PenData>) {
    super(data, PenData)
    let x, y: number
    for (let i = 0; i < this.data.coords.length; i += 2) {
      x = this.data.coords[i]
      y = this.data.coords[i + 1]
      this.updateSrcGeo(x, y)
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
        this.updateSrcGeo(x, y)
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

  /**
   * 根据新加入的点，计算原始矩形
   * @param dot 
   */
  private updateSrcGeo(x: number, y: number): IRect {
    if (this._srcGeo) {
      const left = Math.min(this._srcGeo.x, x)
      const top = Math.min(this._srcGeo.y, y)
      let w = Math.max(this._srcGeo.x + this._srcGeo.w, x) - left
      let h = Math.max(this._srcGeo.y + this._srcGeo.h, y) - top
      if (w !== w) w = 0 // NaN check
      if (h !== h) h = 0 // NaN check
      this._srcGeo = { x: left, y: top, w, h }
    } else {
      this._srcGeo = {
        x: x,
        y: y,
        w: 0,
        h: 0
      }
    }
    return this._srcGeo
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

  appendDot(dot: IDot, type?: 'first' | 'last') {
    const coords = this.data.coords
    const prevY: number | undefined = coords[coords.length - 1]
    const prevX: number | undefined = coords[coords.length - 2]
    if (prevY === dot.y && prevX === dot.x && type !== 'last')
      return
    this.data.coords.push(dot.x, dot.y)
    const geo = this.updateSrcGeo(dot.x, dot.y)
    this.updatePath(dot.x, dot.y, type)
    this.geo(geo.x, geo.y, geo.w, geo.h)
    this.endDirty()
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.visible)
      return;
    const d = this.data;
    if (d.lineWidth && d.strokeStyle && this._srcGeo) {
      this.beginDraw(ctx)
      ctx.translate(
        - this._srcGeo.x,
        - this._srcGeo.y
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