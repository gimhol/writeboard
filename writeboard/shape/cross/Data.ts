import { ShapeEnum } from "../ShapeEnum";
import { ShapeData } from "../base";

/**
 * 叉（错号）的数据：只描边不填充
 *
 * Data of a cross: stroked only, never filled.
 */
export class CrossData extends ShapeData {
  /**
   * 叉不需要填充
   *
   * A cross is never filled.
   *
   * @default false
   */
  override get needFill(): boolean {
    return false;
  }
  /**
   * 建一份叉的数据：默认红色描边、线宽 2
   *
   * Builds cross data: a red stroke of width 2 by default.
   *
   * @param {Partial<CrossData>} [other] 初始数据 / The initial data
   */
  constructor(other?: Partial<CrossData>) {
    super()
    this.type = ShapeEnum.Cross;
    this.strokeStyle = '#FF0000';
    this.lineWidth = 2;
    other && this.read(other);
  }
}

