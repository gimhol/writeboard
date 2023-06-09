import { IObserver } from "./Base";
export class HoverOb implements IObserver {
  private _eles: HTMLElement[];
  private _disabled = true;
  private _hover = false;
  private _mouseenter: (e: MouseEvent) => void;
  private _mouseleave: (e: MouseEvent) => void;
  get hover() { return this._hover; }
  get disabled() { return this._disabled }
  set disabled(v) {
    if (this._disabled === v) { return; }
    this._disabled = v;
    if (v) {
      this._eles.forEach(ele => {
        ele.removeEventListener('mouseenter', this._mouseenter);
        ele.removeEventListener('mouseleave', this._mouseleave);
      })
    } else {
      this._eles.forEach(ele => {
        ele.addEventListener('mouseenter', this._mouseenter);
        ele.addEventListener('mouseleave', this._mouseleave);
      })
    }
  }
  constructor(ele: HTMLElement | HTMLElement[], cb: (hover: boolean, e: MouseEvent) => void) {
    this._eles = Array.isArray(ele) ? ele : [ele];
    this._mouseenter = (e: MouseEvent) => { this._hover = true; cb(this._hover, e); }
    this._mouseleave = (e: MouseEvent) => { this._hover = false; cb(this._hover, e); }
    this.disabled = false;
  }
  destory() { this.disabled = true; }
}