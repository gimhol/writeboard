import { ShapeEnum } from "../ShapeEnum"
import { Gaia } from "../../mgr/Gaia"
import { TickData } from "./Data"
import { ShapeNeedPath } from "../base/ShapeNeedPath"

export class ShapeTick extends ShapeNeedPath<TickData> {
  path(ctx: CanvasRenderingContext2D) {
    const { x, y, w, h } = this.drawingRect()
    const a = { x: x, y: y + h * 0.7 }
    const b = { x: x + w / 3, y: y + h }
    const c = { x: x + w, y: y }
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.bezierCurveTo(
      a.x + (b.x - a.x) / 3, a.y,
      b.x, b.y - (b.y - a.y) / 3,
      b.x, b.y
    );
    ctx.bezierCurveTo(
      b.x, b.y - (b.y - c.y) / 3,
      c.x - (c.x - b.x) / 4, c.y,
      c.x, c.y
    );
  }
}

Gaia.registerShape(ShapeEnum.Tick, () => new TickData, d => new ShapeTick(d))