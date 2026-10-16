import { ShapeEnum } from "../ShapeEnum"
import { Gaia } from "../../mgr/Gaia"
import { HalfTickData } from "./Data"
import { ShapeNeedPath } from "../base/ShapeNeedPath"

/**
 * 半钩图形：钩的路径 + 下面一横（半钩）
 *
 * Half tick shape: the tick path plus a short stroke underneath (the half part).
 */
export class ShapeHalfTick extends ShapeNeedPath<HalfTickData> {
  /**
   * 按数据建一个半钩图形
   *
   * Builds a half tick shape from the given data.
   *
   * @param {Partial<HalfTickData>} data 图形数据 / Shape data
   */
  constructor(data: Partial<HalfTickData>) {
    super(data, HalfTickData)
  }
  /**
   * 半钩的路径：先描钩的那两段贝塞尔，再加一小段直线
   *
   * The half tick path: the two bezier segments of the tick first, then one short line.
   *
   * @param {CanvasRenderingContext2D} ctx 画布上下文 / Canvas context
   */
  path(ctx: CanvasRenderingContext2D) {
    const { x, y, w, h } = this.drawingRect()
    const a = { x: x, y: y + h * 0.7 }
    const b = { x: x + w / 3, y: y + h }
    const c = { x: x + w, y: y }
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.bezierCurveTo(
      a.x + (b.x - a.x) / 3, a.y,
      b.x, b.y - (b.y - a.y) / 3,
      b.x, b.y
    );
    ctx.bezierCurveTo(
      b.x, b.y - (b.y - c.y) / 3,
      c.x - (c.x - b.x) / 4, c.y,
      c.x, c.y
    );
    const e = { x: x + w * 0.35, y: y + h * 0.25 }
    const f = { x: x + w * 0.70, y: y + h * 0.70 }
    ctx.moveTo(e.x, e.y)
    ctx.lineTo(f.x, f.y)
  }
}

Gaia.registerShape(ShapeEnum.HalfTick, () => new HalfTickData, d => new ShapeHalfTick(d))