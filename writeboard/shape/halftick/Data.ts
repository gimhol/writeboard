import { ShapeEnum } from "../ShapeEnum";
import { ShapeData } from "../base";

/**
 * 半钩的数据：只描边不填充
 *
 * Data of a half tick: stroked only, never filled.
 */
export class HalfTickData extends ShapeData {
  /**
   * 半钩不需要填充
   *
   * A half tick is never filled.
   *
   * @default false
   */
  override get needFill(): boolean {
    return false;
  }
  /**
   * 建一份半钩的数据：默认红色描边、线宽 2
   *
   * Builds half tick data: a red stroke of width 2 by default.
   *
   * @param {Partial<HalfTickData>} [other] 初始数据 / The initial data
   */
  constructor(other?: Partial<HalfTickData>) {
    super()
    this.type = ShapeEnum.HalfTick;
    this.strokeStyle = '#FF0000';
    this.lineWidth = 2;
    other && this.read(other)
  }
}

