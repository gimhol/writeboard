import { enumNameGetter } from "../utils/helper"

/**
 * 工具类型枚举：每个成员的值就是该工具在登记表里用的类型名
 *
 * Tool type enum: each member's value is the type name that tool uses in the registry.
 */
export enum ToolEnum {
  /**
   * 无效工具（空字符串）：表示「当前没有工具」
   *
   * Invalid tool (an empty string): means "no tool at the moment".
   */
  Invalid = '',
  /**
   * 选择器：点选 / 框选图形，并拖动、缩放、旋转它们
   *
   * Selector: picks shapes by click or marquee and drags / resizes / rotates them.
   */
  Selector = 'TOOL_SELECTOR',
  /**
   * 画笔
   *
   * Pen.
   */
  Pen = 'TOOL_PEN',
  /**
   * 矩形
   *
   * Rectangle.
   */
  Rect = 'TOOL_RECT',
  /**
   * 椭圆
   *
   * Ellipse.
   */
  Oval = 'TOOL_OVAL',
  /**
   * 文本
   *
   * Text.
   */
  Text = 'TOOL_TEXT',
  /**
   * 多边形
   *
   * Polygon.
   */
  Polygon = 'TOOL_POLYGON',
  /**
   * 钩（对勾）
   *
   * Tick (check mark).
   */
  Tick = 'TOOL_TICK',
  /**
   * 叉（错号）
   *
   * Cross (wrong mark).
   */
  Cross = 'TOOL_CROSS',
  /**
   * 半勾（只有左半边的对勾）
   *
   * Half tick (a check mark that only has its left half).
   */
  HalfTick = 'TOOL_HALFTICK',
  /**
   * 直线
   *
   * Lines.
   */
  Lines = "TOOL_Lines",
  /**
   * 图片
   *
   * Image.
   */
  Img = "TOOL_Img",
  /**
   * 橡皮擦
   *
   * Eraser.
   */
  Eraser = "TOOL_Eraser"
}
/**
 * 任意工具类型：既可以是内置的 ToolEnum，也可以是自定义工具的类型名
 *
 * Any tool type: either a built-in ToolEnum value or the type name of a custom tool.
 */
export type ToolType = ToolEnum | string
/**
 * 按工具类型取展示用的名字，形如 “ToolEnum.Pen”；找不到对应成员时原样返回类型名
 *
 * Gets the display name of a tool type, like "ToolEnum.Pen"; returns the type name as-is
 * when no matching member exists.
 *
 * @param {ToolType} value 工具类型 / Tool type
 * @return {string} 工具名 / Tool name
 */
export const getToolName = enumNameGetter<ToolType>("ToolEnum", ToolEnum)