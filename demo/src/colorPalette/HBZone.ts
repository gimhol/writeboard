import { Base } from "./Base";
import { clampF, clampI, HSB } from "./Color";

export class HBZone extends Base {
  protected _hues = 0;
  protected _hsb = new HSB(this._hues, 1, 1);
  protected _onChanged?: (hsb: HSB) => void;
  get hsb() { return this._hsb.copy(); }
  set hsb(v) {
    this._hsb = v.copy();
    this.hues = v.h;
  }
  get hues() { return this._hues; }
  set hues(v) {
    this._hues = clampI(0, 359, v);
    this._hsb = new HSB(
      this._hues,
      this._hsb.s,
      this._hsb.b
    );
    this.update();
  }
  set onChanged(cb: (rgb: HSB) => void) { this._onChanged = cb; }
  override handlePoinerMove(e: PointerEvent): void {
    super.handlePoinerMove(e);
    const { x, y } = this._pos;
    this._hsb = new HSB(this._hues,
      clampF(0, 1, 1 - x / this._rect.w),
      clampF(0, 1, 1 - y / this._rect.h)
    );
    this._onChanged?.(this._hsb);
    this.update();
  }
  override drawOffscreen() {
    const ctx = this._offscreen.getContext('2d')!;
    ctx.clearRect(this._rect.x, this._rect.y, this._rect.w, this._rect.h);
    const g0 = ctx.createLinearGradient(this._rect.x, this._rect.y, this._rect.x + this._rect.w, this._rect.y);
    g0.addColorStop(0, '' + new HSB(this._hues, 1, 1).toRGB());
    g0.addColorStop(1, 'white');
    ctx.fillStyle = g0;
    ctx.fillRect(this._rect.x + 1, this._rect.y + 1, this._rect.w - 2, this._rect.h - 2);

    const g1 = ctx.createLinearGradient(this._rect.x, this._rect.y, this._rect.x, this._rect.y + this._rect.h);
    g1.addColorStop(0, 'transparent');
    g1.addColorStop(1, 'black');
    ctx.fillStyle = g1;
    ctx.fillRect(this._rect.x + 1, this._rect.y + 1, this._rect.w - 2, this._rect.h - 2);

    const hsb = this._hsb;
    const x = this._rect.w * (1 - hsb.s);
    const y = this._rect.h * (1 - hsb.b);

    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(Math.floor(x) - 0.5, Math.floor(y) - 0.5, 4, 0, 2 * Math.PI);
    ctx.stroke();

    ctx.strokeStyle = 'white';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(Math.floor(x) - 0.5, Math.floor(y) - 0.5, 4, 0, 2 * Math.PI);
    ctx.stroke();
  }
}
