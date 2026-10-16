import type { ILayerInfo } from "../board/Layer";
import type { IShapeData } from "../shape/base/IShapeData";
import type { ToolType } from "../tools/ToolEnum";
import type { ITool } from "../tools/base/Tool";
import type { IRect } from "../utils";
import type { EventEnum } from "./EventType";

export namespace Events {
  /**
   * 调用 board.emit 时要传的事件数据：type / timestamp 由板子在派发时补上
   *
   * Payload passed to board.emit: the board fills in `type` / `timestamp` when dispatching.
   */
  export type IEmit<T extends IBaseDetail> = Omit<T, 'type' | 'timestamp'>
  /**
   * 一切事件数据共有的字段
   *
   * Fields shared by every event payload.
   */
  export interface IBaseDetail {
    /**
     * 事件类型（EventEnum 的值）
     *
     * Event type (a value of EventEnum)
     */
    type: string;
    /**
     * 事件发生时间（毫秒时间戳，由板子填充）
     *
     * When the event happened (ms timestamp, filled in by the board)
     */
    timestamp: number;
    /**
     * 操作者：本端事件为 board.whoami；远端落地为 'remote'；撤回 / 重做为 'action_queue'
     *
     * Actor: local events carry board.whoami, remotely applied ones carry 'remote',
     * undo / redo carry 'action_queue'
     */
    operator: string;
    /**
     * 事务 id：同一次连续手势（例如一次擦除拖拽）里产生的事件共用它，
     * ActionQueue 会把同一事务的动作合并成一条记录（一次撤回 / 重做走完整段手势）
     *
     * Transaction id: every event produced by one continuous gesture (e.g. one eraser
     * drag) shares it, and the ActionQueue merges the actions of one transaction into a
     * single record, so one undo / redo covers the whole gesture
     */
    tx?: string;
  }
  /**
   * 携带整份图形数据的事件（新增 / 删除 / 完成 / 选中 / 取消选中）
   *
   * Payload of the events that carry whole shape data (added / removed / done /
   * selected / deselected).
   */
  export interface IShapesDetail extends IBaseDetail {
    /**
     * 事件涉及的图形数据：新增 / 完成 / 选中的是「新加入的」，删除的是「被删掉的」
     *
     * Shape data the event carries: the added / finished / selected ones for those
     * events, the removed ones for the removal events
     */
    shapeDatas: IShapeData[];
  }
  /**
   * 携带「改动前后」成对数据的事件（编辑中 / 已更改）
   *
   * Payload of the events that carry [current, previous] pairs (changing / changed).
   */
  export interface IShapesChangeDetail<T extends IShapeData = IShapeData> extends IBaseDetail {
    /**
     * [当前, 之前] 成对的图形数据：合并某一对就能把这次改动应用 / 撤销回去
     *
     * Pairs of [current, previous] shape data: merging one pair applies / reverts that
     * change
     */
    shapeDatas: [Readonly<Partial<T>>, Readonly<Partial<T>>][];
  }
  /**
   * 携带图形几何改动的事件（拖动 / 缩放 / 旋转中 / 已结束）
   *
   * Payload of the events that carry shape geometry changes (moving / resizing /
   * rotating, live or finished).
   */
  export interface IAnyShapesDetail extends IBaseDetail {
    /**
     * 发起这次改动的工具（例如选择器拖动）
     *
     * Tool that started this change (e.g. the selector while dragging)
     */
    tool: ToolType,
    /**
     * [当前, 之前] 成对的几何数据（只含 i / x / y / w / h / r）
     *
     * Pairs of [current, previous] geometry data (only i / x / y / w / h / r)
     */
    shapeDatas: (readonly [Partial<IShapeData>, Partial<IShapeData>])[];
  }
  /**
   * 图层增删事件的载荷
   *
   * Payload of the layer added / removed events.
   */
  export interface ILayerDetail extends IBaseDetail {
    /**
     * 图层信息（id 与名字）
     *
     * Layer info (id and name)
     */
    layer: ILayerInfo
  }
  /**
   * 图形数据里的「几何」子集：几何事件只带这些字段，不带样式 / 笔迹点
   *
   * The geometry subset of shape data: geometry events only carry these fields, no
   * style / stroke points.
   */
  export interface IShapeGeoData {
    /**
     * 图形 id
     *
     * Shape id
     */
    i: string;
    /**
     * 位置 x
     *
     * Position x
     */
    x?: number;
    /**
     * 位置 y
     *
     * Position y
     */
    y?: number;
    /**
     * 宽度
     *
     * Width
     */
    w?: number;
    /**
     * 高度
     *
     * Height
     */
    h?: number;
    /**
     * 旋转弧度
     *
     * Rotation in radians
     */
    r?: number;
  }
  /**
   * 从图形数据里挑出「位置」部分（i / x / y）
   *
   * Picks the position part (i / x / y) out of shape data.
   *
   * @param {IShapeData} data 图形数据 / Shape data
   * @return {IShapeGeoData} 只含 i / x / y 的几何数据 / Geometry data with i / x / y only
   */
  export function pickShapePosData(data: IShapeData): IShapeGeoData {
    return {
      i: data.i,
      x: data.x,
      y: data.y,
    }
  }
  /**
   * 从图形数据里挑出「几何」部分（i / x / y / w / h / r）
   *
   * Picks the geometry part (i / x / y / w / h / r) out of shape data.
   *
   * @param {IShapeData} data 图形数据 / Shape data
   * @return {IShapeGeoData} 只含 i / x / y / w / h / r 的几何数据 / Geometry data with i / x / y / w / h / r only
   */
  export function pickShapeGeoData(data: IShapeData): IShapeGeoData {
    return {
      i: data.i,
      x: data.x,
      y: data.y,
      w: data.w,
      h: data.h,
      r: data.r
    }
  }
  /**
   * 工具切换事件的载荷
   *
   * Payload of the tool changed event.
   */
  export interface IToolChangedDetail extends IBaseDetail {
    /**
     * 切换前的工具（首次设置工具时为 undefined）
     *
     * Tool before the switch (undefined when a tool is set for the first time)
     */
    from?: ToolType;
    /**
     * 切换后的工具
     *
     * Tool after the switch
     */
    to?: ToolType;
  }
  /**
   * 矩形变化事件的载荷（世界矩形 / 视口矩形）
   *
   * Payload of the rect change events (world rect / viewport rect).
   */
  export interface IRectChangeDetail extends IBaseDetail {
    /**
     * 变化前的矩形
     *
     * Rect before the change
     */
    form: IRect;
    /**
     * 变化后的矩形
     *
     * Rect after the change
     */
    to: IRect;
  }
  /**
   * 工具指针事件的载荷（按下 / 绘制 / 移动 / 抬起）
   *
   * Payload of the tool pointer events (down / draw / move / up).
   */
  export interface IToolDetail extends IBaseDetail {
    /**
     * 触发事件的工具
     *
     * Tool that triggered the event
     */
    tool: ITool;
    /**
     * 世界坐标 x
     *
     * World x
     */
    x: number;
    /**
     * 世界坐标 y
     *
     * World y
     */
    y: number;
  }
  /**
   * 事件类型 → 事件载荷 的映射：board.on / board.emit 靠它推断回调参数的类型
   *
   * Event type → payload mapping: board.on / board.emit use it to infer the type of
   * the callback argument.
   */
  export interface IDetailMap {
    [EventEnum.ShapesAdded]: IShapesDetail;
    [EventEnum.ShapesRemoved]: IShapesDetail;
    [EventEnum.ShapesChanging]: IShapesChangeDetail<IShapeData>;
    [EventEnum.ShapesChanged]: IShapesChangeDetail<IShapeData>;
    [EventEnum.ShapesDone]: IShapesDetail;
    [EventEnum.ShapesGeoChanging]: IAnyShapesDetail;
    [EventEnum.ShapesGeoChanged]: IAnyShapesDetail;
    [EventEnum.ToolChanged]: IToolChangedDetail;
    [EventEnum.LayerAdded]: ILayerDetail;
    [EventEnum.LayerRemoved]: ILayerDetail;
    [EventEnum.ShapesSelected]: IShapesDetail;
    [EventEnum.ShapesDeselected]: IShapesDetail;
    [EventEnum.WorldRectChanged]: IRectChangeDetail;
    [EventEnum.ViewportChanged]: IRectChangeDetail;
    [EventEnum.ToolDown]: IToolDetail;
    [EventEnum.ToolDraw]: IToolDetail;
    [EventEnum.ToolMove]: IToolDetail;
    [EventEnum.ToolUp]: IToolDetail;
  }
}

