
import { ShapeEnum } from "../ShapeEnum";
import { ShapeData } from "../base";
export class OvalData extends ShapeData {
  constructor() {
    super()
    this.type = ShapeEnum.Oval
    // this.fillStyle = '#00000000'
    this.strokeStyle = '#ff0000'
    this.lineWidth = 2
  }
  copy(): OvalData {
    return new OvalData().copyFrom(this)
  }
}
