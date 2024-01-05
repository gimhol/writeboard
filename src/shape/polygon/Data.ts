import { IDot } from "../../utils/Dot";
import { ShapeEnum } from "../ShapeEnum";
import { IShapeData, ShapeData } from "../base";

export interface IPolygonData extends IShapeData {
  /** dots */
  u: IDot[];
}

export class PolygonData extends ShapeData implements IPolygonData {
  constructor() {
    super()
    this.type = ShapeEnum.Polygon
    this.fillStyle = '#ff0000'
    this.strokeStyle = '#000000'
    this.lineWidth = 2
  }

  u: IDot[] = []
  get dots(): IDot[] { return this.u }
  set dots(v: IDot[]) { this.u = v }

  override read(other: Partial<PolygonData>) {
    super.read(other)
    const { u = other.dots } = other
    if (u) this.u = u.map(v => ({ ...v }))
    return this
  }
}

