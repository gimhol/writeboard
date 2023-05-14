import { WhiteBoard } from "../board";
import { Screenplay } from "./Screenplay";
export declare class Recorder {
    private cancellers;
    destory(): void;
    private _screenplay;
    start(actor: WhiteBoard): void;
    toJson(): Screenplay;
    toJsonStr(): string;
}
