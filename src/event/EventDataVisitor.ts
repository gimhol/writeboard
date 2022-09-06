import { ValueOrSetter, getValue } from "../utils";
import { EventData } from "./EventData";
import { EventEnum, EventType } from "./EventType";

export type EventDataCreateOptions<T = any> = {
  type: EventType;
  operator: string;
  timeStamp: number;
  detail: T;
}
export class EventDataVisitor {
  static create<T = any>(options: EventDataCreateOptions): EventData<T> {
    return {
      a: options.type,
      b: options.operator,
      c: options.timeStamp,
      d: options.detail
    };
  }
  static getType<T = any>(e: EventData<T>): EventType {
    return e.a || e.type || EventEnum.Invalid;
  }
  static setType<T = any>(e: EventData<T>, v: ValueOrSetter<EventType>) {
    e.a = getValue(v, this.getType(e));
    return this;
  }
  static getOperator<T = any>(e: EventData<T>): string {
    return e.b || e.operator || EventEnum.Invalid;
  }
  static setOperator<T = any>(e: EventData<T>, v: ValueOrSetter<string>) {
    e.b = getValue(v, this.getOperator(e));
    return this;
  }
  static getTime<T = any>(e: EventData<T>): number {
    return e.c || e.timeStamp || 0;
  }
  static setTime<T = any>(e: EventData<T>, v: ValueOrSetter<number>) {
    e.c = getValue(v, this.getTime(e));
    return this;
  }
  static getDetail<T = any>(e: EventData<T>): T {
    return e.d || e.detail!;
  }
  static setDetail<T = any>(e: EventData<T>, v: ValueOrSetter<T>) {
    e.d = getValue(v, this.getDetail(e));
    return this;
  }
}
