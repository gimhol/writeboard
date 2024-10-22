import { ShapeEnum } from "../ShapeEnum"
import { Gaia } from "../../mgr/Gaia"
import { CrossData } from "./Data"
import { ShapeNeedPath } from "../base/ShapeNeedPath"

export class ShapeCross extends ShapeNeedPath<CrossData> {
  constructor(data: Partial<CrossData>) {
    super(data, CrossData)
  }
  path(ctx: CanvasRenderingContext2D) {
    const { x, y, w, h } = this.drawingRect()
    const a = { x: x, y: y + 0.05 * h }
    const b = { x: x + w, y: y + h - 0.05 * h }
    const c = { x: x + 0.05 * w, y: y + h }
    const d = { x: x + w - 0.05 * w, y: y }
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.quadraticCurveTo(
      x + w / 2 + 0.2 * w,
      y + h / 2 + 0.1 * h,
      b.x, b.y
    );
    ctx.moveTo(c.x, c.y);
    ctx.quadraticCurveTo(
      x + w / 2 - 0.05 * w,
      y + h / 2 - 0.1 * h,
      d.x, d.y);
  }
}

Gaia.registerShape(ShapeEnum.Cross, () => new CrossData, d => new ShapeCross(d))