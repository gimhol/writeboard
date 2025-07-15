import { IVector } from "./IVector";
import { Numbers } from "./Numbers";

const { pow, abs, sin, cos, sqrt, PI } = Math;
export class Vector implements IVector {
  x = 0
  y = 0
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  plus(o: IVector): this { return this.add(o.x, o.y); }
  minus(o: IVector): this { return this.add(-o.x, -o.y); }
  set(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }
  add(x: number, y: number): this {
    this.x += x;
    this.y += y;
    return this;
  }
  read(a: IVector): this {
    this.x = a.x;
    this.y = a.y;
    return this;
  }
  toString(): string {
    return `Vector(x=${this.x}, y=${this.y})`
  }
  rotate(radians: number, b: IVector): this {
    const { x, y } = Vector.rotated2(this.x, this.y, b.x, b.y, radians)
    return this.set(x, y);
  }
  rotated(radians: number, b: IVector): Vector {
    const { x, y } = Vector.rotated2(this.x, this.y, b.x, b.y, radians)
    return new Vector(x, y);
  }

  static plus(a: IVector, b: IVector): IVector { return { x: a.x + b.x, y: a.y + b.y } }
  static minus(a: IVector, b: IVector): IVector { return { x: a.x - b.x, y: a.y - b.y } }
  static ensure(rect: IVector): Vector {
    return rect instanceof Vector ? rect : Vector.create(rect)
  }
  static create(a: IVector): Vector {
    return new Vector(a.x, a.y);
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
    return this.rotated2(a.x, a.y, b.x, b.y, radians);
  }
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