import { ToolEnum } from "../../tools/ToolEnum";
import { WhiteBoard } from "../../board";
import { ITool } from "../../tools/base/Tool";
import { IDot } from "../../utils/Dot";
export declare class TextTool implements ITool {
    private _board;
    private _curShape;
    private _editor;
    private setCurShape;
    private _updateEditorStyle;
    private _updateShapeText;
    constructor();
    start(): void;
    end(): void;
    get type(): ToolEnum;
    render(): void;
    get board(): WhiteBoard | undefined;
    set board(v: WhiteBoard | undefined);
    pointerMove(dot: IDot): void;
    pointerDown(dot: IDot): void;
    pointerDraw(dot: IDot): void;
    pointerUp(dot: IDot): void;
}
