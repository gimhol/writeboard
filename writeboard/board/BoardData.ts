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
 */
export class BoardData {
  private shapes = new Map<string, ShapeData>()
  private layers = new Map<string, ILayerInfo>()

  get size(): number { return this.shapes.size }

  get isEmpty(): boolean { return !this.shapes.size && !this.layers.size }

  find(id: string): ShapeData | undefined { return this.shapes.get(id) }

  all(): ShapeData[] { return Array.from(this.shapes.values()) }

  add(datas: IShapeData[]): void {
    for (const d of datas) this.upsert(d)
  }

  remove(ids: string[]): void {
    for (const id of ids) this.shapes.delete(id)
  }

  /** 合并增量（没有该图形则忽略）；返回是否命中 */
  merge(d: IShapeData): boolean {
    const data = d.i ? this.shapes.get(d.i) : undefined
    if (!data) return false
    data.merge(d)
    this.trackLayer(data)
    return true
  }

  /** 合并增量；没有则按数据新建（与前端 done / live 的落地一致） */
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
