import { WhiteBoard } from "../../board/WhiteBoard";
import type { ShapeType } from "../../shape/ShapeEnum";
import type { ToolType } from "../ToolEnum";
import type { ITool } from "./Tool";
import type { IDot } from "../../utils/Dot";
export declare class SimpleTool implements ITool {
    get type(): string;
    private _type;
    private _shapeType;
    constructor(type: ToolType, shapeType: ShapeType);
    start(): void;
    end(): void;
    render(): void;
    get board(): WhiteBoard | undefined;
    set board(v: WhiteBoard | undefined);
    pointerMove(dot: IDot): void;
    pointerDown(dot: IDot): void;
    pointerDraw(dot: IDot): void;
    pointerUp(dot: IDot): void;
    private updateGeo;
    private _prevData;
    private _curShape;
    private _board;
    private _rect;
}
