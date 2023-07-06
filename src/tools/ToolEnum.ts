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
}
export type ToolType = ToolEnum | string
export function getToolName(type: ToolType): string {
  switch (type) {
    case ToolEnum.Invalid: return 'ToolEnum.Invalid';
    case ToolEnum.Pen: return 'ToolEnum.Pen';
    case ToolEnum.Rect: return 'ToolEnum.Rect';
    case ToolEnum.Oval: return 'ToolEnum.Oval';
    case ToolEnum.Text: return 'ToolEnum.Text';
    case ToolEnum.Polygon: return 'ToolEnum.Polygon';
    case ToolEnum.Tick: return 'ToolEnum.Tick';
    case ToolEnum.Cross: return 'ToolEnum.Cross';
    case ToolEnum.HalfTick: return 'ToolEnum.HalfTick';
    case ToolEnum.Lines: return 'ToolEnum.Lines';
    case ToolEnum.Lines: return 'ToolEnum.Img';
    default: return type
  }
}