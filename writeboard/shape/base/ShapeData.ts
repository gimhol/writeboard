import { Degrees } from "../../utils"
import { isNum, isStr } from "../../utils/helper"
import { ShapeEnum, ShapeType } from "../ShapeEnum"
import { IShapeData } from "./IShapeData"
import { IShapeStatus } from "./IShapeStatus"
import { IShapeStyle, ShapeStyle } from "./IShapeStyle"
import { ShapeStatus } from "./ShapeStatus"

/**
 * 图形数据的默认实现：短键存值，另有一套便于日常使用的 getter / setter
 *
 * Default implementation of shape data: the short keys hold the values, plus a set of
 * friendly getters / setters.
 */
export class ShapeData implements IShapeData {
  /**
   * 图形类型（短键 t）
   *
   * Shape type (short key `t`).
   *
   * @see {ShapeType}
   */
  t: ShapeType = ShapeEnum.Invalid
  /**
   * 图形 id，全局唯一（短键 i）
   *
   * Shape id, unique across the board (short key `i`).
   */
  i: string = ''
  /**
   * 左上角世界坐标 x（短键 x）
   *
   * World x of the top left corner (short key `x`).
   */
  x: number = 0
  /**
   * 左上角世界坐标 y（短键 y）
   *
   * World y of the top left corner (short key `y`).
   */
  y: number = 0
  /**
   * 宽度（短键 w）
   *
   * Width (short key `w`).
   */
  w: number = 0
  /**
   * 高度（短键 h）
   *
   * Height (short key `h`).
   */
  h: number = 0
  /**
   * 图层内层级（短键 z）：数字越大越靠上
   *
   * Order inside the layer (short key `z`): a larger number is drawn on top.
   */
  z: number = 0

  /**
   * 横向缩放比例（短键 c）
   *
   * Horizontal scale (short key `c`).
   */
  c?: number;
  /**
   * 纵向缩放比例（短键 d）
   *
   * Vertical scale (short key `d`).
   */
  d?: number;

  /**
   * 所在图层的 id（短键 l）
   *
   * Id of the layer this shape lives on (short key `l`).
   */
  l?: string

  /**
   * 旋转弧度，绕图形自身中心（短键 r）
   *
   * Rotation in radians around the shape center (short key `r`).
   */
  r?: number

  /**
   * 所属编组的 id（短键 g）
   *
   * Id of the group this shape belongs to (short key `g`).
   */
  g?: string

  /**
   * 样式：描边 / 填充 / 线宽等绘制参数（短键 a）
   *
   * Style: stroke / fill / line width and other drawing options (short key `a`).
   */
  a?: IShapeStyle

  /**
   * 状态位：可见 / 选中 / 编辑中 / 锁定 / ghost（短键 b）
   *
   * Status flags: visible / selected / editing / locked / ghost (short key `b`).
   */
  b?: IShapeStatus


  /**
   * 创建一份图形数据（子类必须自己调 read，见下面的 @description）
   *
   * Creates an instance of ShapeData.
   *
   * @description 
   *    here, subclasses' "read" can't be called correctly because of "this" problem.
   *    subclass needs to call its own 'read' in its own 'constructor'
   *
   *    like:
   *    ``` typescript 
   *    class SubData extends ShapeData {
   *      constructor(other?: Partial<SubData>) {
   *        // super(other); // don't do it
   *        super();
   *        this.read(other) // subclasses need to call its own 'read' in its own 'constructor'
   *      }
   *    }
   *    ```
   * @constructor
   * @param {?Partial<ShapeData>} [other] 
   */
  constructor(other?: Partial<ShapeData>) {
    other && this.read(other);
  }

  /**
   * 样式对象：拿到的必然是 ShapeStyle 实例，缺省就地补齐
   *
   * The style object: always a ShapeStyle instance, created in place when missing.
   */
  get style(): ShapeStyle {
    if (this.a instanceof ShapeStyle)
      return this.a
    else if (this.a)
      return this.a = new ShapeStyle().merge(this.a)
    else
      return this.a = new ShapeStyle()
  };

  /**
   * 状态对象：拿到的必然是 ShapeStatus 实例，缺省就地补齐
   *
   * The status object: always a ShapeStatus instance, created in place when missing.
   */
  get status(): ShapeStatus {
    if (this.b instanceof ShapeStatus)
      return this.b
    else if (this.b)
      return this.b = new ShapeStatus().merge(this.b)
    else
      return this.b = new ShapeStatus()
  };

  /**
   * 图形类型
   *
   * getter: type
   *
   * @type {ShapeType}
   * @memberof ShapeData
   */
  get type(): ShapeType { return this.t }

  /**
   * 设置图形类型
   *
   * setter: type
   * 
   * @type {ShapeType}
   * @memberof ShapeData
   */
  set type(v: ShapeType) { this.t = v }

  /**
   * 
   * 图形 id，全局唯一
   *
   * Shape id, unique across the board.
   *
   * @type {string}
   * @memberof ShapeData
   */
  get id(): string { return this.i }
  set id(v: string) { this.i = v }

  /**
   * 横向缩放比例，未缩放时为 1
   *
   * Horizontal scale, 1 while it is not scaled.
   *
   * @default 1
   */
  get scaleX(): number { return this.c ?? 1 }
  set scaleX(v: number) { if (v == 1) { delete this.c } else this.c = v }
  /**
   * 纵向缩放比例，未缩放时为 1
   *
   * Vertical scale, 1 while it is not scaled.
   *
   * @default 1
   */
  get scaleY(): number { return this.d ?? 1 }
  set scaleY(v: number) { if (v == 1) { delete this.d } else this.d = v }

  /**
   * 填充色（读写样式对象上的同一字段）
   *
   * Fill color (reads / writes the same field on the style object).
   */
  get fillStyle() { return this.style.fillStyle }
  set fillStyle(v) { this.style.fillStyle = v; }
  /**
   * 描边色（读写样式对象上的同一字段）
   *
   * Stroke color (reads / writes the same field on the style object).
   */
  get strokeStyle() { return this.style.strokeStyle }
  set strokeStyle(v) { this.style.strokeStyle = v; }
  /**
   * 线帽样式（读写样式对象上的同一字段）
   *
   * Line cap (reads / writes the same field on the style object).
   */
  get lineCap() { return this.style.lineCap }
  set lineCap(v) { this.style.lineCap = v; }
  /**
   * 虚线间隔（读写样式对象上的同一字段）
   *
   * Line dash (reads / writes the same field on the style object).
   */
  get lineDash() { return this.style.lineDash }
  set lineDash(v) { this.style.lineDash = v; }
  /**
   * 虚线起始偏移（读写样式对象上的同一字段）
   *
   * Line dash offset (reads / writes the same field on the style object).
   */
  get lineDashOffset() { return this.style.lineDashOffset }
  set lineDashOffset(v) { this.style.lineDashOffset = v; }
  /**
   * 折线拐角样式（读写样式对象上的同一字段）
   *
   * Line join (reads / writes the same field on the style object).
   */
  get lineJoin() { return this.style.lineJoin }
  set lineJoin(v) { this.style.lineJoin = v; }
  /**
   * 线宽（读写样式对象上的同一字段）
   *
   * Line width (reads / writes the same field on the style object).
   */
  get lineWidth() { return this.style.lineWidth }
  set lineWidth(v) { this.style.lineWidth = v; }
  /**
   * 斜接限制（读写样式对象上的同一字段）
   *
   * Miter limit (reads / writes the same field on the style object).
   */
  get miterLimit() { return this.style.miterLimit }
  set miterLimit(v) { this.style.miterLimit = v; }

  /**
   * 是否可见
   *
   * Whether the shape is visible.
   */
  get visible(): boolean { return this.status.visible }
  set visible(v: boolean) { this.status.visible = v }
  /**
   * 是否被选中
   *
   * Whether the shape is selected.
   */
  get selected(): boolean { return this.status.selected }
  set selected(v: boolean) { this.status.selected = v }
  /**
   * 是否编辑中
   *
   * Whether the shape is being edited.
   */
  get editing(): boolean { return this.status.editing }
  set editing(v: boolean) { this.status.editing = v }
  /**
   * 是否被锁定
   *
   * Whether the shape is locked.
   */
  get locked(): boolean { return this.status.locked }
  set locked(v: boolean) { this.status.locked = v }
  /**
   * 是否不允许 selector 操作
   *
   * Whether the selector is not allowed to operate on it.
   */
  get ghost(): boolean { return this.status.ghost }
  set ghost(v: boolean) { this.status.ghost = v }

  /**
   * 图层 id
   *
   * Layer id.
   */
  get layer() { return this.l }
  set layer(v) { this.l = v }

  /**
   * 是否需要填充（默认 true，不需要填充的子类会覆盖它）
   *
   * Whether the shape needs to be filled (default `true`, subclasses override it).
   *
   * @default true
   */
  get needFill() { return true; }
  /**
   * 是否需要描边（默认 true，不需要描边的子类会覆盖它）
   *
   * Whether the shape needs to be stroked (default `true`, subclasses override it).
   *
   * @default true
   */
  get needStroke() { return true; }

  /**
   * 旋转弧度，未旋转时为 0
   *
   * Rotation in radians, 0 while it is not rotated.
   *
   * @default 0
   */
  get rotation() { return this.r ?? 0; }
  set rotation(v: number) { if (!v) delete this.r; else this.r = Degrees.normalized(v) }

  /**
   * 宽度的一半
   *
   * Half of the width.
   */
  get halfW(): number { return this.w / 2 }
  set halfW(v: number) { this.w = v * 2 }
  /**
   * 高度的一半
   *
   * Half of the height.
   */
  get halfH(): number { return this.h / 2 }
  set halfH(v: number) { this.h = v * 2 }
  /**
   * 中心的 x 坐标
   *
   * Center x.
   */
  get midX(): number { return this.x + this.halfW }
  set midX(v: number) { this.x = v - this.halfW }
  /**
   * 中心的 y 坐标
   *
   * Center y.
   */
  get midY(): number { return this.y + this.halfH }
  set midY(v: number) { this.y = v - this.halfH }

  /** 
   * 编组 id，未编组时为空串
   *
   * raw field: g
   *
   * Group id, an empty string while it is not grouped.
   */
  get groupId(): string { return this.g ?? '' }
  set groupId(v: string) { if (v) this.g = v; else delete this.g; }

  /**
   * 合并另一份数据：只读取传进来的字段
   *
   * Merges another data: only the given fields are read.
   *
   * @param {Partial<IShapeData>} o 要合并的数据 / The data to merge
   * @return {this} 本对象（便于链式调用）/ This instance (chainable)
   */
  merge(o: Partial<IShapeData>): this {
    this.read(o)
    return this
  }

  /**
   * 读入另一份数据：只取传进来的字段
   *
   * Reads another data: only the given fields are taken.
   *
   * @param {Partial<IShapeData>} o 要读入的数据 / The data to read
   * @return {this} 本对象（便于链式调用）/ This instance (chainable)
   */
  read(o: Partial<IShapeData>): this {
    if (isStr(o.t) || isNum(o.t)) this.t = o.t
    if (isStr(o.i)) this.i = o.i
    if (isStr(o.g)) this.g = o.g
    if (isNum(o.x)) this.x = o.x
    if (isNum(o.y)) this.y = o.y
    if (isNum(o.z)) this.z = o.z
    if (isNum(o.w)) this.w = o.w
    if (isNum(o.h)) this.h = o.h
    if (isStr(o.l)) this.l = o.l
    if (isNum(o.c)) this.c = o.c
    if (isNum(o.d)) this.d = o.d
    this.r = isNum(o.r) ? o.r : void 0

    const { style, status } = o as any;
    const { a = style, b = status } = o;
    if (a) this.style.read(a)
    if (b) this.status.read(b)
    if (a) this.style.read(a)
    if (b) this.status.read(b)
    return this
  }

  /**
   * 拷一份同类型的副本（子类会拷成子类）
   *
   * Copies into a new instance of the same subclass.
   *
   * @return {typeof this} 副本 / The copy
   */
  copy(): typeof this {
    const ret: (typeof this) = new (Object.getPrototypeOf(this).constructor)
    return ret.read(this)
  }

  /**
   * 清洗掉可空的字段：值为 undefined 或空对象的短键会被删掉，让序列化更紧凑
   *
   * Washes out nullable fields: short keys holding undefined or an empty object are removed
   * to keep the serialized data compact.
   *
   * @return {typeof this} 本对象（便于链式调用）/ This instance (chainable)
   */
  wash(): typeof this {
    delete_void(this, 'a', 'b', 'c', 'd', 'l', 'r', 'g')
    delete_void(this.a, 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h')
    delete_void(this.b, 'v', 's', 'e', 'f', 'g')
    delete_eobj(this, 'a', 'b')
    return this;
  }
}
function delete_void<T extends {}>(o: T | undefined, ...ks: (keyof T)[]) {
  if (o) for (const k of ks) if (k in o && o[k] === void 0) delete o[k];
}
function delete_eobj<T extends {}>(o: T | undefined, ...ks: (keyof T)[]) {
  if (o) for (const k of ks) if (o[k] && typeof o[k] === 'object' && !Object.keys(o[k]).length) delete o[k];
}