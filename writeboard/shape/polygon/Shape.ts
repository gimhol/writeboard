import { ShapeEnum } from "../ShapeEnum"
import { Gaia } from "../../mgr/Gaia"
import { PolygonData } from "./Data"
import { ShapeNeedPath } from "../base/ShapeNeedPath"

/**
 * 多边形图形：按路径绘制，顶点存在数据里
 *
 * Polygon shape: it draws through a path, and the vertices are kept in the data.
 */
export class ShapePolygon extends ShapeNeedPath<PolygonData> {
  /**
   * 按数据建一个多边形图形
   *
   * Builds a polygon shape from the given data.
   *
   * @param {Partial<PolygonData>} data 图形数据 / Shape data
   */
  constructor(data: Partial<PolygonData>) {
    super(data, PolygonData)
  }
  /**
   * 多边形路径：目前输出的是绘制矩形，顶点数据留给子类 / 后续实现使用
   *
   * The polygon path: what it emits now is the drawing rectangle, while the vertices are left
   * for subclasses / later implementations.
   *
   * @param {CanvasRenderingContext2D} ctx 画布上下文 / Canvas context
   */
  path(ctx: CanvasRenderingContext2D) {
    const { x, y, w, h } = this.drawingRect()
    ctx.beginPath();
    ctx.rect(x, y, w, h)
    ctx.closePath();
  }
}

Gaia.registerShape(ShapeEnum.Polygon, () => new PolygonData, d => new ShapePolygon(d))