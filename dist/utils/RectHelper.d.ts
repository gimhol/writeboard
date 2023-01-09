import { IRect } from "./Rect";
export declare enum GenMode {
    FromCorner = 0,
    FromCenter = 1
}
export declare enum LockMode {
    Default = 0,
    Square = 1,
    Circle = 2
}
export type GenOptions = {
    genMode: GenMode;
    lockMode: LockMode;
};
export declare class RectHelper {
    private _from;
    private _to;
    start(x: number, y: number): void;
    end(x: number, y: number): void;
    clear(): void;
    gen(options?: GenOptions): IRect;
}
