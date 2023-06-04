export interface IViewDraggerInits {
  handle?: HTMLElement;
  view?: HTMLElement;
}
export class ViewDragger {
  private _handle?: HTMLElement | null;
  private _view?: HTMLElement | null;
  private _offsetX = 0;
  private _offsetY = 0;
  private _down = false;

  private _onpointerdown = (e: PointerEvent) => {
    if (e.button !== 0) { return; }
    this._down = true;

    this._offsetX = e.offsetX;
    this._offsetY = e.offsetY;
    let ele = e.target as HTMLElement | null | undefined;

    while (ele && ele !== this._view) {
      this._offsetX += ele.offsetLeft
      this._offsetY += ele.offsetTop
      ele = ele.parentElement;
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
  get handle() { return this._handle; }
  set handle(v) {
    this._handle?.removeEventListener('pointerdown', this._onpointerdown);
    this._handle = v;
    this._handle?.addEventListener('pointerdown', this._onpointerdown);
  }

  get view() { return this._view; }
  set view(v) { this._view = v; }

  constructor(inits?: IViewDraggerInits) {
    this.view = inits?.view;
    this.handle = inits?.handle;
    document.addEventListener('pointermove', this._pointermove);
    document.addEventListener('pointerup', this._pointerup);
    document.addEventListener('blur', this._blur)
  }
  destory() {
    document.removeEventListener('pointermove', this._pointermove);
    document.removeEventListener('pointerup', this._pointerup);
    document.removeEventListener('blur', this._blur)
    this._handle?.removeEventListener('pointerdown', this._onpointerdown);
  }
}
