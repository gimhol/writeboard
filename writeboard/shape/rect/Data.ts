import { ShapeEnum } from "../ShapeEnum";
import { ShapeData } from "../base";

export class RectData extends ShapeData {
  constructor(other?: Partial<RectData>) {
    super()
    this.type = ShapeEnum.Rect
    this.strokeStyle = '#ff0000'
    this.lineWidth = 5
    other && this.read(other);
  }
}

