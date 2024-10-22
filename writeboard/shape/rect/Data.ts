import { ShapeEnum } from "../ShapeEnum";
import { ShapeData } from "../base";

export class RectData extends ShapeData {
  constructor(other?: Partial<RectData>) {
    super(other)
    this.type = ShapeEnum.Rect
    this.strokeStyle = '#ff0000'
    this.lineWidth = 2
    other && this.read(other);
  }
}

