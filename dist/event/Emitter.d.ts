import { BaseEvent } from "./Events";
import { Listener } from "./Observer";
export declare type Options = boolean | EventListenerOptions;
export declare type Callback = EventListenerOrEventListenerObject;
export declare type ListenersMap = {
    [key in string]?: (Listener)[];
};
export interface IEmitter extends EventTarget {
    on(type: string, callback: Callback, options?: Options): () => void;
    once(type: string, callback: Callback, options?: Options): () => void;
    emit(e: Event): void;
}
export declare class Emitter implements IEmitter {
    private _listenersMap;
    private _target;
    constructor(target?: EventTarget);
    addEventListener(type: string, callback: Callback | null, options?: Options): Listener;
    removeEventListener(type: string, callback: Callback | null, options?: Options): void;
    dispatchEvent(e: BaseEvent): boolean;
    on(type: string, callback: Callback, options?: Options): () => void;
    once(type: string, callback: Callback, options?: Options): () => void;
    emit(e: BaseEvent): boolean;
}
