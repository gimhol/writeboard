import { ICallback as ICallback, Emitter, ICancelFunc } from "./Emitter";
export interface IListenerBase {
    times: number;
    type: string;
    options?: boolean;
    canceller: ICancelFunc;
}
export interface IEmitterListener extends IListenerBase {
    target: Emitter;
    callback: ICallback;
}
export interface INativeCallback {
    (e: Event): void;
}
export interface INativeListener extends IListenerBase {
    target: EventTarget;
    callback: INativeCallback;
}
export type Listener = IEmitterListener | INativeListener;
export interface IObserver {
    listenTo(target: EventTarget, type: string, callback: INativeCallback): ICancelFunc;
    listenTo(target: Emitter, type: string, callback: ICallback): ICancelFunc;
    destory(): void;
}
export declare class Observer implements IObserver {
    private _listeners;
    listenTo<K extends keyof GlobalEventHandlersEventMap>(target: EventTarget, type: K, callback: (e: GlobalEventHandlersEventMap[K]) => any): ICancelFunc;
    listenTo(target: EventTarget, type: string, callback: INativeCallback): ICancelFunc;
    listenTo(target: Emitter, type: string, callback: ICallback): ICancelFunc;
    listenTo(target: Emitter | EventTarget, type: string, callback: ICallback | INativeCallback): ICancelFunc;
    destory(): void;
}
