import { WhiteBoard } from "../board";
import { EventData } from "../event";
import { Screenplay } from "./Screenplay";
export declare class Player {
    private screenplay;
    private eventIdx;
    private actor;
    private firstEventTime;
    private startTime;
    private timer;
    start(actor: WhiteBoard, screenplay: Partial<Screenplay>): void;
    stop(): void;
    tick(): void;
    applyEvent(e: EventData): void;
}
