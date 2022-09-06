import { IRect } from "./Rect"
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
  private _from = Vector.pure(-999, -999)
  private _to = Vector.pure(-999, -999)
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
    this._from = Vector.pure(-999, -999)
    this._to = Vector.pure(-999, -999)
  }
  gen(options?: GenOptions): IRect {
    // PREF: IMPROVE ME
    const lockMode = options?.lockMode || LockMode.Default
    const genMode = options?.genMode || GenMode.FromCorner
    let { x: x0, y: y0 } = this._from
    let { x: x1, y: y1 } = this._to
    switch (lockMode) {
      case LockMode.Square:
        if (genMode === GenMode.FromCenter) {
          const d = Math.max(Math.abs(x0 - x1), Math.abs(y0 - y1))
          x1 = x0 + d
          y1 = y0 + d
        } else if (genMode === GenMode.FromCorner) {
          const k = (y0 - y1) / (x0 - x1) > 0 ? 1 : -1
          const b = y1 + k * x1
          x1 = (b - y0 + k * x0) / (2 * k)
          y1 = -k * x1 + b
        }
        break
      case LockMode.Circle:
        if (genMode === GenMode.FromCenter) {
          const r = Math.sqrt(Math.pow(Math.abs(x0 - x1), 2) + Math.pow(Math.abs(y0 - y1), 2))
          x1 = x0 + r
          y1 = y0 + r
        } else if (genMode === GenMode.FromCorner) {
          const d = Math.sqrt(Math.pow(Math.abs(x0 - x1), 2) + Math.pow(Math.abs(y0 - y1), 2))
          const xo = (x0 + x1) / 2
          const yo = (y0 + y1) / 2
          return {
            x: xo - d / 2,
            y: yo - d / 2,
            w: d,
            h: d,
          }
        }
        break
    }
    switch (genMode) {
      case GenMode.FromCenter: {
        const halfW = Math.abs(x0 - x1)
        const halfH = Math.abs(y0 - y1)
        return {
          x: x0 - halfW,
          y: y0 - halfH,
          w: 2 * halfW,
          h: 2 * halfH,
        }
      }
      default: {
        const x = Math.min(x0, x1)
        const y = Math.min(y0, y1)
        return {
          x, y,
          w: Math.max(x0, x1) - x,
          h: Math.max(y0, y1) - y
        }
      }
    }
  }
}
