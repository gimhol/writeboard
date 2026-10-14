import type { ToolType } from "../ToolEnum";
import type { Board } from "../../board/Board";
import type { IDot } from "../../utils/Dot";
import type { Shape } from "../../shape/base";

export interface ITool {
  get type(): ToolType
  get board(): Board | undefined
  set board(v: Board | undefined)
  /** 工具的自绘光标（可选）：画布滚动时由画布保持它钉在指针的屏幕位置上 */
  indicator?: Shape
  /**
   * 工具切换时被调用
   * 
   * 例：A切换至B时
   * 有：
   *    A.end(); 
   *    B.start(); 
   */
  start?(): void

  /**
   * 工具被切换时被调用
   * 
   * 例：A切换至B时
   * 有：
   *    A.end(); 
   *    B.start(); 
   */
  end?(): void

  pointerMove?(dot: IDot): void;

  pointerLeave?(): void;

  pointerDown?(dot: IDot, button?: number): void;

  pointerDraw?(dot: IDot): void;

  pointerUp?(dot: IDot, button?: number): void;
  
  render?(ctx: CanvasRenderingContext2D): void
}

