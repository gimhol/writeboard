import { ShapeEnum } from "../ShapeEnum";
import { ShapeData } from "../base";
import { IDot } from "../../utils/Dot";

export class PolygonData extends ShapeData {
  constructor() {
    super()
    this.type = ShapeEnum.Polygon
    this.fillStyle = '#ff0000'
    this.strokeStyle = '#000000'
    this.lineWidth = 2
  }
  dots: IDot[] = []
  override copyFrom(other: Partial<PolygonData>) {
    super.copyFrom(other)
    if ('dots' in other) this.dots = other.dots!.map(v => ({ ...v }))
    return this
  }
}

