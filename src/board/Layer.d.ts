export interface ILayerInfoInit {
    readonly name: string;
}
export interface ILayerInits {
    readonly info: ILayerInfoInit;
    readonly onscreen: HTMLCanvasElement;
}
export interface ILayerInfo {
    name: string;
}
export interface ILayer {
    readonly name: string;
    readonly info: ILayerInfo;
    readonly onscreen: HTMLCanvasElement;
    readonly offscreen: HTMLCanvasElement;
    readonly ctx: CanvasRenderingContext2D;
    readonly octx: CanvasRenderingContext2D;
}
export declare class LayerInfo implements ILayerInfo {
    protected _name: string;
    get name(): string;
    constructor(inits: ILayerInfoInit);
}
export declare class Layer implements ILayer {
    protected _info: ILayerInfo;
    protected _onscreen: HTMLCanvasElement;
    protected _offscreen: HTMLCanvasElement;
    protected _ctx: CanvasRenderingContext2D;
    protected _octx: CanvasRenderingContext2D;
    get name(): string;
    get info(): ILayerInfo;
    get onscreen(): HTMLCanvasElement;
    get offscreen(): HTMLCanvasElement;
    get ctx(): CanvasRenderingContext2D;
    get octx(): CanvasRenderingContext2D;
    constructor(inits: ILayerInits);
    get width(): number;
    set width(v: number);
    get height(): number;
    set height(v: number);
}
