import { PolygonData } from "./Data";
import { ShapeNeedPath } from "../base/ShapeNeedPath";
export declare class ShapePolygon extends ShapeNeedPath<PolygonData> {
    path(ctx: CanvasRenderingContext2D): void;
}
