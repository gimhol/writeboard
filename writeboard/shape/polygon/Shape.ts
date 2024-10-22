import { ShapeEnum } from "../ShapeEnum"
import { Gaia } from "../../mgr/Gaia"
import { PolygonData } from "./Data"
import { ShapeNeedPath } from "../base/ShapeNeedPath"

export class ShapePolygon extends ShapeNeedPath<PolygonData> {
  constructor(data: Partial<PolygonData>) {
    super(data, PolygonData)
  }
  path(ctx: CanvasRenderingContext2D) {
    const { x, y, w, h } = this.drawingRect()
    ctx.beginPath();
    ctx.rect(x, y, w, h)
    ctx.closePath();
  }
}

Gaia.registerShape(ShapeEnum.Polygon, () => new PolygonData, d => new ShapePolygon(d))