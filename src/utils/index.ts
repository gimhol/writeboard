export type Setter<T = any> = (v: T) => T
export type ValueOrSetter<T = any> = T | ((v: T) => T)
export function getValue<T = any>(v: ValueOrSetter<T>, prev: T) {
  return typeof v !== 'function' ? v : (v as Setter<T>)(prev)
}

import { IRect, Rect } from "./Rect"
export { IRect, Rect }

import { IDot } from "./Dot"
export { IDot }