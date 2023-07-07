import { Style, autoPxKeys } from "./StyleType";
import { ReValue, reValue } from "../utils";
import { View } from "./View";

export class Styles<T extends string = string, V extends View<keyof HTMLElementTagNameMap> = View<keyof HTMLElementTagNameMap>>{
  static csses = new Map<string, HTMLLinkElement>();
  static pendings = new Map<string, Promise<HTMLLinkElement>>;

  static css(...hrefs: string[]): Promise<HTMLLinkElement[]> {
    const ls: Promise<HTMLLinkElement>[] = [];
    for (let i = 0; i < hrefs.length; ++i) {
      const href = hrefs[i]!;
      const l = this.csses.get(href);
      if (l) {
        ls.push(Promise.resolve(l));
        continue;
      }

      const p = this.pendings.get(href);
      if (p) {
        ls.push(p);
        continue;
      }

      const n = new Promise<HTMLLinkElement>((resolve, reject) => {
        const l = document.createElement('link');
        l.rel = 'stylesheet';
        l.href = href;
        l.onload = () => {
          this.csses.set(href, l);
          this.pendings.delete(href);
          resolve(l)
        };
        l.onerror = (e) => {
          this.csses.set(href, l);
          this.pendings.delete(href);
          resolve(l)
        };
        document.head.appendChild(l);
      })
      this.pendings.set(href, n);
      ls.push(n);
    }
    return Promise.all(ls);
  }

  private _view?: V;
  private _pool?: Map<T, Style | null>;
  private _applieds?: Set<T>;
  get view() { return this._view!; }
  get pool(): Map<T, Style | null> {
    this._pool = this._pool ?? new Map<T, Style | null>();
    return this._pool;
  }
  get applieds(): Set<T> {
    this._applieds = this._applieds ?? new Set<T>();
    return this._applieds;
  }
  constructor(view: V) {
    this._view = view;
  }
  read(name: T): Style {
    const ret = this.pool.get(name);
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
      const existed = this.pool.get(name);
      processed = reValue(style, existed ?? {})
    }
    this.pool.set(name, processed);
    return this;
  }

  edit(name: T, style: (s: Style) => Style): this {
    const old = this.pool.get(name);
    if (old === undefined) {
      console.warn(`[styles] edit(), style '${name}' not found!`);
      return this;
    }
    this.pool.set(name, style(old ?? {}));
    return this;
  }
  merge(name: T, style: Style): this {
    const old = this.pool.get(name);
    if (old === undefined) {
      console.warn(`[styles] merge(), style '${name}' not found!`);
      return this;
    }
    this.pool.set(name, { ...old, ...style });
    return this;
  }

  add(...names: T[]): this {
    names.forEach(name => this.applieds.add(name));
    return this;
  }
  del(...names: T[]): this {
    names.forEach(name => this.applieds.delete(name));
    return this;
  }
  clear(): this {
    this.applieds.clear();
    this.view?.inner.removeAttribute('style');
    return this;
  }
  forgo(...names: T[]): this {
    this.del(...names).refresh();
    return this;
  }
  refresh() {
    this.view?.inner.removeAttribute('style');
    const final: Style = {}
    this.applieds.forEach(name => {
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

  setCls(...names: string[]): this {
    this.view.inner.className = '';
    return this.addCls(...names);
  }
  addCls(...names: string[]): this {
    this.view.inner.classList.add(...names)
    return this;
  }
  delCls(...names: string[]): this {
    this.view.inner.classList.remove(...names)
    return this;
  }

  destory() {
    delete this._view;
    this.pool.clear();
    this.applieds.clear();
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
