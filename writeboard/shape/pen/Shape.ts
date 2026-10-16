import { Gaia } from "../../mgr/Gaia"
import { IVector } from "../../utils/IVector"
import { Shape, ShapeData } from "../base"
import { ShapeEnum } from "../ShapeEnum"
import { ChangeType, PenData } from "./Data"

/**
 * 笔迹图形：把坐标平滑成一条曲线，并增量维护自己的 Path2D
 *
 * Pen shape: the coordinates are smoothed into a curve, and the shape keeps its own Path2D
 * up to date incrementally.
 */
export class ShapePen extends Shape<PenData> {
  /**
   * 判断一个图形是不是笔迹
   *
   * Tells whether a shape is a pen stroke.
   *
   * @param {Shape<ShapeData>} shape 待判断的图形 / The shape to test
   * @return {shape is ShapePen} 是笔迹时返回 true / True while it is a pen stroke
   */
  static is(shape: Shape<ShapeData>): shape is ShapePen {
    return shape.type === ShapeEnum.Pen && shape.type === shape.data.type
  }

  private _lineFactor = 0.5
  private _smoothFactor = 0.5
  private _path2D: Path2D | undefined
  private prev_t: IVector | undefined
  private prev_dot: IVector | undefined

  /**
   * 按数据建一条笔迹，并先把已坐标的路径拼好
   *
   * Builds a stroke from the given data and builds the path of the existing coordinates
   * first.
   *
   * @param {Partial<PenData>} data 图形数据 / Shape data
   */
  constructor(data: Partial<PenData>) {
    super(data, PenData)
    this.rebuildPath()
  }
  /**
   * 合并一份笔迹数据：追加分片且路径状态还在时只续画尾巴，其余情况整条重建
   *
   * Merges a piece of pen data: an appended slice extends the tail while the path state is
   * still usable, otherwise the whole path is rebuilt.
   *
   * @param {Partial<PenData>} data 要合并的数据 / The data to merge
   */
  override merge(data: Partial<PenData>) {
    const prev = this.data.copy()
    this.beginDirty(prev)
    const startIdx = this.data.coords.length
    this.data.merge(data)
    const endIdx = this.data.coords.length - 1
    if (this.data.coords.length !== startIdx) {
      if (data.v === ChangeType.Append && this.prev_dot) {
        let x, y: number
        for (let i = startIdx; i <= endIdx; i += 2) {
          x = this.data.coords[i]
          y = this.data.coords[i + 1]
          const t = i === 0 ? 'first' : (!this.data.editing && i === endIdx) ? 'last' : 'mid'
          this.updatePath(x, y, t)
        }
      } else {
        this.rebuildPath()
      }
    }
    this.endDirty(prev)
  }

  private rebuildPath(): void {
    this.prev_dot = undefined
    this.prev_t = undefined
    this._path2D = undefined
    const { coords } = this.data
    if (coords.length < 2) return
    const last = coords.length - 2
    this.updatePath(coords[0], coords[1], 'first')
    for (let i = 2; i <= last; i += 2) {
      this.updatePath(coords[i], coords[i + 1], i === last && !this.data.editing ? 'last' : 'mid')
    }
  }

  private updatePath(x: number, y: number, type: 'first' | 'mid' | 'last') {
    // 载入时就带坐标的笔画（快照 / SHAPES_ADDED 里已有点）之后再追加点时，
    // prev_dot 早就被上一段末尾的 'last' 清掉了，这里按新段起点处理，避免回放中断
    if (type === 'first' || !this.prev_dot) {
      this.prev_dot = { x, y }
      this.prev_t = undefined
      this._path2D = new Path2D()
      this._path2D.moveTo(x, y)
      return
    }
    if (!this._path2D) return;
    const { x: prev_x, y: prev_y } = this.prev_dot!
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

  /**
   * 往笔迹末尾加一个点：同时把坐标写进数据、刷新脏区
   *
   * Appends one point to the stroke: the coordinate goes into the data and the dirty area is
   * refreshed.
   *
   * @param {IVector} dot 点的位置 / The position of the point
   * @param {'first' | 'mid' | 'last'} type 点的角色：起笔 / 中间 / 收笔 / The role of the point: first / middle / last
   */
  appendDot(dot: IVector, type: 'first' | 'mid' | 'last') {
    const coords = this.data.coords
    const prevX: number | undefined = coords[coords.length - 2]
    const prevY: number | undefined = coords[coords.length - 1]
    if (type === 'first') {
      this.data.coords = [dot.x, dot.y]
    } else if (prevY === dot.y && prevX === dot.x && type !== 'last') {
      return
    } else {
      this.data.add_coords([dot.x, dot.y])
    }
    const geo = this.data.src_rect
    this.updatePath(dot.x, dot.y, type)
    this.geo(geo.x, geo.y, geo.w, geo.h)
    this.endDirty()
  }

  /**
   * 用一整组扁平坐标重画这条笔迹（首尾点按 first / last 收笔）
   *
   * Redraws the whole stroke from a flat coordinate list (the ends are treated as first /
   * last).
   *
   * @param {number[]} coords 扁平坐标 / The flat coordinates
   */
  applyCoords(coords: number[]) {
    for (let i = 0; i < coords.length; i += 2) {
      const t = i === 0 ? 'first' : i == coords.length - 2 ? 'last' : 'mid'
      this.appendDot({ x: coords[i], y: coords[i + 1] }, t)
    }
  }
  /**
   * 用一整组点重画这条笔迹（首尾点按 first / last 收笔）
   *
   * Redraws the whole stroke from a list of points (the ends are treated as first / last).
   *
   * @param {IVector[]} dots 点列表 / The point list
   */
  applyDots(dots: IVector[]) {
    for (let i = 0; i < dots.length; ++i) {
      const t = i === 0 ? 'first' : i == dots.length - 1 ? 'last' : 'mid'
      this.appendDot(dots[i], t)
    }
  }

  /**
   * 绘制笔迹：先平移到图形位置，再用缓存的 Path2D 一发描边
   *
   * Draws the stroke: the canvas is translated into place first, then the cached Path2D is
   * stroked in one go.
   *
   * @param {CanvasRenderingContext2D} ctx 画布上下文 / Canvas context
   */
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
      this._path2D && ctx.stroke(this._path2D)
      this.endDraw(ctx)
    }
    super.render(ctx);
  }
}

Gaia.registerShape(ShapeEnum.Pen, () => new PenData, d => new ShapePen(d))