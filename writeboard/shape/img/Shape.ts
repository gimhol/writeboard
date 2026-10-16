import { Gaia } from "../../mgr/Gaia";
import { ShapeEnum } from "../ShapeEnum";
import { Resizable, Shape } from "../base";
import { ImgData, ObjectFit } from "./Data";

/**
 * 图片图形：按适配方式把图片画到图形框里，未加载完会先显示提示文字
 *
 * Image shape: the image is drawn into the shape box through the fit mode, while a hint text
 * is shown until it is loaded.
 */
export class ShapeImg extends Shape<ImgData> {
  private _src?: string;
  private _img?: HTMLImageElement;
  private _loaded: boolean = false;
  private _error: string = '';

  /**
   * 按数据建一个图片图形，默认八向都可拉伸
   *
   * Builds an image shape from the given data, resizable in all eight directions by default.
   *
   * @param {Partial<ImgData>} data 图形数据 / Shape data
   */
  constructor(data: Partial<ImgData>) {
    super(data, ImgData);
    this._r = Resizable.All;
  }

  /**
   * 当前地址对应的图片对象：地址变了会重新加载并重新绑定加载事件
   *
   * The image object of the current source: a changed source reloads the image and rebinds
   * the load events.
   *
   * @return {HTMLImageElement} 图片对象 / The image object
   */
  get img() {
    const d = this.data;
    if (this._src === d.src) {
      return this._img!
    };
    if (this._img) {
      this._img.removeEventListener('load', this.onLoad)
      this._img.removeEventListener('error', this.onError)
    }
    this._src = d.src;
    this._loaded = false;
    this._error = '';
    this._img = new Image();
    this._img.src = this.data.src;
    this._img.addEventListener('load', this.onLoad)
    this._img.addEventListener('error', this.onError)
    return this._img;
  }

  /**
   * 图片加载完成：标记已加载并标脏重画
   *
   * The image is loaded: it is marked as loaded and the shape is redrawn.
   */
  onLoad = () => {
    this.beginDirty();
    this._loaded = true;
    this.endDirty()
  }

  /**
   * 图片加载失败：记下错误信息并标脏，渲染时会显示提示文字
   *
   * The image failed to load: the error is recorded and the shape is redrawn, so the render
   * can show the hint text.
   *
   * @param {ErrorEvent} e 加载错误事件 / The load error event
   */
  onError = (e: ErrorEvent) => {
    this.beginDirty();
    this._error = 'fail to load: ' + (e.target as any).src;
    this.endDirty();
  }

  /**
   * 绘制图片：按适配方式直接画到图形框里，未加载完则画提示文字
   *
   * Draws the image: it goes straight into the shape box through the fit mode, and a hint
   * text is drawn while it is not loaded yet.
   *
   * @param {CanvasRenderingContext2D} ctx 画布上下文 / Canvas context
   */
  render(ctx: CanvasRenderingContext2D): void {
    if (!this.visible)
      return;

    const { img } = this;
    if (this._loaded) {
      let { x, y, w, h } = this.drawingRect();

      switch (this.data.objectFit) {
        case ObjectFit.Fill: {
          this.beginDraw(ctx)
          ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, w, h);
          this.endDraw(ctx)
          break;
        }
        case ObjectFit.Contain: {
          const a = img.width / img.height;
          const b = w / h;
          let dx = x;
          let dy = y;
          let dw = w;
          let dh = h;
          if (a > b) {
            dh = w / a;
            dy += (h - dh) * 0.5;
          } else {
            dw = h * a;
            dx += (w - dw) * 0.5;
          }
          this.beginDraw(ctx)
          ctx.drawImage(img, 0, 0, img.width, img.height, dx - x, dy - y, dw, dh);
          this.endDraw(ctx)
          break;
        }
        case ObjectFit.Cover: {
          const a = img.width / img.height;
          const b = w / h;
          let sx = 0;
          let sy = 0;
          let sw = img.width;
          let sh = img.height;
          if (a < b) {
            sh = sw / b;
            sy = (img.height - sh) / 2
          } else {
            sw = sh * b;
            sx = (img.width - sw) / 2
          }
          this.beginDraw(ctx)
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
          this.endDraw(ctx)
          break;
        }
      }
    } else if (this._error) {
      this.drawText(ctx, 'error: ' + this._error)
    } else {
      this.drawText(ctx, 'loading: ' + this.data.src)
    }
    super.render(ctx);
  }

  /**
   * 在图形内画一段提示文字（加载中 / 加载失败时用）
   *
   * Draws a hint text inside the shape (used while loading and on a load error).
   *
   * @param {CanvasRenderingContext2D} ctx 画布上下文 / Canvas context
   * @param {string} text 要绘制的文字 / The text to draw
   */
  drawText(ctx: CanvasRenderingContext2D, text: string): void {

    this.beginDraw(ctx)
    const { x, y, w, h } = this.drawingRect();
    ctx.fillStyle = '#FF000088';
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = '#00000088';
    ctx.fillRect(0, 0, w, h);
    ctx.font = 'normal 16px serif'
    ctx.fillStyle = 'white';
    const {
      fontBoundingBoxDescent: fd,
      fontBoundingBoxAscent: fa,
      actualBoundingBoxLeft: al
    } = ctx.measureText(text);
    const height = fd + fa;
    ctx.fillText(text, x + 1 + al, y + height);
    this.endDraw(ctx)

  }
}

Gaia.registerShape(ShapeEnum.Img, () => new ImgData, d => new ShapeImg(d))