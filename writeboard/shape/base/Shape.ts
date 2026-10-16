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
 * Base class of every shape.
 *
 * @export
 * @class Shape 图形基类
 * @template D 图形数据类
 */
export class Shape<D extends ShapeData = ShapeData> {
  protected _d: D;
  protected _b?: Board;
  protected _r: Resizable = Resizable.None;

  /**
   * 建一个图形，数据由数据类自己读入
   *
   * Builds a shape; the data class reads the given data itself.
   *
   * @param {Partial<D>} data 图形数据 / Shape data
   * @param {new (other?: Partial<D>) => D} cls 图形数据类 / Shape data class
   */
  constructor(data: Partial<D>, cls: new (other?: Partial<D>) => D) {
    this._d = new cls(data);
  }

  /**
   * 图形的数据
   *
   * The shape data.
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
   * Shape type. A ShapeEnum value for the built-in shapes, a string for custom ones.
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
   * The board this shape belongs to, undefined while it is not on a board.
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
   * Whether the shape is visible; an invisible shape is skipped while rendering.
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
   * Whether the shape is being edited.
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
   * Whether the shape is selected; a selected shape is drawn as selected, and several
   * operations only work on selected shapes.
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
   * Whether the user may resize the shape; when it is not Resizable.None, a selected shape
   * shows its handles and the size follows the dragged handle.
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
   * Whether the shape is locked; a locked shape cannot be edited and is drawn as locked
   * while it is selected.
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
   * Whether the shape can be interacted with; while ghost is true the shape is only
   * visible and can neither be selected nor touched, which is handy for things like a
   * background image.
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
   * Width of the shape stroke, 0 while the shape has no stroke.
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

  /**
   * 所属编组的 id，未编组时为空串（改动后会通知黑板重新整理编组）
   *
   * Id of the group this shape belongs to, an empty string while it is not grouped; the
   * board is asked to rebuild the groups after a change.
   */
  set groupId(v: string) {
    if (this._d.groupId === v) return;
    this._d.groupId = v;
    this.board?.update_items_group([this]);
  }
  get groupId(): string { return this._d.groupId }

  /**
   * 合并一份图形数据：按数据类自己的合并语义落地，并修正悬空的图层 id
   *
   * Merges a piece of shape data: the merge semantics of the data class apply, and a
   * dangling layer id is remapped.
   *
   * @param {Partial<IShapeData>} data 要合并的数据 / The data to merge
   */
  merge(data: Partial<IShapeData>): void {
    const prev = this.data.copy()
    this.beginDirty(prev)
    this.data.merge(data)
    const board = this._b
    const l = this._d.l
    if (board && (!l || !board.layer(l))) this._d.l = board.layer()?.id
    this.endDirty(prev)
  }

  /**
   * 标记「改动开始」：先派发事件再标脏，prev 是改动前的数据快照
   *
   * Marks the beginning of a change: the event is dispatched before the dirty area is
   * marked, and prev is a snapshot of the data before the change.
   *
   * @param {Partial<IShapeData>} [prev] 改动前的数据 / The data before the change
   */
  beginDirty(prev?: Partial<IShapeData>): void {
    this.dispatchEvent(ShapeEventEnum.StartDirty, { shape: this, prev })
    this.markDirty()
  }

  /**
   * 标记「改动结束」：先标脏再派发事件，prev 是改动前的数据快照
   *
   * Marks the end of a change: the dirty area is marked before the event is dispatched, and
   * prev is a snapshot of the data before the change.
   *
   * @param {Partial<IShapeData>} [prev] 改动前的数据 / The data before the change
   */
  endDirty(prev?: Partial<IShapeData>): void {
    this.markDirty()
    this.dispatchEvent(ShapeEventEnum.EndDirty, { shape: this, prev })
  }

  /**
   * 标脏一块区域：不传则用图形自己的 AABB 包围盒
   *
   * Marks a rectangle dirty; the AABB of the shape is used while none is given.
   *
   * @param {IRect} [rect] 脏区（世界坐标）/ The dirty rectangle (world space)
   */
  markDirty(rect: IRect = this.aabb()): void {
    this.board?.markDirty(rect)
  }

  /**
   * 移动图形
   * 
   * Moves the shape to the given position, keeping its size.
   *
   * @param x x坐标 / x coordinate
   * @param y y坐标 / y coordinate
   * @param {boolean} [dirty=true] 是否标脏 / Whether to mark the dirty area
   * @returns void
   */
  move(x: number, y: number, dirty: boolean = true): this {
    return this.geo(x, y, this._d.w, this._d.h, dirty)
  }
  /**
   * 改图形尺寸：位置不变
   *
   * Resizes the shape without moving it.
   *
   * @param {number} w 宽度 / Width
   * @param {number} h 高度 / Height
   * @param {boolean} [dirty=true] 是否标脏 / Whether to mark the dirty area
   * @return {this} 本对象（便于链式调用）/ This instance (chainable)
   */
  resize(w: number, h: number, dirty: boolean = true): this {
    return this.geo(this._d.x, this._d.y, w, h, dirty)
  }
  /**
   * 设置中心的 x 坐标（尺寸不变，只挪位置）
   *
   * Sets the center x (the size is kept, only the position moves).
   */
  set midX(v: number) {
    this.beginDirty()
    this._d.midX = v
    this.endDirty()
  }
  /**
   * 设置中心的 y 坐标（尺寸不变，只挪位置）
   *
   * Sets the center y (the size is kept, only the position moves).
   */
  set midY(v: number) {
    this.beginDirty()
    this._d.midY = v
    this.endDirty()
  }

  /**
   * 左上角世界坐标 x
   *
   * World x of the top left corner.
   */
  get x() { return this._d.x }
  /**
   * 左上角世界坐标 y
   *
   * World y of the top left corner.
   */
  get y() { return this._d.y }
  /**
   * 图层内层级
   *
   * Order inside the layer.
   */
  get z() { return this._d.z }
  /**
   * 宽度的一半
   *
   * Half of the width.
   */
  get halfW() { return this._d.halfW }
  /**
   * 高度的一半
   *
   * Half of the height.
   */
  get halfH() { return this._d.halfH }
  /**
   * 中心的 x 坐标
   *
   * Center x.
   */
  get midX() { return this._d.midX }
  /**
   * 中心的 y 坐标
   *
   * Center y.
   */
  get midY() { return this._d.midY }
  /**
   * 宽度
   *
   * Width.
   */
  get w() { return this._d.w }
  /**
   * 高度
   *
   * Height.
   */
  get h() { return this._d.h }
  /**
   * 左边（与 x 相同）
   *
   * Left edge (same as x).
   */
  get left() { return this._d.x }
  /**
   * 上边（与 y 相同）
   *
   * Top edge (same as y).
   */
  get top() { return this._d.y }
  /**
   * 右边（x + w）
   *
   * Right edge (x + w).
   */
  get right() { return this._d.w + this._d.x }
  /**
   * 下边（y + h）
   *
   * Bottom edge (y + h).
   */
  get bottom() { return this._d.h + this._d.y }

  /**
   * 左上角（未旋转）
   *
   * Top left corner (unrotated).
   */
  get topLeft(): IVector { return { x: this.left, y: this.top } }
  /**
   * 左下角（未旋转）
   *
   * Bottom left corner (unrotated).
   */
  get bottomLeft(): IVector { return { x: this.left, y: this.bottom } }
  /**
   * 右上角（未旋转）
   *
   * Top right corner (unrotated).
   */
  get topRight(): IVector { return { x: this.right, y: this.top } }
  /**
   * 右下角（未旋转）
   *
   * Bottom right corner (unrotated).
   */
  get bottomRight(): IVector { return { x: this.right, y: this.bottom } }
  /**
   * 左上角，与 topLeft 相同（旧名字）
   *
   * Top left corner, the same as topLeft (old name).
   */
  get leftTop(): IVector { return this.topLeft }
  /**
   * 左下角，与 bottomLeft 相同（旧名字）
   *
   * Bottom left corner, the same as bottomLeft (old name).
   */
  get leftBottom(): IVector { return this.bottomLeft }
  /**
   * 右上角，与 topRight 相同（旧名字）
   *
   * Top right corner, the same as topRight (old name).
   */
  get rightTop(): IVector { return this.topRight }
  /**
   * 右下角，与 bottomRight 相同（旧名字）
   *
   * Bottom right corner, the same as bottomRight (old name).
   */
  get rightBottom(): IVector { return this.bottomRight }

  /**
   * 上边中点（未旋转）
   *
   * Middle of the top edge (unrotated).
   */
  get midTop(): IVector { return { x: this.midX, y: this.top } }
  /**
   * 下边中点（未旋转）
   *
   * Middle of the bottom edge (unrotated).
   */
  get midBottom(): IVector { return { x: this.midX, y: this.bottom } }
  /**
   * 左边中点（未旋转）
   *
   * Middle of the left edge (unrotated).
   */
  get midLeft(): IVector { return { x: this.left, y: this.midY } }
  /**
   * 右边中点（未旋转）
   *
   * Middle of the right edge (unrotated).
   */
  get midRight(): IVector { return { x: this.right, y: this.midY } }

  /**
   * 旋转后的左上角（世界坐标）
   *
   * The rotated top left corner (world space).
   */
  get rotatedTopLeft(): IVector { return this.map2world(0, 0) }
  /**
   * 旋转后的左下角（世界坐标）
   *
   * The rotated bottom left corner (world space).
   */
  get rotatedBottomLeft(): IVector { return this.map2world(0, this.h) }
  /**
   * 旋转后的右上角（世界坐标）
   *
   * The rotated top right corner (world space).
   */
  get rotatedTopRight(): IVector { return this.map2world(this.w, 0) }
  /**
   * 旋转后的右下角（世界坐标）
   *
   * The rotated bottom right corner (world space).
   */
  get rotatedBottomRight(): IVector { return this.map2world(this.w, this.h) }
  /**
   * 旋转后的左上角，与 rotatedTopLeft 相同（旧名字）
   *
   * The rotated top left corner, the same as rotatedTopLeft (old name).
   */
  get rotatedLeftTop(): IVector { return this.map2world(0, 0) }
  /**
   * 旋转后的左下角，与 rotatedBottomLeft 相同（旧名字）
   *
   * The rotated bottom left corner, the same as rotatedBottomLeft (old name).
   */
  get rotatedLeftBottom(): IVector { return this.map2world(0, this.h) }
  /**
   * 旋转后的右上角，与 rotatedTopRight 相同（旧名字）
   *
   * The rotated top right corner, the same as rotatedTopRight (old name).
   */
  get rotatedRightTop(): IVector { return this.map2world(this.w, 0) }
  /**
   * 旋转后的右下角，与 rotatedBottomRight 相同（旧名字）
   *
   * The rotated bottom right corner, the same as rotatedBottomRight (old name).
   */
  get rotatedRightBottom(): IVector { return this.map2world(this.w, this.h) }
  /**
   * 旋转后的上边中点（世界坐标）
   *
   * The rotated middle of the top edge (world space).
   */
  get rotatedMidTop(): IVector { return this.map2world(this.halfW, 0) }
  /**
   * 旋转后的下边中点（世界坐标）
   *
   * The rotated middle of the bottom edge (world space).
   */
  get rotatedMidBottom(): IVector { return this.map2world(this.halfW, this.h) }
  /**
   * 旋转后的左边中点（世界坐标）
   *
   * The rotated middle of the left edge (world space).
   */
  get rotatedMidLeft(): IVector { return this.map2world(0, this.halfH) }
  /**
   * 旋转后的右边中点（世界坐标）
   *
   * The rotated middle of the right edge (world space).
   */
  get rotatedMidRight(): IVector { return this.map2world(this.w, this.halfH) }
  /**
   * 旋转后的中心（世界坐标，与 midX / midY 一致）
   *
   * The rotated center (world space, the same point as midX / midY).
   */
  get rotatedMid(): IVector { return this.map2world(this.halfW, this.halfH) }

  /**
   * 旋转弧度，未旋转时为 0
   *
   * Rotation in radians, 0 while it is not rotated.
   */
  get rotation() { return this.data.rotation }
  /**
   * 取某个方向对应的点（旋转后的世界坐标）；组合方向返回 (NaN, NaN)
   *
   * Gets the point of one direction (its rotated world position); a combined direction
   * returns (NaN, NaN).
   *
   * @param {Resizable} which 方向 / The direction
   * @return {IVector} 该方向的世界坐标点 / The world position of that direction
   */
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

  /**
   * 在现有角度上再转一点（可指定旋转中心，不传则绕图形中心）
   *
   * Adds to the current rotation (an optional pivot may be given, otherwise the shape center
   * is used).
   *
   * @param {number} d 旋转弧度（增量）/ Rotation in radians (the delta)
   * @param {number} [x] 旋转中心的 x / x of the pivot
   * @param {number} [y] 旋转中心的 y / y of the pivot
   */
  rotateBy(d: number, x?: number, y?: number): void {
    const r = this._d.rotation + d
    this.rotateTo(r, x, y);
  }

  /**
   * 把角度转到指定值（可指定旋转中心，不传则绕图形中心）
   *
   * Sets the rotation to the given value (an optional pivot may be given, otherwise the
   * shape center is used).
   *
   * @param {number} r 目标旋转弧度 / Target rotation in radians
   * @param {number} [x] 旋转中心的 x / x of the pivot
   * @param {number} [y] 旋转中心的 y / y of the pivot
   */
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


  /**
   * 取几何矩形（当场新建一个 Rect）
   *
   * Gets the geometry rectangle (a new Rect is created).
   *
   * @return {Rect} 几何矩形 / The geometry rectangle
   */
  getGeo(): Rect {
    return new Rect(
      this._d.x,
      this._d.y,
      this._d.w,
      this._d.h
    )
  }
  /**
   * 按几何矩形改图形
   *
   * Applies a geometry rectangle to the shape.
   *
   * @param {Rect} rect 新的几何矩形 / The new geometry rectangle
   * @param {boolean} [dirty=true] 是否标脏 / Whether to mark the dirty area
   * @return {this} 本对象（便于链式调用）/ This instance (chainable)
   */
  setGeo(rect: Rect, dirty: boolean = true): this {
    return this.geo(rect.x, rect.y, rect.w, rect.h, dirty)
  }

  /**
   * 同时改位置与尺寸（脏区包含新旧两个矩形）
   *
   * Sets both the position and the size (the dirty area covers the old and the new
   * rectangle).
   *
   * @param {number} x 新的左上角 x / The new top left x
   * @param {number} y 新的左上角 y / The new top left y
   * @param {number} w 新的宽度 / The new width
   * @param {number} h 新的高度 / The new height
   * @param {boolean} [dirty=true] 是否标脏 / Whether to mark the dirty area
   * @return {this} 本对象（便于链式调用）/ This instance (chainable)
   */
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

  /**
   * 相对当前位置平移
   *
   * Moves the shape by a relative offset.
   *
   * @param {number} x 横向增量 / x offset
   * @param {number} y 纵向增量 / y offset
   * @param {boolean} [dirty=true] 是否标脏 / Whether to mark the dirty area
   * @return {this} 本对象（便于链式调用）/ This instance (chainable)
   */
  moveBy(x: number, y: number, dirty: boolean = true): this {
    return this.geo(
      this._d.x + x,
      this._d.y + y,
      this._d.w,
      this._d.h,
      dirty
    )
  }

  /**
   * 相对当前尺寸增减
   *
   * Resizes the shape by a relative delta.
   *
   * @param {number} w 宽度增量 / Width delta
   * @param {number} h 高度增量 / Height delta
   * @param {boolean} [dirty=true] 是否标脏 / Whether to mark the dirty area
   * @return {this} 本对象（便于链式调用）/ This instance (chainable)
   */
  resizeBy(w: number, h: number, dirty: boolean = true): this {
    return this.geo(
      this._d.x,
      this._d.y,
      this._d.w + w,
      this._d.h + h,
      dirty
    )
  }

  /**
   * 位置与尺寸同时叠加相对增量
   *
   * Applies a relative delta to both the position and the size.
   *
   * @param {number} x 横向增量 / x offset
   * @param {number} y 纵向增量 / y offset
   * @param {number} w 宽度增量 / Width delta
   * @param {number} h 高度增量 / Height delta
   * @param {boolean} [dirty=true] 是否标脏 / Whether to mark the dirty area
   * @return {this} 本对象（便于链式调用）/ This instance (chainable)
   */
  geoBy(x: number, y: number, w: number, h: number, dirty: boolean = true): this {
    return this.geo(
      this._d.x + x,
      this._d.y + y,
      this._d.w + w,
      this._d.h + h,
      dirty
    )
  }

  /**
   * 绘制图形本体与状态装饰（ghost / 锁定 / 选中 / 控制点）
   *
   * Draws the shape itself and its state decorations (ghost / locked / selected / resize
   * handles).
   *
   * @param {CanvasRenderingContext2D} ctx 画布上下文 / Canvas context
   */
  render(ctx: CanvasRenderingContext2D): void {
    if (!this.visible) return
    const decoration = this.board?.shapeDecoration
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
   * The rectangle used while drawing: a local origin plus the floored size.
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

  /**
   * 选中框矩形：局部坐标，含描边一半的偏移
   *
   * The rectangle of the selection box: local coordinates, with the half line width taken
   * into account.
   *
   * @return {IRect} 选中框矩形 / The selection rectangle
   */
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


  /**
   * AABB 包围盒的旧名字
   *
   * Old name of the AABB bounding box.
   *
   * @deprecated 命名不一致，请使用 aabb()
   * @deprecated Kept for compatibility, use aabb() instead
   */
  boundingRect = () => this.aabb()

  /**
   * 获取AABB包围盒
   * 
   * 包围盒矩形的数据均为整数。
   * 
   * 脏区域会根据包围盒矩形的来运算
   *
   * The AABB bounding box; every number of it is an integer, and the dirty areas are
   * computed from it.
   *
   * @return {IRect} 包围盒矩形 / The bounding box
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
  /**
   * 取 OBB 包围盒：带旋转的包围盒（线宽也算进去）
   *
   * Gets the OBB bounding box: the rotated bounding box (the line width included).
   *
   * @return {IRotatedRect} 带旋转的包围盒 / The rotated bounding box
   */
  obb(): IRotatedRect {
    const lw = this.lineWidth;
    const x = this.x - lw / 2;
    const y = this.y - lw / 2;
    const w = this.w + lw;
    const h = this.h + lw;
    return { x, y, w, h, r: this.rotation }
  }
  /**
   * 算各控制点的位置：交给给选中框 / 控制点的绘制使用
   *
   * Computes the position of the resize handles, for the selection box / handle drawing.
   *
   * @param {number} x 选中框的局部 x / Local x of the selection box
   * @param {number} y 选中框的局部 y / Local y of the selection box
   * @param {number} w 选中框的宽度 / Width of the selection box
   * @param {number} h 选中框的高度 / Height of the selection box
   * @return {{s: number, lx: number, rx: number, ty: number, by: number, mx: number, my: number}} 控制点尺寸与各坐标 / The handle size and the coordinates
   */
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
   *
   * Converts a world coordinate into the local coordinate of this shape.
   *
   * @param x 世界坐标系X坐标 / World x
   * @param y 世界坐标系Y坐标 / World y
   * @returns 本图坐标系 坐标 / The local coordinate of this shape
   */
  map2me(x: number, y: number): Vector;

  /**
   * 世界坐标系坐标　转换　本图坐标系坐标（与上一个重载等价，坐标以对象传入）
   *
   * Converts a world coordinate into the local coordinate of this shape (the same as the
   * previous overload, the coordinate is passed as an object).
   *
   * @param v 世界坐标系坐标 / The world coordinate
   * @returns 本图坐标系 坐标 / The local coordinate of this shape
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
   *
   * Converts a local coordinate of this shape into a world coordinate.
   *
   * @param x 本图坐标系X坐标 / Local x of this shape
   * @param y 本图坐标系Y坐标 / Local y of this shape
   * @returns 世界坐标系坐标 / The world coordinate
   */
  map2world(x: number, y: number): Vector;

  /**
   * 本图坐标系坐标 转换 世界坐标系坐标（与上一个重载等价，坐标以对象传入）
   *
   * Converts a local coordinate of this shape into a world coordinate (the same as the
   * previous overload, the coordinate is passed as an object).
   *
   * @param v 本图坐标系坐标 / The local coordinate of this shape
   * @returns 世界坐标系坐标 / The world coordinate
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
  /**
   * 指针在哪个控制点上：命中则给出方向与那个控制点的矩形，否则为 Resizable.None
   *
   * Which handle the pointer is on: a hit returns the direction and the rectangle of that
   * handle, otherwise Resizable.None is returned.
   *
   * @param {number} pointerX 指针的世界坐标 x / World x of the pointer
   * @param {number} pointerY 指针的世界坐标 y / World y of the pointer
   * @return {[Resizable, Rect | undefined]} 命中的方向与控制点矩形 / The hit direction and the handle rectangle
   */
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

  /**
   * 绘制前准备好画布：平移（有旋转 / 缩放时还绕中心旋转缩放）到图形自己的坐标系
   *
   * Prepares the canvas before drawing: it is translated (plus rotated / scaled around the
   * center while the shape has a rotation / scale) into the local space of the shape.
   *
   * @param {CanvasRenderingContext2D} ctx 画布上下文 / Canvas context
   */
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
  /**
   * 绘制结束后还原画布（与 beginDraw 成对使用）
   *
   * Restores the canvas after drawing (always used as a pair with beginDraw).
   *
   * @param {CanvasRenderingContext2D} ctx 画布上下文 / Canvas context
   */
  protected endDraw(ctx: CanvasRenderingContext2D): void {
    ctx.restore()
  }

  private _ele: HTMLElement | undefined;
  private _relCount: number = 0;

  /**
   * 监听图形事件（事件内部挂在一个隐藏元素上）
   *
   * Listens to a shape event (the events are dispatched on a hidden element internally).
   *
   * @param {K} type 事件类型 / Event type
   * @param {ShapeEventListener<K>} listener 监听函数 / The listener
   * @param {boolean | AddEventListenerOptions} [options] 监听选项 / Listener options
   * @return {this} 本对象（便于链式调用）/ This instance (chainable)
   */
  addEventListener<K extends keyof ShapeEventMap>(type: K, listener: ShapeEventListener<K>, options?: boolean | AddEventListenerOptions): this
  addEventListener(arg0: any, arg1: any, arg2?: any): this {
    this._ele = this._ele || document.createElement('a')
    this._ele.addEventListener(arg0, arg1, arg2)
    if (!arg2?.once) this._relCount++
    return this
  }

  /**
   * 取消监听图形事件
   *
   * Stops listening to a shape event.
   *
   * @param {K} type 事件类型 / Event type
   * @param {ShapeEventListener<K>} listener 监听函数 / The listener
   * @param {boolean | AddEventListenerOptions} [options] 监听选项 / Listener options
   * @return {this} 本对象（便于链式调用）/ This instance (chainable)
   */
  removeEventListener<K extends keyof ShapeEventMap>(type: K, listener: ShapeEventListener<K>, options?: boolean | AddEventListenerOptions): this
  removeEventListener(arg0: any, arg1: any, arg2?: any): this {
    this._ele?.removeEventListener(arg0, arg1, arg2)
    return this
  }

  /**
   * 派发图形事件：具体事件对象由 ShapeEventMap 描述
   *
   * Dispatches a shape event: the event object is described by ShapeEventMap.
   *
   * @param {K} type 事件类型 / Event type
   * @param {ShapeEventMap[K]['detail']} detail 事件数据 / The event payload
   * @return {this} 本对象（便于链式调用）/ This instance (chainable)
   */
  dispatchEvent<K extends keyof ShapeEventMap>(type: K, detail: ShapeEventMap[K]['detail']): this {
    this._ele?.dispatchEvent(new CustomEvent(type, { detail }))
    return this
  }
}