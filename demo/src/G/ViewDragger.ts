export interface IViewDraggerInits {
  handles?: HTMLElement[];
  view?: HTMLElement;
}
export class ViewDragger {
  private _handles: HTMLElement[] = [];
  private _ignores: HTMLElement[] = [];
  private _view?: HTMLElement;
  private _offsetX = 0;
  private _offsetY = 0;
  private _down = false;

  private _onpointerdown = (e: PointerEvent) => {
    if (e.button !== 0) { return; }
    let ele = e.target as HTMLElement | null | undefined;
    if (ele && this._ignores.indexOf(ele) >= 0) {
      return;
    }
    this._down = true;
    this._offsetX = e.offsetX;
    this._offsetY = e.offsetY;
    while (ele && ele !== this._view) {
      this._offsetX += ele.offsetLeft
      this._offsetY += ele.offsetTop
      ele = ele.parentElement;
      if (ele && this._ignores.indexOf(ele) >= 0) {
        this._down = false;
        return;
      }
    }
    if (ele && this._ignores.indexOf(ele) >= 0) {
      this._down = false;
      return;
    }
  };
  private _pointermove = (e: PointerEvent) => {
    if (!this._view) { return; }
    if (!this._down) { return; }
    this._view.style.left = '' + (e.pageX - this._offsetX) + 'px';
    this._view.style.top = '' + (e.pageY - this._offsetY) + 'px';
  };
  private _pointerup = (e: PointerEvent) => {
    if (e.button !== 0) { return; }
    this._down = false;
  };
  private _blur = () => {
    this._down = false;
  }
  get handles() { return this._handles; }
  set handles(v) {
    this._handles?.forEach(v => v.removeEventListener('pointerdown', this._onpointerdown));
    this._handles = v;
    this._handles?.forEach(v => v.addEventListener('pointerdown', this._onpointerdown));
  }
  get view() { return this._view; }
  set view(v) { this._view = v; }
  get ignores() { return this._ignores; }
  constructor(inits?: IViewDraggerInits) {
    this.view = inits?.view;
    inits?.handles && (this.handles = inits?.handles);
    document.addEventListener('pointermove', this._pointermove);
    document.addEventListener('pointerup', this._pointerup);
    document.addEventListener('blur', this._blur)
  }
  destory() {
    document.removeEventListener('pointermove', this._pointermove);
    document.removeEventListener('pointerup', this._pointerup);
    document.removeEventListener('blur', this._blur)
    this._handles?.forEach(v => v.removeEventListener('pointerdown', this._onpointerdown));
  }
}
