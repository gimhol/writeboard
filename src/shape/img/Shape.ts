import { Gaia } from "../../mgr/Gaia";
import { ShapeEnum } from "../ShapeEnum";
import { Resizable, Shape } from "../base";
import { ImgData, ObjectFit } from "./Data";

export class ShapeImg extends Shape<ImgData> {
  private _src?: string;
  private _img?: HTMLImageElement;
  private _loaded: boolean = false;
  private _error: string = '';

  constructor(data: ImgData) {
    super(data);
    this._resizable = Resizable.All;
  }

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

  onLoad = () => {
    this._loaded = true;
    this.markDirty();
  }

  onError = (e: ErrorEvent) => {
    this._error = 'fail to load: ' + (e.target as any).src;
    this.markDirty();
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.visible)
      return;

    const { img } = this;
    if (this._loaded) {
      let { x, y, w, h } = this.boundingRect();

      switch (this.data.objectFit) {
        case ObjectFit.Fill: {
          ctx.drawImage(img, 0, 0, img.width, img.height, x, y, w, h);
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
          ctx.drawImage(img, 0, 0, img.width, img.height,
            dx, dy, dw, dh
          );
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
          ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
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

  drawText(ctx: CanvasRenderingContext2D, text: string): void {
    const { x, y, w, h } = this.boundingRect();
    ctx.fillStyle = '#00000088';
    ctx.fillRect(x, y, w, h);
    ctx.font = 'normal 16px serif'
    ctx.fillStyle = 'white';
    const {
      fontBoundingBoxDescent: fd,
      fontBoundingBoxAscent: fa,
      actualBoundingBoxLeft: al
    } = ctx.measureText(text);
    const height = fd + fa;
    ctx.fillText(this._error, 1 + x + al, y + height);

  }
}

Gaia.registerShape(ShapeEnum.Img, () => new ImgData, d => new ShapeImg(d))