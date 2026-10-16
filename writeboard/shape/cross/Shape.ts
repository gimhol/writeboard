import { ShapeEnum } from "../ShapeEnum"
import { Gaia } from "../../mgr/Gaia"
import { CrossData } from "./Data"
import { ShapeNeedPath } from "../base/ShapeNeedPath"

/**
 * 叉（错号）图形：两条微微弯曲的线，各自一条子路径
 *
 * Cross shape: two slightly curved lines, each one a sub path of its own.
 */
export class ShapeCross extends ShapeNeedPath<CrossData> {
  /**
   * 按数据建一个叉图形
   *
   * Builds a cross shape from the given data.
   *
   * @param {Partial<CrossData>} data 图形数据 / Shape data
   */
  constructor(data: Partial<CrossData>) {
    super(data, CrossData)
  }
  /**
   * 叉的路径：一撇一捺，各自用一段二次贝塞尔微微弯开
   *
   * The cross path: the two strokes, each one bent a little with a quadratic bezier.
   *
   * @param {CanvasRenderingContext2D} ctx 画布上下文 / Canvas context
   */
  path(ctx: CanvasRenderingContext2D) {
    const { x, y, w, h } = this.drawingRect()
    const a = { x: x, y: y + 0.05 * h }
    const b = { x: x + w, y: y + h - 0.05 * h }
    const c = { x: x + 0.05 * w, y: y + h }
    const d = { x: x + w - 0.05 * w, y: y }
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.quadraticCurveTo(
      x + w / 2 + 0.2 * w,
      y + h / 2 + 0.1 * h,
      b.x, b.y
    );
    ctx.moveTo(c.x, c.y);
    ctx.quadraticCurveTo(
      x + w / 2 - 0.05 * w,
      y + h / 2 - 0.1 * h,
      d.x, d.y);
  }
}

Gaia.registerShape(ShapeEnum.Cross, () => new CrossData, d => new ShapeCross(d))