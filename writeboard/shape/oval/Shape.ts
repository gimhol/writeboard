import { ShapeEnum } from "../ShapeEnum"
import { Gaia } from "../../mgr/Gaia"
import { OvalData } from "./Data"
import { ShapeNeedPath } from "../base/ShapeNeedPath"

/**
 * 椭圆图形：用缩放过的圆孤画出任意长宽比的椭圆
 *
 * Oval shape: a scaled arc is used to draw an oval of any aspect ratio.
 */
export class ShapeOval extends ShapeNeedPath<OvalData> {
  /**
   * 按数据建一个椭圆图形
   *
   * Builds an oval shape from the given data.
   *
   * @param {Partial<OvalData>} data 图形数据 / Shape data
   */
  constructor(data: Partial<OvalData>) {
    super(data, OvalData)
  }
  /**
   * 椭圆路径：先缩放画布再用圆孤画圆，得到正圆 / 椭圆
   *
   * The oval path: the canvas is scaled first and a circular arc is drawn, which yields a
   * circle / oval.
   *
   * @param {CanvasRenderingContext2D} ctx 画布上下文 / Canvas context
   */
  path(ctx: CanvasRenderingContext2D) {
    const { x, y, w, h } = this.drawingRect()
    const r = (w > h) ? w : h;
    const scale = { x: w / r, y: h / r };
    ctx.save();
    ctx.scale(scale.x, scale.y);
    ctx.beginPath();
    ctx.arc((x + 0.5 * w) / scale.x, (y + 0.5 * h) / scale.y, r / 2, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.restore();
  }
}

Gaia.registerShape(ShapeEnum.Oval, () => new OvalData, d => new ShapeOval(d))