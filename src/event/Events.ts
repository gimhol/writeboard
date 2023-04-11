import { IShapeData } from "../shape/base/Data"
import { ToolType } from "../tools/ToolEnum"
import { EventData } from "./EventData"
import { EventDataVisitor } from "./EventDataVisitor"
import { EventEnum, EventType } from "./EventType"
import { IEventDataMaker } from "./IEventDataMaker"

export class BaseEvent<T = any> implements IEventDataMaker<T> {
  get operator() { return this._operator }
  get detail() { return this._detail }
  get type() { return this._type }
  private _operator: string
  private _detail: T
  private _type: EventType
  constructor(type: EventType, operator: string, detail: T) {
    this._type = type
    this._operator = operator
    this._detail = detail
  }
  get bubbles() { return this._bubbles }
  get cancelBubble() { return this._cancelBubble }
  get cancelable() { return this._cancelable }
  get composed() { return this._composed }
  get currentTarget() { return this._currentTarget }
  get defaultPrevented() { return this._defaultPrevented }
  get eventPhase() { return this._eventPhase }
  get isTrusted() { return this._isTrusted }
  get returnValue() { return this._returnValue }
  get srcElement() { return this._srcElement }
  get target() { return this._target }
  get timeStamp() { return this._timeStamp }
  set target(v) {
    this._target = v
    this._currentTarget = v
  }
  private _bubbles: boolean = true
  private _cancelBubble: boolean = true
  private _cancelable: boolean = true
  private _composed: boolean = true
  private _currentTarget: EventTarget | null = null
  private _defaultPrevented: boolean = false
  private _eventPhase: number = 0
  private _isTrusted: boolean = true
  private _returnValue: boolean = true
  private _srcElement: EventTarget | null = null
  private _target: EventTarget | null = null
  private _timeStamp: number = Date.now()
  composedPath(): EventTarget[] { return [] }
  initEvent(type: EventType, bubbles?: boolean, cancelable?: boolean | undefined): void {
    this._type = type
    this._bubbles = !!bubbles
    this._cancelable = !!cancelable
  }
  preventDefault(): void {
    this._defaultPrevented = true
  }
  stopImmediatePropagation(): void { }
  stopPropagation(): void { }

  pure(): EventData<T> {
    return EventDataVisitor.create(this)
  }
}
export interface IShapesEventDetail { shapeDatas: IShapeData[] }
export class ShapesEvent extends BaseEvent<IShapesEventDetail>{
  constructor(type: EventType, operator: string, detail: IShapesEventDetail) {
    super(type, operator, detail)
  }
}
export class ShapesAddedEvent extends ShapesEvent {
  constructor(operator: string, detail: { shapeDatas: IShapeData[] }) {
    super(EventEnum.ShapesAdded, operator, detail)
  }
}
export class ShapesRemovedEvent extends ShapesEvent {
  constructor(operator: string, detail: { shapeDatas: IShapeData[] }) {
    super(EventEnum.ShapesRemoved, operator, detail)
  }
}
export enum ShapesChangedEnum {
  Invalid = 0,
  Any = 1,
  Moved = 2,
  Resized = 3
}
export type ShapesChangedType = ShapesChangedEnum | string
export interface IShapesChangedEventDetail<T extends Partial<IShapeData> = Partial<IShapeData>> { shapeDatas: [T, T][] }
export class ShapesChangedEvent<T extends Partial<IShapeData> = Partial<IShapeData>> extends BaseEvent<IShapesChangedEventDetail<T>>{
  get changedType() { return this._changedType }
  protected _changedType: ShapesChangedType
  constructor(operator: string, detail: IShapesChangedEventDetail<T>) {
    super(EventEnum.ShapesChanged, operator, detail)
    this._changedType = ShapesChangedEnum.Any
  }
}

export interface IShapePositionData extends Pick<IShapeData, 'i' | 'x' | 'y'> { }
export function pickShapePositionData(data: IShapeData): IShapePositionData {
  return {
    i: data.i,
    x: data.x,
    y: data.y
  }
}
export class ShapesMovedEvent extends ShapesChangedEvent<IShapePositionData> {
  constructor(operator: string, detail: IShapesChangedEventDetail<IShapePositionData>) {
    super(operator, detail)
    this._changedType = ShapesChangedEnum.Moved
  }
}

export interface IShapeGeoData extends Pick<IShapeData, 'i' | 'x' | 'y' | 'w' | 'h'> { }
export function pickShapeGeoData(data: IShapeData): IShapeGeoData {
  return {
    i: data.i,
    x: data.x,
    y: data.y,
    w: data.w,
    h: data.h
  }
}
export class ShapesGeoEvent extends ShapesChangedEvent<IShapeGeoData> {
  constructor(operator: string, detail: IShapesChangedEventDetail<IShapeGeoData>) {
    super(operator, detail)
    this._changedType = ShapesChangedEnum.Resized
  }
}

export interface IToolChangedEventDetail { from: ToolType, to: ToolType }
export class ToolChangedEvent extends BaseEvent<IToolChangedEventDetail>{
  constructor(operator: string, detail: IToolChangedEventDetail) {
    super(EventEnum.ToolChanged, operator, detail)
  }
}

export interface EventPureMap {
  [EventEnum.ShapesAdded]: EventData<IShapesEventDetail>
  [EventEnum.ShapesRemoved]: EventData<IShapesEventDetail>,
  [EventEnum.ShapesChanged]: EventData<IShapesChangedEventDetail>,
  [EventEnum.ToolChanged]: EventData<IToolChangedEventDetail>
}
export interface EventMap {
  [EventEnum.ShapesAdded]: ShapesAddedEvent
  [EventEnum.ShapesRemoved]: ShapesRemovedEvent,
  [EventEnum.ShapesChanged]: ShapesChangedEvent,
  [EventEnum.ToolChanged]: ToolChangedEvent
}