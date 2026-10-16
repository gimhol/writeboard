import { IVector, Rect, Vector } from "../../utils";
import { ShapeEnum } from "../ShapeEnum";
import { IShapeData, ShapeData } from "../base";
/**
 * 笔迹坐标的变更方式：告诉接收端这次的新坐标该怎么并进去
 *
 * How the stroke coordinates changed: it tells the receiving side how to merge the new
 * coordinates.
 */
export enum ChangeType {
  /**
   * 非法 / 未指定
   *
   * Invalid / unspecified.
   */
  Invalid = 0,
  /**
   * 全量替换：整条笔迹换成新坐标
   *
   * Replace all: the whole stroke becomes the new coordinates.
   */
  All = 1,
  /**
   * 追加：新坐标接在已有坐标后面
   *
   * Append: the new coordinates are pushed after the existing ones.
   */
  Append = 2,
  /**
   * 从尾部减：丢掉末尾若干个点
   *
   * Subtract from the tail: the last points are dropped.
   */
  Subtract = 3,
}
/**
 * 笔迹数据：除公共字段外只多一组扁平坐标与变更方式
 *
 * Pen data: beyond the common fields it only adds the flat coordinates and the change type.
 */
export interface IPenData extends IShapeData {
  /**
   * 变更方式（短键 v），决定 u 里的坐标怎么并进去
   *
   * ChangeType (short key `v`), it decides how the coordinates of u are merged
   */
  v: ChangeType;

  /**
   * 坐标（短键 u），扁平的 [x0, y0, x1, y1, ...]
   *
   * coords (short key `u`), flat [x0, y0, x1, y1, ...]
   */
  u: number[];
}
/**
 * 笔迹数据的默认实现
 *
 * Default implementation of the pen data.
 */
export class PenData extends ShapeData implements IPenData {

  /**
   * 坐标的变更方式（短键 v），默认全量替换
   *
   * How the coordinates change (short key `v`), it replaces everything by default.
   *
   * @default ChangeType.All
   */
  v: ChangeType = ChangeType.All
  /**
   * 扁平坐标（短键 u）
   *
   * The flat coordinates (short key `u`).
   */
  u: number[] = []

  private _src_rect = new Rect(0, 0, 0, 0)

  /**
   * 坐标自己的包围盒：绘制时用它把坐标平移回图形位置，也会被脏区计算用到
   *
   * The bounding box of the coordinates: drawing uses it to translate the coordinates back
   * into place, and the dirty area computation uses it too.
   *
   * @return {Readonly<Rect>} 坐标包围盒 / The bounding box of the coordinates
   */
  get src_rect(): Readonly<Rect> { return this._src_rect }
  /**
   * 变更方式，与 v 等价
   *
   * The change type, an alias of v.
   */
  get dotsType(): ChangeType { return this.v }
  set dotsType(v: ChangeType) { this.v = v }

  /**
   * 坐标，与 u 等价
   *
   * The coordinates, an alias of u.
   */
  get coords(): Readonly<number[]> { return this.u }
  set coords(v: number[]) {
    this.u = v;
    this.reset_src_rect(this.u);
  }

  /**
   * 往末尾追加一批坐标，并同步扩大坐标包围盒
   *
   * Appends a batch of coordinates and grows the bounding box accordingly.
   *
   * @param {number[]} v 要追加的扁平坐标 / The flat coordinates to append
   * @return {this} 本对象（便于链式调用）/ This instance (chainable)
   */
  add_coords(v: number[]): this {
    if (!v.length) return this;
    const empty = !this.u.length
    this.u.push(...v);
    if (empty) this.reset_src_rect(v)
    else this.expand_src_rect(v)
    return this;
  }

  /**
   * 从指定位置删掉若干个坐标，并按剩下的坐标重算包围盒
   *
   * Deletes some coordinates from the given position and recomputes the bounding box from
   * what is left.
   *
   * @param {number} start 起始下标（坐标数组的下标）/ Start index (an index into the coordinate array)
   * @param {number} deleteCount 删掉多少个坐标 / How many coordinates to delete
   * @return {number[]} 被删掉的坐标 / The deleted coordinates
   */
  del_coords(start: number, deleteCount: number): number[] {
    const ret = this.u.splice(start, deleteCount)
    this.reset_src_rect(this.u);
    return ret;
  }

  /**
   * 按给定坐标重新算包围盒（空数组时置成宽高 -1 的空盒）
   *
   * Recomputes the bounding box from the given coordinates (an empty array gives a box of
   * size -1).
   *
   * @param {Readonly<number[]>} [u] 坐标，默认用当前所有坐标 / The coordinates, all of them by default
   * @return {Readonly<Rect>} 坐标包围盒 / The bounding box of the coordinates
   */
  reset_src_rect(u: Readonly<number[]> = this.coords): Readonly<Rect> {
    if (!u.length) {
      this._src_rect.x = 0
      this._src_rect.y = 0
      this._src_rect.w = -1
      this._src_rect.h = -1
      return this._src_rect
    }
    this._src_rect.x = u[0]
    this._src_rect.y = u[1]
    this._src_rect.w = 0
    this._src_rect.h = 0
    return this.expand_src_rect(u)
  }
  /**
   * 按给定坐标扩大包围盒（不重置，只往外长）
   *
   * Grows the bounding box with the given coordinates (it only expands, never resets).
   *
   * @param {Readonly<number[]>} u 要包进来的坐标 / The coordinates to cover
   * @return {Readonly<Rect>} 坐标包围盒 / The bounding box of the coordinates
   */
  expand_src_rect(u: Readonly<number[]>): Readonly<Rect> {
    let src_r = this._src_rect.right;
    let src_b = this._src_rect.bottom;
    for (let i = 0; i < u.length; i += 2) {
      this._src_rect.x = Math.min(u[i + 0], this._src_rect.x)
      this._src_rect.y = Math.min(u[i + 1], this._src_rect.y)
      src_r = Math.max(u[i + 0], src_r)
      src_b = Math.max(u[i + 1], src_b)
    }
    this._src_rect.right = src_r
    this._src_rect.bottom = src_b
    return this._src_rect;
  }

  /**
   * 把坐标换算成世界坐标（先绕坐标包围盒中心旋转，再叠上图形的位移）
   *
   * Converts the coordinates into world coordinates (they are rotated around the center of
   * their bounding box first, then the shape offset is applied).
   *
   * @return {number[]} 世界坐标下的扁平坐标 / The flat coordinates in world space
   */
  get coords2world(): number[] {
    const { rotation = 0, u } = this;
    const src_rect = this.reset_src_rect()
    const { x: mx, y: my } = src_rect.mid()
    const dot_on_world = (x: number, y: number): IVector => {
      const ret = Vector.rotated2(x, y, mx, my, rotation)
      ret.x -= src_rect.x - this.x
      ret.y -= src_rect.y - this.y
      return ret;
    }
    const ret: number[] = []
    for (let i = 0; i < u.length; i += 2) {
      const { x, y } = dot_on_world(u[i], u[i + 1])
      ret.push(x, y)
    }
    return ret;
  }

  /**
   * 笔迹只描边，不填充
   *
   * A stroke is never filled.
   *
   * @default false
   */
  override get needFill(): boolean {
    return false;
  }
  /**
   * 建一份笔迹数据：默认红色描边、线宽 5、圆头圆角，坐标为空
   *
   * Builds pen data: a red stroke of width 5 with round caps and joins, empty coordinates by
   * default.
   *
   * @param {Partial<PenData>} [other] 初始数据 / The initial data
   */
  constructor(other?: Partial<PenData>) {
    super()
    this.type = ShapeEnum.Pen
    this.strokeStyle = '#ff0000'
    this.lineCap = 'round'
    this.lineJoin = 'round'
    this.lineWidth = 5
    other && this.read(other)
  }
  /**
   * 读入一份笔迹数据：坐标整份拷进来，不会与传入对象共用数组
   *
   * Reads a piece of pen data: the coordinates are copied, so the given object never shares
   * its array.
   *
   * @param {Partial<PenData>} other 要读入的数据 / The data to read
   * @return {this} 本对象（便于链式调用）/ This instance (chainable)
   */
  override read(other: Partial<PenData>) {
    super.read(other)

    const { u = other.coords, v = other.dotsType } = other
    if (v) this.dotsType = v
    if (Array.isArray(u)) this.coords = [...u]
    return this
  }

  /**
   * 把一份笔迹数据并进来：按 v 决定是整份替换、尾巴追加还是从尾部减掉
   *
   * Merges a piece of pen data: v decides whether everything is replaced, appended to the
   * tail or subtracted from the tail.
   *
   * @param {Partial<PenData>} other 要合并的数据 / The data to merge
   * @return {this} 本对象（便于链式调用）/ This instance (chainable)
   */
  override merge(other: Partial<PenData>) {
    super.read(other)

    // 序列化出的负载只有短键 u / v，dotsType 是原型 getter，JSON 往返后取不到，必须回退
    const { u = other.coords, v = other.dotsType } = other
    if (!Array.isArray(u)) {
      return this
    }
    switch (v) {
      case ChangeType.Subtract:
        this.coords = this.coords.slice(0, -u.length);
        break;
      case ChangeType.Append:
        this.add_coords(u);
        break;
      default:
        this.coords = [...u];
        break;
    }
    return this
  }
}
