import type { IVector } from "./IVector";

const { EPSILON: EPS } = Number;
const { abs } = Math;
/**
 * 直线：由起点 (x0, y0) 与终点 (x1, y1) 确定，两端可无限延长
 *
 * A line: defined by its start point (x0, y0) and end point (x1, y1), both ends extend
 * to infinity.
 */
export interface ILine { x0: number, y0: number, x1: number, y1: number }
/**
 * 可复用的直线对象：存放起点与终点，并提供求交点等静态工具
 *
 * A reusable line object: it holds the start and the end point and offers static helpers
 * such as the intersection.
 */
export class Line implements ILine {
  /**
   * 起点的 x
   *
   * X of the start point.
   */
  x0: number
  /**
   * 起点的 y
   *
   * Y of the start point.
   */
  y0: number
  /**
   * 终点的 x
   *
   * X of the end point.
   */
  x1: number
  /**
   * 终点的 y
   *
   * Y of the end point.
   */
  y1: number
  /**
   * 按两个端点建一条直线
   *
   * Builds a line from its two end points.
   *
   * @param {number} x0 起点的 x / X of the start point
   * @param {number} y0 起点的 y / Y of the start point
   * @param {number} x1 终点的 x / X of the end point
   * @param {number} y1 终点的 y / Y of the end point
   * @default 0
   */
  constructor(x0: number = 0, y0: number = 0, x1: number = 0, y1: number = 0) {
    this.x0 = x0
    this.y0 = y0
    this.x1 = x1
    this.y1 = y1
  }
  /**
   * 导出一份普通对象（脱离 Line 实例，便于存储 / 序列化）
   *
   * Exports a plain object (detached from the Line instance, handy for storage /
   * serialization).
   *
   * @return {ILine} 只含四个端点的普通对象 / A plain object holding the four coordinates
   */
  pure(): ILine {
    return {
      x0: this.x0,
      y0: this.y0,
      x1: this.x1,
      y1: this.y1,
    }
  }
  /**
   * 读入另一条直线的两个端点，覆盖自身的
   *
   * Reads the two end points of another line and overwrites this one's.
   *
   * @param {ILine} o 源直线 / Source line
   */
  set(o: ILine) {
    this.x0 = o.x0
    this.y0 = o.y0
    this.x1 = o.x1
    this.y1 = o.y1
  }
  /**
   * 调试用的文字描述
   *
   * Text description for debugging.
   *
   * @return {string} 形如 Line(x0=.., y0=.., x1=.., y1=..) 的字符串 / A string like Line(x0=.., y0=.., x1=.., y1=..)
   */
  toString() {
    return `Line(x0=${this.x0}, y0=${this.x0}, x1=${this.x1}, y1=${this.y1})`
  }
  /**
   * 线段中点
   *
   * Middle point of the line.
   *
   * @return {IVector} 中点 / The middle point
   */
  mid(): IVector { return Line.mid(this) }
  /**
   * 起点
   *
   * The start point.
   *
   * @return {IVector} 起点 / The start point
   */
  start(): IVector { return Line.start(this) }
  /**
   * 终点
   *
   * The end point.
   *
   * @return {IVector} 终点 / The end point
   */
  end(): IVector { return Line.end(this) }
  /**
   * 求一条直线的中点
   *
   * Middle point of a line.
   *
   * @param {ILine} l 直线 / The line
   * @return {IVector} 中点 / The middle point
   */
  static mid(l: ILine): IVector {
    return {
      x: l.x1 + (l.x1 - l.x0) / 2,
      y: l.y1 + (l.y1 - l.y0) / 2
    }
  }
  /**
   * 取直线的起点
   *
   * Start point of a line.
   *
   * @param {ILine} l 直线 / The line
   * @return {IVector} 起点 / The start point
   */
  static start(l: ILine): IVector {
    return { x: l.x0, y: l.y0 }
  }
  /**
   * 取直线的终点
   *
   * End point of a line.
   *
   * @param {ILine} l 直线 / The line
   * @return {IVector} 终点 / The end point
   */
  static end(l: ILine): IVector {
    return { x: l.x1, y: l.y1 }
  }
  /**
   * 直接拼一个普通对象作为直线
   *
   * Builds a plain object as a line.
   *
   * @param {number} x0 起点的 x / X of the start point
   * @param {number} y0 起点的 y / Y of the start point
   * @param {number} x1 终点的 x / X of the end point
   * @param {number} y1 终点的 y / Y of the end point
   * @return {ILine} 普通对象形式的直线 / The line as a plain object
   */
  static pure(x0: number, y0: number, x1: number, y1: number): ILine {
    return { x0, y0, x1, y1 };
  }
  /**
   * 按一份直线数据新建一个 Line 实例
   *
   * Creates a new Line instance from line data.
   *
   * @param {ILine} line 直线数据 / Line data
   * @return {Line} 新的 Line 实例 / The new Line instance
   */
  static create(line: ILine) {
    return new Line(line.x0, line.y0, line.x1, line.y1)
  }
  /**
   * 求两条“无限长直线”的交点（线段请用 LineSegment.intersection）
   *
   * Intersection of two infinite lines (use LineSegment.intersection for segments).
   *
   * @param {number} a_x0 直线 A 起点的 x / X of line A's start point
   * @param {number} a_y0 直线 A 起点的 y / Y of line A's start point
   * @param {number} a_x1 直线 A 终点的 x / X of line A's end point
   * @param {number} a_y1 直线 A 终点的 y / Y of line A's end point
   * @param {number} b_x0 直线 B 起点的 x / X of line B's start point
   * @param {number} b_y0 直线 B 起点的 y / Y of line B's start point
   * @param {number} b_x1 直线 B 终点的 x / X of line B's end point
   * @param {number} b_y1 直线 B 终点的 y / Y of line B's end point
   * @return {IVector | 'collinear' | null} 交点；两线重合时为 'collinear'，平行为 null / The intersection, 'collinear' when both lines overlap, null when they are parallel
   */
  static intersection(a_x0: number, a_y0: number, a_x1: number, a_y1: number, b_x0: number, b_y0: number, b_x1: number, b_y1: number): IVector | 'collinear' | null {
    const a1 = a_y1 - a_y0;
    const b1 = a_x0 - a_x1;
    const c1 = (a_x1 - a_x0) * a_y0 - (a_y1 - a_y0) * a_x0;

    const a2 = b_y1 - b_y0;
    const b2 = b_x0 - b_x1;
    const c2 = (b_x1 - b_x0) * b_y0 - (b_y1 - b_y0) * b_x0;

    const denominator = a1 * b2 - a2 * b1;

    // 情况1：分母为0 → 两直线平行或重合
    if (abs(denominator) < EPS) {
      // 检查是否重合（C1*A2 是否等于 C2*A1，或 C1*B2 是否等于 C2*B1，避免A2/B2为0的情况）
      return (
        abs(c1 * a2 - c2 * a1) < EPS ||
        abs(c1 * b2 - c2 * b1) < EPS
      ) ? 'collinear' : null;
    }

    // 情况2：存在唯一交点
    const x = (b1 * c2 - b2 * c1) / denominator;
    const y = (a2 * c1 - a1 * c2) / denominator;

    return { x, y };
  }
  /**
   * 求两个直线对象的交点
   *
   * Intersection of two line objects.
   *
   * @param {ILine} l0 直线 A / Line A
   * @param {ILine} l1 直线 B / Line B
   * @return {IVector | 'collinear' | null} 交点；两线重合时为 'collinear'，平行为 null / The intersection, 'collinear' when both lines overlap, null when they are parallel
   */
  static intersection2(l0: ILine, l1: ILine): IVector | 'collinear' | null {
    return this.intersection(l0.x0, l0.y0, l0.x1, l0.y1, l1.x0, l1.y0, l1.x1, l1.y1)
  }
}

