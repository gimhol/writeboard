import { IObserver } from "./Base";
export class FocusOb implements IObserver {
  private _focused = false;
  private _destory: () => void;
  get focused() { return this._focused; }
  get destory() { return this._destory }

  constructor(ele: HTMLElement, cb: (focused: boolean) => void) {
    const focus = () => { this._focused = true; cb(this._focused); }
    const blur = () => { this._focused = false; cb(this._focused); }
    ele.addEventListener('focus', focus);
    ele.addEventListener('blur', blur);
    this._destory = () => {
      ele.removeEventListener('focus', focus);
      ele.removeEventListener('blur', blur);
    }

  }
}
