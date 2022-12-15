import { ShapeEnum } from "../ShapeEnum"
import { FactoryMgr } from "../../mgr/FactoryMgr"
import { OvalData } from "./Data"
import { ShapeNeedPath } from "../base/ShapeNeedPath"

export class ShapeOval extends ShapeNeedPath<OvalData> {
  path(ctx: CanvasRenderingContext2D) {
    const { x, y, w, h } = this.drawingRect()
    const r = (w > h) ? w : h;
    const scale = { x: w / r, y: h / r };
    ctx.save();
    ctx.scale(scale.x, scale.y);
    ctx.beginPath();
    ctx.moveTo((x + w) / scale.x, y / scale.y);
    ctx.arc(x / scale.x, y / scale.y, r, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.restore();
  }
}

FactoryMgr.registerShape(ShapeEnum.Oval, () => new OvalData, d => new ShapeOval(d))