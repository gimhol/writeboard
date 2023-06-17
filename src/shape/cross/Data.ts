import { ShapeEnum } from "../ShapeEnum";
import { ShapeData } from "../base";

export class CrossData extends ShapeData {
  constructor() {
    super()
    this.type = ShapeEnum.Cross;
    this.strokeStyle = '#FF0000';
    this.lineWidth = 2;
  }
  override copy(): CrossData {
    return new CrossData().copyFrom(this)
  }
}

