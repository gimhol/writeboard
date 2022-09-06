import type { WhiteBoard } from "../../board/WhiteBoard";
import type { IDot } from "../../utils/Dot";
import type { ITool } from "./Tool";
import { ToolEnum } from "../ToolEnum";

export class InvalidTool implements ITool {
  start(): void {
    console.warn('got InvalidTool');
  }
  end(): void {
    console.warn('got InvalidTool');
  }
  get type() { return ToolEnum.Invalid; }
  get board(): WhiteBoard | undefined {
    console.warn('got InvalidTool');
    return;
  }
  set board(v: WhiteBoard | undefined) {
    console.warn('got InvalidTool');
  }
  pointerMove(dot: IDot): void {
    console.warn('got InvalidTool');
  }
  pointerDown(dot: IDot): void {
    console.warn('got InvalidTool');
  }
  pointerDraw(dot: IDot): void {
    console.warn('got InvalidTool');
  }
  pointerUp(dot: IDot): void {
    console.warn('got InvalidTool');
  }
  render(): void {
    console.warn('got InvalidTool');
  }

}
