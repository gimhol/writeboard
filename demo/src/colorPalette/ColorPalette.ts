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
    this.update()
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
  protected _current = 0
  protected _onChanged: undefined | ((hues: number) => void)
  onChanged(cb: (hues: number) => void) {
    this._onChanged = cb
  }
  update(): void {
    super.update()
    const { y } = this._pos

    const hues = clampF(0, 360, (y / this._rect.h) * 360)
    if (this._current === hues) return
    this._current = hues
    this._onChanged && this._onChanged(hues)
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

    const { y } = this._pos
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
  protected _current = this._base.toRGBA(255)
  protected _onChanged: undefined | ((rgba: RGBA) => void)
  onChanged(cb: (rgb: RGBA) => void) {
    this._onChanged = cb
  }
  setColor(color: RGB) {
    this._base = color.copy()
    this.update()
  }
  update(): void {
    super.update()
    const { x } = this._pos
    const rgba = this._base.toRGBA(255)
    rgba.a = clampI(0, 255, 255 * (1 - x / this._rect.w))
    if (this._current.equal(rgba)) return
    this._current = rgba
    this._onChanged && this._onChanged(rgba)
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

    const { x } = this._pos
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
  protected _hues = 0
  protected _current = new HSB(this._hues, 1, 1).toRGB()
  protected _onChanged: undefined | ((rgb: RGB) => void)
  onChanged(cb: (rgb: RGB) => void) {
    this._onChanged = cb
  }
  setHues(hues: number) {
    this._hues = clampI(0, 359, hues)
    this.update()
  }
  update(): void {
    super.update()
    const { x, y } = this._pos
    const hsb = new HSB(this._hues, 1, 1)
    hsb.s = clampF(0, 1, 1 - x / this._rect.w)
    hsb.b = clampF(0, 1, 1 - y / this._rect.h)
    const rgb = hsb.toRGB()
    if (this._current.equal(rgb)) return
    this._current = rgb
    this._onChanged && this._onChanged(rgb)
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

    const { x, y } = this._pos

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
  private _curr = RGBA.BlackT.copy()
  private _prev = RGBA.BlackT.copy()
  setCurr(color: RGBA) {
    this._curr = color.copy()
    this.update()
  }
  setPrev(color: RGBA = this._curr) {
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
  _onChanged: undefined | ((rgba: RGBA) => void)
  constructor(onscreen: HTMLCanvasElement) {
    const offscreen = document.createElement('canvas')
    offscreen.width = onscreen.width
    offscreen.height = onscreen.height
    const { width: w, height: h } = onscreen
    const rowH = 16
    const colW = 16
    this._colorCol = new ColorCol(onscreen, offscreen, new Rect(w - colW, 0, colW, h - rowH))
    this._hbZone = new HBZone(onscreen, offscreen, new Rect(0, 0, w - colW, h - rowH))
    this._alphaRow = new AlphaRow(onscreen, offscreen, new Rect(0, h - rowH, w - colW, rowH))
    this._finalZone = new FinalZone(onscreen, offscreen, new Rect(w - colW, h - rowH, colW, rowH))
    this._colorCol.onChanged(v => this._hbZone.setHues(v))
    this._hbZone.onChanged(v => this._alphaRow.setColor(v))
    this._alphaRow.onChanged(v => {
      this._onChanged && this._onChanged(v)
      this._finalZone.setCurr(v)
    })
    this._hbZone.setHues(0)
    document.addEventListener('pointerup', _ => this._finalZone.setPrev())
    document.addEventListener('pointercancel', _ => this._finalZone.setPrev())
  }
}