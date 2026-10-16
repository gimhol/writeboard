import { opposites, Resizable, Shape } from "../shape";
import { SelectorTool } from "../tools";
import { Board } from "./Board";
import type { IShapeDecoration } from "./IShapeDecoration";

/**
 * 默认的图形装饰器：选中框 / 锁定框 / 缩放柄都按这里的样式绘制
 *
 * Default shape decoration: the selection frame, the lock frame and the resize handles
 * are drawn the way they are implemented here.
 */
export class DefaultShapeDecoration implements IShapeDecoration {
  /**
   * 装饰器所属的黑板
   *
   * The board this decoration belongs to.
   */
  board: Board;
  /**
   * 建一个装饰器并绑定到某块黑板
   *
   * Creates a decoration bound to a board.
   *
   * @param {Board} board 黑板 / The board
   */
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
   * Checks whether the shape is one of the selected shapes while more than one shape is
   * selected (in that case the shape itself draws no frame).
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

  /**
   * 绘制锁定图形的虚线框与锁形图标（线宽按屏幕比例修正、向内绘制）
   *
   * Draws the dashed frame and the lock icon of a locked shape (the line width is
   * corrected for the screen scale and the frame is drawn inwards).
   *
   * @param {Shape} shape 图形 / Shape
   * @param {CanvasRenderingContext2D} ctx 要绘制到的 2D 上下文 / Context to draw on
   */
  locked(shape: Shape, ctx: CanvasRenderingContext2D) {
    /* 选择多个图形时，图形本身的矩形示意框不展示 */
    // if (this.is_mutiply_selected(shape)) return;
    /* 线宽按屏幕比例修正（至少 1 屏幕像素），并向内绘制（见 selected） */
    const lineWidth = this.board?.screenLineWidth(2) ?? 2
    ctx.lineWidth = lineWidth
    let { x, y, w, h } = shape.selectorRect()
    ctx.beginPath()
    ctx.rect(x + lineWidth / 2, y + lineWidth / 2, Math.max(0, w - lineWidth), Math.max(0, h - lineWidth))
    ctx.closePath()
    this.dash_stroke(ctx, [lineWidth * 8])
    ctx.translate(w - this.lock_icon_w - 5, 5)
    this.draw_lock(ctx)

  }

  /**
   * 绘制选中框：单个图形画虚线框，同组图形画实线框，多选时单个图形不再各自画框
   *
   * Draws the selection frame: dashed for a single shape, solid for shapes of the same
   * group, and none for the individual shapes while several of them are selected.
   *
   * @param {Shape} shape 图形 / Shape
   * @param {CanvasRenderingContext2D} ctx 要绘制到的 2D 上下文 / Context to draw on
   */
  selected(shape: Shape, ctx: CanvasRenderingContext2D) {
    /* 线宽按屏幕比例修正：画布缩小时（如小小的草稿窗口）保证选框至少 1 屏幕像素，不会细到看不见 */
    const lineWidth = this.board?.screenLineWidth(1) ?? 1
    if (shape.groupId) {
      ctx.lineWidth = lineWidth
      const { x, y, w, h } = shape.selectorRect()
      ctx.beginPath()
      /* 向内绘制：线完全落在选框内，取消选中时（按图形包围盒清脏）不会留下半像素残影 */
      ctx.rect(x + lineWidth / 2, y + lineWidth / 2, Math.max(0, w - lineWidth), Math.max(0, h - lineWidth))
      ctx.closePath()
      ctx.stroke()
      return;
    }

    /* 选择多个图形时，图形本身的矩形示意框不展示 */
    if (this.is_mutiply_selected(shape)) return;
    ctx.lineWidth = lineWidth
    const { x, y, w, h } = shape.selectorRect()
    ctx.beginPath()
    /* 向内绘制（同上） */
    ctx.rect(x + lineWidth / 2, y + lineWidth / 2, Math.max(0, w - lineWidth), Math.max(0, h - lineWidth))
    ctx.closePath()
    this.dash_stroke(ctx, [lineWidth * 4])
  }

  /**
   * 绘制缩放柄：图形允许的每个方向画一个小方块，正在拖动的那个画成叉
   *
   * Draws the resize handles: a small square per direction the shape allows, and a cross
   * for the one currently being dragged.
   *
   * @param {Shape} shape 图形 / Shape
   * @param {CanvasRenderingContext2D} ctx 要绘制到的 2D 上下文 / Context to draw on
   * @return {boolean | void} 不绘制时返回 false / Returns false when nothing was drawn
   */
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