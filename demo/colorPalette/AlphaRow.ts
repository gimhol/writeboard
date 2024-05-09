import { Base } from "./Base";
import { clampI, RGB, RGBA } from "./Color";

export class AlphaRow extends Base {
  protected _color = new RGB(255, 0, 0);
  protected _alpha = 255;
  protected _onChanged?: (alpha: number) => void;
  get alpha() { return this._alpha; }
  
  set alpha(v) {
    this._alpha = v;
    this.update();
  }

  get color() { return this._color.copy(); }

  set color(v) {
    this._color = v.copy();
    this.update();
  }

  set onChanged(cb: (alpha: number) => void) {
    this._onChanged = cb;
  }

  override handlePoinerMove(e: PointerEvent): void {
    super.handlePoinerMove(e);
    const { x } = this._pos;
    this._alpha = clampI(0, 255, 255 * (1 - x / this._rect.w));
    this._onChanged?.(this._alpha);
    this.update();
  }
  override drawOffscreen() {
    const ctx = this._offscreen.getContext('2d')!;
    ctx.clearRect(this._rect.x, this._rect.y, this._rect.w, this._rect.h);

    ctx.fillStyle = 'white';
    ctx.fillRect(this._rect.x + 1, this._rect.y + 1, this._rect.w - 2, this._rect.h - 2);
    let dd = 8;
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = 'lightgray';
    for (let yy = this._rect.y; yy < this._rect.bottom; yy += dd) {
      for (let xx = this._rect.x; xx < this._rect.right; xx += dd) {
        ctx.fillRect(xx, yy, dd / 2, dd / 2);
        ctx.fillRect(
          xx + dd / 2,
          yy + dd / 2,
          dd / 2,
          dd / 2);
      }
    }

    ctx.globalCompositeOperation = 'source-over';
    const g0 = ctx.createLinearGradient(
      this._rect.x, this._rect.y,
      this._rect.x + this._rect.w, this._rect.y);
    g0.addColorStop(0, '' + this._color);
    g0.addColorStop(1, '' + this._color.toRGBA(0));

    ctx.fillStyle = g0;
    ctx.fillRect(this._rect.x + 1, this._rect.y + 1, this._rect.w - 2, this._rect.h - 2);

    const x = this._rect.w * (1 - this._alpha / 255);
    const indicatorSize = 4;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(Math.floor(x - indicatorSize / 2) - 0.5, Math.floor(this._rect.y) + 1, indicatorSize, Math.floor(this._rect.h) - 2);
    ctx.stroke();

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(Math.floor(x - indicatorSize / 2) - 0.5, Math.floor(this._rect.y) + 1, indicatorSize, Math.floor(this._rect.h) - 2);
    ctx.stroke();
  }
}
