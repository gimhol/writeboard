import type { Board } from "../board/Board"
import { Shape, ShapeData } from "../shape/base"
import type { ShapeType } from "../shape/ShapeEnum"
import type { IDot } from "../utils/Dot"

const NO_DASH: number[] = []

export class Indicator extends Shape<ShapeData> {
  radius = 0
  gap = 3
  len = 6
  private _pressed = false

  constructor() {
    super(new ShapeData, ShapeData)
    this.data.ghost = true
    this.data.visible = false
  }
  press(): void {
    if (this._pressed) return
    this._pressed = true
    this.markDirty()
  }
  release(): void {
    if (!this._pressed) return
    this._pressed = false
    this.markDirty()
  }
  override render(ctx: CanvasRenderingContext2D): void {
    if (!this.visible) return
    const { x, y, w, h } = this.data
    const color = this.data.strokeStyle || '#000000'
    const lineWidth = this.data.lineWidth || 1
    const { radius, gap, len } = this
    const d0 = radius + gap
    const d1 = d0 + len
    ctx.save()
    ctx.translate(x + w / 2, y + h / 2)
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'butt'
    ctx.lineJoin = 'miter'
    ctx.setLineDash(NO_DASH)
    ctx.strokeStyle = color
    ctx.beginPath()
    ctx.arc(0, 0, radius, 0, Math.PI * 2)
    if (this._pressed) {
      ctx.fillStyle = color
      ctx.fill()
    }
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, -d1)
    ctx.lineTo(0, -d0)
    ctx.moveTo(0, d0)
    ctx.lineTo(0, d1)
    ctx.moveTo(-d1, 0)
    ctx.lineTo(-d0, 0)
    ctx.moveTo(d0, 0)
    ctx.lineTo(d1, 0)
    ctx.stroke()
    ctx.restore()
  }
}

export function placeIndicator(indicator: Indicator, board: Board | undefined, shapeType: ShapeType, dot: IDot): void {
  if (!board) return
  if (!board.customCursor) {
    indicator.visible = false
    return
  }
  const { cursor } = board.factory
  const template = board.factory.shapeTemplate(shapeType)
  const s = board.screenScale || 1
  const radius = Math.max((template.lineWidth || 0) / 2, cursor.minRadius / s)
  const gap = cursor.tickGap / s
  const len = cursor.tickLen / s
  const lw = cursor.lineWidth / s
  indicator.radius = radius
  indicator.gap = gap
  indicator.len = len
  indicator.data.lineWidth = lw
  indicator.data.strokeStyle = cursor.color || template.strokeStyle || '#000000'
  /* 脏矩形在笔迹外多留 2 屏幕像素：高 DPI / 页面缩放下抗锯齿光晕会超出笔画本体，
     清完重绘盖不满时会在光标轨迹上留下与背景同色的残影 */
  const half = radius + gap + len + lw + 2 / s
  indicator.geo(dot.x - half, dot.y - half, half * 2, half * 2)
  if (!indicator.visible) indicator.visible = true
}
