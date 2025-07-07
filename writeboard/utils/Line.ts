import { LineSegment } from "./LineSegment";
import type { IVector } from "./Vector";

const { EPSILON: EPS } = Number;
const { abs } = Math;
export interface ILine { x0: number, y0: number, x1: number, y1: number }
export class Line implements ILine {
  x0: number
  y0: number
  x1: number
  y1: number
  constructor(x0: number = 0, y0: number = 0, x1: number = 0, y1: number = 0) {
    this.x0 = x0
    this.y0 = y0
    this.x1 = x1
    this.y1 = y1
  }
  pure(): ILine {
    return {
      x0: this.x0,
      y0: this.y0,
      x1: this.x1,
      y1: this.y1,
    }
  }
  set(o: ILine) {
    this.x0 = o.x0
    this.y0 = o.y0
    this.x1 = o.x1
    this.y1 = o.y1
  }
  toString() {
    return `Line(x0=${this.x0}, y0=${this.x0}, x1=${this.x1}, y1=${this.y1})`
  }
  mid(): IVector { return LineSegment.mid(this) }
  start(): IVector { return LineSegment.start(this) }
  end(): IVector { return LineSegment.end(this) }
  static mid(l: ILine): IVector {
    return {
      x: l.x1 + (l.x1 - l.x0) / 2,
      y: l.y1 + (l.y1 - l.y0) / 2
    }
  }
  static start(l: ILine): IVector {
    return { x: l.x0, y: l.y0 }
  }
  static end(l: ILine): IVector {
    return { x: l.x1, y: l.y1 }
  }
  static pure(x0: number, y0: number, x1: number, y1: number): ILine {
    return { x0, y0, x1, y1 };
  }
  static create(line: ILine) {
    return new Line(line.x0, line.y0, line.x1, line.y1)
  }
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
  static intersection2(l0: ILine, l1: ILine): IVector | 'collinear' | null {
    return this.intersection(l0.x0, l0.y0, l0.x1, l0.y1, l1.x0, l1.y0, l1.x1, l1.y1)
  }
}

