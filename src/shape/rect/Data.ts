import { ShapeEnum } from "../ShapeEnum";
import { ShapeData } from "../base";

export class RectData extends ShapeData {
  constructor() {
    super()
    this.type = ShapeEnum.Rect
    this.strokeStyle = '#ff0000'
    this.lineWidth = 2
  }
  override copy(): RectData {
    return new RectData().copyFrom(this)
  }
}

