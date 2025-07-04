import { Board } from "../../board";
import { Gaia } from "../../mgr/Gaia";
import { ITool } from "../base";
import { ToolEnum } from "../ToolEnum";

export class EraserTool implements ITool {
  readonly type = ToolEnum.Eraser
  board: Board | undefined = void 0;
  start(): void { console.log('[EraserTool::start]') }
  end?(): void { console.log('[EraserTool::end]') }
  // pointerMove?(dot: IDot): void {
  //   throw new Error("Method not implemented.");
  // }
  // pointerDown?(dot: IDot): void {
  //   throw new Error("Method not implemented.");
  // }
  // pointerDraw?(dot: IDot): void {
  //   throw new Error("Method not implemented.");
  // }
  // pointerUp?(dot: IDot): void {
  //   throw new Error("Method not implemented.");
  // }
  render(ctx: CanvasRenderingContext2D): void {
    throw new Error("Method not implemented.");
  }
}
Gaia.registerTool(ToolEnum.Eraser, () => new EraserTool, {
  name: 'Eraser',
  desc: 'erase pen'
})
