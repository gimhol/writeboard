import type { IRotatedRect } from "./IRotatedRect";
import { Rect } from "./Rect";
import { Vector } from "./Vector";
import { type IVector } from "./IVector";

/**
 * 可带旋转的矩形：左上角 (x, y) 与宽高 w / h 加一个绕矩形中心的旋转弧度 r
 *
 * A rectangle that may be rotated: the top-left corner (x, y), the width w / height h and
 * a rotation r in radians around the centre of the rectangle.
 */
export class RotatedRect implements IRotatedRect {
  /**
   * 未旋转时左上角的 x
   *
   * X of the top-left corner before the rotation.
   */
  x: number
  /**
   * 未旋转时左上角的 y
   *
   * Y of the top-left corner before the rotation.
   */
  y: number
  /**
   * 宽度
   *
   * Width.
   */
  w: number
  /**
   * 高度
   *
   * Height.
   */
  h: number
  private _r: number = 0;
  private _cr: number = 0;
  private _sr: number = 0;
  private _axisX: IVector = { x: 0, y: 0 };
  private _axisY: IVector = { x: 0, y: 0 };
  /**
   * 旋转后的横轴单位向量 (cos r, sin r)
   *
   * Unit vector of the rotated x axis (cos r, sin r).
   *
   * @return {IVector} 横轴单位向量 / The x axis unit vector
   */
  get axisX() { return this._axisX }
  /**
   * 旋转后的纵轴单位向量 (-sin r, cos r)
   *
   * Unit vector of the rotated y axis (-sin r, cos r).
   *
   * @return {IVector} 纵轴单位向量 / The y axis unit vector
   */
  get axisY() { return this._axisY }
  /**
   * 改上边界（未旋转时的上边）：下边界不动，同时改 y 与高
   *
   * Sets the top edge (of the unrotated rectangle): the bottom edge stays, y and the
   * height both change.
   *
   * @param {number} v 新的上边界 / The new top edge
   */
  set top(v: number) {
    this.h = this.bottom - v;
    this.y = v;
  }
  /**
   * 改左边界（未旋转时的左边）：右边界不动，同时改 x 与宽
   *
   * Sets the left edge (of the unrotated rectangle): the right edge stays, x and the
   * width both change.
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
   * 右边界（未旋转时的 x + w）
   *
   * Right edge of the unrotated rectangle (x + w).
   *
   * @return {number} 右边界的 x / X of the right edge
   */
  get right(): number {
    return this.x + this.w
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
   * 下边界（未旋转时的 y + h）
   *
   * Bottom edge of the unrotated rectangle (y + h).
   *
   * @return {number} 下边界的 y / Y of the bottom edge
   */
  get bottom(): number {
    return this.y + this.h
  }
  /**
   * 四个顶点：按左上、右上、右下、左下的顺序（已按当前弧度绕矩形中心旋转）
   *
   * The four vertices, in the order top-left, top-right, bottom-right, bottom-left, already
   * rotated around the centre of the rectangle.
   *
   * @return {[IVector, IVector, IVector, IVector]} 四个顶点 / The four vertices
   */
  get dots(): [IVector, IVector, IVector, IVector] {
    return RotatedRect.dots_cs(this.x, this.y, this.w, this.h, this._cr, this._sr);
  }
  /**
   * 旋转弧度
   *
   * The rotation in radians.
   *
   * @return {number} 旋转弧度 / The rotation in radians
   */
  get r() { return this._r }
  /**
   * 设旋转弧度，顺带缓存 cos / sin 与两条轴，免得每次计算
   *
   * Sets the rotation and caches its cos / sin and both axes so they do not have to be
   * recomputed every time.
   *
   * @param {number} r 旋转弧度 / The rotation in radians
   */
  set r(r: number) {
    this._r = r
    this._cr = Math.cos(r)
    this._sr = Math.sin(r)
    this._axisX = { x: this._cr, y: this._sr }
    this._axisY = { x: -this._sr, y: this._cr }
  }
  /**
   * 矩形中心的 x
   *
   * X of the centre of the rectangle.
   *
   * @return {number} 中心的 x / X of the centre
   */
  get middleX() { return this.x + this.w / 2 }
  /**
   * 矩形中心的 y
   *
   * Y of the centre of the rectangle.
   *
   * @return {number} 中心的 y / Y of the centre
   */
  get middleY() { return this.y + this.h / 2 }
  /**
   * 按中心对齐：只改 x，让矩形中心的 x 落在给定值上
   *
   * Aligns by the centre: only x changes, so that the centre of the rectangle sits on the
   * given value.
   *
   * @param {number} v 矩形中心的新 x / The new x of the centre
   */
  set middleX(v: number) { this.x = v - this.w / 2 }
  /**
   * 按中心对齐：只改 y，让矩形中心的 y 落在给定值上
   *
   * Aligns by the centre: only y changes, so that the centre of the rectangle sits on the
   * given value.
   *
   * @param {number} v 矩形中心的新 y / The new y of the centre
   */
  set middleY(v: number) { this.y = v - this.h / 2 }

  /**
   * 按左上角、宽高与旋转弧度建一个旋转矩形
   *
   * Builds a rotated rectangle from its top-left corner, its size and its rotation.
   *
   * @param {number} x 左上角的 x / X of the top-left corner
   * @param {number} y 左上角的 y / Y of the top-left corner
   * @param {number} w 宽度 / Width
   * @param {number} h 高度 / Height
   * @param {number} r 旋转弧度 / Rotation in radians
   * @default 0
   */
  constructor(x: number = 0, y: number = 0, w: number = 0, h: number = 0, r: number = 0) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
    this._cr = Math.cos(r)
    this._sr = Math.sin(r)
    this._axisX = { x: this._cr, y: this._sr }
    this._axisY = { x: -this._sr, y: this._cr }
    this._r = r
  }
  /**
   * 读入另一份数据，覆盖自身的（r 缺省按 0 处理）
   *
   * Reads another piece of data and overwrites this one's (a missing r counts as 0).
   *
   * @param {IRotatedRect} o 源数据 / Source data
   * @return {this} 自身，便于链式调用 / This instance, for chaining
   */
  set(o: IRotatedRect): this {
    this.x = o.x
    this.y = o.y
    this.w = o.w
    this.h = o.h
    this.r = o.r || 0
    return this
  }

  /**
   * 判断本矩形与另一个矩形是否相交
   *
   * Whether this rectangle overlaps another one.
   *
   * @param {IRotatedRect} b 另一个矩形 / The other rectangle
   * @return {boolean} 相交时返回 true / True when they overlap
   */
  hit(b: IRotatedRect): boolean {
    return RotatedRect.hit(this, b)
  }

  /**
   * 调试用的文字描述
   *
   * Text description for debugging.
   *
   * @return {string} 形如 RotatedRect(x=.., y=.., w=.., h=.., r=..) 的字符串 / A string like RotatedRect(x=.., y=.., w=.., h=.., r=..)
   */
  toString() {
    return `RotatedRect(x=${this.x}, y=${this.x}, w=${this.w}, h=${this.h}, r=${this.r})`
  }

  /**
   * 移动矩形（只改位置，不动宽高与弧度）
   *
   * Moves the rectangle (only the position changes, the size and the rotation stay).
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
   * 矩形中心点（与弧度无关）
   *
   * Centre point of the rectangle (independent of the rotation).
   *
   * @return {IVector} 中心点 / The centre point
   */
  mid(): IVector {
    return { x: this.x + this.w / 2, y: this.y + this.h / 2 }
  }
  /**
   * 已是 RotatedRect 就原样返回，否则按数据新建一个
   *
   * Returns the rectangle as is when it already is a RotatedRect, otherwise builds one from
   * the data.
   *
   * @param {IRotatedRect} rect 矩形数据 / Rectangle data
   * @return {RotatedRect} RotatedRect 实例 / The RotatedRect instance
   */
  static ensure(rect: IRotatedRect): RotatedRect {
    return rect instanceof RotatedRect ? rect : RotatedRect.create(rect)
  }
  /**
   * 按矩形数据新建一个 RotatedRect 实例
   *
   * Creates a new RotatedRect instance from rectangle data.
   *
   * @param {IRotatedRect} rect 矩形数据 / Rectangle data
   * @return {RotatedRect} 新的 RotatedRect 实例 / The new RotatedRect instance
   */
  static create(rect: IRotatedRect) {
    return new RotatedRect(rect.x, rect.y, rect.w, rect.h, rect.r)
  }

  /**
   * 直接拼一个普通对象作为旋转矩形
   *
   * Builds a plain object as a rotated rectangle.
   *
   * @param {number} x 左上角的 x / X of the top-left corner
   * @param {number} y 左上角的 y / Y of the top-left corner
   * @param {number} w 宽度 / Width
   * @param {number} h 高度 / Height
   * @param {number} r 旋转弧度 / Rotation in radians
   * @return {IRotatedRect} 普通对象形式的旋转矩形 / The rotated rectangle as a plain object
   */
  static pure(x: number, y: number, w: number, h: number, r: number): IRotatedRect {
    return { x, y, w, h, r };
  }
  /**
   * 用已算好的 cos / sin 求四个顶点：绕矩形中心旋转，坐标按 4 位有效数字取整
   *
   * Yields the four vertices from an already computed cos / sin: they are rotated around
   * the centre of the rectangle and rounded to 4 significant digits.
   *
   * @param {number} x 左上角的 x / X of the top-left corner
   * @param {number} y 左上角的 y / Y of the top-left corner
   * @param {number} w 宽度 / Width
   * @param {number} h 高度 / Height
   * @param {number} c 旋转弧度的 cos / Cos of the rotation
   * @param {number} s 旋转弧度的 sin / Sin of the rotation
   * @return {[IVector, IVector, IVector, IVector]} 四个顶点 / The four vertices
   */
  static dots_cs(x: number, y: number, w: number, h: number, c: number, s: number): [IVector, IVector, IVector, IVector] {
    const bx = x + w / 2
    const by = y + h / 2
    const right = x + w
    const bottom = y + h
    const dot = (x: number, y: number) => {
      const dx = x - bx;
      const dy = y - by;
      return {
        x: Number((dx * c - dy * s + bx).toPrecision(4)),
        y: Number((dx * s + dy * c + by).toPrecision(4)),
      }
    }
    return [
      dot(x, y),
      dot(right, y),
      dot(right, bottom),
      dot(x, bottom),
    ]
  }
  /**
   * 按旋转弧度求四个顶点（内部先算出 cos / sin 再调 dots_cs）
   *
   * Yields the four vertices for a rotation (it computes cos / sin first and then calls
   * dots_cs).
   *
   * @param {number} x 左上角的 x / X of the top-left corner
   * @param {number} y 左上角的 y / Y of the top-left corner
   * @param {number} w 宽度 / Width
   * @param {number} h 高度 / Height
   * @param {number} r 旋转弧度 / Rotation in radians
   * @return {[IVector, IVector, IVector, IVector]} 四个顶点 / The four vertices
   * @default 0
   */
  static dots(x: number, y: number, w: number, h: number, r: number = 0): [IVector, IVector, IVector, IVector] {
    const c = Math.cos(r)
    const s = Math.sin(r)
    return this.dots_cs(x, y, w, h, c, s)
  }
  /**
   * 按一份矩形数据求四个顶点
   *
   * Yields the four vertices of a piece of rectangle data.
   *
   * @param {IRotatedRect} r 矩形数据 / Rectangle data
   * @return {[IVector, IVector, IVector, IVector]} 四个顶点 / The four vertices
   */
  static dots2(r: IRotatedRect): [IVector, IVector, IVector, IVector] {
    return this.dots(r.x, r.y, r.w, r.h, r.r)
  }
  /**
   * 判断两个旋转矩形是否相交：都不旋转时退化为轴对齐判断，否则逐轴投影比较
   *
   * Whether two rotated rectangles overlap: with no rotation at all it falls back to the
   * axis-aligned test, otherwise every axis is projected and compared.
   *
   * @param {IRotatedRect} a 矩形一 / First rectangle
   * @param {IRotatedRect} b 矩形二 / Second rectangle
   * @return {boolean} 相交时返回 true / True when they overlap
   */
  static hit(a: IRotatedRect, b: IRotatedRect): boolean {
    if (!a.r && !b.r) return Rect.hit(a, b)
    const realA = a instanceof RotatedRect ? a : new RotatedRect(a.x, a.y, a.w, a.h, a.r)
    const realB = b instanceof RotatedRect ? b : new RotatedRect(b.x, b.y, b.w, b.h, b.r)
    const centerDistanceVertor = { x: realA.middleX - realB.middleX, y: realA.middleY - realB.middleY };
    const axes = [realA._axisX, realA._axisY, realB._axisX, realB._axisY];
    for (let i = 0, len = axes.length; i < len; i++) {
      const a = axes[i]
      const p0 = realA.projection(a)
      const p1 = realB.projection(a)
      const p2 = Vector.dot(centerDistanceVertor, a) * 2
      if (p0 + p1 <= p2) {
        return false;
      }
    }
    return true;
  }

  /**
   * 本矩形在给定轴上的投影长度（两条轴上分量的加权和），供分离轴定理使用
   *
   * Projection length of this rectangle on the given axis (the weighted sum of both axis
   * components), used by the separating axis theorem.
   *
   * @param {IVector} axis 投影轴（单位向量） / The axis to project on (a unit vector)
   * @return {number} 投影长度 / The projection length
   */
  projection(axis: IVector): number {
    const px = Vector.dot(this._axisX, axis)
    const py = Vector.dot(this._axisY, axis)
    return px * this.w + py * this.h
  }
}

