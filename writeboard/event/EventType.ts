export enum EventEnum {
  Invalid = '',
  ShapesAdded = 'SHAPES_ADDED',
  ShapesRemoved = 'SHAPES_REMOVED',
  ShapesChanging = 'SHAPES_CHANGING',
  ShapesChanged = 'SHAPES_CHANGED',
  ShapesDone = 'SHAPES_DONE',
  ShapesGeoChanging = 'SHAPES_GEO_CHANGING',
  ShapesGeoChanged = 'SHAPES_GEO_CHANGED',
  ToolChanged = 'TOOL_CHANGED',
  LayerAdded = 'LAYER_ADDED',
  LayerRemoved = 'LAYER_REMOVED',
  ShapesSelected = 'SHAPES_SELECTED',
  ShapesDeselected = 'SHAPES_DESELECTED',
  WorldRectChanged = 'WORLD_RECT_CHANGED',
  ViewportChanged = 'VIEWPORT_CHANGED',
  
  /** 工具在画布上移动 */
  ToolMove = "TOOL_MOVE",
  
  /** 工具按下 */
  ToolDown = "TOOL_DOWN",

  /** 工具在画布上移动（按下后） */
  ToolDraw = "TOOL_DRAW",

  /** 工具抬起 */
  ToolUp = "TOOL_UP",
}
export type EventType = EventEnum | string;
