import { Callback } from "./Emitter";
export interface Listener {
    times: number;
    target: EventTarget;
    type: string;
    callback: Callback | null;
    options?: boolean | AddEventListenerOptions;
    canceller: () => void;
}
export interface IObserver {
    listenTo(target: EventTarget, type: string, callback: Callback | null, options?: boolean | AddEventListenerOptions): () => void;
    destory(): void;
}
export declare class Observer implements IObserver {
    private _listeners;
    listenTo(target: EventTarget, type: string, callback: Callback | null, options?: boolean | AddEventListenerOptions): () => void;
    destory(): void;
}
