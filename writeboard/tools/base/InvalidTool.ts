import type { Board } from "../../board/Board";
import type { ToolType } from "../ToolEnum";
import type { ITool } from "./Tool";
const warn = (func: string) => console.warn('[InvalidTool]', func)

/**
 * 兜底工具：工厂拿不到工具创建函数（类型没登记）时用它，
 * 每个钩子都只在控制台告警，什么都不做
 *
 * Fallback tool: used when the factory cannot get a tool creator (the type was never
 * registered); every hook only warns in the console and does nothing else.
 */
export class InvalidTool implements ITool {
  /**
   * 切换到本工具时的回调：只告警
   *
   * Tool-switch callback: only warns.
   */
  start(): void { warn('start'); }
  /**
   * 切走本工具时的回调：只告警
   *
   * Switch-away callback: only warns.
   */
  end(): void { warn('end'); }
  /**
   * 工具类型：固定为空串（无效）
   *
   * Tool type: always an empty string (invalid).
   */
  get type(): ToolType { return ''; }
  /**
   * 取所属板子：只告警并返回 undefined
   *
   * Gets the owning board: only warns and returns undefined.
   */
  get board(): Board | undefined { warn('get board'); return; }
  /**
   * 换绑所属板子：只告警
   *
   * Rebinds the owning board: only warns.
   */
  set board(_: Board | undefined) { warn('set board'); }
  /**
   * 指针移动：只告警
   *
   * The pointer moved: only warns.
   */
  pointerMove(): void { warn('pointerMove'); }
  /**
   * 指针按下：只告警
   *
   * The pointer went down: only warns.
   */
  pointerDown(): void { warn('pointerDown'); }
  /**
   * 指针拖动：只告警
   *
   * The pointer is dragging: only warns.
   */
  pointerDraw(): void { warn('pointerDraw'); }
  /**
   * 指针松开：只告警
   *
   * The pointer went up: only warns.
   */
  pointerUp(): void { warn('pointerUp'); }
  /**
   * 渲染：只告警
   *
   * Rendering: only warns.
   */
  render(): void { warn('render'); }
}
