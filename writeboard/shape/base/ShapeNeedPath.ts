import { Shape } from "./Shape";
import { Resizable } from "./Resizable";
import { ShapeData } from "./ShapeData";

export class ShapeNeedPath<D extends ShapeData = ShapeData> extends Shape<D> {
  constructor(data: Partial<D>, cls: new (other?: Partial<D>) => D) {
    super(data, cls);
    this._r = Resizable.All;
  }
  path(ctx: CanvasRenderingContext2D) {
    throw new Error("Method 'path' not implemented.");
  }
  render(ctx: CanvasRenderingContext2D): void {
    if (!this.visible)
      return;
    this.beginDraw(ctx)
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
    this.endDraw(ctx)
    super.render(ctx);
  }
}
