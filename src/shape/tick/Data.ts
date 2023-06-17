import { ShapeEnum } from "../ShapeEnum";
import { ShapeData } from "../base";

export class TickData extends ShapeData {
  constructor() {
    super()
    this.type = ShapeEnum.Tick;
    this.strokeStyle = '#FF0000';
    this.lineWidth = 2;
  }
  override copy(): TickData {
    return new TickData().copyFrom(this)
  }
}

