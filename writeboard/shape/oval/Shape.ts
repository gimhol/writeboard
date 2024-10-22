import { ShapeEnum } from "../ShapeEnum"
import { Gaia } from "../../mgr/Gaia"
import { OvalData } from "./Data"
import { ShapeNeedPath } from "../base/ShapeNeedPath"

export class ShapeOval extends ShapeNeedPath<OvalData> {
  constructor(data: Partial<OvalData>) {
    super(data, OvalData)
  }
  path(ctx: CanvasRenderingContext2D) {
    const { x, y, w, h } = this.drawingRect()
    const r = (w > h) ? w : h;
    const scale = { x: w / r, y: h / r };
    ctx.save();
    ctx.scale(scale.x, scale.y);
    ctx.beginPath();
    ctx.arc((x + 0.5 * w) / scale.x, (y + 0.5 * h) / scale.y, r / 2, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.restore();
  }
}

Gaia.registerShape(ShapeEnum.Oval, () => new OvalData, d => new ShapeOval(d))