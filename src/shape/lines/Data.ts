import { ShapeEnum } from "../ShapeEnum"
import { ShapeData } from "../base"

export class LinesData extends ShapeData {
  coords: number[] = []
  constructor() {
    super()
    this.type = ShapeEnum.Lines;
    this.strokeStyle = 'white';
    this.lineCap = 'round';
    this.lineJoin = 'round';
    this.lineDash = [5, 5]
    this.lineWidth = 3;
  }
  override copyFrom(other: Partial<LinesData>) {
    super.copyFrom(other)
    if (Array.isArray(other.coords)) this.coords = [...other.coords]
    return this
  }
  override merge(other: Partial<LinesData>) {
    super.copyFrom(other)
    if (Array.isArray(other.coords)) {
      this.coords = [...other.coords]
    }
    return this
  }
  override copy() {
    return new LinesData().copyFrom(this)
  }
}
