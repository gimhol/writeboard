import { findIndex } from "../utils/Array"
import { BaseEvent } from "./Events"
import { Listener } from "./Observer"
export type ListenersMap = { [key in string]?: (Listener)[] }
export interface ICallback { (e: BaseEvent): void; };
export interface ICancelFunc { (): void; }
export interface IEmitter {
  addEventListener(type: string, callback: ICallback): void;
  dispatchEvent(event: BaseEvent): void;
  removeEventListener(type: string, callback: ICallback): void;
  on(type: string, callback: ICallback): ICancelFunc;
  once(type: string, callback: ICallback): ICancelFunc;
  emit(e: BaseEvent): void;
}

export class Emitter implements IEmitter {
  private _listenersMap: ListenersMap = {}
  constructor() { }

  addEventListener(type: string, callback: ICallback): Listener {
    const listeners = this._listenersMap[type] || []
    const canceller = () => this.removeEventListener(type, callback)
    const listener = { times: -1, callback, type, target: this, canceller }
    listeners.push(listener)
    this._listenersMap[type] = listeners
    return listener
  }

  removeEventListener(type: string, callback: ICallback): void {
    const listeners = this._listenersMap[type]
    const idx = listeners && findIndex(listeners, v =>
      v.type === type && v.callback === callback
    )
    if (idx !== undefined && idx >= 0)
      this._listenersMap[type] = listeners?.filter((_, i) => (i !== idx))
  }

  dispatchEvent(e: BaseEvent): void {
    const listeners = this._listenersMap[e.type]
    if (!listeners) { return; }
    for (let i = 0; i < listeners.length; ++i) {
      const listener = listeners[i];

      if (listener.target instanceof Emitter) {
        const { times, callback } = listener
        if (times > 1) {
          listeners[i].times = times - 1
        } else if (times === 0) {
          listeners.splice(i, 1);
        }
        (callback as ICallback)(e);
      }
    }
    return;
  }

  on(type: string, callback: ICallback): ICancelFunc {
    const listener = this.addEventListener(type, callback)
    return listener.canceller
  }

  once(type: string, callback: ICallback): ICancelFunc {
    const listener = this.addEventListener(type, callback)
    listener.times = 0
    return listener.canceller
  }

  emit(e: BaseEvent): void {
    this.dispatchEvent(e)
  }
}
