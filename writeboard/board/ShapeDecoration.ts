import { opposites, Resizable, Shape } from "../shape";
import { SelectorTool } from "../tools";
import { Board } from "./Board";
import type { IShapeDecoration } from "./IShapeDecoration";

export class DefaultShapeDecoration implements IShapeDecoration {
  board: Board;
  constructor(board: Board) {
    this.board = board;
  }
  private dash_stroke(ctx: CanvasRenderingContext2D, segments: Iterable<number>) {
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
    const selects = this.board?.selects;
    if (!selects) return false;
    return selects.some(v => v === shape) && selects.length > 1
  }
  private lock_icon_w = 25;
  private lock_icon_h = 25;
  private lock_path_2d: Path2D | null = null;
  private draw_lock(ctx: CanvasRenderingContext2D) {
    if (!this.lock_path_2d) {
      const path = this.lock_path_2d = new Path2D()
      const w = 15;
      const h = 12;
      const t = w * 0.65;
      const l = (this.lock_icon_w - w) / 2
      const r = l + w;
      const mx = l + w / 2;
      const my = t + h / 2;
      path.roundRect(0, 0, this.lock_icon_w, this.lock_icon_h, 2)
      path.roundRect(l, t, w, h, 2);
      path.moveTo(l + w / 6, t)
      path.arc(mx, t - 2, w / 3, Math.PI, 0)
      path.lineTo(r - w / 6, t)
      path.moveTo(mx, my - h * 0.3)
      path.lineTo(mx, my + h * 0.2)
      path.arc(mx, my + h * 0.2, 1, 0, Math.PI * 2)
    }

    ctx.fillStyle = '#FFFFFF88'
    ctx.strokeStyle = '#00000088'
    ctx.lineWidth = 2
    ctx.setLineDash([])
    ctx.fill(this.lock_path_2d)
    ctx.stroke(this.lock_path_2d)
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
    this.dash_stroke(ctx, [lineWidth * 8])

    ctx.translate(w - this.lock_icon_w - 5, 5)
    this.draw_lock(ctx)

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
    this.dash_stroke(ctx, [lineWidth * 4])
  }

  resizable(shape: Shape, ctx: CanvasRenderingContext2D) {
    if (!this.board?.shapeResizble || !shape.resizable) return false;

    /* 选择多个图形时，图形本身的resize示意框不展示 */
    if (this.is_mutiply_selected(shape)) return;

    const { tool } = this.board;

    const anchor = opposites[
      tool instanceof SelectorTool && tool.resizer.shape === shape ? tool.resizer.direction : Resizable.None
    ]

    let { x, y, w, h } = shape.selectorRect()
    ctx.fillStyle = 'white'
    ctx.setLineDash([]);
    const {
      s, lx, rx, ty, by, mx, my,
    } = shape.getResizerNumbers(x, y, w, h)
    const { resizable } = shape

    let rects: [[number, number, number, number], boolean][] = []
    if (resizable & Resizable.Top) {
      rects.push([[mx, ty, s, s], anchor == Resizable.Top])
    }
    if (resizable & Resizable.Bottom) {
      rects.push([[mx, by, s, s], anchor == Resizable.Bottom])
    }
    if (resizable & Resizable.Left) {
      rects.push([[lx, my, s, s], anchor == Resizable.Left])
    }
    if (resizable & Resizable.Right) {
      rects.push([[rx, my, s, s], anchor == Resizable.Right])
    }
    if (resizable & Resizable.TopLeft) {
      rects.push([[lx, ty, s, s], anchor == Resizable.TopLeft])
    }
    if (resizable & Resizable.TopRight) {
      rects.push([[rx, ty, s, s], anchor == Resizable.TopRight])
    }
    if (resizable & Resizable.BottomLeft) {
      rects.push([[lx, by, s, s], anchor == Resizable.BottomLeft])
    }
    if (resizable & Resizable.BottomRight) {
      rects.push([[rx, by, s, s], anchor == Resizable.BottomRight])
    }
    for (const [nums, is_anchor] of rects) {
      ctx.beginPath()
      if (is_anchor) {
        ctx.moveTo(nums[0], nums[1])
        ctx.lineTo(nums[0] + nums[2], nums[1] + nums[3])
        ctx.moveTo(nums[0] + nums[2], nums[1])
        ctx.lineTo(nums[0], nums[1] + nums[3])
      }
      ctx.rect(...nums)
      ctx.fill()
      ctx.stroke()
    }
  }
}