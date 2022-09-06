export declare const clampF: (min: number, max: number, value: number) => number;
export declare const clampI: (min: number, max: number, value: number) => number;
export declare class LazyHolder<Result> {
    private _result;
    private _dirty;
    protected constructor(result: Result[]);
    protected dirty(i?: number): boolean;
    protected markAsDirty(i?: number): void;
    protected result(v: Result | undefined, i?: number): Result | undefined;
}
export declare class RGB extends LazyHolder<string> {
    static get White(): RGB;
    static get Black(): RGB;
    private _r;
    private _g;
    private _b;
    get r(): number;
    set r(v: number);
    get g(): number;
    set g(v: number);
    get b(): number;
    set b(v: number);
    equal(o: RGB): boolean;
    setR(v: number): this;
    setG(v: number): this;
    setB(v: number): this;
    constructor(r?: number, g?: number, b?: number);
    copy(): RGB;
    toString(): string;
    toHex(): string;
    toHSB(hues: number): HSB;
    toRGBA(a: number): RGBA;
}
export declare class RGBA extends RGB {
    static get White(): RGBA;
    static get Black(): RGBA;
    static get WhiteT(): RGBA;
    static get BlackT(): RGBA;
    private _a;
    get a(): number;
    set a(v: number);
    equal(o: RGBA): boolean;
    setA(v: number): this;
    constructor(r?: number, g?: number, b?: number, a?: number);
    copy(): RGBA;
    toString(): string;
    toHex(): string;
    toRGB(): RGB;
}
export declare class HSB {
    private _h;
    private _s;
    private _b;
    get h(): number;
    set h(v: number);
    get s(): number;
    set s(v: number);
    get b(): number;
    set b(v: number);
    equal(o: HSB): boolean;
    constructor(h: number, s: number, b: number);
    copy(): HSB;
    toString(): string;
    toRGB(): RGB;
    toRGBA(a: number): RGBA;
    stripSB(): HSB;
}
