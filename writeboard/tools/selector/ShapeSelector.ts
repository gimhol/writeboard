import { ShapeData, ShapeRect } from "../../shape";

export class ShapeSelector extends ShapeRect {
  constructor() {
    super(new ShapeData);
    this.data.lineWidth = 2
    this.data.strokeStyle = '#003388FF'
    this.data.fillStyle = '#00338855'
    this.data.ghost = true;
  }
  /** 框线线宽按屏幕比例修正：画布缩小时（如小小的草稿窗口）保证至少 1 屏幕像素，不会细到看不见 */
  override render(ctx: CanvasRenderingContext2D): void {
    const d = this.data
    const lineWidth = this.board?.screenLineWidth(d.lineWidth) ?? d.lineWidth
    const prev = d.lineWidth
    d.lineWidth = lineWidth
    try {
      super.render(ctx)
    } finally {
      d.lineWidth = prev
    }
  }
  /** 向内绘制：框线完全落在矩形内，拖动结束后（按矩形清脏）不会留下残影 */
  override path(ctx: CanvasRenderingContext2D): void {
    const { x, y, w, h } = this.drawingRect()
    const lineWidth = this.data.lineWidth
    ctx.beginPath()
    ctx.rect(x + lineWidth / 2, y + lineWidth / 2, Math.max(0, w - lineWidth), Math.max(0, h - lineWidth))
    ctx.closePath()
  }
}
