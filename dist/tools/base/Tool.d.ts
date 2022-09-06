import { ToolType } from "../ToolEnum";
import { WhiteBoard } from "../../board/WhiteBoard";
import { IDot } from "../../utils/Dot";
export interface ITool {
    get type(): ToolType;
    get board(): WhiteBoard | undefined;
    set board(v: WhiteBoard | undefined);
    start(): void;
    end(): void;
    pointerMove(dot: IDot): void;
    pointerDown(dot: IDot): void;
    pointerDraw(dot: IDot): void;
    pointerUp(dot: IDot): void;
    render(ctx: CanvasRenderingContext2D): void;
}
