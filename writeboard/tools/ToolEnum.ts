import { enumNameGetter } from "../utils/helper"

export enum ToolEnum {
  Invalid = '',
  Selector = 'TOOL_SELECTOR',
  Pen = 'TOOL_PEN',
  Rect = 'TOOL_RECT',
  Oval = 'TOOL_OVAL',
  Text = 'TOOL_TEXT',
  Polygon = 'TOOL_POLYGON',
  Tick = 'TOOL_TICK',
  Cross = 'TOOL_CROSS',
  HalfTick = 'TOOL_HALFTICK',
  Lines = "TOOL_Lines",
  Img = "TOOL_Img",
  Eraser = "TOOL_Eraser"
}
export type ToolType = ToolEnum | string
export const getToolName = enumNameGetter<ToolType>("ToolEnum", ToolEnum)