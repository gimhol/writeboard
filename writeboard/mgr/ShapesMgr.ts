import { Shape } from "../shape/base/Shape"
import { IRotatedRect, RotatedRect } from "../utils/RotatedRect"
export interface IShapesMgr {
  /**
   * 查找指定ID的图形
   *
   * @param {string} id 指定ID
   * @return {(Shape | null)} 存在时，返回图形，否则返回undefined
   * @memberof IShapesMgr
   */
  find(id: string): Shape | null

  /**
   * 获取全部图形
   *
   * @return {Shape[]} 全部图形
   * @memberof IShapesMgr
   */
  shapes(): Shape[]


  add(...items: Shape[]): number

  remove(...items: Shape[]): number

  exists(...items: Shape[]): number

  hit(rect: IRotatedRect, predicate?: (shape: Shape) => any): Shape | null

  hits(rect: IRotatedRect, predicate?: (shape: Shape) => any): Shape[]
}

const Tag = '[DefaultShapesMgr]'
export class DefaultShapesMgr implements IShapesMgr {
  private _items: Shape[] = [];
  private _kvs: { [id in string]?: Shape } = {}

  find(id: string) {
    return this._kvs[id] || null
  }

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

  hits(rect: IRotatedRect, predicate?: (shape: Shape) => any): Shape[] {
    const count = this._items.length
    const ret: Shape[] = []
    for (let idx = count - 1; idx >= 0; --idx) {
      const v = this._items[idx]
      if (!v.ghost && RotatedRect.hit(v.data, rect) && (!predicate || predicate(v)))
        ret.push(v)
    }
    return ret
  }

  hit(rect: IRotatedRect, predicate?: (shape: Shape) => any): Shape | null {
    const count = this._items.length
    for (let idx = count - 1; idx >= 0; --idx) {
      const v = this._items[idx]
      if (!v.ghost && RotatedRect.hit(v.data, rect) && (!predicate || predicate(v)))
        return v
    }
    return null
  }
}
