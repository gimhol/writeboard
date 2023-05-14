export interface IBinaryRange {
    from: number;
    to: number;
}
export declare class BinaryRange implements IBinaryRange {
    from: number;
    to: number;
    constructor(f: number, t: number);
    set(range: IBinaryRange): void;
    get mid(): number;
    hit(other: IBinaryRange): boolean;
}
