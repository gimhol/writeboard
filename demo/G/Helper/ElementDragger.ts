import { EventType, ViewEventMap } from "../Events/EventType";
export interface OnMoveCallback {
  (x: number, y: number, oldX: number, oldY: number): void
}
export interface OnDownCallback { (): void; }
export interface OnUpCallback { (): void; }
export interface IElementDraggerInits {
  handles?: HTMLElement[];
  responser?: HTMLElement;
  ignores?: HTMLElement[];
  handleDown?: OnDownCallback;
  handleMove?: OnMoveCallback;
  handleUp?: OnUpCallback;
}
export class ElementDragger {
  get offsetX() { return this._offsetX; }
  get offsetY() { return this._offsetY; }
  set offsetX(v) { this._offsetX = v; }
  set offsetY(v) { this._offsetY = v; }

  private _handles: HTMLElement[] = [];
  private _ignores: HTMLElement[] = [];
  private _responser: HTMLElement | null = null;
  private _offsetX = 0;
  private _offsetY = 0;
  private _down = false;
  private _disabled = false;
  private _oldX: number = 0;
  private _oldY: number = 0;
  private _handleMove: OnMoveCallback | undefined = (x, y) => {
    if (!this._responser) { return; }
    this._responser.style.left = `${x}px`;
    this._responser.style.top = `${y}px`;
  };
  private _handleDown: OnDownCallback | undefined;
  private _handleUp: OnUpCallback | undefined;
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
    this._oldX = left;
    this._oldY = top;
    this._handleDown?.()
    const event: ViewEventMap[EventType.ViewDragStart] = new CustomEvent(
      EventType.ViewDragStart, {
      detail: { pageX, pageY, dragger: this }
    });
    this.responser?.dispatchEvent(event);
    event.preventDefault();
    event.stopPropagation();
  }
  private _onmove = (pageX: number, pageY: number) => {
    if (!this._responser || !this._down) { return; }
    this._handleMove?.(
      pageX - this._offsetX,
      pageY - this._offsetY,
      this._oldX,
      this._oldY,
    );
    const event: ViewEventMap[EventType.ViewDragging] = new CustomEvent(
      EventType.ViewDragging, {
      detail: { pageX, pageY, dragger: this }
    });
    this.responser?.dispatchEvent(event);
    event.preventDefault();
    event.stopPropagation();
  }
  private _onup = () => {
    if (!this._down) return;
    this._handleUp?.()

    const event: ViewEventMap[EventType.ViewDragEnd] = new CustomEvent(
      EventType.ViewDragEnd, {
      detail: { dragger: this }
    });
    this.responser?.dispatchEvent(event)
    this._down = false;
    event.preventDefault();
    event.stopPropagation();
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
    this._handles.forEach(v => v.removeEventListener('pointerdown', this._onpointerdown, true));
    this._handles.forEach(v => v.removeEventListener('touchstart', this._ontouchstart, true));
    this._handles = v;
    if (!this._disabled) {
      this._handles.forEach(v => v.addEventListener('pointerdown', this._onpointerdown, true));
      this._handles.forEach(v => v.addEventListener('touchstart', this._ontouchstart, { capture: true, passive: false }));
    }
  }
  set handleMove(v: OnMoveCallback | undefined) { this._handleMove = v }
  set handleDown(v: OnDownCallback | undefined) { this._handleDown = v }
  set handleUp(v: OnUpCallback | undefined) { this._handleUp = v }
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
    document.addEventListener('pointermove', this._pointermove, true);
    document.addEventListener('pointerup', this._onpointerup, true);
    document.addEventListener('blur', this._onblur)
    this._handles.forEach(v => v.addEventListener('pointerdown', this._onpointerdown, true));

    document.addEventListener('touchmove', this._ontouchmove, true);
    document.addEventListener('touchend', this._ontouchend, true);
    document.addEventListener('touchcancel', this._ontouchend);
    this._handles.forEach(v => v.addEventListener('touchstart', this._ontouchstart, { capture:true, passive: true }));
  }

  private stopListen() {
    document.removeEventListener('pointermove', this._pointermove, true);
    document.removeEventListener('pointerup', this._onpointerup, true);
    document.removeEventListener('blur', this._onblur)
    this._handles.forEach(v => v.removeEventListener('pointerdown', this._onpointerdown));

    document.removeEventListener('touchmove', this._ontouchmove, true);
    document.removeEventListener('touchend', this._ontouchend, true);
    document.removeEventListener('touchcancel', this._ontouchend);
    this._handles.forEach(v => v.removeEventListener('touchstart', this._ontouchstart));
  }
  constructor(inits?: IElementDraggerInits) {
    inits?.responser && (this.responser = inits.responser);
    inits?.handles && (this._handles = inits.handles);
    inits?.ignores && (this._ignores = inits.ignores);
    inits?.handleMove && (this._handleMove = inits.handleMove);
    this._handleDown = inits?.handleDown;
    this._handleUp = inits?.handleUp;
    this.startListen();
  }
  destory() {
    this.stopListen();
  }
}
