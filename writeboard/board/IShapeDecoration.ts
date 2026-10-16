import type { Shape } from "../shape";
import { Board } from "./Board";

/**
 * 图形装饰器：在图形之上（或之外）额外绘制些东西，比如选中框、锁定图标、缩放柄、拖拽预览
 *
 * Shape decoration: draws extra things on top of a shape (or around it), such as the
 * selection frame, the lock icon, the resize handles and the ghost of a drag.
 */
export interface IShapeDecoration {
  /**
   * 装饰器所属的黑板
   *
   * The board this decoration belongs to.
   */
  board: Board;
  /**
   * 绘制拖拽 / 粘贴前的「预览影子」
   *
   * Draws the ghost that previews a drag / paste.
   *
   * @param {Shape} shape 图形 / Shape
   * @param {CanvasRenderingContext2D} ctx 画布上下文 / Canvas context
   */
  ghost?: (shape: Shape, ctx: CanvasRenderingContext2D) => void;
  /**
   * 绘制锁定图形的标记（锁定后不可编辑）
   *
   * Draws the marker of a locked shape (a locked shape cannot be edited).
   *
   * @param {Shape} shape 图形 / Shape
   * @param {CanvasRenderingContext2D} ctx 画布上下文 / Canvas context
   */
  locked?: (shape: Shape, ctx: CanvasRenderingContext2D) => void;
  /**
   * 绘制被选中图形的选中框
   *
   * Draws the selection frame of a selected shape.
   *
   * @param {Shape} shape 图形 / Shape
   * @param {CanvasRenderingContext2D} ctx 画布上下文 / Canvas context
   */
  selected?: (shape: Shape, ctx: CanvasRenderingContext2D) => void;
  /**
   * 绘制被选中图形的缩放柄
   *
   * Draws the resize handles of a selected shape.
   *
   * @param {Shape} shape 图形 / Shape
   * @param {CanvasRenderingContext2D} ctx 画布上下文 / Canvas context
   */
  resizable?: (shape: Shape, ctx: CanvasRenderingContext2D) => void;
  /**
   * 绘制调试信息（包围盒 / 控制点等）
   *
   * Draws debug information (bounding boxes, control points, ...).
   *
   * @param {Shape} shape 图形 / Shape
   * @param {CanvasRenderingContext2D} ctx 画布上下文 / Canvas context
   */
  debug?: (shape: Shape, ctx: CanvasRenderingContext2D) => void;
}
