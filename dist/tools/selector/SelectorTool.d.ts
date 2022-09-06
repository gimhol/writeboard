import { ToolType } from "../ToolEnum";
import { IDot } from "../../utils/Dot";
import { ITool } from "../base/Tool";
import { WhiteBoard } from "../../board";
export declare enum SelectorStatus {
    Invalid = "SELECTOR_STATUS_INVALID",
    Dragging = "SELECTOR_STATUS_DRAGGING",
    Selecting = "SELECTOR_STATUS_SELECTING"
}
export declare class SelectorTool implements ITool {
    get type(): ToolType;
    private _rect;
    private _rectHelper;
    private _status;
    private _prevPos;
    private _shapes;
    get board(): WhiteBoard | undefined;
    set board(v: WhiteBoard | undefined);
    constructor();
    render(ctx: CanvasRenderingContext2D): void;
    start(): void;
    end(): void;
    pointerDown(dot: IDot): void;
    pointerMove(): void;
    pointerDraw(dot: IDot): void;
    private _waiting;
    private emitEvent;
    pointerUp(): void;
    private updateGeo;
}
