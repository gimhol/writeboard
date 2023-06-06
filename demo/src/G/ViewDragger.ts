import { GEventType } from "./Event";
import { View } from "./View";

export interface IViewDraggerInits {
  handles?: HTMLElement[];
  view?: View;
}
export class ViewDragger {
  private _handles: HTMLElement[] = [];
  private _ignores: HTMLElement[] = [];
  private _view?: View;
  private _offsetX = 0;
  private _offsetY = 0;
  private _down = false;
  private _disabled = false;
  private isIgnore(ele: HTMLElement) {
    return this._ignores.indexOf(ele) >= 0;
  }
  private _onpointerdown = (e: PointerEvent) => {
    if (e.button !== 0) { return; }
    let ele = (e.target as HTMLElement);
    if (this.isIgnore(ele)) { return; }
    this._down = true;
    this._offsetX = e.offsetX;
    this._offsetY = e.offsetY;

    while (ele !== this._view?.inner) {
      this._offsetX += ele.offsetLeft;
      this._offsetY += ele.offsetTop;
      if (!ele.parentElement) {
        break;
      }
      ele = ele.parentElement;
      if (this.isIgnore(ele)) {
        this._down = false;
        return;
      }
    }
    if (this.isIgnore(ele)) {
      this._down = false;
      return;
    }
    this.view?.inner.dispatchEvent(new Event(GEventType.ViewDragStart))
  };
  private _pointermove = (e: PointerEvent) => {
    if (!this._view || !this._down) { return; }
    this._view.styles().apply('drag_by_dragger', v => ({
      ...v,
      left: `${e.pageX - this._offsetX}px`,
      top: `${e.pageY - this._offsetY}px`,
    }))


    this.view?.inner.dispatchEvent(new Event(GEventType.ViewDragging))
  };
  private _pointerup = (e: PointerEvent) => {
    if (e.button !== 0) { return; }
    if (this._down) {
      this.view?.inner.dispatchEvent(new Event(GEventType.ViewDragEnd))
      this._down = false;
    }
  };
  private _blur = () => {
    if (this._down) {
      this.view?.inner.dispatchEvent(new Event(GEventType.ViewDragEnd))
      this._down = false;
    }
  }
  get handles() { return this._handles; }
  set handles(v) {
    this._handles?.forEach(v => v.removeEventListener('pointerdown', this._onpointerdown));
    this._handles = v;
    if (!this._disabled) {
      this._handles?.forEach(v => v.addEventListener('pointerdown', this._onpointerdown));
    }
  }
  get view() { return this._view; }
  set view(v) { this._view = v; }
  get ignores() { return this._ignores; }

  get disabled() { return this._disabled; }
  set disabled(v) {
    if (this._disabled === v) { return; }
    this._disabled = v;
    v ? this.stopListen() : this.startListen()
  }
  private startListen() {
    document.addEventListener('pointermove', this._pointermove);
    document.addEventListener('pointerup', this._pointerup);
    document.addEventListener('blur', this._blur)
    this.handles?.forEach(v => v.addEventListener('pointerdown', this._onpointerdown));
  }
  private stopListen() {
    document.removeEventListener('pointermove', this._pointermove);
    document.removeEventListener('pointerup', this._pointerup);
    document.removeEventListener('blur', this._blur)
    this._handles?.forEach(v => v.removeEventListener('pointerdown', this._onpointerdown));
  }
  constructor(inits?: IViewDraggerInits) {
    this.view = inits?.view;
    this._handles = inits?.handles ?? [];
    this.startListen();
  }
  destory() {
    this.stopListen();
  }
}
