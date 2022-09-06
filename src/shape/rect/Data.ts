import { ShapeEnum } from "../ShapeEnum";
import { ShapeData } from "../base";

export class RectData extends ShapeData {
  constructor() {
    super()
    this.type = ShapeEnum.Rect
    this.fillStyle = '#ff0000'
    this.strokeStyle = '#000000'
    this.lineWidth = 2
  }
  override copy(): RectData {
    return new RectData().copyFrom(this)
  }
}

