import { WhiteBoard } from "../../board/WhiteBoard";
import { IDot } from "../../utils/Dot";
import { ITool } from "../../tools/base/Tool";
export declare class PenTool implements ITool {
    start(): void;
    end(): void;
    get type(): string;
    render(): void;
    get board(): WhiteBoard | undefined;
    set board(v: WhiteBoard | undefined);
    addDot(dot: IDot, type?: 'first' | 'last'): void;
    pointerMove(dot: IDot): void;
    pointerDown(dot: IDot): void;
    pointerDraw(dot: IDot): void;
    pointerUp(dot: IDot): void;
    private _prevData;
    private _curShape;
    private _board;
}
