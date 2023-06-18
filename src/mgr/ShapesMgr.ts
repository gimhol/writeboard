import { Shape } from "../shape/base/Shape"
import { IRect, Rect } from "../utils/Rect"
const Tag = '[ShapesMgr]'
export interface IShapesMgr {
  finds(id: string[]): Shape[]
  find(id: string): Shape | undefined
  shapes(): Shape[]
  add(...items: Shape[]): number
  remove(...items: Shape[]): number
  exists(...items: Shape[]): number
  hit(rect: IRect): Shape | undefined
  hits(rect: IRect): Shape[]
}

export class ShapesMgr implements IShapesMgr {
  finds(ids: string[]): Shape[] {
    const ret: Shape[] = []
    ids.forEach(id => {
      const shape = this._kvs[id]
      shape && ret.push(shape)
    })
    return ret
  }
  find(id: string) {
    return this._kvs[id]
  }
  private _items: Shape[] = []
  private _kvs: { [id in string]?: Shape } = {}
  shapes(): Shape[] { return this._items }
  exists(...items: Shape[]): number {
    let ret = 0
    items.forEach(v => {
      if (this._kvs[v.data.id])
        ++ret
    })
    return ret
  }
  add(...items: Shape[]): number {
    let ret = 0
    items.forEach(item => {
      if (this.exists(item))
        return console.warn(Tag, `can not add "${item.data.id}", already exists!`)
      this._kvs[item.data.id] = item
      this._items.push(item)
      ++ret
    })
    this._items.sort((a, b) => a.data.z - b.data.z)
    return ret
  }

  remove(...items: Shape[]): number {
    let ret = 0
    items.forEach(item => {
      const idx = this._items.findIndex(v => v === item);
      if (idx < 0)
        return
      this._items = this._items.filter((_, i) => i !== idx)
      delete this._kvs[item.data.id]
      ++ret
    })
    return ret
  }

  hits(rect: IRect): Shape[] {
    const count = this._items.length
    const ret: Shape[] = []
    for (let idx = count - 1; idx >= 0; --idx) {
      const v = this._items[idx]
      if (Rect.hit(v.data, rect))
        ret.push(v)
    }
    return ret
  }
  hit(rect: IRect): Shape | undefined {
    const count = this._items.length
    for (let idx = count - 1; idx >= 0; --idx) {
      const v = this._items[idx]
      if (Rect.hit(v.data, rect))
        return v

    }
  }
}
