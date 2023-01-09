export declare enum EventEnum {
    Invalid = "",
    ShapesAdded = "SHAPES_ADDED",
    ShapesRemoved = "SHAPES_REMOVED",
    ShapesChanged = "SHAPES_CHANGED",
    ToolChanged = "TOOL_CHANGED"
}
export type EventType = EventEnum | string;
