import { ShapeData } from "../base";
export declare enum DotsType {
    Invalid = 0,
    All = 1,
    Append = 2
}
export declare class PenData extends ShapeData {
    dotsType: DotsType;
    coords: number[];
    constructor();
    copyFrom(other: Partial<PenData>): this;
    merge(other: Partial<PenData>): this;
    copy(): PenData;
}
