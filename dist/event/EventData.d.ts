import { EventType } from "./EventType";
export declare type EventData<T = any> = {
    a: EventType;
    b: string;
    c: number;
    d: T;
} & Partial<{
    /**
     * @deprecated
     * use 'EventEditor.getType / EventEditor.setType'
     */
    type: EventType;
    /**
     * @deprecated
     * use 'EventEditor.getOperator / EventEditor.setOperator'
     */
    operator: string;
    /**
     * @deprecated
     * use 'EventEditor.getTime / EventEditor.setTime'
     */
    timeStamp: number;
    /**
     * @deprecated
     * use 'EventEditor.getDetail / EventEditor.setDetail'
     */
    detail: T;
}>;
