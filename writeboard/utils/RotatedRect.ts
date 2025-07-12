import type { IRotatedRect } from "./IRotatedRect";
import { Rect } from "./Rect";
import { Vector } from "./Vector";
import { type IVector } from "./IVector";

export class RotatedRect implements IRotatedRect {
  x: number
  y: number
  w: number
  h: number
  private _r: number = 0;
  private _cr: number = 0;
  private _sr: number = 0;
  private _axisX: IVector = { x: 0, y: 0 };
  private _axisY: IVector = { x: 0, y: 0 };
  get axisX() { return this._axisX }
  get axisY() { return this._axisY }
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
  get right(): number {
    return this.x + this.w
  }
  set bottom(v: number) {
    this.h = v - this.y
  }
  get bottom(): number {
    return this.y + this.h
  }
  get dots(): [IVector, IVector, IVector, IVector] {
    return RotatedRect.dots_cs(this.x, this.y, this.w, this.h, this._cr, this._sr);
  }
  get r() { return this._r }
  set r(r: number) {
    this._r = r
    this._cr = Math.cos(r)
    this._sr = Math.sin(r)
    this._axisX = { x: this._cr, y: this._sr }
    this._axisY = { x: -this._sr, y: this._cr }
  }
  get middleX() { return this.x + this.w / 2 }
  get middleY() { return this.y + this.h / 2 }
  set middleX(v: number) { this.x = v - this.w / 2 }
  set middleY(v: number) { this.y = v - this.h / 2 }

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
  set(o: IRotatedRect): this {
    this.x = o.x
    this.y = o.y
    this.w = o.w
    this.h = o.h
    this.r = o.r || 0
    return this
  }

  hit(b: IRotatedRect): boolean {
    return RotatedRect.hit(this, b)
  }

  toString() {
    return `RotatedRect(x=${this.x}, y=${this.x}, w=${this.w}, h=${this.h}, r=${this.r})`
  }

  moveTo(x: number, y: number): this {
    this.x = x;
    this.y = y;
    return this;
  }

  mid(): IVector {
    return { x: this.x + this.w / 2, y: this.y + this.h / 2 }
  }
  static ensure(rect: IRotatedRect): RotatedRect {
    return rect instanceof RotatedRect ? rect : RotatedRect.create(rect)
  }
  static create(rect: IRotatedRect) {
    return new RotatedRect(rect.x, rect.y, rect.w, rect.h, rect.r)
  }

  static pure(x: number, y: number, w: number, h: number, r: number): IRotatedRect {
    return { x, y, w, h, r };
  }
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
  static dots(x: number, y: number, w: number, h: number, r: number = 0): [IVector, IVector, IVector, IVector] {
    const c = Math.cos(r)
    const s = Math.sin(r)
    return this.dots_cs(x, y, w, h, c, s)
  }
  static dots2(r: IRotatedRect): [IVector, IVector, IVector, IVector] {
    return this.dots(r.x, r.y, r.w, r.h, r.r)
  }
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

  projection(axis: IVector): number {
    const px = Vector.dot(this._axisX, axis)
    const py = Vector.dot(this._axisY, axis)
    return px * this.w + py * this.h
  }
}

