import type { IShapeData } from "../shape/base/IShapeData";
import type { ILayerInfo } from "./Layer";

/**
 * 画布快照：一份可以序列化、可以再次载入的完整画布数据（图层 + 图形）
 *
 * Board snapshot: the whole board (layers and shapes) in a serialisable form that can be
 * loaded again later.
 */
export interface ISnapshot {
  /**
   * 快照格式版本号（当前为 0）
   *
   * Version of the snapshot format (0 for now).
   */
  v: number;
  /**
   * 保留字段，导出时固定为 0（导入端不消费）
   *
   * Reserved field, always 0 when exported (the importing side does not read it).
   */
  x: number;
  /**
   * 保留字段，导出时固定为 0（导入端不消费）
   *
   * Reserved field, always 0 when exported (the importing side does not read it).
   */
  y: number;
  /**
   * 画布宽度（设计单位）
   *
   * Canvas width in design units.
   */
  w: number;
  /**
   * 画布高度（设计单位）
   *
   * Canvas height in design units.
   */
  h: number;
  /**
   * 图层信息列表
   *
   * List of layer infos.
   */
  l: ILayerInfo[];
  /**
   * 图形数据列表（不含运行时字段，见 ShapeData.wash）
   *
   * List of shape data (without the runtime fields, see ShapeData.wash).
   */
  s: IShapeData[];
}
