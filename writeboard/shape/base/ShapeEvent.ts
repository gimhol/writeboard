import { Shape } from "./Shape";
import { Board } from "../../board";
import { IShapeData } from "./IShapeData";

/**
 * 图形可监听的事件类型
 *
 * Event types a shape can dispatch.
 */
export enum ShapeEventEnum {
  /**
   * 图形开始脏了：数据改动前触发，事件载荷里的 prev 是改动前的快照
   *
   * The shape starts getting dirty: fired right before the data changes, and `prev` in the
   * payload is a snapshot of the previous value.
   */
  StartDirty = 'start_dirty',
  /**
   * 图形脏完了：数据改动后触发，事件载荷里的 prev 是改动前的快照
   *
   * The shape finished getting dirty: fired right after the data changed, and `prev` in the
   * payload is a snapshot of the previous value.
   */
  EndDirty = 'end_dirty',
  /**
   * 图形改属别的黑板（脱离黑板时 prev 为旧黑板，可能为 undefined）
   *
   * The shape moved to another board (while leaving a board, `prev` is the old board and may
   * be undefined).
   */
  BoardChanged = 'board_changed'
}

/**
 * 事件类型 → 事件对象 的映射
 *
 * Event type → event object map.
 */
export interface ShapeEventMap {
  /**
   * 开始改动：detail 里带图形本体与改动前的数据快照
   *
   * Change started: the detail carries the shape itself and a snapshot of the previous data.
   */
  [ShapeEventEnum.StartDirty]: CustomEvent<{ shape: Shape; prev?: Partial<IShapeData>; }>;
  /**
   * 改动结束：detail 里带图形本体与改动前的数据快照
   *
   * Change finished: the detail carries the shape itself and a snapshot of the previous data.
   */
  [ShapeEventEnum.EndDirty]: CustomEvent<{ shape: Shape; prev?: Partial<IShapeData>; }>;
  /**
   * 归属黑板变了：detail 里带图形本体与旧黑板
   *
   * The owning board changed: the detail carries the shape itself and the previous board.
   */
  [ShapeEventEnum.BoardChanged]: CustomEvent<{ shape: Shape; prev?: Board; }>;
}

/**
 * 图形事件的监听函数
 *
 * Listener of a shape event.
 *
 * @param {ShapeEventMap[K]} ev 事件对象 / The event object
 */
export type ShapeEventListener<K extends keyof ShapeEventMap> = (this: HTMLObjectElement, ev: ShapeEventMap[K]) => any;

