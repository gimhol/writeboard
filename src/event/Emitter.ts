import { findIndex } from "../utils/Array"
import { BaseEvent } from "./Events"
import { Listener } from "./Observer"
export type Options = boolean | EventListenerOptions
export type Callback = EventListenerOrEventListenerObject
export type ListenersMap = { [key in string]?: (Listener)[] }
export interface IEmitter extends EventTarget {
  on(type: string,
    callback: Callback,
    options?: Options): () => void
  once(type: string,
    callback: Callback,
    options?: Options): () => void
  emit(e: Event): void
}
export class Emitter implements IEmitter {
  private _listenersMap: ListenersMap = {}
  private _target: EventTarget
  constructor(target?: EventTarget) {
    this._target = target || this
  }
  addEventListener(
    type: string,
    callback: Callback | null,
    options?: Options): Listener {
    const listeners = this._listenersMap[type] || []
    const canceller = () => this.removeEventListener(type, callback, options)
    const listener = { times: -1, callback, options, type, target: this._target, canceller }
    listeners.push(listener)
    this._listenersMap[type] = listeners
    return listener
  }
  removeEventListener(
    type: string,
    callback: Callback | null,
    options?: Options
  ): void {
    const listeners = this._listenersMap[type]
    const idx = listeners && findIndex(listeners, v =>
      v.type === type && v.callback === callback && JSON.stringify(v.options) === JSON.stringify(options)
    )
    if (idx !== undefined && idx >= 0)
      this._listenersMap[type] = listeners?.filter((_, i) => (i !== idx))
  }
  dispatchEvent(e: BaseEvent): boolean {
    e.target = this
    const ret = !e.cancelable || !e.defaultPrevented
    const listeners = this._listenersMap[e.type]
    if (!listeners) return ret
    for (let i = 0; i < listeners.length; ++i) {
      const { times, callback } = listeners[i]
      if (times > 1)
        listeners[i].times = times - 1
      else if (times === 0)
        listeners.splice(i, 1)

      if (!callback) continue
      if (typeof callback === 'function')
        callback(e)
      else
        callback.handleEvent(e)
    }
    return ret
  }
  on(
    type: string,
    callback: Callback,
    options?: Options) {
    const listener = this.addEventListener(type, callback, options)
    return listener.canceller
  }
  once(
    type: string,
    callback: Callback,
    options?: Options) {
    const listener = this.addEventListener(type, callback, options)
    listener.times = 0
    return listener.canceller
  }
  emit(e: BaseEvent): boolean {
    return this.dispatchEvent(e)
  }
}
