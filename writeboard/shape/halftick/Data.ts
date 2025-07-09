import { ShapeEnum } from "../ShapeEnum";
import { ShapeData } from "../base";

export class HalfTickData extends ShapeData {
  override get needFill(): boolean {
    return false;
  }
  constructor(other?: Partial<HalfTickData>) {
    super()
    this.type = ShapeEnum.HalfTick;
    this.strokeStyle = '#FF0000';
    this.lineWidth = 2;
    other && this.read(other)
  }
}

