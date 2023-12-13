import { Resizable, Shape, ShapeData, ShapeEventEnum, ShapeEventMap } from "../../shape";
import { Degrees } from "../../utils/Numbers";

export class ShapeRotater extends Shape<ShapeData> {
  private _prevShape: Shape | null = null
  constructor() {
    super(new ShapeData);
    this.data.ghost = true
    this.data.visible = false
  }

  update = (shape: Shape) => {
    const { x: mx, y: my } = shape.rotatedMid
    this.visible = shape.selected
    this.markDirty()
    this.data.w = 30
    this.data.h = shape.h + 60
    this.data.x = mx - this.halfW
    this.data.y = my - this.halfH
    this.data.rotation = shape.rotation
    this.markDirty()
  }

  listener = (e: ShapeEventMap[ShapeEventEnum.EndDirty]) => this.update(e.detail.shape)

  follow(shape: Shape | null) {
    this._prevShape?.addEventListener(ShapeEventEnum.EndDirty, this.listener)
    shape?.addEventListener(ShapeEventEnum.EndDirty, this.listener)
    if (shape) this.update(shape)
    this._prevShape = shape
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.visible) return;
    this.beginDraw(ctx)
    const { x, y, w } = this.drawingRect()
    const s = this.board?.factory.resizer.size || 10

    const mx = Math.floor(x + w / 2)
    const l = Math.floor(mx - s / 2)

    ctx.strokeStyle = "black"
    ctx.fillStyle = "white"
    ctx.lineWidth = 1
    ctx.fillRect(l, y, s, s)
    ctx.strokeRect(l + 0.5, y + 0.5, s, s)

    ctx.beginPath();
    ctx.moveTo(mx + 0.5, y + s)
    ctx.lineTo(mx + 0.5, 30)
    ctx.stroke()

    this.endDraw(ctx)
    super.render(ctx);
  }

  cursor(x: number, y: number): string | null {
    const { w, h } = this.drawingRect()
    const s = this.board?.factory.resizer.size || 10

    if (x < w / 2 - 10 || x > w / 2 + 10 || y < 0 || y > s * 2)
      return null
    const d = Degrees.normalized(this.rotation * Math.PI / 4 + Math.PI / 0.25);
    switch (Math.floor((115 + Degrees.angle(d)) / 45) % 8) {
      case 0: case 4: return 'ns-resize';
      case 2: case 6: return 'ew-resize';
      case 3: case 7: return 'nw-resize';
      case 1: case 5: return 'ne-resize';
    }
    return null
  }
}