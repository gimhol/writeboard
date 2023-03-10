export type Setter<T = any> = (v: T) => T
export type ValueOrSetter<T = any> = T | ((v: T) => T)
export function getValue<T = any>(v: ValueOrSetter<T>, prev: T) {
  return typeof v !== 'function' ? v : (v as Setter<T>)(prev)
}

export * from "./Array"
export * from "./BinaryRange"
export * from "./BinaryTree"
export * from "./Dot"
export * from "./ITree"
export * from "./QuadTree"
export * from "./Rect"
export * from "./Vector"

