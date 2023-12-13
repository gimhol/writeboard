import { Degrees, Numbers } from "../../utils"
import { isNum, isStr } from "../../utils/helper"
import { ShapeEnum, ShapeType } from "../ShapeEnum"
import { IShapeStatus, ShapeStatus } from "./IShapeStatus"
import { IShapeStyle, ShapeStyle } from "./IShapeStyle"

export interface IShapeData {
  t: ShapeType;
  /** id */
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;

  /** layerId */
  l: string;

  /** rotation */
  r?: number;
  style?: IShapeStyle;
  status?: IShapeStatus;
}
export class ShapeData implements IShapeData {
  t: ShapeType = ShapeEnum.Invalid
  i = ''
  x = 0
  y = 0
  w = 0
  h = 0
  z = 0

  /** layerId */
  l = ''

  /** rotation */
  r: number | undefined = void 0
  style = new ShapeStyle();
  status = new ShapeStatus();

  get type() { return this.t }
  set type(v) { this.t = v }
  get id() { return this.i }
  set id(v) { this.i = v }

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
  set rotation(v: number) { this.r = Degrees.normalized(v) }

  merge(o: Partial<IShapeData>) {
    this.read(o)
    return this
  }

  read(o: Partial<IShapeData>): this {
    if (isStr(o.t) || isNum(o.t)) this.t = o.t
    if (isStr(o.i)) this.i = o.i
    if (isNum(o.x)) this.x = o.x
    if (isNum(o.y)) this.y = o.y
    if (isNum(o.z)) this.z = o.z
    if (isNum(o.w)) this.w = o.w
    if (isNum(o.h)) this.h = o.h
    if (isStr(o.l)) this.l = o.l
    this.r = isNum(o.r) ? o.r : void 0

    const { style, status } = o
    if (style) this.style.read(style)
    if (status) this.status.read(status)
    return this
  }

  copy(): typeof this {
    const ret: (typeof this) = new (Object.getPrototypeOf(this).constructor)
    return ret.read(this)
  }
}
