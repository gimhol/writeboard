import { EventData } from "../event/EventData";
export interface Screenplay {
    startTime: number;
    snapshot: any;
    events: EventData<any>[];
}
