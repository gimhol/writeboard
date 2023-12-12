export namespace Numbers {
  export function equals(a: number, b: number) {
    return Math.abs(a - b) <= Number.EPSILON
  }
}
export namespace Degrees {
  export function normalized(v: number): number
  export function normalized(v: null): null
  export function normalized(v: undefined): undefined
  export function normalized(v?: number | null): number | undefined | null {
    if (!v) return v
    else if (Numbers.equals(0, v)) return 0
    else if (v < 0) return v % (Math.PI * 2) + Math.PI * 2
    else return v % (Math.PI * 2)
  }
  export function angle(v: number): number
  export function angle(v: null): null
  export function angle(v: undefined): undefined
  export function angle(v?: number | null): number | undefined | null {
    if (!v) return v
    return 180 * v / Math.PI
  }
}