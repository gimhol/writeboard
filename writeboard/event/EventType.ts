/**
 * 黑板的事件类型：事件名（值）与 Events.IDetailMap 里的载荷一一对应，
 * 也是 ActionQueue / Recorder / 房间同步筛选用的事件名
 *
 * Event types of a board: the names (values) map one to one onto the payloads of
 * Events.IDetailMap, and they are also what the ActionQueue / Recorder / room
 * synchronisation filter by.
 */
export enum EventEnum {
  /**
   * 无效事件（空字符串，用来表示「没有事件」）
   *
   * Invalid event (an empty string, used to mean "no event").
   */
  Invalid = '',
  /**
   * 新增了图形（载荷带完整的图形数据）
   *
   * Shapes were added (the payload carries the whole shape data).
   */
  ShapesAdded = 'SHAPES_ADDED',
  /**
   * 移除了图形
   *
   * Shapes were removed.
   */
  ShapesRemoved = 'SHAPES_REMOVED',
  /**
   * 图形正在改动（编辑中，载荷是 [当前, 之前] 成对的数据）
   *
   * Shapes are being changed (live editing; the payload holds [current, previous] pairs).
   */
  ShapesChanging = 'SHAPES_CHANGING',
  /**
   * 图形已改动（文案、样式等非几何属性改完）
   *
   * Shapes were changed (non-geometry attributes such as text and style).
   */
  ShapesChanged = 'SHAPES_CHANGED',
  /**
   * 图形绘制完成（落笔拾起，载荷是完整的图形数据，撤回队列就挂在它上面）
   *
   * Shapes were finished (the stroke / drag ended; the payload is the whole shape data,
   * and the undo queue hooks onto this event).
   */
  ShapesDone = 'SHAPES_DONE',
  /**
   * 图形几何正在改动（拖动 / 缩放 / 旋转中）
   *
   * Shape geometry is being changed (dragging / resizing / rotating, live).
   */
  ShapesGeoChanging = 'SHAPES_GEO_CHANGING',
  /**
   * 图形几何改动结束（拖动 / 缩放 / 旋转完成）
   *
   * The shape geometry change is over (the drag / resize / rotate finished).
   */
  ShapesGeoChanged = 'SHAPES_GEO_CHANGED',
  /**
   * 工具切换（载荷带切换前后的工具）
   *
   * Tool switched (the payload carries the tool before and after).
   */
  ToolChanged = 'TOOL_CHANGED',
  /**
   * 新增了图层
   *
   * A layer was added.
   */
  LayerAdded = 'LAYER_ADDED',
  /**
   * 移除了图层
   *
   * A layer was removed.
   */
  LayerRemoved = 'LAYER_REMOVED',
  /**
   * 图形被选中
   *
   * Shapes were selected.
   */
  ShapesSelected = 'SHAPES_SELECTED',
  /**
   * 图形被取消选中
   *
   * Shapes were deselected.
   */
  ShapesDeselected = 'SHAPES_DESELECTED',
  /**
   * 世界矩形变化（滚动 / 可滚动区域变化）
   *
   * The world rect changed (scrolling or changing the scrollable area).
   */
  WorldRectChanged = 'WORLD_RECT_CHANGED',
  /**
   * 视口变化（画布尺寸或位置变化）
   *
   * The viewport changed (the canvas size or position changed).
   */
  ViewportChanged = 'VIEWPORT_CHANGED',
  
  /**
   * 工具在画布上移动
   *
   * The pointer moved over the canvas while no button was down.
   */
  ToolMove = "TOOL_MOVE",
  
  /**
   * 工具按下
   *
   * The pointer went down on the canvas.
   */
  ToolDown = "TOOL_DOWN",

  /**
   * 工具在画布上移动（按下后）
   *
   * The pointer moved over the canvas with a button held down.
   */
  ToolDraw = "TOOL_DRAW",

  /**
   * 工具抬起
   *
   * The pointer went up, finishing the tool gesture.
   */
  ToolUp = "TOOL_UP",
}
/**
 * 事件类型：既可以用 EventEnum 里的枚举值，也可以直接用字符串（自定义事件）
 *
 * Event type: either a value of EventEnum or a plain string (for custom events).
 */
export type EventType = EventEnum | string;
