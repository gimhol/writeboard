import { Callback, Emitter } from "./Emitter";
export interface Listener {
  times: number
  target: EventTarget
  type: string
  callback: Callback | null
  options?: boolean | AddEventListenerOptions
  canceller: () => void
}
export interface IObserver {
  listenTo(
    target: EventTarget,
    type: string,
    callback: Callback | null,
    options?: boolean | AddEventListenerOptions
  ): () => void
  destory(): void
}
export class Observer implements IObserver {
  private _listeners: Listener[] = [];
  listenTo(
    target: EventTarget,
    type: string,
    callback: Callback | null,
    options?: boolean | AddEventListenerOptions
  ) {
    if (target instanceof Emitter) {
      const { canceller } = target.addEventListener(type, callback, options);
      return canceller
    }
    const canceller = () => target.removeEventListener(type, callback, options)
    const listener = { times: -1, target, type, callback, canceller }
    target.addEventListener(type, callback, options);
    this._listeners.push(listener);
    return canceller
  }
  destory() {
    this._listeners.forEach(v => v.canceller());
  }
}
