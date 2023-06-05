import { IRect, Rect } from "../../../dist/utils/Rect";
import { Vector } from "../../../dist/utils/Vector";
import { clampF, clampI, HSB, RGB, RGBA } from "./Color";

class Base {
  protected _rect: Rect
  protected _pos = new Vector(0, 0)
  protected _pointerId: number | undefined
  protected _onscreen: HTMLCanvasElement
  protected _offscreen: HTMLCanvasElement
  protected _requested = false;
  get rect() { return this._rect; }
  set rect(v: IRect) {
    this._rect.set(v);
    this.update();
  }
  constructor(onscreen: HTMLCanvasElement, offscreen: HTMLCanvasElement, rect?: IRect) {
    if (rect)
      this._rect = Rect.create(rect)
    else
      this._rect = new Rect(0, 0, onscreen.width, onscreen.height)
    this._offscreen = offscreen
    this._onscreen = onscreen
    onscreen.addEventListener('pointerdown', e => this.pointerstart(e))
    document.addEventListener('pointermove', e => this.pointermove(e))
    document.addEventListener('pointerup', e => this.pointerend(e))
    document.addEventListener('pointercancel', e => this.pointerend(e))
    setTimeout(() => this.update(), 1);
  }
  pointerstart(e: PointerEvent) {
    if (!this.pressOnMe(e) || this._pointerId)
      return
    this._pointerId = e.pointerId
    this.updatePos(e)
    this.update()
  }
  pointermove(e: PointerEvent) {
    if (e.pointerId !== this._pointerId)
      return
    this.updatePos(e)
    this.update()
  }
  pointerend(e: PointerEvent) {
    if (e.pointerId !== this._pointerId)
      return
    delete this._pointerId
    this.updatePos(e)
    this.update()
  }
  pressOnMe(e: PointerEvent) {
    if (e.pointerType === 'mouse' && e.button !== 0)
      return false
    const { x, y } = this.pos(e)
    return x < this._rect.w && y < this._rect.h && x >= 0 && y >= 0
  }
  pos(e: PointerEvent) {
    const { left, top, width, height } = this._onscreen.getBoundingClientRect()
    const { x, y, w, h } = this._rect
    return new Vector(
      (e.clientX - left) * this._onscreen.width / width - x,
      (e.clientY - top) * this._onscreen.height / height - y
    )
  }
  clampPos(e: PointerEvent) {
    const pos = this.pos(e)
    pos.x = clampI(0, this._rect.w, pos.x)
    pos.y = clampI(0, this._rect.h, pos.y)
    return pos
  }
  updatePos(e: PointerEvent) {
    this._pos = this.clampPos(e)
  }
  update() {
    if (this._requested) return
    this._requested = true
    requestAnimationFrame(() => {
      this.drawOffscreen()
      const onscreen = this._onscreen.getContext('2d')!
      onscreen.clearRect(this._rect.x, this._rect.y, this._rect.w, this._rect.h)
      onscreen.drawImage(this._offscreen,
        this._rect.x, this._rect.y, this._rect.w, this._rect.h,
        this._rect.x, this._rect.y, this._rect.w, this._rect.h)

      this._requested = false
    })
  }
  drawOffscreen() { }
}
class ColorCol extends Base {
  protected __colors = [
    new RGB(255, 0, 0),
    new RGB(255, 255, 0),
    new RGB(0, 255, 0),
    new RGB(0, 255, 255),
    new RGB(0, 0, 255),
    new RGB(255, 0, 255),
    new RGB(255, 0, 0)
  ];
  protected _result = 0
  protected _onChanged?: (hues: number) => void;
  get value() { return this._result; }
  set value(v) {
    this._result = clampF(0, 360, v)
    this.update();
  }
  set onChanged(cb: (hues: number) => void) { this._onChanged = cb }
  updatePos(e: PointerEvent): void {
    super.updatePos(e);
    const { y } = this._pos
    this._result = clampF(0, 360, (y / this._rect.h) * 360)
    this._onChanged?.(this._result);
    this.update();
  }
  drawOffscreen() {
    const ctx = this._offscreen.getContext('2d')!
    ctx.clearRect(this._rect.x, this._rect.y, this._rect.w, this._rect.h)

    ctx.fillStyle = 'white'
    ctx.fillRect(this._rect.x + 1, this._rect.y + 1, this._rect.w - 2, this._rect.h - 2)

    let dd = 8
    ctx.globalCompositeOperation = 'source-atop'
    ctx.fillStyle = 'lightgray'
    for (let yy = this._rect.y; yy < this._rect.bottom; yy += dd) {
      for (let xx = this._rect.x; xx < this._rect.right; xx += dd) {
        ctx.fillRect(xx, yy, dd / 2, dd / 2)
        ctx.fillRect(
          xx + dd / 2,
          yy + dd / 2,
          dd / 2,
          dd / 2)
      }
    }
    ctx.globalCompositeOperation = 'source-over'
    const grd = ctx.createLinearGradient(
      this._rect.x, this._rect.y,
      this._rect.x, this._rect.y + this._rect.h);
    const length = this.__colors.length
    for (var i = 0; i < length; ++i) {
      var step = i / (length - 1)
      var color = this.__colors[i].toString()
      grd.addColorStop(step, color)
    }
    ctx.fillStyle = grd
    ctx.fillRect(this._rect.x + 1, this._rect.y + 1, this._rect.w - 2, this._rect.h - 2)

    const y = this._rect.h * (this._result / 360);

    const indicatorSize = 4
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
class AlphaRow extends Base {
  protected _base = new RGB(255, 0, 0)
  protected _value = this._base.toRGBA(255)
  protected _onChanged: undefined | ((rgba: RGBA) => void)
  get value() { return this._value.copy() }
  set value(v) {
    this._value = v.copy();
    this._base = v.toRGB();
    this.update();
  }
  get base() { return this._base.copy(); }
  set base(v) {
    this._base = v.copy();
    this._value = this._base.toRGBA(this._value.a);
    this.update();
  }
  set onChanged(cb: (rgb: RGBA) => void) {
    this._onChanged = cb
  }
  updatePos(e: PointerEvent): void {
    super.updatePos(e)
    const { x } = this._pos
    this._value = this._base.toRGBA(
      clampI(0, 255, 255 * (1 - x / this._rect.w))
    )
    this._onChanged?.(this._value)
    this.update();
  }
  drawOffscreen() {
    const ctx = this._offscreen.getContext('2d')!
    ctx.clearRect(this._rect.x, this._rect.y, this._rect.w, this._rect.h)

    ctx.fillStyle = 'white'
    ctx.fillRect(this._rect.x + 1, this._rect.y + 1, this._rect.w - 2, this._rect.h - 2)
    let dd = 8
    ctx.globalCompositeOperation = 'source-atop'
    ctx.fillStyle = 'lightgray'
    for (let yy = this._rect.y; yy < this._rect.bottom; yy += dd) {
      for (let xx = this._rect.x; xx < this._rect.right; xx += dd) {
        ctx.fillRect(xx, yy, dd / 2, dd / 2)
        ctx.fillRect(
          xx + dd / 2,
          yy + dd / 2,
          dd / 2,
          dd / 2)
      }
    }

    ctx.globalCompositeOperation = 'source-over'
    const g0 = ctx.createLinearGradient(
      this._rect.x, this._rect.y,
      this._rect.x + this._rect.w, this._rect.y);
    g0.addColorStop(0, '' + this._base)
    g0.addColorStop(1, '' + this._base.toRGBA(0))

    ctx.fillStyle = g0
    ctx.fillRect(this._rect.x + 1, this._rect.y + 1, this._rect.w - 2, this._rect.h - 2)

    const x = this._rect.w * (1 - this._value.a / 255);
    const indicatorSize = 4
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
class HBZone extends Base {
  protected _hues = 0;
  protected _value = new HSB(this._hues, 1, 1);
  protected _onChanged?: (hsb: HSB) => void;
  get value() { return this._value.copy(); }
  set value(v) {
    this._value = v.copy();
    this.hues = v.h;
  }
  get hues() { return this._hues; }
  set hues(v) {
    this._hues = clampI(0, 359, v)
    this._value = new HSB(
      this._hues,
      this._value.s,
      this._value.b
    );
    this.update()
  }
  set onChanged(cb: (rgb: HSB) => void) { this._onChanged = cb; }
  updatePos(e: PointerEvent): void {
    super.updatePos(e);
    const { x, y } = this._pos
    this._value = new HSB(this._hues,
      clampF(0, 1, 1 - x / this._rect.w),
      clampF(0, 1, 1 - y / this._rect.h)
    )
    this._onChanged?.(this._value)
    this.update();
  }
  drawOffscreen() {
    const ctx = this._offscreen.getContext('2d')!
    ctx.clearRect(this._rect.x, this._rect.y, this._rect.w, this._rect.h)
    const g0 = ctx.createLinearGradient(this._rect.x, this._rect.y, this._rect.x + this._rect.w, this._rect.y);
    g0.addColorStop(0, '' + new HSB(this._hues, 1, 1).toRGB())
    g0.addColorStop(1, 'white')
    ctx.fillStyle = g0
    ctx.fillRect(this._rect.x + 1, this._rect.y + 1, this._rect.w - 2, this._rect.h - 2)

    const g1 = ctx.createLinearGradient(this._rect.x, this._rect.y, this._rect.x, this._rect.y + this._rect.h);
    g1.addColorStop(0, 'transparent')
    g1.addColorStop(1, 'black')
    ctx.fillStyle = g1
    ctx.fillRect(this._rect.x + 1, this._rect.y + 1, this._rect.w - 2, this._rect.h - 2)

    const hsb = this._value;
    const x = this._rect.w * (1 - hsb.s)
    const y = this._rect.h * (1 - hsb.b)

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
class FinalZone extends Base {
  protected _curr = RGBA.BlackT.copy()
  protected _prev = RGBA.BlackT.copy()
  get curr() { return this._curr.copy() }
  set curr(color: RGBA) {
    this._curr = color.copy()
    this.update()
  }
  get prev() { return this._prev.copy(); }
  set prev(color: RGBA) {
    this._prev = color.copy()
    this.update()
  }
  drawOffscreen(): void {
    const ctx = this._offscreen.getContext('2d')!
    ctx.clearRect(this._rect.x, this._rect.y, this._rect.w, this._rect.h)

    ctx.fillStyle = 'white'
    ctx.fillRect(this._rect.x + 1, this._rect.y + 1, this._rect.w - 2, this._rect.h - 2)
    let dd = 8
    ctx.globalCompositeOperation = 'source-atop'
    ctx.fillStyle = 'lightgray'
    for (let yy = this._rect.y; yy < this._rect.bottom; yy += dd) {
      for (let xx = this._rect.x; xx < this._rect.right; xx += dd) {
        ctx.fillRect(xx, yy, dd / 2, dd / 2)
        ctx.fillRect(
          xx + dd / 2,
          yy + dd / 2,
          dd / 2,
          dd / 2)
      }
    }

    ctx.globalCompositeOperation = 'source-over'
    {
      ctx.fillStyle = '' + this._curr
      let x = Math.floor(this._rect.x + 1)
      let y = Math.floor(this._rect.y + 1)
      let w = Math.floor((this._rect.w - 2) / 2)
      let h = Math.floor(this._rect.h - 2)
      ctx.fillRect(x, y, w, h)
      x += w
      ctx.fillStyle = '' + this._prev
      ctx.fillRect(x, y, w, h)
    }
  }
}
export class ColorPalette {
  private _colorCol: ColorCol;
  private _alphaRow: AlphaRow;
  private _hbZone: HBZone;
  private _finalZone: FinalZone
  private _rowH = 16
  private _colW = 16
  private _onscreen: HTMLCanvasElement;
  private _offscreen: HTMLCanvasElement;
  private _onChanged?: (rgba: RGBA) => void;
  get onChanged() { return this._onChanged; }
  set onChanged(v) { this._onChanged = v; }
  set value(v: RGBA) {
    const hsb = v.toHSB(this._colorCol.value)
    this._colorCol.value = hsb.h;
    this._hbZone.value = hsb;
    this._alphaRow.value = v;
    this._finalZone.curr = v;
    this._finalZone.prev = v;
  }
  get value() { return this._alphaRow.value; }

  constructor(onscreen: HTMLCanvasElement) {
    this._onscreen = onscreen;
    this._offscreen = document.createElement('canvas')
    this._colorCol = new ColorCol(this._onscreen, this._offscreen)
    this._hbZone = new HBZone(this._onscreen, this._offscreen)
    this._alphaRow = new AlphaRow(this._onscreen, this._offscreen)
    this._finalZone = new FinalZone(this._onscreen, this._offscreen)
    this._colorCol.onChanged = v => {
      this._hbZone.hues = v;
      this._alphaRow.base = this._hbZone.value.toRGB();
      this._finalZone.curr = this._alphaRow.value;
      this._onChanged?.(this._finalZone.curr);
    }
    this._hbZone.onChanged = v => {
      this._alphaRow.base = v.toRGB();
      this._finalZone.curr = this._alphaRow.value;
      this._onChanged?.(this._finalZone.curr);
    }
    this._alphaRow.onChanged = v => {
      this._finalZone.curr = v;
      this._onChanged?.(this._finalZone.curr);
    }
    this._hbZone.hues = 0;
    this.update();
    document.addEventListener('pointerup', _ => this._finalZone.prev = this._finalZone.curr)
    document.addEventListener('pointercancel', _ => this._finalZone.prev = this._finalZone.curr)
  }
  update() {
    const { width: w, height: h } = this._onscreen
    this._offscreen.width = w;
    this._offscreen.height = h;
    this._colorCol.rect = new Rect(w - this._colW, 0, this._colW, h - this._rowH)
    this._hbZone.rect = new Rect(0, 0, w - this._colW, h - this._rowH)
    this._alphaRow.rect = new Rect(0, h - this._rowH, w - this._colW, this._rowH)
    this._finalZone.rect = new Rect(w - this._colW, h - this._rowH, this._colW, this._rowH)
    this._colorCol.drawOffscreen();
    this._alphaRow.drawOffscreen();
    this._hbZone.drawOffscreen();
    this._finalZone.drawOffscreen()
  }
}