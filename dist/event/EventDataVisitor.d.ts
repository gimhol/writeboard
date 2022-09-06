import { ValueOrSetter } from "../utils";
import { EventData } from "./EventData";
import { EventType } from "./EventType";
export declare type EventDataCreateOptions<T = any> = {
    type: EventType;
    operator: string;
    timeStamp: number;
    detail: T;
};
export declare class EventDataVisitor {
    static create<T = any>(options: EventDataCreateOptions): EventData<T>;
    static getType<T = any>(e: EventData<T>): EventType;
    static setType<T = any>(e: EventData<T>, v: ValueOrSetter<EventType>): typeof EventDataVisitor;
    static getOperator<T = any>(e: EventData<T>): string;
    static setOperator<T = any>(e: EventData<T>, v: ValueOrSetter<string>): typeof EventDataVisitor;
    static getTime<T = any>(e: EventData<T>): number;
    static setTime<T = any>(e: EventData<T>, v: ValueOrSetter<number>): typeof EventDataVisitor;
    static getDetail<T = any>(e: EventData<T>): T;
    static setDetail<T = any>(e: EventData<T>, v: ValueOrSetter<T>): typeof EventDataVisitor;
}
