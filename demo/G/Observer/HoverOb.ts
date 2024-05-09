import { IObserver } from "./Base";
export class HoverOb implements IObserver {
  get target() { return this._target; }
  set target(v) { v && this.setTarget(v); }
  get hover() {
    if (!this._target) { return; }
    if (getComputedStyle(this._target).pointerEvents === 'none') {
      return false;
    } else {
      return this._hover;
    }
  }
  get disabled() { return this._disabled }
  set disabled(v) { this.setDisabled(v); }
  constructor(target?: HTMLElement) {
    this.target = target;
  }
  setTarget(target?: HTMLElement): this {
    if (this._target) {
      this._target.removeEventListener('mouseenter', this._mouseenter);
      this._target.removeEventListener('mouseleave', this._mouseleave);
    }
    this._target = target;
    if (!this._disabled && this._target) {
      this._target.addEventListener('mouseenter', this._mouseenter);
      this._target.addEventListener('mouseleave', this._mouseleave);
    }
    return this;
  }
  setDisabled(disabled: boolean): this {
    if (this._disabled === disabled) { return this; }
    this._disabled = disabled;
    if (disabled) {
      this._hover = false;
      this._target?.removeEventListener('mouseenter', this._mouseenter);
      this._target?.removeEventListener('mouseleave', this._mouseleave);
    } else {
      this._target?.addEventListener('mouseenter', this._mouseenter);
      this._target?.addEventListener('mouseleave', this._mouseleave);
    }
    return this;
  }
  setCallback(callback: (hover: boolean, e: MouseEvent) => void): this {
    this._callback = callback;
    return this;
  }
  destory() {
    this._target?.removeEventListener('mouseenter', this._mouseenter);
    this._target?.removeEventListener('mouseleave', this._mouseleave);
    this.disabled = true;
    delete this._target;
    delete this._callback;

  }

  private _target?: HTMLElement;
  private _disabled = false;
  private _hover = false;
  private _mouseenter = (e: MouseEvent) => {
    this._hover = true;
    this._callback?.(this._hover, e);
  }
  private _mouseleave = (e: MouseEvent) => {
    this._hover = false;
    this._callback?.(this._hover, e);
  }
  private _callback?: (hover: boolean, e: MouseEvent) => void;
}