import { isNum } from "../../utils/helper";

export interface IShapeStyle {
  /**
   * strokeStyle
   */
  a?: CanvasFillStrokeStyles['strokeStyle'];
  /**
   * fillStyle
   */
  b?: CanvasFillStrokeStyles['fillStyle'];
  /**
   * lineCap
   */
  c?: CanvasLineCap;
  /**
   * lineDash
   */
  d?: number[];
  /**
   * lineDashOffset
   */
  e?: number;
  /**
   * lineJoin
   */
  f?: CanvasLineJoin;
  /**
   * lineWidth
   */
  g?: number;
  /**
   * miterLimit
   */
  h?: number;
}
export class ShapeStyle implements IShapeStyle {
  /**
   * strokeStyle
   */
  a?: CanvasFillStrokeStyles['strokeStyle'];
  /**
   * fillStyle
   */
  b?: CanvasFillStrokeStyles['fillStyle'];
  /**
   * lineCap
   */
  c?: CanvasLineCap;
  /**
   * lineDash
   */
  d?: number[];
  /**
   * lineDashOffset
   */
  e?: number;
  /**
   * lineJoin
   */
  f?: CanvasLineJoin;
  /**
   * lineWidth
   */
  g?: number;
  /**
   * miterLimit
   */
  h?: number;

  get fillStyle() { return this.b || '' }
  set fillStyle(v) { if (v) this.b = v; else delete this.b; }
  get strokeStyle() { return this.a || '' }
  set strokeStyle(v) { if (v) this.a = v; else delete this.a; }
  get lineCap() { return this.c || 'round' }
  set lineCap(v) { if (v) this.c = v; else delete this.c; }
  get lineDash() { return this.d || [] }
  set lineDash(v) {
    if (Array.isArray(v) && v.length > 0) this.d = [...v]; else delete this.d;
  }
  get lineDashOffset() { return this.e || 0 }
  set lineDashOffset(v) { if (v) this.e = v; else delete this.e; }
  get lineJoin() { return this.f || 'round' }
  set lineJoin(v) { if (v) this.f = v; else delete this.f; }
  get lineWidth() { return this.g || 0 }
  set lineWidth(v) { if (v) this.g = v; else delete this.g; }
  get miterLimit() { return this.h || 0 }
  set miterLimit(v) { if (v) this.h = v; else delete this.h; }

  merge(o: Partial<IShapeStyle>): this {
    return this.read(o)
  }

  read(o: Partial<IShapeStyle>): this {
    if (o.a) this.a = o.a
    if (o.b) this.b = o.b
    if (o.c) this.c = o.c
    if (o.d) this.d = [...o.d]
    if (isNum(o.e)) this.e = o.e
    if (o.f) this.f = o.f
    if (isNum(o.g)) this.g = o.g
    if (isNum(o.h)) this.h = o.h
    return this
  }

  copy(): typeof this {
    const ret: (typeof this) = new (Object.getPrototypeOf(this).constructor)
    return ret.read(this)
  }
}