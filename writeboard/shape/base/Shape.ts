import { Board } from "../../board/Board";
import { IRotatedRect, Numbers, RotatedRect } from "../../utils";
import { IRect } from "../../utils/IRect";
import { IVector } from "../../utils/IVector";
import { Rect } from "../../utils/Rect";
import { Vector } from "../../utils/Vector";
import { isNum } from "../../utils/helper";
import { ShapeType } from "../ShapeEnum";
import { IShapeData } from "./IShapeData";
import { Resizable } from "./Resizable";
import { ShapeData } from "./ShapeData";
import { ShapeEventEnum, ShapeEventListener, ShapeEventMap } from "./ShapeEvent";
const { floor, max, ceil, abs, sin, cos, PI, min } = Math;
/**
 * 一切图形的基类
 *
 * @export
 * @class Shape 图形基类
 * @template D 图形数据类
 */
export class Shape<D extends ShapeData = ShapeData> {
  protected _d: D;
  protected _b?: Board;
  protected _r: Resizable = Resizable.None;

  constructor(data: Partial<D>, cls: new (other?: Partial<D>) => D) {
    this._d = new cls(data);
  }

  /**
   * 图形的数据
   *
   * @readonly
   * @type {D}
   * @memberof Shape
   */
  get data(): D { return this._d as D }

  /**
   * 图形类型
   * 
   * 当图形为内置图形时，值为ShapeEnum，否则为字符串
   *
   * @readonly
   * @see {ShapeEnum}
   * @type {ShapeType}
   * @memberof Shape
   */
  get type(): ShapeType { return this._d.t }

  /**
   * 图形属于哪个黑板
   *
   * @type {(Board | undefined)}
   * @memberof Shape
   */
  get board(): Board | undefined { return this._b }
  set board(v: Board | undefined) {
    if (v === this._b) return;
    const prev = this._b
    this._b = v
    this.dispatchEvent(ShapeEventEnum.BoardChanged, { shape: this, prev })
  }

  /**
   * 图形是否可见，
   * 
   * 当不可见时，图形将在渲染时被忽略
   *
   * @type {boolean}
   * @memberof Shape
   */
  get visible(): boolean { return this._d.visible }
  set visible(v: boolean) {
    if (this._d.visible === v) return
    const prev: Partial<IShapeData> = { b: { v: v ? 0 : (void 0) } }
    this.beginDirty(prev)
    this._d.visible = v
    this.endDirty(prev)
  }

  /**
   * 是否正在编辑中
   * 
   * TODO
   *
   * @type {boolean}
   * @memberof Shape
   */
  get editing(): boolean { return this._d.editing }
  set editing(v: boolean) {
    if (this._d.editing === v) return
    const prev: Partial<IShapeData> = { b: { e: v ? (void 0) : 1 } }
    this.beginDirty(prev)
    this._d.editing = v
    this.endDirty(prev)
  }

  /**
   * 图形是否被选中
   * 
   * 选中图形后，图形将呈现为被选中状态，其他一些对图形的操作均需要选中图形
   *
   * @type {boolean}
   * @memberof Shape
   */
  get selected(): boolean { return this._d.selected }
  set selected(v: boolean) {
    if (this._d.selected === v) return
    const prev: Partial<IShapeData> = { b: { s: v ? (void 0) : 1 } }
    this.beginDirty(prev)
    this._d.selected = v
    this.endDirty(prev)
  }

  /**
   * 图形是否可以被用户修改尺寸
   * 
   * 当不为Resizable.None时，选中的图形将出现控制点，
   * 此时可以点击拖拽控制点来修改图形的尺寸
   *
   * @type {Resizable}
   * @memberof Shape
   */
  get resizable(): Resizable { return this._r; }
  set resizable(v: Resizable) { this._r = v; }

  /**
   * 图形是否被锁定
   * 
   * 被锁定的图形将不能被编辑，选中图形时，选中图形将显示为被锁定
   *
   * @type {boolean}
   * @memberof Shape
   */
  get locked(): boolean { return this._d.locked }
  set locked(v: boolean) {
    if (this._d.locked === v) return
    const prev: Partial<IShapeData> = { b: { f: v ? (void 0) : 1 } }
    this.beginDirty(prev)
    this._d.locked = v
    this.endDirty(prev)
  }

  /**
   * 图形能否交互
   * 
   * 当ghost为true时，只能看见这个图形，而不能选中并与其产生交互。
   * 利用这个属性，可以实现比较特殊的功能，比如：背景图
   *
   * @type {boolean}
   * @memberof Shape
   */
  get ghost(): boolean { return this._d.ghost }
  set ghost(v: boolean) {
    if (this._d.ghost === v) return
    const prev: Partial<IShapeData> = { b: { g: v ? (void 0) : 1 } }
    this.beginDirty(prev)
    this._d.ghost = v
    this.endDirty(prev)
  }

  /**
   * 图形描边宽度
   * 若图形不存在描边，则为0
   *
   * @type {number}
   * @memberof Shape
   */
  get lineWidth(): number { return this._d.lineWidth }
  set lineWidth(v: number) {
    if (!this._d.needStroke) { return; }
    const prev: Partial<IShapeData> = { a: { g: this._d.lineWidth } }
    this.beginDirty(prev)
    this._d.lineWidth = max(0, v);
    this.endDirty(prev)
  }

  set groupId(v: string | undefined | null) { this._d.groupId = v }
  get groupId(): string { return this._d.groupId }

  merge(data: Partial<IShapeData>): void {
    const prev = this.data.copy()
    this.beginDirty(prev)
    this.data.merge(data)
    this.endDirty(prev)
  }

  beginDirty(prev?: Partial<IShapeData>): void {
    this.dispatchEvent(ShapeEventEnum.StartDirty, { shape: this, prev })
    this.markDirty()
  }

  endDirty(prev?: Partial<IShapeData>): void {
    this.markDirty()
    this.dispatchEvent(ShapeEventEnum.EndDirty, { shape: this, prev })
  }

  markDirty(rect: IRect = this.aabb()): void {
    this.board?.markDirty(rect)
  }

  /**
   * 移动图形
   * 
   * @param x x坐标
   * @param y y坐标
   * @returns void
   */
  move(x: number, y: number, dirty: boolean = true): this {
    return this.geo(x, y, this._d.w, this._d.h, dirty)
  }
  resize(w: number, h: number, dirty: boolean = true): this {
    return this.geo(this._d.x, this._d.y, w, h, dirty)
  }
  set midX(v: number) {
    this.beginDirty()
    this._d.midX = v
    this.endDirty()
  }
  set midY(v: number) {
    this.beginDirty()
    this._d.midY = v
    this.endDirty()
  }

  get x() { return this._d.x }
  get y() { return this._d.y }
  get halfW() { return this._d.halfW }
  get halfH() { return this._d.halfH }
  get midX() { return this._d.midX }
  get midY() { return this._d.midY }
  get w() { return this._d.w }
  get h() { return this._d.h }
  get left() { return this._d.x }
  get top() { return this._d.y }
  get right() { return this._d.w + this._d.x }
  get bottom() { return this._d.h + this._d.y }

  get topLeft(): IVector { return { x: this.left, y: this.top } }
  get bottomLeft(): IVector { return { x: this.left, y: this.bottom } }
  get topRight(): IVector { return { x: this.right, y: this.top } }
  get bottomRight(): IVector { return { x: this.right, y: this.bottom } }
  get leftTop(): IVector { return this.topLeft }
  get leftBottom(): IVector { return this.bottomLeft }
  get rightTop(): IVector { return this.topRight }
  get rightBottom(): IVector { return this.bottomRight }

  get midTop(): IVector { return { x: this.midX, y: this.top } }
  get midBottom(): IVector { return { x: this.midX, y: this.bottom } }
  get midLeft(): IVector { return { x: this.left, y: this.midY } }
  get midRight(): IVector { return { x: this.right, y: this.midY } }

  get rotatedTopLeft(): IVector { return this.map2world(0, 0) }
  get rotatedBottomLeft(): IVector { return this.map2world(0, this.h) }
  get rotatedTopRight(): IVector { return this.map2world(this.w, 0) }
  get rotatedBottomRight(): IVector { return this.map2world(this.w, this.h) }
  get rotatedLeftTop(): IVector { return this.map2world(0, 0) }
  get rotatedLeftBottom(): IVector { return this.map2world(0, this.h) }
  get rotatedRightTop(): IVector { return this.map2world(this.w, 0) }
  get rotatedRightBottom(): IVector { return this.map2world(this.w, this.h) }
  get rotatedMidTop(): IVector { return this.map2world(this.halfW, 0) }
  get rotatedMidBottom(): IVector { return this.map2world(this.halfW, this.h) }
  get rotatedMidLeft(): IVector { return this.map2world(0, this.halfH) }
  get rotatedMidRight(): IVector { return this.map2world(this.w, this.halfH) }
  get rotatedMid(): IVector { return this.map2world(this.halfW, this.halfH) }

  get rotation() { return this.data.rotation }
  getRotatedDot(which: Resizable) {
    switch (which) {
      case Resizable.TopLeft: return this.rotatedTopLeft;
      case Resizable.Top: return this.rotatedMidTop;
      case Resizable.TopRight: return this.rotatedTopRight;
      case Resizable.Right: return this.rotatedMidRight;
      case Resizable.BottomRight: return this.rotatedBottomRight
      case Resizable.Bottom: return this.rotatedMidBottom;
      case Resizable.BottomLeft: return this.rotatedBottomLeft;
      case Resizable.Left: return this.rotatedMidLeft;
      case Resizable.None:
      case Resizable.Horizontal:
      case Resizable.Vertical:
      case Resizable.Corner:
      case Resizable.All:
        return { x: NaN, y: NaN }
    }
  }

  rotateBy(d: number, x?: number, y?: number): void {
    const r = this._d.rotation + d
    this.rotateTo(r, x, y);
  }

  rotateTo(r: number, x?: number, y?: number): void {
    if (r == this._d.rotation) return;
    const old_rotation = this._d.r
    const prev: Partial<IShapeData> = { x: this._d.x, y: this._d.y, r: old_rotation }
    this.beginDirty(prev)
    this._d.rotation = r % (PI * 2);
    if (Numbers.isVaild(x) && Numbers.isVaild(y)) {
      const m = Vector.rotated2(this.midX, this.midY, x, y, this.rotation - (old_rotation || 0))
      this._d.x = m.x - this.w / 2
      this._d.y = m.y - this.h / 2
    }
    this.endDirty(prev)
  }


  getGeo(): Rect {
    return new Rect(
      this._d.x,
      this._d.y,
      this._d.w,
      this._d.h
    )
  }
  setGeo(rect: Rect, dirty: boolean = true): this {
    return this.geo(rect.x, rect.y, rect.w, rect.h, dirty)
  }

  geo(x: number, y: number, w: number, h: number, dirty: boolean = true): this {
    if (
      x === this._d.x &&
      y === this._d.y &&
      w === this._d.w &&
      h === this._d.h
    ) return this;
    if (!dirty) {
      this._d.x = x
      this._d.y = y
      this._d.w = w
      this._d.h = h
      return this;
    }
    const prev: Partial<IShapeData> = {
      x: this._d.x, y: this._d.y,
      w: this._d.w, h: this._d.h
    }
    this.beginDirty(prev)
    this._d.x = x
    this._d.y = y
    this._d.w = w
    this._d.h = h
    this.endDirty(prev)
    return this
  }

  moveBy(x: number, y: number, dirty: boolean = true): this {
    return this.geo(
      this._d.x + x,
      this._d.y + y,
      this._d.w,
      this._d.h,
      dirty
    )
  }

  resizeBy(w: number, h: number, dirty: boolean = true): this {
    return this.geo(
      this._d.x,
      this._d.y,
      this._d.w + w,
      this._d.h + h,
      dirty
    )
  }

  geoBy(x: number, y: number, w: number, h: number, dirty: boolean = true): this {
    return this.geo(
      this._d.x + x,
      this._d.y + y,
      this._d.w + w,
      this._d.h + h,
      dirty
    )
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.visible) return
    const decoration = this.board?.factory.shapeDecoration(this)
    const { ghost, locked, resizable, selected } = this;
    this.beginDraw(ctx)
    ghost && decoration?.ghost?.(this, ctx)
    selected && locked && decoration?.locked?.(this, ctx)
    selected && !locked && decoration?.selected?.(this, ctx)
    selected && !locked && resizable && decoration?.resizable?.(this, ctx)
    this.endDraw(ctx)
    decoration?.debug?.(this, ctx)
  }


  /**
   * 绘制矩形
   * 
   * @returns 
   */
  drawingRect(): IRect {
    const d = this._d
    return {
      x: 0,
      y: 0,
      w: floor(d.w),
      h: floor(d.h)
    }
  }

  selectorRect(): IRect {
    const { w, h, locked, lineWidth } = this.data
    const hlw = floor(lineWidth / 2)
    const offset = locked ? 0 : 0.5
    return {
      x: offset - hlw,
      y: offset - hlw,
      w: floor(w + hlw * 2) - 1,
      h: floor(h + hlw * 2) - 1
    }
  }


  /** @deprecated */ boundingRect = () => this.aabb()

  /**
   * 获取AABB包围盒
   * 
   * 包围盒矩形的数据均为整数。
   * 
   * 脏区域会根据包围盒矩形的来运算
   *
   * @return {IRect} 包围盒矩形
   * @memberof Shape
   */
  aabb(): IRect {
    const d = this.data
    const offset = (d.lineWidth % 2) ? 1 : 0
    const overbound1 = this.board?.factory.overbound(this) || 1
    const overbound2 = overbound1 * 2
    const rr = {
      x: floor(d.x - d.lineWidth / 2 - overbound1),
      y: floor(d.y - d.lineWidth / 2 - overbound1),
      w: ceil(d.w + d.lineWidth + offset + overbound2),
      h: ceil(d.h + d.lineWidth + offset + overbound2),
      r: d.r,
    }
    if (!d.r) return rr
    const { dots } = RotatedRect.create(rr)
    let x = rr.x;
    let y = rr.y;
    let r = rr.x + rr.w;
    let b = rr.y + rr.h;
    for (const dot of dots) {
      x = min(x, floor(dot.x))
      y = min(y, floor(dot.y))
      r = max(r, ceil(dot.x))
      b = max(b, ceil(dot.y))
    }
    return { x, y, w: r - x, h: b - y }
  }
  obb(): IRotatedRect {
    const lw = this.lineWidth;
    const x = this.x - lw / 2;
    const y = this.y - lw / 2;
    const w = this.w + lw;
    const h = this.h + lw;
    return { x, y, w, h, r: this.rotation }
  }
  getResizerNumbers(x: number, y: number, w: number, h: number) {
    const lw = 1
    const hlw = lw / 2
    const s = this._b?.factory.resizer.size || 10;
    return {
      s,
      lx: x,
      rx: x + w - s,
      ty: y,
      by: y + h - s,
      mx: floor(x + (w - s) / 2) - hlw,
      my: floor(y + (h - s) / 2) - hlw,
    }
  }

  /**
   * 世界坐标系坐标　转换　本图坐标系坐标
   * @param x 世界坐标系X坐标
   * @param y 世界坐标系Y坐标
   * @returns 本图坐标系 坐标
   */
  map2me(x: number, y: number): Vector;

  /**
   * 世界坐标系坐标　转换　本图坐标系坐标
   * @param v 世界坐标系坐标
   * @returns 本图坐标系 坐标
   */
  map2me(v: IVector): Vector;

  map2me(arg0: number | IVector, arg1?: number): Vector {
    const ix = isNum(arg0) ? arg0 : arg0.x
    const iy = isNum(arg0) ? arg1! : arg0.y
    const { r, x, y } = this.data
    if (!r) return new Vector(ix - x, iy - y)
    const mx = this.midX
    const my = this.midY
    const cr = cos(-r)
    const sr = sin(-r)
    const dx = ix - mx
    const dy = iy - my
    return new Vector(
      dx * cr - dy * sr + mx - x,
      dx * sr + dy * cr + my - y
    )
  }

  /**
   * 本图坐标系坐标 转换 世界坐标系坐标
   * @param x 本图坐标系X坐标
   * @param y 本图坐标系Y坐标
   * @returns 世界坐标系坐标
   */
  map2world(x: number, y: number): Vector;

  /**
   * 本图坐标系坐标 转换 世界坐标系坐标 
   * @param v 本图坐标系坐标
   * @returns 世界坐标系坐标
   */
  map2world(v: IVector): Vector;
  map2world(arg0: number | IVector, arg1?: number): IVector {
    const ix = isNum(arg0) ? arg0 : arg0.x
    const iy = isNum(arg0) ? arg1! : arg0.y
    const { r, x, y, w, h } = this.data
    if (!r) return { x: ix + x, y: iy + y }
    const mx = w / 2
    const my = h / 2
    const cr = cos(r)
    const sr = sin(r)
    const dx = ix - mx
    const dy = iy - my
    return {
      x: dx * cr - dy * sr + mx + x,
      y: dx * sr + dy * cr + my + y
    }
  }
  resizableDirection(pointerX: number, pointerY: number): [Resizable, Rect | undefined] {
    if (!this.selected || !this._r || this.ghost || this.locked || !this.board?.shapeResizble) {
      return [Resizable.None, undefined];
    }

    const { x: l, y: t } = this.data
    const { x, y, w, h } = this.selectorRect();
    const { s, lx, rx, ty, by, mx, my } = this.getResizerNumbers(l + x, t + y, w, h)

    const pos = this.map2me(pointerX, pointerY).plus(this)
    const rect = new Rect(0, 0, s, s);

    if (this.resizable & Resizable.Top) {
      rect.moveTo(mx, ty)
      if (rect.hit(pos)) return [Resizable.Top, rect];
    }
    if (this.resizable & Resizable.Bottom) {
      rect.moveTo(mx, by);
      if (rect.hit(pos)) return [Resizable.Bottom, rect];
    }

    if (this.resizable & Resizable.Left) {
      rect.moveTo(lx, my);
      if (rect.hit(pos)) return [Resizable.Left, rect];
    }
    if (this.resizable & Resizable.Right) {
      rect.moveTo(rx, my);
      if (rect.hit(pos)) return [Resizable.Right, rect];
    }
    if (this.resizable & Resizable.TopLeft) {
      rect.moveTo(lx, ty)
      if (rect.hit(pos)) return [Resizable.TopLeft, rect];
    }
    if (this.resizable & Resizable.TopRight) {
      rect.moveTo(rx, ty);
      if (rect.hit(pos)) return [Resizable.TopRight, rect];
    }
    if (this.resizable & Resizable.BottomLeft) {
      rect.moveTo(lx, by);
      if (rect.hit(pos)) return [Resizable.BottomLeft, rect];
    }
    if (this.resizable & Resizable.BottomRight) {
      rect.moveTo(rx, by);
      if (rect.hit(pos)) return [Resizable.BottomRight, rect];
    }
    return [Resizable.None, undefined]
  }

  protected beginDraw(ctx: CanvasRenderingContext2D): void {
    let { x, y, w, h, r, c, d } = this.data
    ctx.save()
    x = floor(x)
    y = floor(y)
    const hw = floor(w / 2)
    const hh = floor(h / 2)
    if (r || c || d) {
      ctx.translate(x + hw, y + hh)
      r && ctx.rotate(r);
      (c || d) && ctx.scale(c ?? 1, d ?? 1)
      ctx.translate(- hw, - hh)
    } else {
      ctx.translate(x, y)
    }
  }
  protected endDraw(ctx: CanvasRenderingContext2D): void {
    ctx.restore()
  }

  private _ele: HTMLElement | undefined;
  private _relCount: number = 0;

  addEventListener<K extends keyof ShapeEventMap>(type: K, listener: ShapeEventListener<K>, options?: boolean | AddEventListenerOptions): this
  addEventListener(arg0: any, arg1: any, arg2?: any): this {
    this._ele = this._ele || document.createElement('a')
    this._ele.addEventListener(arg0, arg1, arg2)
    if (!arg2?.once) this._relCount++
    return this
  }

  removeEventListener<K extends keyof ShapeEventMap>(type: K, listener: ShapeEventListener<K>, options?: boolean | AddEventListenerOptions): this
  removeEventListener(arg0: any, arg1: any, arg2?: any): this {
    this._ele?.removeEventListener(arg0, arg1, arg2)
    return this
  }

  dispatchEvent<K extends keyof ShapeEventMap>(type: K, detail: ShapeEventMap[K]['detail']): this {
    this._ele?.dispatchEvent(new CustomEvent(type, { detail }))
    return this
  }
}