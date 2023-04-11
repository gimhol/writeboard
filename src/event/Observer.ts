import { ICallback as ICallback, Emitter, ICancelFunc } from "./Emitter";
export interface IListenerBase {
  times: number;
  type: string;
  options?: boolean;
  canceller: ICancelFunc;
};
export interface IEmitterListener extends IListenerBase {
  target: Emitter;
  callback: ICallback;
};

export interface INativeCallback { (e: Event): void; };
export interface INativeListener extends IListenerBase {
  target: EventTarget;
  callback: INativeCallback;
};

export type Listener = IEmitterListener | INativeListener

export interface IObserver {
  listenTo(target: EventTarget, type: string, callback: INativeCallback): ICancelFunc;
  listenTo(target: Emitter, type: string, callback: ICallback): ICancelFunc;
  destory(): void
};

export class Observer implements IObserver {
  private _listeners: Listener[] = [];

  listenTo<K extends keyof GlobalEventHandlersEventMap>(target: EventTarget, type: K, callback: (e: GlobalEventHandlersEventMap[K]) => any): ICancelFunc;
  listenTo(target: EventTarget, type: string, callback: INativeCallback): ICancelFunc;
  listenTo(target: Emitter, type: string, callback: ICallback): ICancelFunc;
  listenTo(target: Emitter | EventTarget, type: string, callback: ICallback | INativeCallback): ICancelFunc;
  listenTo(target: Emitter | EventTarget, type: string, callback: ICallback | INativeCallback) {
    if (target instanceof Emitter) {
      const listener = target.addEventListener(type, callback as ICallback);
      this._listeners.push(listener);
      return listener.canceller;
    } else {
      const canceller = () => target.removeEventListener(type, callback as INativeCallback);
      target.addEventListener(type, callback as INativeCallback, undefined);
      const listener: INativeListener = {
        times: -1,
        target,
        type,
        callback: callback as INativeCallback,
        canceller
      }
      this._listeners.push(listener);
      return canceller;
    }
  }

  destory(): void {
    this._listeners.forEach(v => v.canceller());
  }
}
