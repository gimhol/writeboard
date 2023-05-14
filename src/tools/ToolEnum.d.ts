export declare enum ToolEnum {
    Invalid = "",
    Selector = "TOOL_SELECTOR",
    Pen = "TOOL_PEN",
    Rect = "TOOL_RECT",
    Oval = "TOOL_OVAL",
    Text = "TOOL_TEXT",
    Polygon = "TOOL_Polygon"
}
export type ToolType = ToolEnum | string;
export declare function getToolName(type: ToolType): string;
