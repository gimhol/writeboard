import { IRect } from "./IRect"
import { Vector } from "./Vector"
export enum GenMode {
  FromCorner = 0,
  FromCenter = 1
}
export enum LockMode {
  Default = 0,
  Square = 1,
  Circle = 2
}
export type GenOptions = {
  genMode: GenMode
  lockMode: LockMode
}
export class RectHelper {
  private _from = Vector.pure(NaN, NaN);
  private _to = Vector.pure(NaN, NaN);
  get ok() { return isNaN(this._from.x) || isNaN(this._to.x) }
  get from() { return this._from; }
  get to() { return this._to; }
  start(x: number, y: number) {
    this._from.x = x
    this._from.y = y
    this._to.x = x
    this._to.y = y
  }
  end(x: number, y: number) {
    this._to.x = x
    this._to.y = y
  }
  clear() {
    this._from = Vector.pure(NaN, NaN)
    this._to = Vector.pure(NaN, NaN)
  }
  gen(): IRect {
    const { x: x0, y: y0 } = this._from
    const { x: x1, y: y1 } = this._to
    const x = Math.min(x0, x1)
    const y = Math.min(y0, y1)
    return {
      x, y,
      w: Math.max(x0, x1) - x,
      h: Math.max(y0, y1) - y
    }
  }
}
