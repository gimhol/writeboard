import { IRect } from "./IRect"
import { Vector } from "./Vector"
/**
 * 矩形的生成方式：从角起画还是从心起画
 *
 * How a rectangle is generated: from a corner or from the centre.
 */
export enum GenMode {
  /**
   * 按下点为矩形的一个角，往对角拖
   *
   * The press point is a corner of the rectangle, dragging towards the opposite corner.
   */
  FromCorner = 0,
  /**
   * 按下点为矩形中心，往四周拖
   *
   * The press point is the centre of the rectangle, dragging outwards.
   */
  FromCenter = 1
}
/**
 * 图形的锁定方式：非等比还是等比（正方形 / 正圆）
 *
 * How a shape is locked: free ratio or equal ratio (square / circle).
 */
export enum LockMode {
  /**
   * 不锁定，宽高各自自由变化
   *
   * Not locked, the width and the height change freely.
   */
  Default = 0,
  /**
   * 锁成正方形（宽高取相同值）
   *
   * Locked to a square (the width and the height use the same value).
   */
  Square = 1,
  /**
   * 锁成正圆
   *
   * Locked to a circle.
   */
  Circle = 2
}
/**
 * 矩形生成的选项：起始方式 + 锁定方式
 *
 * Options of the rectangle generation: how to start and how to lock.
 */
export type GenOptions = {
  /**
   * 从角起画还是从心起画
   *
   * Whether to start from a corner or from the centre.
   */
  genMode: GenMode
  /**
   * 是否锁成正方形 / 正圆
   *
   * Whether to lock to a square / circle.
   */
  lockMode: LockMode
}
/**
 * 矩形生成器：记下按下点与当前点，随时算出两者围成的轴对齐矩形
 *
 * Rectangle generator: it remembers the press point and the current point and yields the
 * axis-aligned rectangle they enclose at any time.
 */
export class RectHelper {
  private _from = Vector.pure(NaN, NaN);
  private _to = Vector.pure(NaN, NaN);
  /**
   * 起点 / 终点是否为空（未 start 过，或已 clear）
   *
   * Whether the start / end point is empty (never started, or already cleared).
   *
   * @return {boolean} 起点或终点为空时返回 true / True when the start or the end point is empty
   */
  get ok() { return isNaN(this._from.x) || isNaN(this._to.x) }
  /**
   * 起点（clear 后为 NaN / NaN）
   *
   * The start point (NaN / NaN after clear).
   *
   * @return {IVector} 起点对象（内部直接引用，不要直接改） / The start point object (a direct reference, do not mutate it)
   */
  get from() { return this._from; }
  /**
   * 终点（clear 后为 NaN / NaN）
   *
   * The end point (NaN / NaN after clear).
   *
   * @return {IVector} 终点对象（内部直接引用，不要直接改） / The end point object (a direct reference, do not mutate it)
   */
  get to() { return this._to; }
  /**
   * 开始：记下起点，并让终点也落在起点（此时围成的矩形是零尺寸）
   *
   * Starts: remembers the start point and puts the end point on it as well (the enclosed
   * rectangle is zero-sized at that moment).
   *
   * @param {number} x 起点的 x / X of the start point
   * @param {number} y 起点的 y / Y of the start point
   */
  start(x: number, y: number) {
    this._from.x = x
    this._from.y = y
    this._to.x = x
    this._to.y = y
  }
  /**
   * 拖拽中更新终点（起点不动）
   *
   * Updates the end point while dragging (the start point stays).
   *
   * @param {number} x 终点的 x / X of the end point
   * @param {number} y 终点的 y / Y of the end point
   */
  end(x: number, y: number) {
    this._to.x = x
    this._to.y = y
  }
  /**
   * 清空起终点（都重置为 NaN / NaN）
   *
   * Clears the start and the end point (both reset to NaN / NaN).
   */
  clear() {
    this._from = Vector.pure(NaN, NaN)
    this._to = Vector.pure(NaN, NaN)
  }
  /**
   * 算出当前起终点围成的轴对齐矩形：宽高按 min / max 规范化，向左上拖也能得到正的宽高
   *
   * Yields the axis-aligned rectangle enclosed by the current start and end point: the
   * size is normalized with min / max, so dragging to the top-left still gives positive
   * values.
   *
   * @return {IRect} 普通对象形式的矩形 / The rectangle as a plain object
   */
  gen(): IRect {
    const { x: x0, y: y0 } = this._from
    const { x: x1, y: y1 } = this._to
    const x = Math.min(x0, x1)
    const y = Math.min(y0, y1)
    return {
      x, y,
      w: Math.max(x0, x1) - x,
      h: Math.max(y0, y1) - y
    }
  }
}
