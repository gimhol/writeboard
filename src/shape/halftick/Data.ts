import { ShapeEnum } from "../ShapeEnum";
import { ShapeData } from "../base";

export class HalfTickData extends ShapeData {
  override get needFill(): boolean {
    return false;
  }
  constructor() {
    super()
    this.type = ShapeEnum.HalfTick;
    this.strokeStyle = '#FF0000';
    this.lineWidth = 2;
  }
  override copy(): HalfTickData {
    return new HalfTickData().copyFrom(this)
  }
}

