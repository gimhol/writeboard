import { ShapeEnum } from "../ShapeEnum"
import { ShapeData } from "../base"

export class LinesData extends ShapeData {
  coords: number[] = []
  override get needFill(): boolean {
    return false;
  }
  constructor() {
    super()
    this.type = ShapeEnum.Lines;
    this.strokeStyle = '#ff0000';
    this.lineCap = 'round';
    this.lineJoin = 'round';
    this.lineWidth = 2;
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
