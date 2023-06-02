
export class View<T extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap> {
  protected _inner: HTMLElementTagNameMap[T];
  private _cb?: (self: View) => void
  private _handleClick = () => this._cb?.(this);
  protected get cb() { return this._cb; }
  protected set cb(v) {
    this._cb = v;
  }
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
  onBeforeAdded(parent: View): void { }
  onAfterAdded(parent: View): void { }
  onBeforeRemoved(parent: View): void { }
  onAfterRemoved(parent: View): void { }
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
}
