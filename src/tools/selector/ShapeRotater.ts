import { Resizable, Shape, ShapeData } from "../../shape";

export class ShapeRotater extends Shape<ShapeData> {
  private _prevShape: Shape | null = null
  constructor() {
    super(new ShapeData);
    this._resizable = Resizable.All;
    this.resize(100, 100)
  }

  update = (shape: Shape) => {
    const { x: mx, y: my } = shape.rotatedMid
    this.visible = shape.visible
    this.markDirty()
    this.data.w = 30
    this.data.h = shape.h + 60
    this.data.x = mx - this.halfW
    this.data.y = my - this.halfH
    this.data.rotation = shape.rotation
    this.markDirty()
  }

  follow = (shape: Shape) => {
    this.update(shape)
    this._prevShape?.onDirty(() => { })
    shape.onDirty(this.update)
    this._prevShape = shape
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.visible) return;
    this.beginDraw(ctx)
    const { x, y, w, h } = this.drawingRect()
    const s = this.board?.factory.resizer.size || 10

    const mx = x + w / 2
    const my = y + h / 2
    const l = mx - s / 2

    // ctx.fillStyle = "red"
    // ctx.fillRect(x, y, w, h)

    ctx.strokeStyle = "black"
    ctx.fillStyle = "white"
    ctx.lineWidth = 1
    ctx.fillRect(l, y, s, s)
    ctx.strokeRect(l + 0.5, y + 0.5, s, s)

    ctx.beginPath();
    ctx.moveTo(mx, y + s)
    ctx.lineTo(mx, 30)
    ctx.stroke()

    this.endDraw(ctx)
    super.render(ctx);
  }
}