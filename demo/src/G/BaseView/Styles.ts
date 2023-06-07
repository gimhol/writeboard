import { Style } from "./StyleType";
import { ReValue, reValue } from "../utils";
import { View } from "./View";

export class Styles<T extends string = string>{
  private _view: View<keyof HTMLElementTagNameMap>;
  private _pool = new Map<T, Style>();
  private _applieds = new Set<T>();
  get view() { return this._view; }
  constructor(view: View) {
    this._view = view;
  }
  pool(): Map<T, Style> { return this._pool; }
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
  get applieds(): Set<T> { return this._applieds; }
  refresh() {
    this.view.inner.removeAttribute('style');
    this._applieds.forEach(name => {
      const style = this.makeUp(this.read(name));
      Object.assign(this.view.inner.style, style)
    });
  }

  apply(name: T, style: ReValue<Style>): Styles<T> {
    this.register(name, style).add(name).refresh();
    return this;
  }
  applyCls(...names: string[]): Styles<T> {
    names.forEach(name => this.view.inner.classList.add(name))
    return this;
  }
  removeCls(...names: string[]): Styles<T> {
    names.forEach(name => this.view.inner.classList.remove(name))
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
const autoPxKeys = new Set<keyof Style>([
  'width',
  'height',
  'maxWidth',
  'maxHeight',
  'minWidth',
  'minHeight',
  'left',
  'right',
  'top',
  'bottom',
  'borderRadius',
  'borderTopLeftRadius',
  'borderTopRightRadius',
  'borderBottomLeftRadius',
  'borderBottomRightRadius',
  'fontSize',
  'lineHeight',
  'padding',
  'paddingLeft',
  'paddingRight',
  'paddingBottom',
  'paddingTop',
  'margin',
  'marginLeft',
  'marginRight',
  'marginBottom',
  'marginTop',
])