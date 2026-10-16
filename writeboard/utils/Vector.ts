import { IVector } from "./IVector";
import { Numbers } from "./Numbers";

const { pow, abs, sin, cos, sqrt, PI } = Math;
/**
 * 可复用的二维向量：兼作点使用，链式方法直接改自身并返回 this
 *
 * A reusable two-dimensional vector: it also serves as a point, and its chained methods
 * mutate the instance and return this.
 */
export class Vector implements IVector {
  /**
   * x 分量
   *
   * The x component.
   */
  x = 0
  /**
   * y 分量
   *
   * The y component.
   */
  y = 0
  /**
   * 按两个分量建一个向量
   *
   * Builds a vector from its two components.
   *
   * @param {number} x x 分量 / The x component
   * @param {number} y y 分量 / The y component
   */
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  /**
   * 加上另一个向量（就地把第二个向量按分量加到自己身上）
   *
   * Adds another vector to this one in place, component by component.
   *
   * @param {IVector} o 另一个向量 / The other vector
   * @return {this} 自身，便于链式调用 / This instance, for chaining
   */
  plus(o: IVector): this { return this.add(o.x, o.y); }
  /**
   * 减去另一个向量（就地把第二个向量的相反数加到自己身上）
   *
   * Subtracts another vector from this one in place.
   *
   * @param {IVector} o 另一个向量 / The other vector
   * @return {this} 自身，便于链式调用 / This instance, for chaining
   */
  minus(o: IVector): this { return this.add(-o.x, -o.y); }
  /**
   * 直接设定两个分量
   *
   * Overwrites both components.
   *
   * @param {number} x x 分量 / The x component
   * @param {number} y y 分量 / The y component
   * @return {this} 自身，便于链式调用 / This instance, for chaining
   */
  set(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }
  /**
   * 按分量加上一个位移
   *
   * Adds a displacement, component by component.
   *
   * @param {number} x x 方向的位移 / Displacement along x
   * @param {number} y y 方向的位移 / Displacement along y
   * @return {this} 自身，便于链式调用 / This instance, for chaining
   */
  add(x: number, y: number): this {
    this.x += x;
    this.y += y;
    return this;
  }
  /**
   * 读入另一个向量的两个分量，覆盖自身的
   *
   * Reads the two components of another vector and overwrites this one's.
   *
   * @param {IVector} a 源向量 / Source vector
   * @return {this} 自身，便于链式调用 / This instance, for chaining
   */
  read(a: IVector): this {
    this.x = a.x;
    this.y = a.y;
    return this;
  }
  /**
   * 调试用的文字描述
   *
   * Text description for debugging.
   *
   * @return {string} 形如 Vector(x=.., y=..) 的字符串 / A string like Vector(x=.., y=..)
   */
  toString(): string {
    return `Vector(x=${this.x}, y=${this.y})`
  }
  /**
   * 就地把自身绕另一个点旋转
   *
   * Rotates this vector around another point in place.
   *
   * @param {number} radians 旋转弧度 / Rotation in radians
   * @param {IVector} b 旋转中心 / The centre of the rotation
   * @return {this} 自身，便于链式调用 / This instance, for chaining
   */
  rotate(radians: number, b: IVector): this {
    const { x, y } = Vector.rotated2(this.x, this.y, b.x, b.y, radians)
    return this.set(x, y);
  }
  /**
   * 返回绕另一个点旋转后的新向量（不改自身）
   *
   * Returns a new vector rotated around another point (this one stays unchanged).
   *
   * @param {number} radians 旋转弧度 / Rotation in radians
   * @param {IVector} b 旋转中心 / The centre of the rotation
   * @return {Vector} 旋转后的新向量 / The rotated vector
   */
  rotated(radians: number, b: IVector): Vector {
    const { x, y } = Vector.rotated2(this.x, this.y, b.x, b.y, radians)
    return new Vector(x, y);
  }

  /**
   * 两向量相加，返回全新的普通对象
   *
   * Adds two vectors and returns a brand new plain object.
   *
   * @param {IVector} a 向量一 / First vector
   * @param {IVector} b 向量二 / Second vector
   * @return {IVector} 和向量 / The sum
   */
  static plus(a: IVector, b: IVector): IVector { return { x: a.x + b.x, y: a.y + b.y } }
  /**
   * 两向量相减，返回全新的普通对象
   *
   * Subtracts two vectors and returns a brand new plain object.
   *
   * @param {IVector} a 被减向量 / The vector to subtract from
   * @param {IVector} b 减去的向量 / The vector to subtract
   * @return {IVector} 差向量 / The difference
   */
  static minus(a: IVector, b: IVector): IVector { return { x: a.x - b.x, y: a.y - b.y } }
  /**
   * 已是 Vector 就原样返回，否则按数据新建一个
   *
   * Returns the vector as is when it already is a Vector, otherwise builds one from the
   * data.
   *
   * @param {IVector} rect 向量数据 / Vector data
   * @return {Vector} Vector 实例 / The Vector instance
   */
  static ensure(rect: IVector): Vector {
    return rect instanceof Vector ? rect : Vector.create(rect)
  }
  /**
   * 按向量数据新建一个 Vector 实例
   *
   * Creates a new Vector instance from vector data.
   *
   * @param {IVector} a 向量数据 / Vector data
   * @return {Vector} 新的 Vector 实例 / The new Vector instance
   */
  static create(a: IVector): Vector {
    return new Vector(a.x, a.y);
  }
  /**
   * 两点之间的插值：factor 为 0 时是 v0、为 1 时是 v1、为 0.5 时是中点
   *
   * Interpolates between two points: factor 0 yields v0, 1 yields v1 and 0.5 the middle.
   *
   * @param {IVector} v0 起点 / The start point
   * @param {IVector} v1 终点 / The end point
   * @param {number} factor 插值比例 / The interpolation factor
   * @return {IVector} 插值结果 / The interpolated point
   * @default 0.5
   */
  static mid(v0: IVector, v1: IVector, factor: number = 0.5): IVector {
    return {
      x: v0.x + (v1.x - v0.x) * factor,
      y: v0.y + (v1.y - v0.y) * factor,
    }
  }
  /**
   * 直接拼一个普通对象作为向量
   *
   * Builds a plain object as a vector.
   *
   * @param {number} x x 分量 / The x component
   * @param {number} y y 分量 / The y component
   * @return {IVector} 普通对象形式的向量 / The vector as a plain object
   */
  static pure(x: number, y: number): IVector {
    return { x, y }
  }
  /**
   * 两点间的欧氏距离
   *
   * Euclidean distance between two points.
   *
   * @param {IVector} a 点一 / First point
   * @param {IVector} b 点二 / Second point
   * @return {number} 距离 / The distance
   */
  static distance(a: IVector, b: IVector): number {
    return sqrt(
      pow(a.x - b.x, 2) +
      pow(a.y - b.y, 2)
    )
  }
  /**
   * 两点间的曼哈顿距离（两轴差之和）
   *
   * Manhattan distance between two points (the sum of both axis differences).
   *
   * @param {IVector} a 点一 / First point
   * @param {IVector} b 点二 / Second point
   * @return {number} 曼哈顿距离 / The Manhattan distance
   */
  static manhattan(a: IVector, b: IVector): number {
    return abs(a.x - b.x) + abs(a.y - b.y);
  }
  /**
   * 两向量的点积（本实现取的是绝对值）
   *
   * Dot product of two vectors (this implementation takes the absolute value).
   *
   * @param {IVector} a 向量一 / First vector
   * @param {IVector} b 向量二 / Second vector
   * @return {number} 点积的绝对值 / The absolute value of the dot product
   */
  static dot(a: IVector, b: IVector) {
    return abs(a.x * b.x + a.y * b.y);
  }
  /**
   * 按倍数缩放一个向量，返回全新的普通对象
   *
   * Scales a vector and returns a brand new plain object.
   *
   * @param {IVector} a 源向量 / Source vector
   * @param {number} n 缩放倍数 / The scale factor
   * @return {IVector} 缩放结果 / The scaled vector
   */
  static multiply(a: IVector, n: number): IVector {
    return { x: a.x * n, y: a.y * n }
  }
  /**
   * 把一个向量绕另一个点旋转，返回全新的普通对象
   *
   * Rotates a vector around another point and returns a brand new plain object.
   *
   * @param {IVector} a 待旋转的向量 / The vector to rotate
   * @param {IVector} b 旋转中心 / The centre of the rotation
   * @param {number} radians 旋转弧度 / Rotation in radians
   * @return {IVector} 旋转结果 / The rotated vector
   */
  static rotated(a: IVector, b: IVector, radians: number): IVector {
    return this.rotated2(a.x, a.y, b.x, b.y, radians);
  }
  /**
   * 按分量把一个点绕另一个点旋转：弧度无效或为整圈时原样返回
   *
   * Rotates a point around another one, component by component: a missing rotation or a
   * whole number of turns returns the point unchanged.
   *
   * @param {number} ax 待旋转点的 x / X of the point to rotate
   * @param {number} ay 待旋转点的 y / Y of the point to rotate
   * @param {number} bx 旋转中心的 x / X of the centre
   * @param {number} by 旋转中心的 y / Y of the centre
   * @param {number} radians 旋转弧度 / Rotation in radians
   * @return {IVector} 旋转结果 / The rotated point
   */
  static rotated2(ax: number, ay: number, bx: number, by: number, radians: number): IVector {
    if (!radians || Numbers.equals(radians % (PI * 2), 0))
      return { x: ax, y: ay }
    const dx = ax - bx;
    const dy = ay - by;
    const c = cos(radians);
    const s = sin(radians);
    return {
      x: dx * c - dy * s + bx,
      y: dx * s + dy * c + by,
    };
  }
  /**
   * 两个坐标是否近似相等：逐个分量比较，差值不超过 Number.EPSILON 即算相等
   *
   * Whether two coordinates are about equal: each component is compared and a difference
   * within Number.EPSILON counts as equal.
   *
   * @param {number} x 点一的 x / X of the first point
   * @param {number} y 点一的 y / Y of the first point
   * @param {number} x1 点二的 x / X of the second point
   * @param {number} y1 点二的 y / Y of the second point
   * @return {any} 两分量都近似相等时返回 true（返回类型声明为 any） / True when both components are about equal (declared as any)
   */
  static equal2(x: number, y: number, x1: number, y1: number): any {
    return abs(x - x1) <= Number.EPSILON && abs(y - y1) <= Number.EPSILON
  }
}
// const test_vector_rotated = () => {
//   const a: IVector = { x: 1, y: 1 };
//   const b: IVector = { x: 2, y: 2 };
//   return [
//     Vector.create(Vector.rotated(a, b, 0 * Math.PI / 2)),
//     Vector.create(Vector.rotated(a, b, 1 * Math.PI / 2)),
//     Vector.create(Vector.rotated(a, b, 2 * Math.PI / 2)),
//     Vector.create(Vector.rotated(a, b, 3 * Math.PI / 2)),
//   ].join('\n')
// }
// alert('' + test_vector_rotated())