import { Degrees } from "../../utils"
import { isNum, isStr } from "../../utils/helper"
import { ShapeEnum, ShapeType } from "../ShapeEnum"
import { IShapeData } from "./IShapeData"
import { IShapeStatus } from "./IShapeStatus"
import { IShapeStyle, ShapeStyle } from "./IShapeStyle"
import { ShapeStatus } from "./ShapeStatus"

export class ShapeData implements IShapeData {
  t: ShapeType = ShapeEnum.Invalid
  i: string = ''
  x: number = 0
  y: number = 0
  w: number = 0
  h: number = 0
  z: number = 0

  c?: number;
  d?: number;

  /** layerId */
  l?: string

  /** rotation */
  r?: number

  /** group id */
  g?: string

  /** style */
  a?: IShapeStyle

  /** status */
  b?: IShapeStatus


  /**
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

  get style(): ShapeStyle {
    if (this.a instanceof ShapeStyle)
      return this.a
    else if (this.a)
      return this.a = new ShapeStyle().merge(this.a)
    else
      return this.a = new ShapeStyle()
  };

  get status(): ShapeStatus {
    if (this.b instanceof ShapeStatus)
      return this.b
    else if (this.b)
      return this.b = new ShapeStatus().merge(this.b)
    else
      return this.b = new ShapeStatus()
  };

  /**
   * getter: type
   *
   * @type {ShapeType}
   * @memberof ShapeData
   */
  get type(): ShapeType { return this.t }

  /**
   * setter: type
   * 
   * @type {ShapeType}
   * @memberof ShapeData
   */
  set type(v: ShapeType) { this.t = v }

  /**
   * 
   * @type {string}
   * @memberof ShapeData
   */
  get id(): string { return this.i }
  set id(v: string) { this.i = v }


  get scaleX(): number { return this.c ?? 1 }
  set scaleX(v: number) { if (v == 1) { delete this.c } else this.c = v }
  get scaleY(): number { return this.d ?? 1 }
  set scaleY(v: number) { if (v == 1) { delete this.d } else this.d = v }

  get fillStyle() { return this.style.fillStyle }
  set fillStyle(v) { this.style.fillStyle = v; }
  get strokeStyle() { return this.style.strokeStyle }
  set strokeStyle(v) { this.style.strokeStyle = v; }
  get lineCap() { return this.style.lineCap }
  set lineCap(v) { this.style.lineCap = v; }
  get lineDash() { return this.style.lineDash }
  set lineDash(v) { this.style.lineDash = v; }
  get lineDashOffset() { return this.style.lineDashOffset }
  set lineDashOffset(v) { this.style.lineDashOffset = v; }
  get lineJoin() { return this.style.lineJoin }
  set lineJoin(v) { this.style.lineJoin = v; }
  get lineWidth() { return this.style.lineWidth }
  set lineWidth(v) { this.style.lineWidth = v; }
  get miterLimit() { return this.style.miterLimit }
  set miterLimit(v) { this.style.miterLimit = v; }

  get visible(): boolean { return this.status.visible }
  set visible(v: boolean) { this.status.visible = v }
  get selected(): boolean { return this.status.selected }
  set selected(v: boolean) { this.status.selected = v }
  get editing(): boolean { return this.status.editing }
  set editing(v: boolean) { this.status.editing = v }
  get locked(): boolean { return this.status.locked }
  set locked(v: boolean) { this.status.locked = v }
  get ghost(): boolean { return this.status.ghost }
  set ghost(v: boolean) { this.status.ghost = v }

  get layer() { return this.l }
  set layer(v) { this.l = v }

  get needFill() { return true; }
  get needStroke() { return true; }

  get rotation() { return this.r ?? 0; }
  set rotation(v: number) { if (!v) delete this.r; else this.r = Degrees.normalized(v) }

  get halfW(): number { return this.w / 2 }
  set halfW(v: number) { this.w = v * 2 }
  get halfH(): number { return this.h / 2 }
  set halfH(v: number) { this.h = v * 2 }
  get midX(): number { return this.x + this.halfW }
  set midX(v: number) { this.x = v - this.halfW }
  get midY(): number { return this.y + this.halfH }
  set midY(v: number) { this.y = v - this.halfH }

  /** 
   * raw field: g
   */
  get groupId(): string { return this.g ?? '' }
  set groupId(v: string) { if (v) this.g = v; else delete this.g; }

  merge(o: Partial<IShapeData>): this {
    this.read(o)
    return this
  }

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
    if (isStr(o.d)) this.d = o.d
    this.r = isNum(o.r) ? o.r : void 0

    const { style, status } = o as any;
    const { a = style, b = status } = o;
    if (a) this.style.read(a)
    if (b) this.status.read(b)
    if (a) this.style.read(a)
    if (b) this.status.read(b)
    return this
  }

  copy(): typeof this {
    const ret: (typeof this) = new (Object.getPrototypeOf(this).constructor)
    return ret.read(this)
  }

  /** 清洗掉可空的字段 */
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