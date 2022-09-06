import { Shape } from "../base";
import { PenData } from "./Data";
import { IDot } from "../../utils/Dot";
export declare class ShapePen extends Shape<PenData> {
    private _lineFactor;
    private _smoothFactor;
    private _srcGeo;
    private _path2D;
    private prev_t;
    private prev_dot;
    constructor(v: PenData);
    merge(data: Partial<PenData>): void;
    /**
     * 根据新加入的点，计算原始矩形
     * @param dot
     */
    private updateSrcGeo;
    private updatePath;
    appendDot(dot: IDot, type?: 'first' | 'last'): void;
    render(ctx: CanvasRenderingContext2D): void;
}
