import { ShapeEnum } from "../ShapeEnum"
import { FactoryMgr } from "../../mgr/FactoryMgr"
import { RectData } from "./Data"
import { ShapeNeedPath } from "../base/ShapeNeedPath"

export class ShapeRect extends ShapeNeedPath<RectData> {
  path(ctx: CanvasRenderingContext2D) {
    const { x, y, w, h } = this.drawingRect()
    ctx.beginPath();
    ctx.rect(x, y, w, h)
    ctx.closePath();
  }
}

FactoryMgr.registerShape(ShapeEnum.Rect, () => new RectData, d => new ShapeRect(d))