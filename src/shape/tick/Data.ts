import { ShapeEnum } from "../ShapeEnum";
import { ShapeData } from "../base";

export class TickData extends ShapeData {
  override get needFill(): boolean {
    return false;
  }
  constructor() {
    super()
    this.type = ShapeEnum.Tick;
    this.strokeStyle = '#FF0000';
    this.lineWidth = 2;
  }
}

