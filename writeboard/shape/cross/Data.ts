import { ShapeEnum } from "../ShapeEnum";
import { ShapeData } from "../base";

export class CrossData extends ShapeData {
  override get needFill(): boolean {
    return false;
  }
  constructor() {
    super()
    this.type = ShapeEnum.Cross;
    this.strokeStyle = '#FF0000';
    this.lineWidth = 2;
  }
}

