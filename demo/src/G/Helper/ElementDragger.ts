import { EventType } from "../Events/EventType";
export interface IElementDraggerInits {
  handles?: HTMLElement[];
  responser?: HTMLElement;
  ignores?: HTMLElement[];
  handlePos?: (x: number, y: number) => void
}
export class ElementDragger {
  private _handles: HTMLElement[] = [];
  private _ignores: HTMLElement[] = [];
  private _responser: HTMLElement | null = null;
  private _offsetX = 0;
  private _offsetY = 0;
  private _down = false;
  private _disabled = false;
  private _handlePos = (x: number, y: number) => {
    if (!this._responser) { return; }
    this._responser.style.left = `${x}px`;
    this._responser.style.top = `${y}px`;
  };
  private isIgnore(target: HTMLElement) {
    return this._ignores.indexOf(target) >= 0;
  }
  private _ondown = (target: HTMLElement, pageX: number, pageY: number) => {
    if (!this._responser) { return; }
    if (this.isIgnore(target)) { return; }
    const { left, top } = target.getBoundingClientRect();
    this._down = true;
    this._offsetX = pageX - left;
    this._offsetY = pageY - top;
    while (target !== this._responser) {
      this._offsetX += target.offsetLeft;
      this._offsetY += target.offsetTop;
      if (!target.parentElement) {
        break;
      }
      target = target.parentElement;
      if (this.isIgnore(target)) {
        this._down = false;
        return;
      }
    }
    if (this.isIgnore(target)) {
      this._down = false;
      return;
    }
    this.responser?.dispatchEvent(new Event(EventType.ViewDragStart))
  }
  private _onmove = (pageX: number, pageY: number) => {
    if (!this._responser || !this._down) { return; }
    this._handlePos(pageX - this._offsetX, pageY - this._offsetY);
    this.responser?.dispatchEvent(new Event(EventType.ViewDragging))
  }
  private _onup = () => {
    if (!this._down) return;
    this.responser?.dispatchEvent(new Event(EventType.ViewDragEnd))
    this._down = false;
  }

  private _onpointerdown = (e: PointerEvent) => {
    if (e.button !== 0) { return; }
    const target = (e.target as HTMLElement);
    this._ondown(target, e.pageX, e.pageY);
  };
  private _pointermove = (e: PointerEvent) => {
    this._onmove(e.pageX, e.pageY);
  };
  private _onpointerup = (e: PointerEvent) => {
    if (e.button !== 0) { return; }
    this._onup();
  };

  private _ontouchstart = (e: TouchEvent) => {
    if (e.touches.length !== 1) { return }
    const target = (e.target as HTMLElement);
    this._ondown(target, e.touches[0]!.pageX, e.touches[0]!.pageY);
  };
  private _ontouchmove = (e: TouchEvent) => {
    if (e.touches.length !== 1) { return }
    this._onmove(e.touches[0]!.pageX, e.touches[0]!.pageY);
  }
  private _ontouchend = (e: TouchEvent) => {
    if (e.touches.length !== 0) { return }
    this._onup();
  }
  private _onblur = () => this._onup()

  get handles() { return this._handles; }
  set handles(v) {
    this._handles.forEach(v => v.removeEventListener('pointerdown', this._onpointerdown));
    this._handles.forEach(v => v.removeEventListener('touchstart', this._ontouchstart));
    this._handles = v;
    if (!this._disabled) {
      this._handles.forEach(v => v.addEventListener('pointerdown', this._onpointerdown));
      this._handles.forEach(v => v.addEventListener('touchstart', this._ontouchstart, { passive: true }));
    }
  }
  get responser() { return this._responser; }
  set responser(v) { this._responser = v; }
  get ignores() { return this._ignores; }

  get disabled() { return this._disabled; }
  set disabled(v) {
    if (this._disabled === v) { return; }
    this._disabled = v;
    v ? this.stopListen() : this.startListen()
  }
  private startListen() {
    document.addEventListener('pointermove', this._pointermove);
    document.addEventListener('pointerup', this._onpointerup);
    document.addEventListener('blur', this._onblur)
    this._handles.forEach(v => v.addEventListener('pointerdown', this._onpointerdown));

    document.addEventListener('touchmove', this._ontouchmove);
    document.addEventListener('touchend', this._ontouchend);
    document.addEventListener('touchcancel', this._ontouchend);
    this._handles.forEach(v => v.addEventListener('touchstart', this._ontouchstart, { passive: true }));
  }

  private stopListen() {
    document.removeEventListener('pointermove', this._pointermove);
    document.removeEventListener('pointerup', this._onpointerup);
    document.removeEventListener('blur', this._onblur)
    this._handles.forEach(v => v.removeEventListener('pointerdown', this._onpointerdown));

    document.removeEventListener('touchmove', this._ontouchmove);
    document.removeEventListener('touchend', this._ontouchend);
    document.removeEventListener('touchcancel', this._ontouchend);
    this._handles.forEach(v => v.removeEventListener('touchstart', this._ontouchstart));
  }
  constructor(inits?: IElementDraggerInits) {
    inits?.responser && (this.responser = inits.responser);
    inits?.handles && (this._handles = inits.handles);
    inits?.ignores && (this._ignores = inits.ignores);
    inits?.handlePos && (this._handlePos = inits.handlePos);
    this.startListen();
  }
  destory() {
    this.stopListen();
  }
}
