import { ShapeEnum } from "../ShapeEnum"
import { Gaia } from "../../mgr/Gaia"
import { RectData } from "./Data"
import { ShapeNeedPath } from "../base/ShapeNeedPath"

/**
 * 矩形图形：只画一个矩形路径，填充 / 描边交给基类
 *
 * Rectangle shape: it only draws a rectangular path, the fill / stroke work is done by the
 * base class.
 */
export class ShapeRect extends ShapeNeedPath<RectData> {
  /**
   * 按数据建一个矩形图形
   *
   * Builds a rectangle shape from the given data.
   *
   * @param {Partial<RectData>} data 图形数据 / Shape data
   */
  constructor(data: Partial<RectData>) {
    super(data, RectData)
  }
  /**
   * 矩形路径：局部坐标系里的一个矩形
   *
   * The rectangular path: one rectangle in the local space.
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

Gaia.registerShape(ShapeEnum.Rect, () => new RectData, d => new ShapeRect(d))