import { Gaia } from "../mgr/Gaia"
import { ShapeData } from "../shape/base"
import type { IShapeData } from "../shape/base"
import type { ShapeType } from "../shape/ShapeEnum"
import type { ILayerInfo } from "./Layer"
import type { ISnapshot } from "./ISnapshot"

const DEFAULT_LAYER_NAME = 'Layer'

/**
 * 无 Canvas / 无 DOM 环境下的图形数据容器：按 id 维护图形数据、应用增量、产出与 board.toJson 同格式的快照。
 * 不涉及渲染（Shape / Path2D / 画布），可在 Node 里当房间状态的存储用。
 *
 * Shape data container for environments without canvas / DOM: it keeps shape data by id,
 * applies deltas and produces a snapshot in the same format as board.toJson. It does not
 * render anything (no Shape / Path2D / canvas), so it can be used in Node as the room
 * state store.
 */
export class BoardData {
  private shapes = new Map<string, ShapeData>()
  private layers = new Map<string, ILayerInfo>()

  /**
   * 图形数量
   *
   * Number of shapes.
   */
  get size(): number { return this.shapes.size }

  /**
   * 是否没有任何图形与图层
   *
   * Whether there is neither a shape nor a layer.
   */
  get isEmpty(): boolean { return !this.shapes.size && !this.layers.size }

  /**
   * 按 id 找图形数据
   *
   * Finds shape data by id (undefined when it is not there).
   *
   * @param {string} id 图形 id / Shape id
   * @return {ShapeData | undefined} 图形数据 / Shape data
   */
  find(id: string): ShapeData | undefined { return this.shapes.get(id) }

  /**
   * 全部图形数据
   *
   * Every shape data of this container.
   *
   * @return {ShapeData[]} 图形数据数组 / Array of shape data
   */
  all(): ShapeData[] { return Array.from(this.shapes.values()) }

  /**
   * 批量添加图形数据：已存在的按增量合并，没有的按类型新建
   *
   * Adds a batch of shape data: the existing ones are merged, the missing ones are
   * created from their type.
   *
   * @param {IShapeData[]} datas 图形数据 / Shape data
   */
  add(datas: IShapeData[]): void {
    for (const d of datas) this.upsert(d)
  }

  /**
   * 按 id 批量删除图形数据
   *
   * Removes shape data by id.
   *
   * @param {string[]} ids 图形 id / Shape ids
   */
  remove(ids: string[]): void {
    for (const id of ids) this.shapes.delete(id)
  }

  /**
   * 合并增量（没有该图形则忽略）；返回是否命中
   *
   * Merges a delta and ignores it when there is no such shape; returns whether it hit.
   *
   * @param {IShapeData} d 增量数据 / Delta data
   * @return {boolean} 是否命中已有的图形 / Whether an existing shape was hit
   */
  merge(d: IShapeData): boolean {
    const data = d.i ? this.shapes.get(d.i) : undefined
    if (!data) return false
    data.merge(d)
    this.trackLayer(data)
    return true
  }

  /**
   * 合并增量；没有则按数据新建（与前端 done / live 的落地一致）
   *
   * Merges a delta, or creates the shape from the data when it is missing (exactly like
   * the front end lands a done / live message).
   *
   * @param {IShapeData} d 增量数据 / Delta data
   * @return {ShapeData | undefined} 合并后的图形数据 / The merged shape data
   */
  upsert(d: IShapeData): ShapeData | undefined {
    if (!d.i) return undefined
    let data = this.shapes.get(d.i)
    if (data) {
      data.merge(d)
    } else {
      data = this.newData(d.t)
      data.read(d)
      this.shapes.set(d.i, data)
    }
    this.trackLayer(data)
    return data
  }

  /**
   * 导出快照（与 board.toJson 同格式；导入端不消费 v / x / y / w / h，所以置 0）
   *
   * Exports a snapshot in the same format as board.toJson (v / x / y / w / h are 0 because
   * the importing side does not read them).
   *
   * @return {ISnapshot} 快照 / Snapshot
   */
  toSnapshot(): ISnapshot {
    return {
      v: 0,
      x: 0,
      y: 0,
      w: 0,
      h: 0,
      l: Array.from(this.layers.values()),
      s: Array.from(this.shapes.values(), (d) => d.copy().wash()),
    }
  }

  /**
   * 导出快照 JSON
   *
   * Exports the snapshot as JSON.
   *
   * @return {string} 快照 JSON / Snapshot JSON
   */
  toJson(): string { return JSON.stringify(this.toSnapshot()) }

  private newData(type: ShapeType): ShapeData {
    const create = Gaia.shapeData(type)
    return create ? create() : new ShapeData()
  }

  private trackLayer(data: ShapeData): void {
    const layer = data.layer
    if (!layer || this.layers.has(layer)) return
    this.layers.set(layer, { id: layer, name: DEFAULT_LAYER_NAME })
  }
}
