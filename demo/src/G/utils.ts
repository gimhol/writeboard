export type GetValue<T = Exclude<any, Function>> = T | (() => T);
export function getValue<T = Exclude<any, Function>>(v: GetValue<T>): T {
  return (typeof v !== 'function') ? v : (v as any)();
}
export type ReValue<T = Exclude<any, Function>> = T | ((v: T) => T);
export function reValue<T = Exclude<any, Function>>(next: ReValue<T>, prev: T): T {
  return (typeof next !== 'function') ? next : (next as any)(prev);
}
export type Rect = { x: number; y: number; w: number; h: number }