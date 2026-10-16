import { ShapeEnum } from "../ShapeEnum"
import { Gaia } from "../../mgr/Gaia"
import { TickData } from "./Data"
import { ShapeNeedPath } from "../base/ShapeNeedPath"

/**
 * 钩（对号）图形：两段三次贝塞尔拼成的曲线
 *
 * Tick (check mark) shape: a curve made of two cubic bezier segments.
 */
export class ShapeTick extends ShapeNeedPath<TickData> {
  /**
   * 按数据建一个钩图形
   *
   * Builds a tick shape from the given data.
   *
   * @param {Partial<TickData>} data 图形数据 / Shape data
   */
  constructor(data: Partial<TickData>) {
    super(data, TickData)
  }
  /**
   * 钩的路径：起笔 → 拐点 → 钩尖，两段贝塞尔过渡
   *
   * The tick path: the start, the turning point and the tip, joined by two bezier segments.
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
  }
}

Gaia.registerShape(ShapeEnum.Tick, () => new TickData, d => new ShapeTick(d))