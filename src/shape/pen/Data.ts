import { ShapeEnum } from "../ShapeEnum"
import { ShapeData } from "../base"
export enum DotsType {
  Invalid = 0,
  All = 1,
  Append = 2,
  Subtract = 3,
}
export class PenData extends ShapeData {
  dotsType: DotsType = DotsType.All
  coords: number[] = []
  override get needFill(): boolean {
    return false;
  }
  constructor() {
    super()
    this.type = ShapeEnum.Pen
    this.strokeStyle = '#ff0000'
    this.lineCap = 'round'
    this.lineJoin = 'round'
    this.lineWidth = 3
  }
  override copyFrom(other: Partial<PenData>) {
    super.copyFrom(other)
    if (other.dotsType) this.dotsType = other.dotsType
    if (Array.isArray(other.coords)) this.coords = [...other.coords]
    return this
  }
  override merge(other: Partial<PenData>) {
    super.copyFrom(other)
    if (!Array.isArray(other.coords)) {
      return this
    }
    switch (other.dotsType) {
      case DotsType.Subtract:
        this.coords = this.coords.slice(0, -other.coords.length);
        break;
      case DotsType.Append:
        this.coords.push(...other.coords);
        break;
      default:
        this.coords = [...other.coords];
        break;
    }

    return this
  }
  override copy() {
    return new PenData().copyFrom(this)
  }
}
