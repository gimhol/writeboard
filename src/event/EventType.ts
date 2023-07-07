export enum EventEnum {
  Invalid = '',
  ShapesAdded = 'SHAPES_ADDED',
  ShapesRemoved = 'SHAPES_REMOVED',
  ShapesChanged = 'SHAPES_CHANGED',
  ShapesMoved = 'SHAPES_MOVED',
  ShapesResized = 'SHAPES_RESIZED',
  ToolChanged = 'TOOL_CHANGED',
  LayerAdded = 'LAYER_ADDED',
  LayerRemoved = 'LAYER_REMOVED',
  ShapesSelected = 'SHAPES_SELECTED',
  ShapesDeselected = 'SHAPES_DESELECTED',
}
export type EventType = EventEnum | string;
