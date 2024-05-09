import { Base } from "./Base";
import { clampF, RGB } from "./Color";

export class ColorCol extends Base {
  protected __colors = [
    new RGB(255, 0, 0),
    new RGB(255, 255, 0),
    new RGB(0, 255, 0),
    new RGB(0, 255, 255),
    new RGB(0, 0, 255),
    new RGB(255, 0, 255),
    new RGB(255, 0, 0)
  ];

  protected _hues = 0;

  protected _onChanged?: (hues: number) => void;

  get hues() { return this._hues; }

  set hues(v) {
    this._hues = clampF(0, 360, v);
    this.update();
  }
  
  set onChanged(cb: (hues: number) => void) { this._onChanged = cb; }

  override handlePoinerMove(e: PointerEvent): void {
    super.handlePoinerMove(e);
    const { y } = this._pos;
    this._hues = clampF(0, 360, (y / this._rect.h) * 360);
    this._onChanged?.(this._hues);
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
    const grd = ctx.createLinearGradient(
      this._rect.x, this._rect.y,
      this._rect.x, this._rect.y + this._rect.h);
    const length = this.__colors.length;
    for (var i = 0; i < length; ++i) {
      var step = i / (length - 1);
      var color = this.__colors[i]!.toString();
      grd.addColorStop(step, color);
    }
    ctx.fillStyle = grd;
    ctx.fillRect(this._rect.x + 1, this._rect.y + 1, this._rect.w - 2, this._rect.h - 2);

    const y = this._rect.h * (this._hues / 360);

    const indicatorSize = 4;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.rect(Math.floor(this._rect.x) + 1, Math.floor(y - indicatorSize / 2) - 0.5, Math.floor(this._rect.w) - 2, indicatorSize);
    ctx.stroke();

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(Math.floor(this._rect.x) + 1, Math.floor(y - indicatorSize / 2) - 0.5, Math.floor(this._rect.w) - 2, indicatorSize);
    ctx.stroke();
  }
}
