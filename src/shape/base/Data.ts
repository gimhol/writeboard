import { ShapeEnum, ShapeType } from "../ShapeEnum"

export interface IShapeStyle {
  /**
   * strokeStyle
   */
  a?: CanvasFillStrokeStyles['strokeStyle']
  /**
   * fillStyle
   */
  b?: CanvasFillStrokeStyles['fillStyle']
  /**
   * lineCap
   */
  c?: CanvasLineCap
  /**
   * lineDash
   */
  d?: number[]
  /**
   * lineDashOffset
   */
  e?: number
  /**
   * lineJoin
   */
  f?: CanvasLineJoin
  /**
   * lineWidth
   */
  g?: number
  /**
   * miterLimit
   */
  h?: number
}
export interface IShapeStatus {
  /**
   * visible
   */
  v?: number
  /**
   * selected
   */
  s?: number
  /**
   * editing
   */
  e?: number
}
export interface IShapeData {
  t: ShapeType;
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  l: string;
  style?: IShapeStyle;
  status?: IShapeStatus;
}
export class ShapeData implements IShapeData {
  t: ShapeType = ShapeEnum.Invalid
  i = ''
  x = 0
  y = 0
  w = -0
  h = -0
  z = -0
  l = ''
  style?: Partial<IShapeStyle> = {}
  status?: Partial<IShapeStatus> = {}

  get type() { return this.t }
  set type(v) { this.t = v }
  get id() { return this.i }
  set id(v) { this.i = v }
  get fillStyle() { return this.style?.b || '' }
  set fillStyle(v) {
    if (!this.style) this.style = {}
    if (v) this.style.b = v
    else delete this.style.b
  }
  get strokeStyle() { return this.style?.a || '' }
  set strokeStyle(v) {
    if (!this.style) this.style = {}
    if (v) this.style.a = v
    else delete this.style.a
  }
  get lineCap() { return this.style?.c || 'round' }
  set lineCap(v) {
    if (!this.style) this.style = {}
    if (v) this.style.c = v
    else delete this.style.c
  }
  get lineDash() { return this.style?.d || [] }
  set lineDash(v) {
    if (!this.style) this.style = {}
    if (Array.isArray(v) && v.length > 0) this.style.d = [...v]
    else delete this.style.d
  }
  get lineDashOffset() { return this.style?.e || 0 }
  set lineDashOffset(v) {
    if (!this.style) this.style = {}
    if (v) this.style.e = v
    else delete this.style.e
  }
  get lineJoin() { return this.style?.f || 'round' }
  set lineJoin(v) {
    if (!this.style) this.style = {}
    if (v) this.style.f = v
    else delete this.style.f
  }
  get lineWidth() { return this.style?.g || 0 }
  set lineWidth(v) {
    if (!this.style) this.style = {}
    if (v) this.style.g = v
    else delete this.style.g
  }
  get miterLimit() { return this.style?.h || 0 }
  set miterLimit(v) {
    if (!this.style) this.style = {}
    if (v) this.style.h = v
    else delete this.style.h
  }
  get visible() { return this.status?.v !== 0 }
  set visible(v) {
    if (!this.status) this.status = {}
    if (v) this.status.v = 1
    else if (v === false) this.status.v = 0
    else delete this.status.v
  }
  get selected() { return !!this.status?.s }
  set selected(v) {
    if (!this.status) this.status = {}
    if (v) this.status.s = 1
    else delete this.status.s
  }
  get editing() { return !!this.status?.e }
  set editing(v) {
    if (!this.status) this.status = {}
    if (v) this.status.e = 1
    else delete this.status.e
  }
  get layer() { return this.l }
  set layer(v) { this.l = v }
  
  get needFill() { return true; }
  get needStroke() { return true; }

  merge(other: Partial<IShapeData>) {
    this.copyFrom(other)
    return this
  }
  copyFrom(other: Partial<IShapeData>) {
    if (typeof other.t === 'string' || typeof other.t === 'number') this.t = other.t
    if (typeof other.i === 'string') this.i = other.i
    if (typeof other.x === 'number') this.x = other.x
    if (typeof other.y === 'number') this.y = other.y
    if (typeof other.z === 'number') this.z = other.z
    if (typeof other.w === 'number') this.w = other.w
    if (typeof other.h === 'number') this.h = other.h
    if (typeof other.l === 'string') this.l = other.l

    const { style, status } = other
    if (style) {
      if (!this.style) this.style = {}
      if (style.a) this.style.a = style.a
      if (style.b) this.style.b = style.b
      if (style.c) this.style.c = style.c
      if (style.d) this.style.d = [...style.d]
      if (typeof style.e === 'number') this.style.e = style.e
      if (style.f) this.style.f = style.f
      if (typeof style.g === 'number') this.style.g = style.g
      if (typeof style.h === 'number') this.style.h = style.h
    }
    if (status) {
      if (!this.status) this.status = {}
      if (typeof status.v === 'number') this.status.v = status.v
      if (typeof status.s === 'number') this.status.s = status.s
      if (typeof status.e === 'number') this.status.e = status.e
    }
    return this
  }
  copy(): ShapeData {
    return new ShapeData().copyFrom(this)
  }
}
