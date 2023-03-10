import { Shape } from "./Shape";
import { ShapeData } from "./Data";

export class ShapeNeedPath<D extends ShapeData = ShapeData> extends Shape<D> {
  path(ctx: CanvasRenderingContext2D) {
    throw new Error("Method 'path' not implemented.");
  }
  render(ctx: CanvasRenderingContext2D): void {
    if (!this.visible)
      return;
    const d = this.data;

    if (d.fillStyle || (d.lineWidth && d.strokeStyle))
      this.path(ctx);
    if (d.fillStyle) {
      ctx.fillStyle = d.fillStyle;
      ctx.fill();
    }
    if (d.lineWidth && d.strokeStyle) {
      ctx.lineCap = d.lineCap;
      ctx.lineDashOffset = d.lineDashOffset;
      ctx.lineJoin = d.lineJoin;
      ctx.lineWidth = d.lineWidth;
      ctx.miterLimit = d.miterLimit;
      ctx.strokeStyle = d.strokeStyle;
      ctx.setLineDash(d.lineDash);
      ctx.stroke();
    }
    super.render(ctx);
  }
}
