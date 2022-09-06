export declare type Setter<T = any> = (v: T) => T;
export declare type ValueOrSetter<T = any> = T | ((v: T) => T);
export declare function getValue<T = any>(v: ValueOrSetter<T>, prev: T): T;
import { IRect, Rect } from "./Rect";
export { IRect, Rect };
import { IDot } from "./Dot";
export { IDot };
