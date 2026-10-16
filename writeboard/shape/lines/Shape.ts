import { ShapeEnum } from "../ShapeEnum"
import { Gaia } from "../../mgr/Gaia"
import { Shape } from "../base"
import { LinesData } from "./Data"
import { IRect } from "../../utils/IRect"
import { IDot } from "../../utils/Dot"

/**
 * 直线图形：把一串点连成折线，绘制时只按位移平移（不参与旋转）
 *
 * Lines shape: it joins a list of points into a polyline, and drawing only applies the shape
 * offset (the rotation is not taken part in).
 */
export class ShapeLines extends Shape<LinesData> {
  private _srcGeo: IRect | null = null
  private _path2D = new Path2D();

  /**
   * 按数据建一条直线，并把已坐标的路径拼好、算好原始矩形
   *
   * Builds a polyline from the given data, builds the path of the existing coordinates and
   * computes the source rectangle.
   *
   * @param {Partial<LinesData>} data 图形数据 / Shape data
   */
  constructor(data: Partial<LinesData>) {
    super(data, LinesData);
    let x, y: number
    for (let i = 0; i < this.data.coords.length; i += 2) {
      x = this.data.coords[i]
      y = this.data.coords[i + 1]
      this.updatePath(x, y, i === 0 ? 'first' : undefined);
    }
    this.updateSrcGeo()
  }

  /**
   * 合并一份直线数据：把新增的坐标续到路径上，并重算原始矩形
   *
   * Merges a piece of lines data: the new coordinates are appended to the path and the source
   * rectangle is recomputed.
   *
   * @param {Partial<LinesData>} data 要合并的数据 / The data to merge
   */
  override merge(data: Partial<LinesData>) {
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
        this.updatePath(x, y, i === 0 ? 'first' : undefined);
      }
    }
    this.updateSrcGeo()
    this.endDirty(prev)
  }

  /**
   * 计算原始矩形
   * @param dot 
   */
  private updateSrcGeo(): IRect {
    let minX = Number.MAX_VALUE;
    let minY = Number.MAX_VALUE;
    let maxX = Number.MIN_VALUE;
    let maxY = Number.MIN_VALUE;
    for (let i = 0; i < this.data.coords.length; i += 2) {
      const x = this.data.coords[i];
      const y = this.data.coords[i + 1];
      minX = Math.min(minX, x)
      minY = Math.min(minY, y)
      maxX = Math.max(maxX, x)
      maxY = Math.max(maxY, y)
    }
    this._srcGeo = {
      x: minX,
      y: minY,
      w: maxX - minX,
      h: maxY - minY
    }
    return this._srcGeo
  }

  private updatePath(x: number, y: number, type?: 'first') {
    if (type === 'first') {
      this._path2D.moveTo(x, y);
    } else {
      this._path2D.lineTo(x, y);
    }
  }

  /**
   * 往折线末尾接一个新点：同时把坐标写进数据、重算原始矩形与脏区
   *
   * Appends a new point to the polyline: the coordinate goes into the data and both the source
   * rectangle and the dirty area are refreshed.
   *
   * @param {IDot} dot 点的位置 / The position of the point
   * @param {'first'} [type] 传 'first' 时当作起点重新 moveTo / Pass 'first' to treat it as the start and moveTo again
   */
  pushDot(dot: IDot, type?: 'first'): void {
    this.data.coords.push(dot.x, dot.y)
    const geo = this.updateSrcGeo()
    this.updatePath(dot.x, dot.y, type)
    this.geo(geo.x, geo.y, geo.w, geo.h)
    this.endDirty()
  }

  /**
   * 把末尾那个点挪到新位置（拖拽画直线时用），并重建整条路径
   *
   * Moves the last point to a new position (used while dragging out a line) and rebuilds the
   * whole path.
   *
   * @param {IDot} dot 末尾点的新位置 / The new position of the last point
   */
  editDot(dot: IDot): void {
    this.data.coords[this.data.coords.length - 2] = dot.x;
    this.data.coords[this.data.coords.length - 1] = dot.y;
    this._path2D = new Path2D();
    for (let i = 0; i < this.data.coords.length; i += 2) {
      const x = this.data.coords[i];
      const y = this.data.coords[i + 1];
      this.updatePath(x, y, i === 0 ? 'first' : undefined)
    }
    const geo = this.updateSrcGeo();
    this.geo(geo.x, geo.y, geo.w, geo.h);
    this.endDirty();
  }

  /**
   * 绘制折线：先按图形位移与原始矩形的差平移，再一发描边
   *
   * Draws the polyline: the canvas is translated by the difference between the shape offset
   * and the source rectangle first, then the path is stroked in one go.
   *
   * @param {CanvasRenderingContext2D} ctx 画布上下文 / Canvas context
   */
  render(ctx: CanvasRenderingContext2D): void {
    if (!this.visible) { return; }
    const d = this.data;

    if (d.lineWidth && d.strokeStyle && this._srcGeo) {
      ctx.save()
      ctx.translate(
        this.data.x - this._srcGeo.x,
        this.data.y - this._srcGeo.y
      )
      ctx.lineCap = d.lineCap
      ctx.lineDashOffset = d.lineDashOffset || 0
      ctx.lineJoin = d.lineJoin
      ctx.lineWidth = d.lineWidth || 0
      ctx.miterLimit = d.miterLimit || 0
      ctx.strokeStyle = d.strokeStyle
      ctx.setLineDash(d.lineDash)
      ctx.stroke(this._path2D)
      ctx.restore()
    }
    super.render(ctx);
  }
}

Gaia.registerShape(ShapeEnum.Lines, () => new LinesData, d => new ShapeLines(d))