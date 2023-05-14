import { ShapeType } from "../ShapeEnum";
export interface IShapeStyle {
    /**
     * strokeStyle
     */
    a?: CanvasFillStrokeStyles['strokeStyle'];
    /**
     * fillStyle
     */
    b?: CanvasFillStrokeStyles['fillStyle'];
    /**
     * lineCap
     */
    c?: CanvasLineCap;
    /**
     * lineDash
     */
    d?: number[];
    /**
     * lineDashOffset
     */
    e?: number;
    /**
     * lineJoin
     */
    f?: CanvasLineJoin;
    /**
     * lineWidth
     */
    g?: number;
    /**
     * miterLimit
     */
    h?: number;
}
export interface IShapeStatus {
    /**
     * visible
     */
    v?: number;
    /**
     * selected
     */
    s?: number;
    /**
     * editing
     */
    e?: number;
}
export interface IShapeData {
    t: ShapeType;
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    z: number;
    l: string;
    style?: IShapeStyle;
    status?: IShapeStatus;
}
export declare class ShapeData implements IShapeData {
    t: ShapeType;
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    z: number;
    l: string;
    style?: Partial<IShapeStyle>;
    status?: Partial<IShapeStatus>;
    get type(): ShapeType;
    set type(v: ShapeType);
    get id(): string;
    set id(v: string);
    get fillStyle(): string | CanvasGradient | CanvasPattern;
    set fillStyle(v: string | CanvasGradient | CanvasPattern);
    get strokeStyle(): string | CanvasGradient | CanvasPattern;
    set strokeStyle(v: string | CanvasGradient | CanvasPattern);
    get lineCap(): CanvasLineCap;
    set lineCap(v: CanvasLineCap);
    get lineDash(): number[];
    set lineDash(v: number[]);
    get lineDashOffset(): number;
    set lineDashOffset(v: number);
    get lineJoin(): CanvasLineJoin;
    set lineJoin(v: CanvasLineJoin);
    get lineWidth(): number;
    set lineWidth(v: number);
    get miterLimit(): number;
    set miterLimit(v: number);
    get visible(): boolean;
    set visible(v: boolean);
    get selected(): boolean;
    set selected(v: boolean);
    get editing(): boolean;
    set editing(v: boolean);
    get layer(): string;
    set layer(v: string);
    merge(other: Partial<IShapeData>): this;
    copyFrom(other: Partial<IShapeData>): this;
    copy(): ShapeData;
}
