import { HoverOb } from "./HoverOb";
import { Style } from "./Styles";

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

  get inner() { return this._inner; }
  get parent() { return (this._inner.parentElement as any)?.view; }
  get children() { return Array.from(this._inner.children).map(v => (v as any)?.view) }
  constructor(tagName: T) {
    this._inner = document.createElement(tagName);
    (this._inner as any).view = this;
  }
  hoverOb(): HoverOb {
    if (!this._hoverOb) {
      this._hoverOb = new HoverOb(this._inner, v => this.onHover(v))
    }
    return this._hoverOb!
  }
  private _hoverOb?: HoverOb;
  onBeforeAdded(parent: View): void { }
  onAfterAdded(parent: View): void { }
  onBeforeRemoved(parent: View): void { }
  onAfterRemoved(parent: View): void { }
  onHover(hover: boolean) { }
  addChild(child: View) {
    child.onBeforeAdded(this);
    this._inner.append(child.inner);
    child.onAfterAdded(this);
  }
  insertBefore(child: View, anchor: View) {
    child.onBeforeAdded(this);
    this._inner.insertBefore(child.inner, anchor.inner);
    child.onAfterAdded(this);
  }
  removeChild(child: View) {
    child.onBeforeRemoved(this);
    this._inner.removeChild(child.inner);
    child.onAfterRemoved(this);
  }
  onClick(cb: (self: View) => void): View {
    this.handleClick = () => this.cb?.(this);
    this.cb = cb as any;
    return this;
  }
  styleHolder(): StyleHolder<string> {
    if (!this._styleHolder) {
      this._styleHolder = new StyleHolder<string>(this)
    }
    return this._styleHolder;
  }
  private _styleHolder?: StyleHolder<string>;
}

export class StyleHolder<T extends string = string> implements IStyleHolder<T>{
  private _view: View<keyof HTMLElementTagNameMap>;
  private _styles = new Map<T, Style>();
  private _appliedStyles = new Map<T, Style>();

  get view() { return this._view; }
  constructor(view: View) {
    this._view = view;
  }
  styles(): Map<T, Style> { return this._styles; }
  applieds(): Map<T, Style> { return this._appliedStyles; }
  getStyle(name: T): Style | undefined { return this._styles.get(name) }
  setStyle(name: T, style: Style | ((old: Style) => Style)): StyleHolder<T> {
    const s = typeof style === 'function' ? style(this.getStyle(name) ?? {}) : style;
    this._styles.set(name, s);
    return this;
  }
  clearApplieds(): StyleHolder<T> {
    this._appliedStyles.clear();
    this.view.inner.removeAttribute('style');
    return this;
  }
  applyStyle(name: T, style: Style | ((old: Style) => Style)): StyleHolder<T>;
  applyStyle(...names: T[]): StyleHolder<T>;
  applyStyle(...args: any[]): StyleHolder<T> {
    if (typeof args[1] === 'object') {
      this.setStyle(args[0], args[1])
      this._appliedStyles.set(args[0], args[1]);
      Object.assign(this.view.inner.style, args[1]);
    } else {
      args.forEach(name => this._appliedStyles.set(name, this._styles.get(name) ?? {}))
      Object.assign(this.view.inner.style, ...args.map(name => this._styles.get(name)));
    }
    return this;
  }
  applyClass(...names: string[]): StyleHolder<T> {
    this.view.inner.className = Array.from(
      new Set(Array.from(this.view.inner.classList).concat(names))
    ).join(' ');
    return this;
  }
  removeClass(...names: string[]): StyleHolder<T> {
    this.view.inner.className = Array.from(
      new Set(Array.from(this.view.inner.classList).filter(v => names.indexOf(v) < 0))
    ).join(' ');
    return this;
  }
}

interface IStyleHolder<T extends string = string> {
  getStyle(name: T): Style | undefined;
  setStyle(name: T, style: Style | ((old: Style) => Style)): void
  clearApplieds(): void
  applyStyle(...names: T[]): void
}