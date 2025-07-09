export type Setter<T = any> = (v: T) => T
export type ValueOrSetter<T = any> = T | ((v: T) => T)
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
