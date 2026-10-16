import type { IRect } from "./IRect";
import type { ILine } from "./Line";
import { LineSegment } from "./LineSegment";
import { Vector } from "./Vector";
import { type IVector } from "./IVector";
import { Numbers } from "./Numbers";

const { min, max } = Math;
/**
 * 轴对齐矩形：左上角 (x, y) 与宽高 w / h；宽高为负时表示空矩形
 *
 * An axis-aligned rectangle: the top-left corner (x, y) plus the width w and height h;
 * a negative width or height means an empty rectangle.
 */
export class Rect implements IRect {

  /**
   * 左上角的 x
   *
   * X of the top-left corner.
   */
  x: number = 0
  /**
   * 左上角的 y
   *
   * Y of the top-left corner.
   */
  y: number = 0
  /**
   * 宽度（初始 -1，即空矩形）
   *
   * Width (initially -1, that is an empty rectangle).
   */
  w: number = -1
  /**
   * 高度（初始 -1，即空矩形）
   *
   * Height (initially -1, that is an empty rectangle).
   */
  h: number = -1
  /**
   * 上边界（就是 y）
   *
   * Top edge (that is y).
   *
   * @return {number} 上边界的 y / Y of the top edge
   */
  get top() { return this.y }
  /**
   * 左边界（就是 x）
   *
   * Left edge (that is x).
   *
   * @return {number} 左边界的 x / X of the left edge
   */
  get left() { return this.x }
  /**
   * 右边界（x + w）
   *
   * Right edge (x + w).
   *
   * @return {number} 右边界的 x / X of the right edge
   */
  get right() { return this.x + this.w }
  /**
   * 下边界（y + h）
   *
   * Bottom edge (y + h).
   *
   * @return {number} 下边界的 y / Y of the bottom edge
   */
  get bottom() { return this.y + this.h }
  /**
   * 改上边界：下边界不动，同时改 y 与高
   *
   * Sets the top edge: the bottom edge stays, y and the height both change.
   *
   * @param {number} v 新的上边界 / The new top edge
   */
  set top(v: number) {
    this.h = this.bottom - v;
    this.y = v;
  }
  /**
   * 改左边界：右边界不动，同时改 x 与宽
   *
   * Sets the left edge: the right edge stays, x and the width both change.
   *
   * @param {number} v 新的左边界 / The new left edge
   */
  set left(v: number) {
    this.w = this.right - v;
    this.x = v;
  }
  /**
   * 改右边界：左边界不动，只改宽
   *
   * Sets the right edge: the left edge stays, only the width changes.
   *
   * @param {number} v 新的右边界 / The new right edge
   */
  set right(v: number) {
    this.w = v - this.x
  }
  /**
   * 改下边界：上边界不动，只改高
   *
   * Sets the bottom edge: the top edge stays, only the height changes.
   *
   * @param {number} v 新的下边界 / The new bottom edge
   */
  set bottom(v: number) {
    this.h = v - this.y
  }
  /**
   * 获取顶点
   *
   * Vertices in the order top-left, top-right, bottom-right, bottom-left
   *
   * @readonly
   * @type {[IVector, IVector, IVector, IVector]}
   */
  get dots(): [IVector, IVector, IVector, IVector] {
    return [
      { x: this.x, y: this.y },
      { x: this.right, y: this.y },
      { x: this.right, y: this.bottom },
      { x: this.x, y: this.bottom },
    ]
  }
  /**
   * 按左上角与宽高建矩形
   *
   * Builds a rectangle from its top-left corner and its size.
   *
   * @param {number} x 左上角的 x / X of the top-left corner
   * @param {number} y 左上角的 y / Y of the top-left corner
   * @param {number} w 宽度 / Width
   * @param {number} h 高度 / Height
   * @default 0
   */
  constructor(x: number = 0, y: number = 0, w: number = 0, h: number = 0) {
    this.set(x, y, w, h)
  }
  /**
   * 导出一份普通对象（脱离 Rect 实例）
   *
   * Exports a plain object (detached from the Rect instance).
   *
   * @return {IRect} 普通对象形式的矩形 / The rectangle as a plain object
   */
  pure(): IRect {
    return {
      x: this.x,
      y: this.y,
      w: this.w,
      h: this.h,
    }
  }
  /**
   * 直接改四个字段（会保留负的宽高，不规范化）
   *
   * Overwrites the four fields directly (negative sizes are kept, not normalized).
   *
   * @param {number} x 左上角的 x / X of the top-left corner
   * @param {number} y 左上角的 y / Y of the top-left corner
   * @param {number} w 宽度 / Width
   * @param {number} h 高度 / Height
   */
  set(x: number, y: number, w: number, h: number) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
  }
  /**
   * 读入另一个矩形的四个字段，覆盖自身的
   *
   * Reads the four fields of another rectangle and overwrites this one's.
   *
   * @param {IRect} o 源矩形 / Source rectangle
   */
  read(o: IRect) {
    this.x = o.x
    this.y = o.y
    this.w = o.w
    this.h = o.h
  }
  /**
   * 判断一个点是否落在本矩形内（含边界）
   *
   * Whether a point lies inside this rectangle (borders included).
   *
   * @param {IVector} b 待判断的点 / The point to test
   * @return {boolean} 命中时返回 true / True when it hits
   */
  hit(b: IVector): boolean {
    return Rect.hit(this, b)
  }
  /**
   * 调试用的文字描述
   *
   * Text description for debugging.
   *
   * @return {string} 形如 Rect(x=.., y=.., w=.., h=..) 的字符串 / A string like Rect(x=.., y=.., w=.., h=..)
   */
  toString() {
    return `Rect(x=${this.x}, y=${this.x}, w=${this.w}, h=${this.h})`
  }
  /**
   * 移动矩形（只改位置，不动宽高）
   *
   * Moves the rectangle (only the position changes, the size stays).
   *
   * @param {number} x 新的左上角 x / The new top-left x
   * @param {number} y 新的左上角 y / The new top-left y
   * @return {this} 自身，便于链式调用 / This instance, for chaining
   */
  moveTo(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }
  /**
   * 矩形中心点
   *
   * Centre point of the rectangle.
   *
   * @return {IVector} 中心点 / The centre point
   */
  mid(): IVector {
    return { x: this.x + this.w / 2, y: this.y + this.h / 2 }
  }
  /**
   * 宽或高至少有一个不为负时视为有效
   *
   * Considered valid when the width or the height is not negative.
   *
   * @return {boolean} 宽或高不为负时返回 true / True when the width or the height is not negative
   */
  vaild(): boolean {
    return this.w >= 0 || this.h >= 0
  }
  /**
   * 已是 Rect 就原样返回，否则按数据新建一个
   *
   * Returns the rectangle as is when it already is a Rect, otherwise builds one from the
   * data.
   *
   * @param {IRect} rect 矩形数据 / Rectangle data
   * @return {Rect} Rect 实例 / The Rect instance
   */
  static ensure(rect: IRect): Rect {
    return rect instanceof Rect ? rect : Rect.create(rect)
  }
  /**
   * 按矩形数据新建一个 Rect 实例
   *
   * Creates a new Rect instance from rectangle data.
   *
   * @param {IRect} rect 矩形数据 / Rectangle data
   * @return {Rect} 新的 Rect 实例 / The new Rect instance
   */
  static create(rect: IRect) {
    return new Rect(rect.x, rect.y, rect.w, rect.h)
  }
  /**
   * 直接拼一个普通对象作为矩形
   *
   * Builds a plain object as a rectangle.
   *
   * @param {number} x 左上角的 x / X of the top-left corner
   * @param {number} y 左上角的 y / Y of the top-left corner
   * @param {number} w 宽度 / Width
   * @param {number} h 高度 / Height
   * @return {IRect} 普通对象形式的矩形 / The rectangle as a plain object
   */
  static pure(x: number, y: number, w: number, h: number): IRect {
    return { x, y, w, h };
  }
  /**
   * 复制一份普通对象形式的矩形
   *
   * Copies a rectangle into a plain object.
   *
   * @param {IRect} r 源矩形 / Source rectangle
   * @return {IRect} 新的普通对象 / The new plain object
   */
  static pure2(r: IRect): IRect {
    return { x: r.x, y: r.y, w: r.w, h: r.h };
  }
  /**
   * 求两个矩形的外包矩形
   *
   * Bounding rectangle of two rectangles.
   *
   * @param {IRect} r1 矩形一 / First rectangle
   * @param {IRect} r2 矩形二 / Second rectangle
   * @return {IRect} 能同时装下两个矩形的矩形 / A rectangle covering both of them
   */
  static bounds(r1: IRect, r2: IRect): IRect {
    const x = min(r1.x, r2.x)
    const y = min(r1.y, r2.y)
    return {
      x, y,
      w: max(r1.x + r1.w, r2.x + r2.w) - x,
      h: max(r1.y + r1.h, r2.y + r2.h) - y
    }
  }
  /**
   * 判断矩形 a 与矩形或点 b 是否相交（点按零宽高的矩形算，挨着边界也算相交）
   *
   * Whether rectangle a overlaps the rectangle or point b (a point counts as a zero-sized
   * rectangle, touching borders count as overlapping).
   *
   * @param {IRect} a 矩形 / The rectangle
   * @param {IRect | IVector} b 矩形或点 / The rectangle or the point
   * @return {boolean} 相交（命中）时返回 true / True when they overlap (hit)
   */
  static hit(a: IRect, b: IRect | IVector): boolean {
    let w = 0
    let h = 0
    if ('w' in b && 'h' in b) {
      w = b.w
      h = b.h
    }
    return (
      a.x + a.w >= b.x &&
      b.x + w >= a.x &&
      a.y + a.h >= b.y &&
      b.y + h >= a.y
    )
  }
  /**
   * 求两个矩形的重叠区域（不相交时得到的矩形宽高为负）
   *
   * Overlap of two rectangles (the resulting rectangle has negative sizes when they do
   * not intersect).
   *
   * @param {IRect} a 矩形一 / First rectangle
   * @param {IRect} b 矩形二 / Second rectangle
   * @return {IRect} 重叠区域 / The overlapping area
   */
  static intersect(a: IRect, b: IRect): IRect {
    const x = max(a.x, b.x)
    const y = max(a.y, b.y)
    const right = min(a.x + a.w, b.x + b.w)
    const bottom = min(a.y + a.h, b.y + b.h)
    return {
      x, y,
      w: right - x,
      h: bottom - y
    }
  }
  /**
   * 获取矩形与线段的交点
   * (与边共线视为不相交)
   *
   * Collinear with an edge counts as no intersection
   *
   * @static
   * @param {IRect} rect 
   * @param {ILine} line 线段
   * @return {IVector[]} 当不相交时，返回空数组，否则返回非空Vector数组
   * @memberof Rect
   */
  static line_segment_intersection(rect: IRect, line: ILine): IVector[] {
    const sides: ILine[] = [
      { x0: rect.x, y0: rect.y, x1: rect.x + rect.w, y1: rect.y },
      { x0: rect.x, y0: rect.y, x1: rect.x, y1: rect.y + rect.h },
      { x0: rect.x, y0: rect.y + rect.h, x1: rect.x + rect.w, y1: rect.y + rect.h },
      { x0: rect.x + rect.w, y0: rect.y, x1: rect.x + rect.w, y1: rect.y + rect.h }
    ];
    const ret: IVector[] = [];
    for (const side of sides) {
      const vector = LineSegment.intersection2(side, line)
      if (vector) ret.push(vector)
    }
    if (ret.length <= 1) return ret;
    const s = LineSegment.start(line)
    ret.sort((a, b) => Vector.distance(a, s) - Vector.distance(b, s))
    return ret;
  }

  /**
   * 逐字段比较两个矩形是否相同（数值按 Numbers.equals 判等）
   *
   * Whether two rectangles are the same, field by field (numbers compared with
   * Numbers.equals).
   *
   * @param {IRect} a 矩形一 / First rectangle
   * @param {IRect} b 矩形二 / Second rectangle
   * @return {boolean} 四个字段都相等时返回 true / True when all four fields are equal
   */
  static equal = (a: IRect, b: IRect) => (
    Numbers.equals(a.x, b.x) &&
    Numbers.equals(a.y, b.y) &&
    Numbers.equals(a.w, b.w) &&
    Numbers.equals(a.h, b.h)
  )
}