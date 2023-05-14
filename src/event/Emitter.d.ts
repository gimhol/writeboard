import { BaseEvent } from "./Events";
import { Listener } from "./Observer";
export type ListenersMap = {
    [key in string]?: (Listener)[];
};
export interface ICallback {
    (e: BaseEvent): void;
}
export interface ICancelFunc {
    (): void;
}
export interface IEmitter {
    addEventListener(type: string, callback: ICallback): void;
    dispatchEvent(event: BaseEvent): void;
    removeEventListener(type: string, callback: ICallback): void;
    on(type: string, callback: ICallback): ICancelFunc;
    once(type: string, callback: ICallback): ICancelFunc;
    emit(e: BaseEvent): void;
}
export declare class Emitter implements IEmitter {
    private _listenersMap;
    constructor();
    addEventListener(type: string, callback: ICallback): Listener;
    removeEventListener(type: string, callback: ICallback): void;
    dispatchEvent(e: BaseEvent): void;
    on(type: string, callback: ICallback): ICancelFunc;
    once(type: string, callback: ICallback): ICancelFunc;
    emit(e: BaseEvent): void;
}
