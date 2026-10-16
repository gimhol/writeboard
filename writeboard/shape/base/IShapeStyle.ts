import { isNum } from "../../utils/helper";

/**
 * 图形的样式字段：字段名都是紧凑短键，键序与 canvas 的对应关系见各成员
 *
 * Style fields of a shape: the names are compact short keys, and each member maps to one
 * canvas drawing option.
 *
 * @see {ShapeStyle}
 */
export interface IShapeStyle {
  /**
   * 描边色
   *
   * strokeStyle
   */
  a?: CanvasFillStrokeStyles['strokeStyle'];
  /**
   * 填充色
   *
   * fillStyle
   */
  b?: CanvasFillStrokeStyles['fillStyle'];
  /**
   * 线帽样式
   *
   * lineCap
   */
  c?: CanvasLineCap;
  /**
   * 虚线间隔
   *
   * lineDash
   */
  d?: number[];
  /**
   * 虚线起始偏移
   *
   * lineDashOffset
   */
  e?: number;
  /**
   * 折线拐角样式
   *
   * lineJoin
   */
  f?: CanvasLineJoin;
  /**
   * 线宽
   *
   * lineWidth
   */
  g?: number;
  /**
   * 斜接限制
   *
   * miterLimit
   */
  h?: number;
}
/**
 * 样式对象的默认实现：短键存值，取不到的字段返回画布默认值
 *
 * Default implementation of the style: the short keys hold the values, and a missing one
 * falls back to the canvas default.
 */
export class ShapeStyle implements IShapeStyle {
  /**
   * 描边色
   *
   * strokeStyle
   */
  a?: CanvasFillStrokeStyles['strokeStyle'];
  /**
   * 填充色
   *
   * fillStyle
   */
  b?: CanvasFillStrokeStyles['fillStyle'];
  /**
   * 线帽样式
   *
   * lineCap
   */
  c?: CanvasLineCap;
  /**
   * 虚线间隔
   *
   * lineDash
   */
  d?: number[];
  /**
   * 虚线起始偏移
   *
   * lineDashOffset
   */
  e?: number;
  /**
   * 折线拐角样式
   *
   * lineJoin
   */
  f?: CanvasLineJoin;
  /**
   * 线宽
   *
   * lineWidth
   */
  g?: number;
  /**
   * 斜接限制
   *
   * miterLimit
   */
  h?: number;

  /**
   * 填充色，未设置时为空串
   *
   * fillStyle, an empty string while it is not set.
   *
   * @default ''
   */
  get fillStyle() { return this.b || '' }
  set fillStyle(v) { if (v) this.b = v; else delete this.b; }
  /**
   * 描边色，未设置时为空串
   *
   * strokeStyle, an empty string while it is not set.
   *
   * @default ''
   */
  get strokeStyle() { return this.a || '' }
  set strokeStyle(v) { if (v) this.a = v; else delete this.a; }
  /**
   * 线帽样式，未设置时为 'round'
   *
   * lineCap, 'round' while it is not set.
   *
   * @default 'round'
   */
  get lineCap() { return this.c || 'round' }
  set lineCap(v) { if (v) this.c = v; else delete this.c; }
  /**
   * 虚线间隔，未设置时为空数组
   *
   * lineDash, an empty array while it is not set.
   *
   * @default []
   */
  get lineDash() { return this.d || [] }
  set lineDash(v) {
    if (Array.isArray(v) && v.length > 0) this.d = [...v]; else delete this.d;
  }
  /**
   * 虚线起始偏移，未设置时为 0
   *
   * lineDashOffset, 0 while it is not set.
   *
   * @default 0
   */
  get lineDashOffset() { return this.e || 0 }
  set lineDashOffset(v) { if (v) this.e = v; else delete this.e; }
  /**
   * 折线拐角样式，未设置时为 'round'
   *
   * lineJoin, 'round' while it is not set.
   *
   * @default 'round'
   */
  get lineJoin() { return this.f || 'round' }
  set lineJoin(v) { if (v) this.f = v; else delete this.f; }
  /**
   * 线宽，未设置时为 0
   *
   * lineWidth, 0 while it is not set.
   *
   * @default 0
   */
  get lineWidth() { return this.g || 0 }
  set lineWidth(v) { if (v) this.g = v; else delete this.g; }
  /**
   * 斜接限制，未设置时为 0
   *
   * miterLimit, 0 while it is not set.
   *
   * @default 0
   */
  get miterLimit() { return this.h || 0 }
  set miterLimit(v) { if (v) this.h = v; else delete this.h; }

  /**
   * 合并另一份样式：只读取传进来的字段
   *
   * Merges another style: only the given fields are read.
   *
   * @param {Partial<IShapeStyle>} o 要合并的样式 / The style to merge
   * @return {this} 本对象（便于链式调用）/ This instance (chainable)
   */
  merge(o: Partial<IShapeStyle>): this {
    return this.read(o)
  }

  /**
   * 读入另一份样式：只读取传进来的字段，其余保持不变
   *
   * Reads another style: only the given fields are read, the rest is kept.
   *
   * @param {Partial<IShapeStyle>} o 要读入的样式 / The style to read
   * @return {this} 本对象（便于链式调用）/ This instance (chainable)
   */
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
}