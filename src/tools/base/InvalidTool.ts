import type { Board } from "../../board/Board";
import type { ToolType } from "../ToolEnum";
import type { ITool } from "./Tool";
const warn = (func: string) => console.warn('[InvalidTool]', func)

export class InvalidTool implements ITool {
  start(): void { warn('start'); }
  end(): void { warn('end'); }
  get type(): ToolType { return ''; }
  get board(): Board | undefined { warn('get board'); return; }
  set board(_: Board | undefined) { warn('set board'); }
  pointerMove(): void { warn('pointerMove'); }
  pointerDown(): void { warn('pointerDown'); }
  pointerDraw(): void { warn('pointerDraw'); }
  pointerUp(): void { warn('pointerUp'); }
  render(): void { warn('render'); }
}
