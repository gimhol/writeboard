export class HoverOb {
  private _hover = false;
  get hover() { return this._hover; }
  constructor(ele: HTMLElement, cb: (hover: boolean) => void) {
    ele.addEventListener('mouseenter', e => { this._hover = true; cb(this._hover); });
    ele.addEventListener('mouseleave', e => { this._hover = false; cb(this._hover); });
  }
}
