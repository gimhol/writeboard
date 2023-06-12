import { Style, autoPxKeys } from "./StyleType";
import { ReValue, reValue } from "../utils";
import { View } from "./View";

export class Styles<T extends string = string>{
  private _view: View<keyof HTMLElementTagNameMap>;
  private _pool = new Map<T, Style | null>();
  private _applieds = new Set<T>();
  get view() { return this._view; }
  get pool(): Map<T, Style | null> { return this._pool; }
  get applieds(): Set<T> { return this._applieds; }

  constructor(view: View) {
    this._view = view;
  }
  read(name: T): Style {
    const ret = this._pool.get(name);
    if (!ret) { console.warn(`[styles] read(), style '${name}' not found!`); }
    return ret ?? {};
  }

  registers(styles: Record<T, ReValue<Style>>): this {
    for (const name in styles) {
      this.register(name, styles[name])
    }
    return this;
  }

  register(name: T, style?: ReValue<Style>): this {
    let processed: Style = {}
    if (style) {
      const existed = this._pool.get(name);
      processed = reValue(style, existed ?? {})
    }
    this._pool.set(name, processed);
    return this;
  }

  edit(name: T, style: (s: Style) => Style): this {
    const old = this._pool.get(name);
    if (old === undefined) {
      console.warn(`[styles] edit(), style '${name}' not found!`);
      return this;
    }
    this._pool.set(name, style(old ?? {}));
    return this;
  }
  merge(name: T, style: Style): this {
    const old = this._pool.get(name);
    if (old === undefined) {
      console.warn(`[styles] merge(), style '${name}' not found!`);
      return this;
    }
    this._pool.set(name, { ...old, ...style });
    return this;
  }

  add(...names: T[]): this {
    names.forEach(name => this._applieds.add(name));
    return this;
  }
  remove(...names: T[]): this {
    names.forEach(name => this._applieds.delete(name));
    return this;
  }
  clear(): this {
    this._applieds.clear();
    this.view.inner.removeAttribute('style');
    return this;
  }
  forgo(...names: T[]): this {
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

  /**
   * 应用一个已存在的样式
   *
   * @param {T} name 样式名
   * @return {this} 返回this
   * @memberof Styles
   */
  apply(name: T): this;

  /**
   * 合并一个样式并应用，
   *
   * @param {T} name 样式名
   * @param {ReValue<Style>} style 样式或者样式处理函数
   * @return {this} 返回this
   * @memberof Styles
   */
  apply(name: T, style: ReValue<Style>): this;
  apply(name: T, style?: ReValue<Style>): this {
    if (style) {
      this.register(name, style).add(name).refresh();
    } else {
      this.add(name).refresh();
    }
    return this;
  }

  resetCls(...names: string[]): this {
    this.view.inner.className = '';
    return this.applyCls(...names);
  }
  applyCls(...names: string[]): this {
    this.view.inner.classList.add(...names)
    return this;
  }
  removeCls(...names: string[]): this {
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
