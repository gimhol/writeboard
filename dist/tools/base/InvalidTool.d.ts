import type { WhiteBoard } from "../../board/WhiteBoard";
import type { IDot } from "../../utils/Dot";
import type { ITool } from "./Tool";
import { ToolEnum } from "../ToolEnum";
export declare class InvalidTool implements ITool {
    start(): void;
    end(): void;
    get type(): ToolEnum;
    get board(): WhiteBoard | undefined;
    set board(v: WhiteBoard | undefined);
    pointerMove(dot: IDot): void;
    pointerDown(dot: IDot): void;
    pointerDraw(dot: IDot): void;
    pointerUp(dot: IDot): void;
    render(): void;
}
