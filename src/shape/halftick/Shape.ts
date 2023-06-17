import { ShapeEnum } from "../ShapeEnum"
import { FactoryMgr } from "../../mgr/FactoryMgr"
import { HalfTickData } from "./Data"
import { ShapeNeedPath } from "../base/ShapeNeedPath"

export class ShapeHalfTick extends ShapeNeedPath<HalfTickData> {
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
    const e = { x: x + w * 0.35, y: y + h * 0.25 }
    const f = { x: x + w * 0.70, y: y + h * 0.70 }
    ctx.moveTo(e.x, e.y)
    ctx.lineTo(f.x, f.y)
  }
}

FactoryMgr.registerShape(ShapeEnum.HalfTick, () => new HalfTickData, d => new ShapeHalfTick(d))