import { Resizable, Shape, ShapeData } from "../../shape";

export class ShapeRotater extends Shape<ShapeData> {
  constructor() {
    super(new ShapeData);
    this._resizable = Resizable.All;
    this.resize(100, 100)
  }
  render(ctx: CanvasRenderingContext2D): void {
    if (!this.visible) return;
    this.beginDraw(ctx)
    const { x, y, w, h } = this.drawingRect()
    const s = this.board?.factory.resizer.size || 10

    const mx = x + w / 2
    const my = y + h / 2
    const l = mx - s / 2

    ctx.fillStyle = "red"
    ctx.fillRect(x, y, w, h)

    ctx.strokeStyle = "black"
    ctx.fillStyle = "white"
    ctx.lineWidth = 1
    ctx.fillRect(l, y, s, s)
    ctx.strokeRect(l + 0.5, y + 0.5, s, s)

    ctx.beginPath();
    ctx.moveTo(mx, y + s)
    ctx.arc(mx, my, s / 2, -0.5 * Math.PI, 2 * Math.PI);
    ctx.closePath();
    ctx.fill()
    ctx.stroke()





    this.endDraw(ctx)
    super.render(ctx);
  }
}