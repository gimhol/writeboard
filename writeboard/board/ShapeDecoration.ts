import { Resizable, Shape } from "../shape";
import type { IShapeDecoration } from "./IShapeDecoration";

export class DefaultShapeDecoration implements IShapeDecoration {

  private dashSroke(ctx: CanvasRenderingContext2D, segments: Iterable<number>) {
    ctx.strokeStyle = 'white'
    ctx.setLineDash([])
    ctx.stroke()
    ctx.strokeStyle = 'black'
    ctx.setLineDash(segments)
    ctx.stroke()
  }

  /**
   * 检查一个图形是否是被选择的图形之一
   *
   * @note 有些工具自身需要利用图形来渲染自身，这些图形不会再board?.selects中。
   * @param {Shape} shape 图形
   * @returns {boolean} 若是返回true，否则返回false
   */
  is_mutiply_selected(shape: Shape): boolean {
    const selects = shape.board?.selects;
    if (!selects) return false;
    return selects.some(v => v === shape) && selects.length > 1
  }

  locked(shape: Shape, ctx: CanvasRenderingContext2D) {
    /* 选择多个图形时，图形本身的矩形示意框不展示 */
    // if (this.is_mutiply_selected(shape)) return;
    const lineWidth = 2
    ctx.lineWidth = lineWidth
    let { x, y, w, h } = shape.selectorRect()
    ctx.beginPath()
    ctx.rect(x + 1, y + 1, w - 1, h - 1)
    ctx.closePath()
    this.dashSroke(ctx, [lineWidth * 8])
  }

  selected(shape: Shape, ctx: CanvasRenderingContext2D) {
    /* 选择多个图形时，图形本身的矩形示意框不展示 */
    if (this.is_mutiply_selected(shape)) return;
    const lineWidth = 1
    ctx.lineWidth = lineWidth
    let { x, y, w, h } = shape.selectorRect()
    ctx.beginPath()
    ctx.rect(x, y, w, h)
    ctx.closePath()
    this.dashSroke(ctx, [lineWidth * 4])
  }

  resizable(shape: Shape, ctx: CanvasRenderingContext2D) {
    /* 选择多个图形时，图形本身的resize示意框不展示 */
    if (this.is_mutiply_selected(shape)) return;
    let { x, y, w, h } = shape.selectorRect()
    ctx.fillStyle = 'white'
    ctx.setLineDash([]);
    const {
      s, lx, rx, ty, by, mx, my,
    } = shape.getResizerNumbers(x, y, w, h)
    const { resizable } = shape

    if (resizable & Resizable.Vertical) {
      // top resizer
      ctx.beginPath()
      ctx.rect(mx, ty, s, s)
      ctx.fill()
      ctx.stroke()

      // bottom resizer
      ctx.beginPath()
      ctx.rect(mx, by, s, s)
      ctx.fill()
      ctx.stroke()
    }

    if (resizable & Resizable.Horizontal) {
      // left resizer
      ctx.beginPath()
      ctx.rect(lx, my, s, s)
      ctx.fill()
      ctx.stroke()

      // right resizer
      ctx.beginPath()
      ctx.rect(rx, my, s, s)
      ctx.fill()
      ctx.stroke()
    }
    if (resizable & Resizable.Corner) {
      // top-left resizer
      ctx.beginPath()
      ctx.rect(lx, ty, s, s)
      ctx.fill()
      ctx.stroke()

      // top-right resizer
      ctx.beginPath()
      ctx.rect(rx, ty, s, s)
      ctx.fill()
      ctx.stroke()

      // bottom-left resizer
      ctx.beginPath()
      ctx.rect(lx, by, s, s)
      ctx.fill()
      ctx.stroke()

      // bottom-right resizer
      ctx.beginPath()
      ctx.rect(rx, by, s, s)
      ctx.fill()
      ctx.stroke()
    }
  }
}