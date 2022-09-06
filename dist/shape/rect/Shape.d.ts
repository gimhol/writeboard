import { RectData } from "./Data";
import { ShapeNeedPath } from "../base/ShapeNeedPath";
export declare class ShapeRect extends ShapeNeedPath<RectData> {
    path(ctx: CanvasRenderingContext2D): void;
}
