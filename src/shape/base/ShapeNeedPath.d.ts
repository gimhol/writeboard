import { Shape } from "./Shape";
import { ShapeData } from "./Data";
export declare class ShapeNeedPath<D extends ShapeData = ShapeData> extends Shape<D> {
    path(ctx: CanvasRenderingContext2D): void;
    render(ctx: CanvasRenderingContext2D): void;
}
