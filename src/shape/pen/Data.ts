import { ShapeEnum } from "../ShapeEnum"
import { ShapeData } from "../base"
export enum DotsType {
  Invalid = 0,
  All = 1,
  Append = 2
}
export class PenData extends ShapeData {
  dotsType: DotsType = DotsType.All
  coords: number[] = []

  constructor() {
    super()
    this.type = ShapeEnum.Pen
    this.strokeStyle = 'white'
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
    if (Array.isArray(other.coords)) {
      if (other.dotsType === DotsType.Append)
        this.coords.push(...other.coords)
      else
        this.coords = [...other.coords]
    }
    return this
  }
  override copy() {
    return new PenData().copyFrom(this)
  }
}
