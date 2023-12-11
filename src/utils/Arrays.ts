export namespace Arrays {
  export function find<T, R>(arr: T[], func: (it: T) => R): R | null {
    for (let i = 0, len = arr.length; i < len; i++) {
      const result = func(arr[i])
      if (result !== null && result !== void 0) {
        return result
      }
    }
    return null
  }
}