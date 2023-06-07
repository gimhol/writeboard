import { IObserver } from "./Base";
export class HoverOb implements IObserver {
  private _hover = false;
  private _destory: () => void;
  get hover() { return this._hover; }
  get destory() { return this._destory }
  constructor(ele: HTMLElement, cb: (hover: boolean) => void) {
    const mouseenter = (e: MouseEvent) => { this._hover = true; cb(this._hover); }
    const mouseleave = (e: MouseEvent) => { this._hover = false; cb(this._hover); }
    ele.addEventListener('mouseenter', mouseenter);
    ele.addEventListener('mouseleave', mouseleave);
    this._destory = () => {
      ele.removeEventListener('mouseenter', mouseenter);
      ele.removeEventListener('mouseleave', mouseleave);
    }
  }
}