import { ShapeEnum } from "../ShapeEnum";
import { ShapeData } from "../base";

/**
 * 钩（对号）的数据：只描边不填充
 *
 * Data of a tick (a check mark): stroked only, never filled.
 */
export class TickData extends ShapeData {
  /**
   * 钩不需要填充
   *
   * A tick is never filled.
   *
   * @default false
   */
  override get needFill(): boolean {
    return false;
  }
  /**
   * 建一份钩的数据：默认红色描边、线宽 2
   *
   * Builds tick data: a red stroke of width 2 by default.
   *
   * @param {Partial<TickData>} [other] 初始数据 / The initial data
   */
  constructor(other?: Partial<TickData>) {
    super()
    this.type = ShapeEnum.Tick;
    this.strokeStyle = '#FF0000';
    this.lineWidth = 2;
    other && this.read(other)
  }
}

