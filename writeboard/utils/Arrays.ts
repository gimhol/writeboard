/**
 * 数组类型相关的工具函数
 */
export namespace Arrays {
  export type Unsafe<T> = T | null | undefined | void
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