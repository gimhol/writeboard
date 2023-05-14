import { IVector } from "./Vector";
export interface IRect {
    x: number;
    y: number;
    w: number;
    h: number;
}
export declare class Rect implements IRect {
    x: number;
    y: number;
    w: number;
    h: number;
    get top(): number;
    get left(): number;
    get right(): number;
    get bottom(): number;
    constructor(x: number, y: number, w: number, h: number);
    set(o: IRect): void;
    hit(b: IRect | IVector): boolean;
    toString(): string;
    mid(): IVector;
    static create(rect: IRect): Rect;
    static pure(x: number, y: number, w: number, h: number): IRect;
    static bounds(r1: IRect, r2: IRect): IRect;
    static hit(a: IRect, b: IRect | IVector): boolean;
    static intersect(a: IRect, b: IRect): IRect;
}
