import { IVector } from "./Vector"

export interface IRect { x: number, y: number, w: number, h: number }
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
  constructor(x: number, y: number, w: number, h: number) {
    this.x = x
    this.y = y
    this.w = w
    this.h = h
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
  static create(rect: IRect) {
    return new Rect(rect.x, rect.y, rect.w, rect.h)
  }
  static pure(x: number, y: number, w: number, h: number): IRect {
    return { x, y, w, h };
  }
  static bounds(r1: IRect, r2: IRect): IRect {
    const x = Math.min(r1.x, r2.x)
    const y = Math.min(r1.y, r2.y)
    return {
      x, y,
      w: Math.max(r1.x + r1.w, r2.x + r2.w) - x,
      h: Math.max(r1.y + r1.h, r2.y + r2.h) - y
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
    const x = Math.max(a.x, b.x)
    const y = Math.max(a.y, b.y)
    const right = Math.min(a.x + a.w, b.x + b.w)
    const bottom = Math.min(a.y + a.h, b.y + b.h)
    return {
      x, y,
      w: right - x,
      h: bottom - y
    }
  }
}