import { ShapeEnum } from "../ShapeEnum";
import { ShapeData } from "../base";

/**
 * 矩形的数据
 *
 * Data of a rectangle.
 */
export class RectData extends ShapeData {
  /**
   * 建一份矩形数据：默认红色描边、线宽 5
   *
   * Builds rectangle data: a red stroke of width 5 by default.
   *
   * @param {Partial<RectData>} [other] 初始数据 / The initial data
   */
  constructor(other?: Partial<RectData>) {
    super()
    this.type = ShapeEnum.Rect
    this.strokeStyle = '#ff0000'
    this.lineWidth = 5
    other && this.read(other);
  }
}

