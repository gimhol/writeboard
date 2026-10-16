/**
 * 数字类型相关的工具函数
 *
 * Number related utility functions.
 */
export namespace Numbers {
  /**
   * 判断一个值是不是有效数字：类型为 number 且不是 NaN
   *
   * Whether a value is a valid number: of type number and not NaN.
   *
   * @param {any} n 待检查的值 / The value to check
   * @return {boolean} 是有效数字时返回 true / True when it is a valid number
   */
  export function isVaild(n: any): n is number {
    if (typeof n !== 'number') return false;
    return !Number.isNaN(n)
  }
  /**
   * 判断两个数值是否相等
   * 
   * 差值小于等于Number.EPSILON时，视为相等
   *
   * Whether two numbers are equal: a difference within Number.EPSILON counts as equal
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
 *
 * Degree and radian related utility functions.
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
   * Normalizes a radian value so that it stays inside [0, PI * 2)
   *
   * @see {Math.PI}
   * @export
   * @param {number} v 弧度
   * @return {number} 归一化后的弧度值
   */
  export function normalized(v: number): number
  /**
   * 入参为 null 时的重载：原样返回 null
   *
   * Overload for a null input: returns null unchanged.
   *
   * @param {null} v 空值 / The null value
   * @return {null} null / null
   */
  export function normalized(v: null): null
  /**
   * 入参为 undefined 时的重载：原样返回 undefined
   *
   * Overload for an undefined input: returns undefined unchanged.
   *
   * @param {undefined} v 空值 / The undefined value
   * @return {undefined} undefined / undefined
   */
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
   * Turns a radian value into an angle in degrees.
   *
   * @export
   * @param {number} v 弧度
   * @return {number} 角度
   */
  export function angle(v: number): number
  /**
   * 入参为 null 时的重载：原样返回 null
   *
   * Overload for a null input: returns null unchanged.
   *
   * @param {null} v 空值 / The null value
   * @return {null} null / null
   */
  export function angle(v: null): null
  /**
   * 入参为 undefined 时的重载：原样返回 undefined
   *
   * Overload for an undefined input: returns undefined unchanged.
   *
   * @param {undefined} v 空值 / The undefined value
   * @return {undefined} undefined / undefined
   */
  export function angle(v: undefined): undefined
  export function angle(v?: number | null): number | undefined | null {
    return v ? v * _180_D_PI : v
  }
}