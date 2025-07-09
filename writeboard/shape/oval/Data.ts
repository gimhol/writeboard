
import { ShapeEnum } from "../ShapeEnum";
import { ShapeData } from "../base";
export class OvalData extends ShapeData {
  constructor(other?: Partial<OvalData>) {
    super()
    this.type = ShapeEnum.Oval;
    this.strokeStyle = '#ff0000';
    this.lineWidth = 2;
    other && this.read(other)
  }
}
