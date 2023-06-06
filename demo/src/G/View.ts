import { FocusOb, HoverOb } from "./HoverOb";
import { Style } from "./StyleType";
import { Styles } from "./Styles";


export class View<T extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap> {
  protected _inner: HTMLElementTagNameMap[T];
  private _cb?: (self: View) => void
  private _handleClick = () => { this._cb?.(this) };
  protected get cb() { return this._cb; }
  protected set cb(v) { this._cb = v; }
  protected get handleClick() { return this._handleClick; }
  protected set handleClick(v) {
    this._inner.removeEventListener('click', this._handleClick)
    this._handleClick = v;
    this._inner.addEventListener('click', this._handleClick)
  }
  get id() { return this.inner.id; }
  set id(v) { this.inner.id = v; }
  get inner() { return this._inner; }
  get parent() { return (this._inner.parentElement as any)?.view; }
  get children() { return Array.from(this._inner.children).map(v => (v as any)?.view) }
  get draggable() { return this._inner.draggable; }
  set draggable(v) { this._inner.draggable = v; }
  constructor(tagName: T) {
    this._inner = document.createElement(tagName);
    (this._inner as any).view = this;
  }

  protected _hoverOb?: HoverOb;
  get hover() { return this.hoverOb.hover }
  get hoverOb(): HoverOb {
    this._hoverOb = this._hoverOb ?? new HoverOb(this._inner, v => this.onHover(v))
    return this._hoverOb
  }
  onHover(hover: boolean) { }

  protected _focusOb?: FocusOb;
  get focused() { return this.focusOb.focused }
  get focusOb(): FocusOb {
    this._focusOb = this._focusOb ?? new FocusOb(this._inner, v => this.onFocus(v))
    return this._focusOb
  }
  onFocus(focused: boolean) { }


  onBeforeAdded(parent: View): void { }
  onAfterAdded(parent: View): void { }
  onBeforeRemoved(parent: View): void { }
  onAfterRemoved(parent: View): void { }
  addChild(...children: View[]) {
    children.forEach(child => {
      child.onBeforeAdded(this);
      this._inner.append(child.inner);
      child.onAfterAdded(this);
    })
  }
  insertBefore(child: View, anchor: View) {
    child.onBeforeAdded(this);
    this._inner.insertBefore(child.inner, anchor.inner);
    child.onAfterAdded(this);
  }
  removeChild(...children: View[]) {
    children.forEach(child => {
      child.onBeforeRemoved(this);
      this._inner.removeChild(child.inner);
      child.onAfterRemoved(this);
    })
  }
  onClick(cb: (self: View) => void): View {
    this.handleClick = () => this.cb?.(this);
    this.cb = cb as any;
    return this;
  }
  styles(): Styles<string> {
    if (!this._styleHolder) {
      this._styleHolder = new Styles<string>(this)
    }
    return this._styleHolder;
  }
  private _styleHolder?: Styles<string>;
}