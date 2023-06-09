import { Style, autoPxKeys } from "./StyleType";
import { ReValue, reValue } from "../utils";
import { View } from "./View";

export class Styles<T extends string = string>{
  private _view: View<keyof HTMLElementTagNameMap>;
  private _pool = new Map<T, Style>();
  private _applieds = new Set<T>();
  get view() { return this._view; }
  get pool(): Map<T, Style> { return this._pool; }
  get applieds(): Set<T> { return this._applieds; }

  constructor(view: View) {
    this._view = view;
  }
  read(name: T): Style {
    const ret = this._pool.get(name);
    if (!ret) { console.warn(`[styles] read(), style '${name}' not found!`); }
    return ret ?? {};
  }

  register(name: T, style: ReValue<Style>): Styles<T> {
    this._pool.set(name, reValue(style, this._pool.get(name) ?? {}));
    return this;
  }

  edit(name: T, style: (s: Style) => Style): Styles<T> {
    const old = this._pool.get(name);
    if (!old) {
      console.warn(`[styles] edit(), style '${name}' not found!`);
      return this;
    }
    this._pool.set(name, style(old));
    return this;
  }
  merge(name: T, style: Style): Styles<T> {
    const old = this._pool.get(name);
    if (!old) {
      console.warn(`[styles] merge(), style '${name}' not found!`);
      return this;
    }
    this._pool.set(name, { ...old, ...style });
    return this;
  }

  add(...names: T[]): Styles<T> {
    names.forEach(name => this._applieds.add(name));
    return this;
  }
  remove(...names: T[]): Styles<T> {
    names.forEach(name => this._applieds.delete(name));
    return this;
  }
  clear(): Styles<T> {
    this._applieds.clear();
    this.view.inner.removeAttribute('style');
    return this;
  }
  forgo(...names: T[]): Styles<T> {
    this.remove(...names).refresh();
    return this;
  }
  refresh() {
    this.view.inner.removeAttribute('style');
    const final: Style = {}
    this._applieds.forEach(name => {
      Object.assign(final, this.makeUp(this.read(name)))
    });
    Object.assign(this.view.inner.style, final)
  }

  apply(name: T, style: ReValue<Style>): Styles<T> {
    this.register(name, style).add(name).refresh();
    return this;
  }
  resetCls(...names: string[]): Styles<T> {
    this.view.inner.className = '';
    return this.applyCls(...names);
  }
  applyCls(...names: string[]): Styles<T> {
    this.view.inner.classList.add(...names)
    return this;
  }
  removeCls(...names: string[]): Styles<T> {
    this.view.inner.classList.remove(...names)
    return this;
  }
  private makeUp(style: Style): Style {
    const ret: Style = { ...style }
    autoPxKeys.forEach(key => {
      if (typeof ret[key] === 'number') {
        (ret as any)[key] = `${ret[key]}px`
      }
    })
    return ret;
  }
}
