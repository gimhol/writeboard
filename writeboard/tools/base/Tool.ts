import type { ToolType } from "../ToolEnum";
import type { Board } from "../../board/Board";
import type { IDot } from "../../utils/Dot";

export interface ITool {
  get type(): ToolType
  get board(): Board | undefined
  set board(v: Board | undefined)
  start(): void
  end(): void
  pointerMove(dot: IDot): void;
  pointerDown(dot: IDot): void;
  pointerDraw(dot: IDot): void;
  pointerUp(dot: IDot): void;
  render(ctx: CanvasRenderingContext2D): void
}

