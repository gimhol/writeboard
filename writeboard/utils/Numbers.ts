/**
 * 数字类型相关的工具函数
 */
export namespace Numbers {
  /**
   * 判断两个数值是否相等
   * 
   * 差值小于等于Number.EPSILON时，视为相等
   *
   * @export
   * @see {Number.EPSILON}
   * @param {number} a 值1
   * @param {number} b 值2
   * @return {boolean} a等于b时返回true，否则返回false
   */
  export function equals(a: number, b: number): boolean {
    return Math.abs(a - b) <= Number.EPSILON
  }
}

/**
 * 角度弧度相关的工具函数
 */
export namespace Degrees {
  const { PI } = Math;
  const PI_2 = PI * 2;
  const _180_D_PI = 180 / PI


  /**
   * 弧度归一化
   * 
   * 避免弧度小于0或大于等于PI*2
   *
   * @see {Math.PI}
   * @export
   * @param {number} v 弧度
   * @return {number} 归一化后的弧度值
   */
  export function normalized(v: number): number
  export function normalized(v: null): null
  export function normalized(v: undefined): undefined
  export function normalized(v?: number | null): number | undefined | null {
    if (!v) return v
    else if (Numbers.equals(0, v)) return 0
    else if (v < 0) return v % PI_2 + PI_2
    else return v % PI_2
  }

  /**
   * 弧度转角度
   *
   * @export
   * @param {number} v 弧度
   * @return {number} 角度
   */
  export function angle(v: number): number
  export function angle(v: null): null
  export function angle(v: undefined): undefined
  export function angle(v?: number | null): number | undefined | null {
    return v ? v * _180_D_PI : v
  }
}