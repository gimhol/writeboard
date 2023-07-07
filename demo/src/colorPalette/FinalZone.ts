import { Base } from "./Base";
import { RGBA } from "./Color";

export class FinalZone extends Base {
  protected _curr = RGBA.BlackT.copy();
  protected _prev = RGBA.BlackT.copy();
  get curr() { return this._curr.copy(); }
  set curr(color: RGBA) {
    this._curr = color.copy();
    this.update();
  }
  get prev() { return this._prev.copy(); }
  set prev(color: RGBA) {
    this._prev = color.copy();
    this.update();
  }
  override drawOffscreen(): void {
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
    {
      ctx.fillStyle = '' + this._curr;
      let x = Math.floor(this._rect.x + 1);
      let y = Math.floor(this._rect.y + 1);
      let w = Math.floor((this._rect.w - 2) / 2);
      let h = Math.floor(this._rect.h - 2);
      ctx.fillRect(x, y, w, h);
      x += w;
      ctx.fillStyle = '' + this._prev;
      ctx.fillRect(x, y, w, h);
    }
  }
}
