import { ShapeEnum } from "../ShapeEnum"
import { FactoryMgr } from "../../mgr/FactoryMgr"
import { PolygonData } from "./Data"
import { ShapeNeedPath } from "../base/ShapeNeedPath"

export class ShapePolygon extends ShapeNeedPath<PolygonData> {
  path(ctx: CanvasRenderingContext2D) {
    const { x, y, w, h } = this.drawingRect()
    ctx.beginPath();
    ctx.rect(x, y, w, h)
    ctx.closePath();
  }
}

FactoryMgr.registerShape(ShapeEnum.Polygon, () => new PolygonData, d => new ShapePolygon(d))