import { ShapeEnum } from "../ShapeEnum"
import { Gaia } from "../../mgr/Gaia"
import { RectData } from "./Data"
import { ShapeNeedPath } from "../base/ShapeNeedPath"

export class ShapeRect extends ShapeNeedPath<RectData> {
  constructor(data: Partial<RectData>) {
    super(data, RectData)
  }
  path(ctx: CanvasRenderingContext2D) {
    const { x, y, w, h } = this.drawingRect()
    ctx.beginPath();
    ctx.rect(x, y, w, h)
    ctx.closePath();
  }
}

Gaia.registerShape(ShapeEnum.Rect, () => new RectData, d => new ShapeRect(d))