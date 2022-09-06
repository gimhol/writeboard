import { ShapeEnum } from "../ShapeEnum"
import { FactoryMgr } from "../../mgr/FactoryMgr"
import { OvalData } from "./Data"
import { ShapeNeedPath } from "../base/ShapeNeedPath"

export class ShapeOval extends ShapeNeedPath<OvalData> {
  path(ctx: CanvasRenderingContext2D) {
    const d = this.data
    const { x, y, w, h } = this.drawingRect()
    const drawOffset = (d.w % 2) ? 0.5 : 0
    // 贝塞尔曲线拟合椭圆
    const kappa = 0.5522848
    const ox = (w / 2) * kappa
    const oy = (h / 2) * kappa
    const xe = x + w
    const ye = y + h
    const xm = Math.floor(d.x + d.w / 2) + drawOffset
    const ym = Math.floor(d.y + d.h / 2) + drawOffset
    ctx.beginPath()
    ctx.moveTo(x, ym)
    ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y)
    ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym)
    ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye)
    ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym)
    ctx.closePath()
  }
}

FactoryMgr.registerShape(ShapeEnum.Oval, () => new OvalData, d => new ShapeOval(d))