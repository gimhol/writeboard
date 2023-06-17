export enum ToolEnum {
  Invalid = '',
  Selector = 'TOOL_SELECTOR',
  Pen = 'TOOL_PEN',
  Rect = 'TOOL_RECT',
  Oval = 'TOOL_OVAL',
  Text = 'TOOL_TEXT',
  Polygon = 'TOOL_Polygon',
  Tick = 'TOOL_Tick',
  Cross = 'TOOL_Cross',
  HalfTick = 'TOOL_HalfTick',
}
export type ToolType = ToolEnum | string
export function getToolName(type: ToolType): string {
  switch (type) {
    case ToolEnum.Invalid: return 'ToolEnum.Invalid'
    case ToolEnum.Pen: return 'ToolEnum.Pen'
    case ToolEnum.Rect: return 'ToolEnum.Rect'
    case ToolEnum.Oval: return 'ToolEnum.Oval'
    case ToolEnum.Text: return 'ToolEnum.Text'
    case ToolEnum.Polygon: return 'ToolEnum.Polygon'
    case ToolEnum.Tick: return 'ToolEnum.Tick'
    case ToolEnum.Cross: return 'ToolEnum.Cross'
    case ToolEnum.HalfTick: return 'ToolEnum.HalfTick'
    default: return type
  }
}