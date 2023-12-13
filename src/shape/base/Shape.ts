import { Board } from "../../board/Board";
import { IRect, Rect } from "../../utils/Rect";
import { IVector, Vector } from "../../utils/Vector";
import { isNum } from "../../utils/helper";
import { ShapeEnum, ShapeType } from "../ShapeEnum";
import { IShapeData, ShapeData } from "./Data";
export enum ResizeDirection {
  None = 0,
  Top = 1,
  TopRight = 2,
  Right = 3,
  BottomRight = 4,
  Bottom = 5,
  BottomLeft = 6,
  Left = 7,
  TopLeft = 8,
}

export enum ShapeEventEnum {
  StartDirty = 'start_dirty',
  EndDirty = 'end_dirty',
}

export interface ShapeEventMap {
  [ShapeEventEnum.StartDirty]: CustomEvent<{ shape: Shape, prev?: Partial<IShapeData> }>;
  [ShapeEventEnum.EndDirty]: CustomEvent<{ shape: Shape, prev?: Partial<IShapeData> }>;
}

export type ShapeEventListener<K extends keyof ShapeEventMap> = (this: HTMLObjectElement, ev: ShapeEventMap[K]) => any

/**
 * 表示图形能以何种方式被拉伸
 *
 * @export
 * @enum {number}
 */
export enum Resizable {
  /**
   * 图形不能被拉伸
   */
  None = 0,

  /**
   * 八方向拉伸
   */
  All = 1,
}

/**
 * 一切图形的基类
 *
 * @export
 * @class Shape 图形基类
 * @template D 图形数据类
 */
export class Shape<D extends ShapeData = ShapeData> {
  private _data: D;
  private _board?: Board;
  protected _resizable: Resizable = Resizable.None;
  constructor(data: D) {
    this._data = data
  }

  /**
   * 图形的数据
   *
   * @readonly
   * @type {D}
   * @memberof Shape
   */
  get data(): D { return this._data as D }

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
  get type(): ShapeType { return this._data.type }

  /**
   * 图形属于哪个黑板
   *
   * @type {(Board | undefined)}
   * @memberof Shape
   */
  get board(): Board | undefined { return this._board }
  set board(v: Board | undefined) { this._board = v }

  /**
   * 图形是否可见，
   * 
   * 当不可见时，图形将在渲染时被忽略
   *
   * @type {boolean}
   * @memberof Shape
   */
  get visible(): boolean { return !!this._data.visible }
  set visible(v: boolean) {
    if (!!this._data.visible === v) return
    const prev: Partial<IShapeData> = { status: { v: v ? 0 : 1 } }
    this.beginDirty(prev)
    this._data.visible = v
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
  get editing(): boolean { return !!this._data.editing }
  set editing(v: boolean) {
    if (this._data.editing === v) return
    const prev: Partial<IShapeData> = { status: { e: v ? 0 : 1 } }
    this.beginDirty(prev)
    this._data.editing = v
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
  get selected(): boolean { return !!this._data.selected }
  set selected(v: boolean) {
    if (this._data.selected === v) return
    const prev: Partial<IShapeData> = { status: { s: v ? 0 : 1 } }
    this.beginDirty(prev)
    this._data.selected = v
    this.endDirty(prev)
  }

  /**
   * 图形是否可以被用户修改尺寸
   * 
   * 当不为Resizable.None时，选中的图形将出现控制点，
   * 此时可以点击拖拽控制点来修改图形的尺寸
   *
   * @readonly
   * @type {Resizable}
   * @memberof Shape
   */
  get resizable(): Resizable { return this._resizable; }

  /**
   * 图形是否被锁定
   * 
   * 被锁定的图形将不能被编辑，选中图形时，选中图形将显示为被锁定
   *
   * @type {boolean}
   * @memberof Shape
   */
  get locked(): boolean { return this._data.locked }
  set locked(v: boolean) {
    if (this._data.locked === v) return
    const prev: Partial<IShapeData> = { status: { f: v ? 0 : 1 } }
    this.beginDirty(prev)
    this._data.locked = v
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
  get ghost(): boolean { return this._data.ghost }
  set ghost(v: boolean) {
    if (this._data.ghost === v) return
    const prev: Partial<IShapeData> = { status: { g: v ? 0 : 1 } }
    this.beginDirty(prev)
    this._data.ghost = v
    this.endDirty(prev)
  }

  /**
   * 图形描边宽度
   * 若图形不存在描边，则为0
   *
   * @type {number}
   * @memberof Shape
   */
  get lineWidth(): number { return this._data.lineWidth }
  set lineWidth(v: number) {
    if (!this._data.needStroke) { return; }
    const prev: Partial<IShapeData> = { style: { g: this._data.lineWidth } }
    this.beginDirty(prev)
    this._data.lineWidth = Math.max(0, v);
    this.endDirty(prev)
  }

  merge(data: Partial<ShapeData>): void {
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

  private markDirty(rect: IRect = this.boundingRect()): void {
    this.board?.markDirty(rect)
  }

  /**
   * 移动图形
   * 
   * @param x x坐标
   * @param y y坐标
   * @returns void
   */
  move(x: number, y: number): void {
    this.geo(x, y, this._data.w, this._data.h)
  }

  resize(w: number, h: number): void {
    this.geo(this._data.x, this._data.y, w, h)
  }

  get x() { return this._data.x }
  get y() { return this._data.y }
  get halfW() { return this._data.w / 2 }
  get halfH() { return this._data.h / 2 }
  get midX() { return this._data.x + this.halfW }
  get midY() { return this._data.y + this.halfH }
  get w() { return this._data.w }
  get h() { return this._data.h }
  get left() { return this._data.x }
  get right() { return this._data.y }
  get top() { return this._data.w + this._data.x }
  get bottom() { return this._data.h + this._data.y }

  get topLeft(): IVector { return { x: this.left, y: this.top } }
  get bottomLeft(): IVector { return { x: this.left, y: this.bottom } }
  get topRight(): IVector { return { x: this.right, y: this.top } }
  get bottomRight(): IVector { return { x: this.right, y: this.bottom } }
  get leftTop(): IVector { return this.topLeft }
  get leftBottom(): IVector { return this.bottomLeft }
  get rightTop(): IVector { return this.topRight }
  get rightBottom(): IVector { return this.bottomRight }

  get rotatedTopLeft(): IVector { return this.map2world(0, 0) }
  get rotatedBottomLeft(): IVector { return this.map2world(0, this.h) }
  get rotatedTopRight(): IVector { return this.map2world(this.w, 0) }
  get rotatedBottomRight(): IVector { return this.map2world(this.w, this.h) }
  get rotatedLeftTop(): IVector { return this.map2world(0, 0) }
  get rotatedLeftBottom(): IVector { return this.map2world(0, this.h) }
  get rotatedRightTop(): IVector { return this.map2world(this.w, 0) }
  get rotatedRightBottom(): IVector { return this.map2world(this.w, this.h) }

  get midTop(): IVector { return { x: this.midX, y: this.top } }
  get midBottom(): IVector { return { x: this.midX, y: this.bottom } }
  get midLeft(): IVector { return { x: this.left, y: this.midY } }
  get midRight(): IVector { return { x: this.right, y: this.midY } }

  get rotatedMidTop(): IVector { return this.map2world(this.halfW, 0) }
  get rotatedMidBottom(): IVector { return this.map2world(this.halfW, this.h) }
  get rotatedMidLeft(): IVector { return this.map2world(0, this.halfH) }
  get rotatedMidRight(): IVector { return this.map2world(this.w, this.halfH) }
  get rotatedMid(): IVector { return this.map2world(this.halfW, this.halfH) }

  get rotation() { return this.data.rotation }

  rotateBy(d: number, ox: number | undefined = void 0, oy: number | undefined = void 0): void {
    const r = this._data.rotation + d
    this.rotateTo(r, ox, oy);
  }

  rotateTo(r: number, ox: number | undefined = void 0, oy: number | undefined = void 0): void {
    if (r == this._data.rotation) return

    const prev: Partial<IShapeData> = { x: this._data.x, y: this._data.y, r: this._data.r }
    this.beginDirty(prev)
    const { w, h, midX: mx, midY: my } = this;
    ox = ox ?? mx;
    oy = oy ?? my;
    const mx1 = (mx - ox) * Math.cos(r) - (my - oy) * Math.sin(r) + ox;
    const my1 = (mx - ox) * Math.sin(r) + (my - oy) * Math.cos(r) + oy;
    this._data.x = mx1 - w / 2
    this._data.y = my1 - h / 2
    this._data.rotation = r % (Math.PI * 2);
    this.endDirty(prev)
  }

  getGeo(): Rect {
    return new Rect(
      this._data.x,
      this._data.y,
      this._data.w,
      this._data.h
    )
  }
  setGeo(rect: Rect): void {
    this.geo(rect.x, rect.y, rect.w, rect.h)
  }

  geo(x: number, y: number, w: number, h: number): void {
    if (
      x === this._data.x &&
      y === this._data.y &&
      w === this._data.w &&
      h === this._data.h
    ) return
    const prev: Partial<IShapeData> = {
      x: this._data.x, y: this._data.y,
      w: this._data.w, h: this._data.h
    }
    this.beginDirty(prev)
    this._data.x = x
    this._data.y = y
    this._data.w = w
    this._data.h = h
    this.endDirty(prev)
  }

  moveBy(x: number, y: number): void {
    this.geo(
      this._data.x + x,
      this._data.y + y,
      this._data.w,
      this._data.h
    )
  }

  resizeBy(w: number, h: number): void {
    this.geo(
      this._data.x,
      this._data.y,
      this._data.w + w,
      this._data.h + h
    )
  }

  geoBy(x: number, y: number, w: number, h: number): void {
    this.geo(
      this._data.x + x,
      this._data.y + y,
      this._data.w + w,
      this._data.h + h
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
    const d = this._data
    return {
      x: 0,
      y: 0,
      w: Math.floor(d.w),
      h: Math.floor(d.h)
    }
  }

  selectorRect(): IRect {
    const { w, h, locked, lineWidth } = this.data
    const hlw = Math.floor(lineWidth / 2)
    const offset = locked ? 0 : 0.5
    return {
      x: offset - hlw,
      y: offset - hlw,
      w: Math.floor(w + hlw * 2) - 1,
      h: Math.floor(h + hlw * 2) - 1
    }
  }

  /**
   * 获取包围盒矩形
   *
   * @return {IRect} 包围盒矩形
   * @memberof Shape
   */
  boundingRect(): IRect {
    const d = this.data
    const offset = (d.lineWidth % 2) ? 1 : 0
    const overbound1 = this.board?.factory.overbound(this) || 1
    const overbound2 = overbound1 * 2
    if (!d.r)
      return {
        x: Math.floor(d.x - d.lineWidth / 2 - overbound1),
        y: Math.floor(d.y - d.lineWidth / 2 - overbound1),
        w: Math.ceil(d.w + d.lineWidth + offset + overbound2),
        h: Math.ceil(d.h + d.lineWidth + offset + overbound2)
      }

    const w = Math.abs(d.w * Math.cos(d.r)) + Math.abs(d.h * Math.sin(d.r))
    const h = Math.abs(d.w * Math.sin(d.r)) + Math.abs(d.h * Math.cos(d.r))
    const x = d.x - (w - d.w) / 2
    const y = d.y - (h - d.h) / 2
    return {
      x: Math.floor(x - d.lineWidth / 2 - overbound1),
      y: Math.floor(y - d.lineWidth / 2 - overbound1),
      w: Math.ceil(w + d.lineWidth + offset + overbound2),
      h: Math.ceil(h + d.lineWidth + offset + overbound2)
    }
  }

  getResizerNumbers(x: number, y: number, w: number, h: number) {
    const lw = 1
    const hlw = lw / 2
    const s = this._board?.factory.resizer.size || 10;
    return {
      s,
      lx: x,
      rx: x + w - s,
      ty: y,
      by: y + h - s,
      mx: Math.floor(x + (w - s) / 2) - hlw,
      my: Math.floor(y + (h - s) / 2) - hlw,
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
    const cr = Math.cos(-r)
    const sr = Math.sin(-r)
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
    const cr = Math.cos(r)
    const sr = Math.sin(r)
    const dx = ix - mx
    const dy = iy - my
    return {
      x: dx * cr - dy * sr + mx + x,
      y: dx * sr + dy * cr + my + y
    }
  }
  resizeDirection(pointerX: number, pointerY: number): [ResizeDirection, Rect | undefined] {
    if (!this.selected || !this._resizable || this.ghost || this.locked) {
      return [ResizeDirection.None, undefined];
    }
    const { x: l, y: t } = this.data
    const { x, y, w, h } = this.selectorRect();
    const { s, lx, rx, ty, by, mx, my } = this.getResizerNumbers(l + x, t + y, w, h)

    const pos = { x: pointerX, y: pointerY }
    const rect = new Rect(0, 0, s, s);

    rect.moveTo(mx, ty)
    if (rect.hit(pos)) {
      return [ResizeDirection.Top, rect];
    }
    rect.moveTo(mx, by);
    if (rect.hit(pos)) {
      return [ResizeDirection.Bottom, rect];
    }
    rect.moveTo(lx, my);
    if (rect.hit(pos)) {
      return [ResizeDirection.Left, rect];
    }
    rect.moveTo(rx, my);
    if (rect.hit(pos)) {
      return [ResizeDirection.Right, rect];
    }

    rect.moveTo(lx, ty)
    if (rect.hit(pos)) {
      return [ResizeDirection.TopLeft, rect];
    }
    rect.moveTo(rx, ty);
    if (rect.hit(pos)) {
      return [ResizeDirection.TopRight, rect];
    }
    rect.moveTo(lx, by);
    if (rect.hit(pos)) {
      return [ResizeDirection.BottomLeft, rect];
    }
    rect.moveTo(rx, by);
    if (rect.hit(pos)) {
      return [ResizeDirection.BottomRight, rect];
    }
    return [ResizeDirection.None, undefined]
  }

  protected beginDraw(ctx: CanvasRenderingContext2D): void {
    let { x, y, w, h, rotation } = this.data
    ctx.save()
    x = Math.floor(x)
    y = Math.floor(y)
    const hw = Math.floor(w / 2)
    const hh = Math.floor(h / 2)
    if (rotation) {
      ctx.translate(x + hw, y + hh)
      ctx.rotate(rotation)
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