import { Shape } from "../../shape/base/Shape";
import { ShapeData } from "../../shape/base/ShapeData";
import { ShapeEventEnum, ShapeEventMap } from "../../shape/base/ShapeEvent";
import { Vector } from "../../utils";
import { IDot } from "../../utils/Dot";
import { Numbers } from "../../utils/Numbers";
import { Rect } from "../../utils/Rect";

/**
 * 旋转柄：在选中的图形（或组合框）上方画一根带圆点的柄，把它拖到哪个方向就把图形转到哪个方向
 *
 * The rotate grip: it draws a stalk with a round knob above the selected shape (or group
 * box); dragging it turns the shape toward the pointer.
 */
export class ShapeRotator extends Shape<ShapeData> {
  /**
   * 正在跟随的目标（选中的图形或组合框），没有时为 undefined
   *
   * The shape (or group box) it follows, undefined while there is none.
   */
  get target() { return this._target }
  private _target: Shape | undefined
  private _ctrl = new Rect(0, 0, 0, 0)
  private _oY: number = 0;
  private _oX: number = 0;
  private get _distance() { return this.board?.factory.rotator.distance || 30 }
  private get _width() { return this.board?.factory.rotator.size || 10 }
  /**
   * 新建旋转柄：默认不可见（等 follow 有目标了再显示）
   *
   * Creates a rotate grip: invisible by default (follow shows it once it has a target).
   */
  constructor() {
    super({}, ShapeData);
    this.data.ghost = true
    this.data.visible = false
    this.data.lineWidth = 10
  }

  private _update = (shape: Shape) => {
    this.beginDirty()
    const { x: mx, y: my } = shape.rotatedMid
    const w = this._width
    const d = this._distance
    const v = shape.visible && shape.selected && !shape.locked && !!shape.board
    if (v) {
      this.data.w = w
      this.data.h = shape.h + d * 2
      const offset = Vector.rotated2(0, shape.lineWidth / 2, 0, 0, shape.rotation)
      this.data.x = mx - this.halfW - offset.x
      this.data.y = my - this.halfH - offset.y
      this.data.rotation = shape.rotation
      const s = this.board?.factory.rotator.size || 10
      this._ctrl.w = s;
      this._ctrl.h = s;
    }
    this.data.visible = v && !!this.board?.shapeRotatable
    this.endDirty()
  }

  private _listener1 = (e: ShapeEventMap[ShapeEventEnum.EndDirty]) => this._update(e.detail.shape)
  private _listener2 = (e: ShapeEventMap[ShapeEventEnum.BoardChanged]) => this._update(e.detail.shape)

  /**
   * 开始跟随一个图形：听听它的几何变化，把柄摆到它上方
   *
   * Starts following a shape: it listens to the shape's geometry changes and places the
   * grip above it.
   *
   * @param {Shape} shape 要跟随的图形 / The shape to follow
   */
  follow(shape: Shape) {
    this.unfollow()
    shape.addEventListener(ShapeEventEnum.EndDirty, this._listener1);
    shape.addEventListener(ShapeEventEnum.BoardChanged, this._listener2);
    this._update(shape)
    this._target = shape
  }

  /**
   * 停止跟随：解除监听并隐藏旋转柄
   *
   * Stops following: removes the listeners and hides the grip.
   */
  unfollow() {
    this._target?.removeEventListener(ShapeEventEnum.EndDirty, this._listener1)
    this._target?.removeEventListener(ShapeEventEnum.BoardChanged, this._listener2)
    delete this._target
  }

  /**
   * 画旋转柄：圆点 + 连着图形顶边的竖线
   *
   * Draws the grip: the knob plus the stalk that joins it to the shape's top edge.
   *
   * @param {CanvasRenderingContext2D} ctx 画布上下文 / Canvas context
   */
  render(ctx: CanvasRenderingContext2D): void {
    if (!this.visible) return;
    this.beginDraw(ctx)
    const { x, y, w, h } = this._ctrl

    const mx = Math.floor(x + w / 2) - 0.5
    ctx.strokeStyle = "black"
    ctx.fillStyle = "white"
    ctx.lineWidth = 1

    ctx.beginPath();
    ctx.arc(x + w / 2, y + w / 2, w / 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.beginPath();
    ctx.moveTo(mx, y + h)
    ctx.lineTo(mx, this._distance)
    ctx.stroke()
    this.endDraw(ctx)
  }

  /**
   * 按下：命中旋转柄时记下目标的中心（作为旋转中心），返回是否命中
   *
   * Pressed: when the grip is hit it remembers the target's center (the rotation center);
   * it returns whether the grip was hit.
   *
   * @param {IDot} dot 指针位置（画布坐标）/ Pointer position (canvas coordinates)
   * @return {boolean} 是否命中旋转柄 / Whether the grip was hit
   */
  pointerDown(dot: IDot): boolean {
    const ret = this.visible && !!this._target && this.hit(dot)
    if (ret) {
      this._oX = this._target!.midX;
      this._oY = this._target!.midY;
    }
    return ret
  }

  /**
   * 拖动：把图形转到指针方向（柄总是朝上，所以减 90 度）
   *
   * Dragging: turns the shape toward the pointer (the grip always points up, hence the 90
   * degree offset).
   *
   * @param {IDot} dot 指针位置（画布坐标）/ Pointer position (canvas coordinates)
   */
  pointerDraw(dot: IDot): void {
    const dx = this._oX - dot.x;
    const dy = this._oY - dot.y;
    if (Numbers.equals(dx + dy, 0)) return;
    this._target?.rotateTo(Math.atan2(dy, dx) - Math.PI / 2);
  }

  /**
   * 命中判定：指针是否落在旋转柄的圆点上
   *
   * Hit test: whether the pointer lands on the grip's knob.
   *
   * @param {IDot} dot 指针位置（画布坐标）/ Pointer position (canvas coordinates)
   * @return {boolean} 是否命中 / Whether it was hit
   */
  hit(dot: IDot): boolean {
    return this._ctrl.hit(this.map2me(dot.x, dot.y))
  }
}