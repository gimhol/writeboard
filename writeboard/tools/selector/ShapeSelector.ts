import { ShapeData, ShapeRect } from "../../shape";

/**
 * 框选用的选框：从按下点拖出来的半透明矩形，框选过程中实时变化
 *
 * The marquee used for box selection: the translucent rect dragged out from the press
 * point, updated live while selecting.
 */
export class ShapeSelector extends ShapeRect {
  /**
   * 新建选框：默认不可见（拖动时由选择工具打开）
   *
   * Creates a marquee: invisible by default (the selector tool shows it while dragging).
   */
  constructor() {
    super(new ShapeData);
    this.data.lineWidth = 2
    this.data.strokeStyle = '#003388FF'
    this.data.fillStyle = '#00338855'
    this.data.ghost = true;
  }
  /**
   * 框线线宽按屏幕比例修正：画布缩小时（如小小的草稿窗口）保证至少 1 屏幕像素，不会细到看不见
   *
   * The border width is corrected by the screen scale: when the canvas shrinks (as in a
   * small draft window) it keeps at least one screen pixel, so it never becomes invisible.
   *
   * @param {CanvasRenderingContext2D} ctx 画布上下文 / Canvas context
   */
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
  /**
   * 向内绘制：框线完全落在矩形内，拖动结束后（按矩形清脏）不会留下残影
   *
   * Draws inward: the border lies completely inside the rect, so clearing the rect after
   * the drag leaves no ghost behind.
   *
   * @param {CanvasRenderingContext2D} ctx 画布上下文 / Canvas context
   */
  override path(ctx: CanvasRenderingContext2D): void {
    const { x, y, w, h } = this.drawingRect()
    const lineWidth = this.data.lineWidth
    ctx.beginPath()
    ctx.rect(x + lineWidth / 2, y + lineWidth / 2, Math.max(0, w - lineWidth), Math.max(0, h - lineWidth))
    ctx.closePath()
  }
}
