

export type EleMap = HTMLElementTagNameMap
export type EleMapKey = keyof EleMap
export type EleEventMap = HTMLElementEventMap
export type EleEventMapKey = keyof EleEventMap
export interface EleRender<
  T, S extends Obj,
  SK extends keyof Obj = keyof Obj,
  AK extends string = string,
> { (ele: T, ui: UI<S, SK, AK>): void }
export type Obj = { [key in string | number | symbol]?: any };
export interface InitEle<
  S extends Obj,
  SK extends keyof Obj = keyof Obj,
  AK extends string = string,
> { (ui: UI<S, SK, AK>): void };

export interface Style extends Partial<CSSStyleDeclaration> { };
export interface Opts<
  T extends keyof EleMap = keyof EleMap,
  K extends keyof EleEventMap = keyof EleEventMap,
  S extends Obj = Obj,
  SK extends keyof S = keyof S,
  AK extends string = string,
> {
  alias?: AK;
  style?: Style;
  attrs?: { [key in string]: string };
  on?: { [x in K]?: (ev: EleEventMap[K], ele: EleMap[T], ui: UI<S, SK, AK>) => any };
  offscreen?: boolean;
  listens?: ([SK[], (ele: EleMap[T], ui: UI<S, SK, AK>) => any] | [SK[]])[];
}

interface ListenerInfo {
  update?: (...args: any[]) => any,
  callback?: (...args: any[]) => any,
  ele: HTMLElement
}
export class UI<
  S extends Obj,
  SK extends keyof Obj = keyof Obj,
  AK extends string = string,
> {
  private _eleRoot?: HTMLElement;
  private _eleStack: HTMLElement[] = [];
  _eles: { [x in AK]?: HTMLElement } = {}
  private _listens: { [x in keyof S]?: ListenerInfo[] } = {}

  state: S

  constructor(container: HTMLElement, initState: () => S, initEle: InitEle<S, SK, AK>) {
    this._eleStack = [container];
    this.state = initState();
    initEle(this);
  }

  setState(state: Partial<S>) {
    setTimeout(() => {
      Object.assign(this.state, state);
      const set = new Set<ListenerInfo>();
      for (const key in state) {
        this._listens[key]?.forEach(cb => set.add(cb));
      }
      set.forEach(cb => {
        cb.callback?.(cb.ele, this);
        cb.update?.(cb.ele, this);
      })
    }, 1)
  }

  private applyOpts<T extends EleMapKey>(
    ele: EleMap[T] | undefined,
    opts?: Opts<T, EleEventMapKey, S, SK, AK>
  ) {
    if (!ele || !opts) return
    for (const key in opts) {
      if (key === 'style' || key === 'attrs') continue
      (ele as any)[key] = (opts as any)[key]
    }
    for (const key in opts?.style) {
      (ele.style as any)[key] = (opts?.style as any)[key]
    }
    for (const key in opts?.attrs) {
      ele.setAttribute(key, (opts!.attrs as any)[key])
    }
    for (const key in opts?.on) {
      const listener = opts.on[key as EleEventMapKey]!;
      ele.addEventListener(key, (e) => listener(e, ele, this));
    }
  }

  private appendChild<T extends EleMapKey>(
    parent: HTMLElement,
    child: EleMap[T],
    options?: Opts<T, EleEventMapKey, S, SK, AK>
  ) {
    if (parent === this._eleStack[0]) {
      if (!options?.offscreen)
        this._eleRoot ? parent.replaceChild(child, this._eleRoot) : parent.appendChild(child)
      this._eleRoot = child
    } else {
      !options?.offscreen && parent.appendChild(child)
    }
  }

  ele<T extends EleMapKey>(
    tagName: T,
    opts?: Omit<Partial<EleMap[T]>, 'style'> & Opts<T, EleEventMapKey, S, SK, AK>,
    render?: EleRender<EleMap[T], S, SK, AK>
  ): EleMap[T] {
    const endIdx = this._eleStack.length - 1;
    const parent = this._eleStack[endIdx];
    const ele: EleMap[T] = document.createElement(tagName);
    this.applyOpts(ele, opts)

    if (opts?.alias) {
      this._eles[opts.alias] = ele;
    }

    this._eleStack.push(ele)
    render && render(ele, this)
    opts?.listens?.forEach(([keys, callback]) => {
      keys.forEach((key) => {
        this._listens[key] = this._listens[key] || [];
        this._listens[key]?.push({ ele: ele, callback, update: render });
      })
    });

    this.appendChild(parent, ele, opts)
    this._eleStack.pop()
    return ele;
  }
}