
export interface IVector { x: number, y: number }
const { pow, abs, sin, cos, sqrt } = Math;
export class Vector implements IVector {
  x = 0
  y = 0
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  plus(o: IVector): this { return this.add(o.x, o.y); }

  add(x: number, y: number): this {
    this.x += x;
    this.y += y;
    return this;
  }

  static mid(v0: IVector, v1: IVector, factor: number = 0.5): IVector {
    return {
      x: v0.x + (v1.x - v0.x) * factor,
      y: v0.y + (v1.y - v0.y) * factor,
    }
  }
  static pure(x: number, y: number): IVector {
    return { x, y }
  }
  static distance(a: IVector, b: IVector): number {
    return sqrt(
      pow(a.x - b.x, 2) +
      pow(a.y - b.y, 2)
    )
  }
  static manhattan(a: IVector, b: IVector): number {
    return abs(a.x - b.x) + abs(a.y - b.y);
  }
  static dot(a: IVector, b: IVector) {
    return abs(a.x * b.x + a.y * b.y);
  }
  static multiply(a: IVector, n: number): IVector {
    return { x: a.x * n, y: a.y * n }
  }
  static rotated(a: IVector, b: IVector, radians: number): IVector {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const c = cos(radians);
    const s = sin(radians);
    return {
      x: dx * c - dy * s + b.x,
      y: dx * s + dy * c + b.y
    };
  }
}