import { IShapeData } from "../shape/base/Data";
import { ToolType } from "../tools/ToolEnum";
import { EventData } from "./EventData";
import { EventEnum, EventType } from "./EventType";
import { IEventDataMaker } from "./IEventDataMaker";
export declare class BaseEvent<T = any> implements Event, IEventDataMaker<T> {
    get operator(): string;
    get detail(): T;
    get type(): string;
    private _operator;
    private _detail;
    private _type;
    constructor(type: EventType, operator: string, detail: T);
    get bubbles(): boolean;
    get cancelBubble(): boolean;
    get cancelable(): boolean;
    get composed(): boolean;
    get currentTarget(): EventTarget | null;
    get defaultPrevented(): boolean;
    get eventPhase(): number;
    get isTrusted(): boolean;
    get returnValue(): boolean;
    get srcElement(): EventTarget | null;
    get target(): EventTarget | null;
    get timeStamp(): number;
    set target(v: EventTarget | null);
    private _bubbles;
    private _cancelBubble;
    private _cancelable;
    private _composed;
    private _currentTarget;
    private _defaultPrevented;
    private _eventPhase;
    private _isTrusted;
    private _returnValue;
    private _srcElement;
    private _target;
    private _timeStamp;
    composedPath(): EventTarget[];
    initEvent(type: EventType, bubbles?: boolean, cancelable?: boolean | undefined): void;
    preventDefault(): void;
    stopImmediatePropagation(): void;
    stopPropagation(): void;
    readonly AT_TARGET: number;
    readonly BUBBLING_PHASE: number;
    readonly CAPTURING_PHASE: number;
    readonly NONE: number;
    pure(): EventData<T>;
}
export interface IShapesEventDetail {
    shapeDatas: IShapeData[];
}
export declare class ShapesEvent extends BaseEvent<IShapesEventDetail> {
    constructor(type: EventType, operator: string, detail: IShapesEventDetail);
}
export declare class ShapesAddedEvent extends ShapesEvent {
    constructor(operator: string, detail: {
        shapeDatas: IShapeData[];
    });
}
export declare class ShapesRemovedEvent extends ShapesEvent {
    constructor(operator: string, detail: {
        shapeDatas: IShapeData[];
    });
}
export declare enum ShapesChangedEnum {
    Invalid = 0,
    Any = 1,
    Moved = 2,
    Resized = 3
}
export declare type ShapesChangedType = ShapesChangedEnum | string;
export interface IShapesChangedEventDetail<T extends Partial<IShapeData> = Partial<IShapeData>> {
    shapeDatas: [T, T][];
}
export declare class ShapesChangedEvent<T extends Partial<IShapeData> = Partial<IShapeData>> extends BaseEvent<IShapesChangedEventDetail<T>> {
    get changedType(): ShapesChangedType;
    protected _changedType: ShapesChangedType;
    constructor(operator: string, detail: IShapesChangedEventDetail<T>);
}
export interface IShapePositionData extends Pick<IShapeData, 'i' | 'x' | 'y'> {
}
export declare function pickShapePositionData(data: IShapeData): IShapePositionData;
export declare class ShapesMovedEvent extends ShapesChangedEvent<IShapePositionData> {
    constructor(operator: string, detail: IShapesChangedEventDetail<IShapePositionData>);
}
export interface IShapeGeoData extends Pick<IShapeData, 'i' | 'x' | 'y' | 'w' | 'h'> {
}
export declare function pickShapeGeoData(data: IShapeData): IShapeGeoData;
export declare class ShapesGeoEvent extends ShapesChangedEvent<IShapeGeoData> {
    constructor(operator: string, detail: IShapesChangedEventDetail<IShapeGeoData>);
}
export interface IToolChangedEventDetail {
    from: ToolType;
    to: ToolType;
}
export declare class ToolChangedEvent extends BaseEvent<IToolChangedEventDetail> {
    constructor(operator: string, detail: IToolChangedEventDetail);
}
export interface EventPureMap extends GlobalEventHandlersEventMap {
    [EventEnum.ShapesAdded]: EventData<IShapesEventDetail>;
    [EventEnum.ShapesRemoved]: EventData<IShapesEventDetail>;
    [EventEnum.ShapesChanged]: EventData<IShapesChangedEventDetail>;
    [EventEnum.ToolChanged]: EventData<IToolChangedEventDetail>;
}
export interface EventMap extends GlobalEventHandlersEventMap {
    [EventEnum.ShapesAdded]: ShapesAddedEvent;
    [EventEnum.ShapesRemoved]: ShapesRemovedEvent;
    [EventEnum.ShapesChanged]: ShapesChangedEvent;
    [EventEnum.ToolChanged]: ToolChangedEvent;
}
