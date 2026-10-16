/**
 * 数组类型相关的工具函数
 *
 * Array related utility functions.
 */
export namespace Arrays {
  /**
   * 可能为空的类型：T 本身，或 null / undefined / void
   *
   * A possibly empty type: T itself, or null / undefined / void.
   */
  export type Unsafe<T> = T | null | undefined | void
  /**
   * 找出第一个变换结果非空的元素
   *
   * Returns the first element whose transformed value is not empty.
   *
   * @param {T[]} arr 待遍历的数组 / Array to walk through
   * @param {(it: T) => Unsafe<R>} transform 元素变换函数，返回空值表示该元素不算命中 / Element transform; an empty result means the element is not a hit
   * @return {R | null} 第一个命中的结果，一个都没有时为 null / The first hit, or null when nothing hits
   */
  export function firstOf<T, R>(arr: T[], transform: (it: T) => Unsafe<R>): R | null {
    for (let i = 0, len = arr.length; i < len; i++) {
      const result = transform(arr[i])
      if (result !== null && result !== void 0) {
        return result
      }
    }
    return null
  }
}