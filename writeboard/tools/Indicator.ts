import type { Board } from "../board/Board"
import { Shape, ShapeData } from "../shape/base"
import type { ShapeType } from "../shape/ShapeEnum"
import type { IDot } from "../utils/Dot"

const NO_DASH: number[] = []

/**
 * 工具的自绘光标：十字刻度 + 中心圆，自己就是一个图形（ghost），画在图形层上
 *
 * A tool's self-drawn cursor: crosshair ticks plus a center circle. It is a shape of its
 * own (a ghost) and is painted on the shape layer.
 */
export class Indicator extends Shape<ShapeData> {
  /**
   * 中心圆的半径（画布坐标）
   *
   * Radius of the center circle (canvas coordinates).
   */
  radius = 0
  /**
   * 刻度线与中心圆之间的间隙（画布坐标）
   *
   * Gap between the ticks and the center circle (canvas coordinates).
   */
  gap = 3
  /**
   * 刻度线的长度（画布坐标）
   *
   * Length of the ticks (canvas coordinates).
   */
  len = 6
  private _pressed = false

  /**
   * 新建一个光标：默认不可见（等第一次 placeIndicator 时再显示）
   *
   * Creates a cursor: invisible by default (it shows up on the first placeIndicator).
   */
  constructor() {
    super(new ShapeData, ShapeData)
    this.data.ghost = true
    this.data.visible = false
  }
  /**
   * 按下（左键按下）：中心圆变成实心
   *
   * Pressed (the primary button went down): the center circle becomes filled.
   */
  press(): void {
    if (this._pressed) return
    this._pressed = true
    this.markDirty()
  }
  /**
   * 抬起：中心圆恢复空心
   *
   * Released: the center circle goes back to being hollow.
   */
  release(): void {
    if (!this._pressed) return
    this._pressed = false
    this.markDirty()
  }
  /**
   * 画光标：以 data 的 x / y / w / h 求出中心，再画十字刻度与中心圆
   *
   * Draws the cursor: takes the center from data's x / y / w / h, then paints the ticks
   * and the center circle.
   *
   * @param {CanvasRenderingContext2D} ctx 画布上下文 / Canvas context
   */
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

/**
 * 把光标摆到指针位置：按工厂配置（cursor / shapeTemplate）设置尺寸与颜色，
 * 并在指针周围标出脏区；板子关掉了自绘光标（board.customCursor 为 false）时直接隐藏
 *
 * Places the cursor at the pointer: sets its size and color from the factory config
 * (cursor / shapeTemplate) and marks the dirty rect around the pointer; it is hidden
 * straight away when the board turned self-drawn cursors off (board.customCursor false).
 *
 * @param {Indicator} indicator 要摆放的光标 / The cursor to place
 * @param {Board | undefined} board 所在板子 / The board it belongs to
 * @param {ShapeType} shapeType 当前工具画的图形类型（它的描边色 / 线宽作缺省值）/ Shape type the current tool draws (its stroke color / line width are the fallbacks)
 * @param {IDot} dot 指针位置（画布坐标）/ Pointer position (canvas coordinates)
 */
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
