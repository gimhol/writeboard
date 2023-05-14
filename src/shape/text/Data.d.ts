import { ShapeData } from "../base";
export declare class TextData extends ShapeData {
    constructor();
    text: string;
    font: string;
    t_l: number;
    t_r: number;
    t_t: number;
    t_b: number;
    copyFrom(other: Partial<TextData>): this;
    copy(): TextData;
}
