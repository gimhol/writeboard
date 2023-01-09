import { BaseEvent } from "./Events";
import { Listener } from "./Observer";
export type Options = boolean | EventListenerOptions;
export type Callback = EventListenerOrEventListenerObject;
export type ListenersMap = {
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
