
export interface IVector { x: number, y: number }
export class Vector implements IVector {
  x = 0
  y = 0
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
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
    return Math.sqrt(
      Math.pow(a.x - b.x, 2) +
      Math.pow(a.y - b.y, 2)
    )
  }
  static manhattan(a: IVector, b: IVector): number {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }
  static dot(a: IVector, b: IVector) {
    return Math.abs(a.x * b.x + a.y * b.y);
  }
  static multiply(a: IVector, n: number): IVector {
    return { x: a.x * n, y: a.y * n }
  }
}