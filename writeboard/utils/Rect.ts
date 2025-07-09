import type { IRect } from "./IRect";
import type { ILine } from "./Line";
import { LineSegment } from "./LineSegment";
import { Vector } from "./Vector";
import { type IVector } from "./IVector";

const { min, max } = Math;
export class Rect implements IRect {
  x: number
  y: number
  w: number
  h: number
  get top() { return this.y }
  get left() { return this.x }
  get right() { return this.x + this.w }
  get bottom() { return this.y + this.h }
  set top(v: number) {
    this.h = this.bottom - v;
    this.y = v;
  }
  set left(v: number) {
    this.w = this.right - v;
    this.x = v;
  }
  set right(v: number) {
    this.w = v - this.x
  }
  set bottom(v: number) {
    this.h = v - this.y
  }

  /**
   * 获取顶点
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
  constructor(x: number = 0, y: number = 0, w: number = 0, h: number = 0) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
  }
  pure(): IRect {
    return {
      x: this.x,
      y: this.y,
      w: this.w,
      h: this.h,
    }
  }
  set(o: IRect) {
    this.x = o.x
    this.y = o.y
    this.w = o.w
    this.h = o.h
  }
  hit(b: IRect | IVector): boolean {
    return Rect.hit(this, b)
  }
  toString() {
    return `Rect(x=${this.x}, y=${this.x}, w=${this.w}, h=${this.h})`
  }
  moveTo(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }
  mid(): IVector {
    return { x: this.x + this.w / 2, y: this.y + this.h / 2 }
  }
  vaild(): boolean {
    return this.w >= 0 || this.h >= 0
  }
  static ensure(rect: IRect): Rect {
    return rect instanceof Rect ? rect : Rect.create(rect)
  }
  static create(rect: IRect) {
    return new Rect(rect.x, rect.y, rect.w, rect.h)
  }
  static pure(x: number, y: number, w: number, h: number): IRect {
    return { x, y, w, h };
  }
  static bounds(r1: IRect, r2: IRect): IRect {
    const x = min(r1.x, r2.x)
    const y = min(r1.y, r2.y)
    return {
      x, y,
      w: max(r1.x + r1.w, r2.x + r2.w) - x,
      h: max(r1.y + r1.h, r2.y + r2.h) - y
    }
  }
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


}