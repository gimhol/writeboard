

export enum StateEventType {
  Change = 'G_STATE_CHANGE'
}
export interface StateEventTypeEventMap<D extends object> {
  [StateEventType.Change]: CustomEvent<{ prev: D, curr: D }>
}
export class State<D extends object> {
  private _value: D;
  private _owner?: HTMLElement;
  private _elements = new Set<HTMLElement>();
  private _timer?: number;

  get value() { return this._value; }

  constructor(inits: D) {
    this._value = new Proxy(inits, {
      set: (target, p, newValue) => {
        if ((target as any)[p] === newValue) {
          return true;
        }
        
        if (!this._timer) {
          const prev = { ...target };

          this._timer = setTimeout(() => {
            if (!this._elements.size && !this._owner) { return }
            const curr = { ...target, [p]: newValue };
            const e: StateEventTypeEventMap<D>[StateEventType.Change] = new CustomEvent(
              StateEventType.Change, { detail: { prev, curr } }
            );
            this._owner?.dispatchEvent(e);
            this._elements.forEach(ele => ele.dispatchEvent(e))
            delete this._timer;
          }, 1)
        }
        (target as any)[p] = newValue;
        return true;
      },
    });
  }

  connect(ele: HTMLElement): this {
    if (this._elements.has(ele)) {
      return this;
    }
    return this;
  }

  disconnect(ele: HTMLElement): this {
    if (!this._elements.has(ele)) {
      return this;
    }
    return this;
  }

  setOwner(ele: HTMLElement): this {
    this._owner = ele;
    return this;
  }

  addEventListener<K extends keyof StateEventTypeEventMap<D>>(
    type: K, listener: (this: HTMLElement, ev: StateEventTypeEventMap<D>[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void {
    return this._owner?.addEventListener(type.toString(), listener as any, options);
  }

  removeEventListener<K extends keyof StateEventTypeEventMap<D>>(
    type: K, listener: (this: HTMLElement, ev: StateEventTypeEventMap<D>[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void {
    return this._owner?.removeEventListener(type.toString(), listener as any, options);
  }
}
