export interface IVector {
    x: number;
    y: number;
}
export declare class Vector implements IVector {
    x: number;
    y: number;
    constructor(x: number, y: number);
    static mid(v0: IVector, v1: IVector, factor?: number): IVector;
    static pure(x: number, y: number): IVector;
    static distance(v0: IVector, v1: IVector): number;
}
