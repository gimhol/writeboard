
import { ShapeEnum } from "../ShapeEnum";
import { ShapeData } from "../base";
/**
 * 椭圆的数据
 *
 * Data of an oval.
 */
export class OvalData extends ShapeData {
  /**
   * 建一份椭圆数据：默认红色描边、线宽 2
   *
   * Builds oval data: a red stroke of width 2 by default.
   *
   * @param {Partial<OvalData>} [other] 初始数据 / The initial data
   */
  constructor(other?: Partial<OvalData>) {
    super()
    this.type = ShapeEnum.Oval;
    this.strokeStyle = '#ff0000';
    this.lineWidth = 2;
    other && this.read(other)
  }
}
