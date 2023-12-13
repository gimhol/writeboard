import { Shape, ShapeData } from "../../shape";
import { ShapeEventMap, ShapeEventEnum } from "../../shape/base/ShapeEvent";
import { IDot } from "../../utils";
import { Degrees, Numbers } from "../../utils/Numbers";
import { Rect } from "../../utils/Rect";

export class ShapeRotator extends Shape<ShapeData> {
  get target() { return this._target }
  private _target: Shape | undefined
  private _ctrlDot = new Rect(0, 0, 0, 0)
  private _oY: number = 0;
  private _oX: number = 0;
  private get _distance() { return this.board?.factory.rotator.distance || 30 }
  private get _width() { return this.board?.factory.rotator.size || 10 }
  constructor() {
    super(new ShapeData);
    this.data.ghost = true
    this.data.visible = false
  }

  private _update = (shape: Shape) => {
    this.beginDirty()
    const { x: mx, y: my } = shape.rotatedMid
    const w = this._width
    const d = this._distance

    this.data.visible = shape.selected && !shape.locked && !!shape.board
    
    console.log(this.data.visible)
    this.data.w = w
    this.data.h = shape.h + d * 2
    this.data.x = mx - this.halfW
    this.data.y = my - this.halfH
    this.data.rotation = shape.rotation
    const s = this.board?.factory.rotator.size || 10
    this._ctrlDot.w = s;
    this._ctrlDot.h = s;
    this.endDirty()
  }

  private _listener = (e: ShapeEventMap[ShapeEventEnum.EndDirty]) => this._update(e.detail.shape)
  private _listener2 = (e: ShapeEventMap[ShapeEventEnum.BoardChanged]) => this._update(e.detail.shape)

  follow(shape: Shape) {
    this.unfollow()
    shape.addEventListener(ShapeEventEnum.EndDirty, this._listener);
    shape.addEventListener(ShapeEventEnum.BoardChanged, this._listener2);
    this._update(shape)
    this._target = shape
  }

  unfollow() {
    this._target?.removeEventListener(ShapeEventEnum.EndDirty, this._listener)
    this._target?.removeEventListener(ShapeEventEnum.BoardChanged, this._listener2)
    delete this._target
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.visible) return;
    this.beginDraw(ctx)
    const { x, y, w, h } = this._ctrlDot
    const mx = Math.floor(x + w / 2) - 0.5
    const t = Math.floor(y) + 0.5
    const l = Math.floor(x) - 0.5
    ctx.strokeStyle = "black"
    ctx.fillStyle = "white"
    ctx.lineWidth = 1
    ctx.fillRect(x, y, w, h)
    ctx.strokeRect(l, t, w, h)
    ctx.beginPath();
    ctx.moveTo(mx, y + h)
    ctx.lineTo(mx, this._distance)
    ctx.stroke()
    this.endDraw(ctx)
    // super.render(ctx);
  }

  pointerDown(dot: IDot): boolean {
    const ret = this.visible && !!this._target && this.hit(dot)
    if (ret) {
      this._oX = this._target!.midX;
      this._oY = this._target!.midY;
    }
    return ret
  }

  pointerDraw(dot: IDot): void {
    const dx = this._oX - dot.x;
    const dy = this._oY - dot.y;
    if (Numbers.equals(dx + dy, 0)) return;
    this._target?.rotateTo(Math.atan2(dy, dx) - Math.PI / 2);
  }

  hit(dot: IDot): boolean {
    return this._ctrlDot.hit(this.map2me(dot.x, dot.y))
  }
}