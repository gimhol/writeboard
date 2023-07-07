import { Rect } from "../../../dist/utils/Rect";
import { AlphaRow } from "./AlphaRow";
import { RGBA } from "./Color";
import { ColorCol } from "./ColorCol";
import { FinalZone } from "./FinalZone";
import { HBZone } from "./HBZone";

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
    const hsb = v.toHSB(this._colorCol.hues)
    this._colorCol.hues = hsb.h;
    this._hbZone.hsb = hsb;
    this._alphaRow.alpha = v.a;
    this._finalZone.curr = v;
    this._finalZone.prev = v;
  }
  get value() { return this._alphaRow.color.toRGBA(this._alphaRow.alpha) }

  constructor(onscreen: HTMLCanvasElement) {
    this._onscreen = onscreen;
    this._offscreen = document.createElement('canvas')
    this._colorCol = new ColorCol(this._onscreen, this._offscreen)
    this._hbZone = new HBZone(this._onscreen, this._offscreen)
    this._alphaRow = new AlphaRow(this._onscreen, this._offscreen)
    this._finalZone = new FinalZone(this._onscreen, this._offscreen)
    this._colorCol.onChanged = v => {
      this._hbZone.hues = v;
      this._alphaRow.color = this._hbZone.hsb.toRGB();
      this._finalZone.curr = this.value;
      this._onChanged?.(this._finalZone.curr);
    }
    this._hbZone.onChanged = v => {
      this._alphaRow.color = v.toRGB();
      this._finalZone.curr = this.value;
      this._onChanged?.(this._finalZone.curr);
    }
    this._alphaRow.onChanged = v => {
      this._finalZone.curr = this.value;
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