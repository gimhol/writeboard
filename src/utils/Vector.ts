
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
  static distance(v0: IVector, v1: IVector): number {
    return Math.sqrt(
      Math.pow(v0.x - v1.x, 2) +
      Math.pow(v0.y - v1.y, 2)
    )
  }
  static manhattan(v0: IVector, v1: IVector): number {
    return Math.abs(v0.x - v1.x) + Math.abs(v0.y - v1.y);
  }
}