import { Style } from "./StyleType";
import { ReValue, reValue } from "./utils";
import { View } from "./View";

export class Styles<T extends string = string>{
  private _view: View<keyof HTMLElementTagNameMap>;
  private _pool = new Map<T, Style>();
  private _applieds: T[] = [];
  get view() { return this._view; }
  constructor(view: View) {
    this._view = view;
  }
  pool(): Map<T, Style> { return this._pool; }
  read(name: T): Style {
    const ret = this._pool.get(name);
    if (!ret) { console.warn(`style '${name}' not found!`); }
    return ret ?? {};
  }
  register(name: T, style: ReValue<Style>): Styles<T> {
    this._pool.set(name, reValue(style, this._pool.get(name) ?? {}));
    return this;
  }

  add(...names: T[]): Styles<T> {
    names.forEach(name => {
      const idx = this._applieds.indexOf(name);
      if (idx >= 0) { this._applieds.splice(idx, 1); }
      this._applieds.push(name)
    });
    return this;
  }
  remove(...names: T[]): Styles<T> {
    names.forEach(name => {
      const idx = this._applieds.indexOf(name);
      if (idx >= 0)
        this._applieds.splice(idx, 1);
    });
    return this;
  }
  clear(): Styles<T> {
    this._applieds.length = 0;
    this.view.inner.removeAttribute('style');
    return this;
  }
  forgo(...names: T[]): Styles<T> {
    this.remove(...names).refresh();
    return this;
  }
  get applieds(): T[] { return this._applieds; }
  refresh() {
    this.view.inner.removeAttribute('style');
    Object.assign(this.view.inner.style, ...this._applieds.map(name => this.read(name)));
  }
  apply(name: T, style: ReValue<Style>): Styles<T> {
    this.register(name, style).add(name).refresh();
    return this;
  }


  applyCls(...names: string[]): Styles<T> {
    this.view.inner.className = Array.from(
      new Set(Array.from(this.view.inner.classList).concat(names))
    ).join(' ');
    return this;
  }
  removeCls(...names: string[]): Styles<T> {
    this.view.inner.className = Array.from(
      new Set(Array.from(this.view.inner.classList).filter(v => names.indexOf(v) < 0))
    ).join(' ');
    return this;
  }
}
