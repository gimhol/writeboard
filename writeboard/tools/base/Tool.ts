import type { ToolType } from "../ToolEnum";
import type { Board } from "../../board/Board";
import type { IDot } from "../../utils/Dot";
import type { Shape } from "../../shape/base";

/**
 * 工具接口：所有工具都实现它，板子通过它的钩子把指针事件与渲染交给工具
 *
 * Tool interface: every tool implements it, and the board hands pointer events and
 * rendering over to the tool through these hooks.
 */
export interface ITool {
  /**
   * 工具类型（对应 ToolEnum，也是登记表里的键）
   *
   * Tool type (a ToolEnum value, also the key in the registry).
   */
  get type(): ToolType
  /**
   * 工具所属的板子（未挂到板子上时为 undefined）
   *
   * Board the tool belongs to (undefined while it is not attached to a board).
   */
  get board(): Board | undefined
  /**
   * 挂载 / 换绑所属板子
   *
   * Attaches or rebinds the owning board.
   */
  set board(v: Board | undefined)
  /**
   * 工具的自绘光标（可选）：画布滚动时由画布保持它钉在指针的屏幕位置上
   *
   * Optional self-drawn cursor of the tool: the canvas keeps it pinned to the pointer's
   * screen position while the canvas scrolls.
   */
  indicator?: Shape
  /**
   * 工具切换时被调用
   * 
   * 例：A切换至B时
   * 有：
   *    A.end(); 
   *    B.start(); 
   *
   * Called when this tool becomes the active one (the previous tool's end() runs first).
   */
  start?(): void

  /**
   * 工具被切换时被调用
   * 
   * 例：A切换至B时
   * 有：
   *    A.end(); 
   *    B.start(); 
   *
   * Called when this tool is switched away.
   */
  end?(): void

  /**
   * 指针在板子上移动（未按下）
   *
   * The pointer moved over the board (no button pressed).
   *
   * @param {IDot} dot 指针位置（画布坐标）/ Pointer position (canvas coordinates)
   */
  pointerMove?(dot: IDot): void;

  /**
   * 指针离开板子（自绘光标之类应在这里隐藏）
   *
   * The pointer left the board (hide a self-drawn cursor here).
   */
  pointerLeave?(): void;

  /**
   * 在板子上按下指针（手势开始）
   *
   * The pointer went down on the board (a gesture starts).
   *
   * @param {IDot} dot 指针位置（画布坐标）/ Pointer position (canvas coordinates)
   * @param {number} [button] 按键：0 左键、1 中键、2 右键 / Button: 0 primary, 1 middle, 2 secondary
   */
  pointerDown?(dot: IDot, button?: number): void;

  /**
   * 按住指针拖动（手势进行中）
   *
   * The pointer is dragging (the gesture is in progress).
   *
   * @param {IDot} dot 指针位置（画布坐标）/ Pointer position (canvas coordinates)
   */
  pointerDraw?(dot: IDot): void;

  /**
   * 松开指针（手势结束）
   *
   * The pointer went up (the gesture ends).
   *
   * @param {IDot} dot 指针位置（画布坐标）/ Pointer position (canvas coordinates)
   * @param {number} [button] 按键：0 左键、1 中键、2 右键 / Button: 0 primary, 1 middle, 2 secondary
   */
  pointerUp?(dot: IDot, button?: number): void;
  
  /**
   * 随板子一起渲染（图形层之上、当前视口）
   *
   * Renders together with the board (on the shape layer, current viewport).
   *
   * @param {CanvasRenderingContext2D} ctx 画布上下文 / Canvas context
   */
  render?(ctx: CanvasRenderingContext2D): void
}

