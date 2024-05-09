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
}
export type EventType = EventEnum | string;
