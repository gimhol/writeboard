/**
 * 以旧值为入参、返回新值的函数
 *
 * A function taking the previous value and returning the new one.
 */
export type Setter<T = any> = (v: T) => T
/**
 * 值或取值函数：两种写法都当作新值使用
 *
 * A value or a setter: both forms count as the new value.
 */
export type ValueOrSetter<T = any> = T | ((v: T) => T)
/**
 * 取出新值：传入函数时以旧值调用它，否则原样返回
 *
 * Resolves the new value: a function is called with the previous value, anything else
 * is returned as is.
 *
 * @param {ValueOrSetter<T>} v 新值或取值函数 / The new value or the setter
 * @param {T} prev 旧值 / The previous value
 * @return {T} 求值后的新值 / The resolved new value
 */
export function getValue<T = any>(v: ValueOrSetter<T>, prev: T) {
  return typeof v !== 'function' ? v : (v as Setter<T>)(prev)
}

export * from "./Arrays"
export * from "./BinaryRange"
export * from "./BinaryTree"
export * from "./Dot"
export * from "./IPolygon"
export * from "./IRect"
export * from "./IRotatedRect"
export * from "./ITree"
export * from "./IVector"
export * from "./Numbers"
export * from "./Polygon"
export * from "./QuadTree"
export * from "./Rect"
export * from "./RotatedRect"
export * from "./Vector"
