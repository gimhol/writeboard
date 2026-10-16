import { Shape } from "./Shape";
import { Resizable } from "./Resizable";
import { ShapeData } from "./ShapeData";

/**
 * 靠 path(ctx) 画路径的图形基类：子类只需给出路径，填充 / 描边由基类统一处理
 *
 * Base class of the shapes that draw a path: a subclass only describes the path, while the
 * fill / stroke work is done here.
 *
 * @see {Shape}
 */
export class ShapeNeedPath<D extends ShapeData = ShapeData> extends Shape<D> {
  /**
   * 建一个靠路径绘制的图形，默认八向都可拉伸
   *
   * Builds a path based shape, resizable in all eight directions by default.
   *
   * @param {Partial<D>} data 图形数据 / Shape data
   * @param {new (other?: Partial<D>) => D} cls 图形数据类 / Shape data class
   */
  constructor(data: Partial<D>, cls: new (other?: Partial<D>) => D) {
    super(data, cls);
    this._r = Resizable.All;
  }
  /**
   * 描述图形路径：子类必须覆盖，调用时坐标已换算到图形自己的局部坐标系
   *
   * Describes the shape path: subclasses must override it, and the coordinates are already
   * in the local space of the shape when it is called.
   *
   * @param {CanvasRenderingContext2D} ctx 画布上下文 / Canvas context
   */
  path(ctx: CanvasRenderingContext2D) {
    throw new Error("Method 'path' not implemented.");
  }
  /**
   * 绘制图形：先让子类输出路径，再按样式填充 / 描边，最后画状态装饰
   *
   * Draws the shape: the subclass emits the path first, then it is filled / stroked with the
   * style, and the state decorations come last.
   *
   * @param {CanvasRenderingContext2D} ctx 画布上下文 / Canvas context
   */
  render(ctx: CanvasRenderingContext2D): void {
    if (!this.visible)
      return;
    this.beginDraw(ctx)
    const d = this.data;
    if (d.fillStyle || (d.lineWidth && d.strokeStyle))
      this.path(ctx);
    if (d.fillStyle) {
      ctx.fillStyle = d.fillStyle;
      ctx.fill();
    }
    if (d.lineWidth && d.strokeStyle) {
      ctx.lineCap = d.lineCap;
      ctx.lineDashOffset = d.lineDashOffset;
      ctx.lineJoin = d.lineJoin;
      ctx.lineWidth = d.lineWidth;
      ctx.miterLimit = d.miterLimit;
      ctx.strokeStyle = d.strokeStyle;
      ctx.setLineDash(d.lineDash);
      ctx.stroke();
    }
    this.endDraw(ctx)
    super.render(ctx);
  }
}
