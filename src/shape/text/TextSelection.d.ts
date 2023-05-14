export interface ITextSelection {
    start: number;
    end: number;
}
export declare class TextSelection implements ITextSelection {
    start: number;
    end: number;
    constructor(start?: number, end?: number);
    equal(other: ITextSelection): boolean;
}
