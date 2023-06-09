import { IObserver } from "./Base";
export class FocusOb implements IObserver {
  private _focused = false;
  private _disabled = false;
  private _ele: HTMLElement;
  private _focus: (e: FocusEvent) => void;
  private _blur: (e: FocusEvent) => void;
  get focused() { return this._focused; }
  get disabled() { return this._disabled }
  set disabled(v) {
    if (this._disabled === v) { return; }
    this._disabled = v;
    if (v) {
      this._ele.removeEventListener('focus', this._focus);
      this._ele.removeEventListener('blur', this._blur);
    } else {
      this._ele.addEventListener('focus', this._focus);
      this._ele.addEventListener('blur', this._blur);
    }
  }
  constructor(ele: HTMLElement, cb: (focused: boolean, e: FocusEvent) => void) {
    this._ele = ele;
    this._focus = (e: FocusEvent) => { this._focused = true; cb(this._focused, e); }
    this._blur = (e: FocusEvent) => { this._focused = false; cb(this._focused, e); }
  }
  destory() { this.disabled = true; }
}
