import { Shape } from "../shape";
import { IRotatedRect, RotatedRect } from "../utils";
import { IShapesMgr, IHitPredicate } from "./IShapesMgr";

const Tag = 'DefaultShapesMgr'
export class DefaultShapesMgr implements IShapesMgr {
  private _items: Shape[] = [];
  private _kvs: {
    [id in string]?: Shape;
  } = {};

  find(id: string) {
    return this._kvs[id] || null;
  }

  shapes(): Shape[] { return this._items; }

  exists(...items: Shape[]): number {
    let ret = 0;
    items.forEach(v => {
      if (this._kvs[v.data.id])
        ++ret;
    });
    return ret;
  }

  add(...items: Shape[]): number {
    let ret = 0;
    items.forEach(item => {
      if (this.exists(item))
        return console.warn(`[${Tag}::add] can not add "${item.data.id}", already exists!`);
      this._kvs[item.data.id] = item;
      this._items.push(item);
      ++ret;
    });
    this._items.sort((a, b) => a.data.z - b.data.z);
    return ret;
  }

  remove(...items: Shape[]): number {
    let ret = 0;
    items.forEach(item => {
      const idx = this._items.findIndex(v => v === item);
      if (idx < 0)
        return;
      this._items = this._items.filter((_, i) => i !== idx);
      delete this._kvs[item.data.id];
      ++ret;
    });
    return ret;
  }

  is_hit(shape: Shape, rect: IRotatedRect, predicate?: IHitPredicate): boolean {
    if (shape.ghost) return false;
    if (!RotatedRect.hit(shape.obb(), rect)) return false;
    if (!predicate) return true;
    return predicate(shape, rect);
  }

  hits(rect: IRotatedRect, predicate?: IHitPredicate): Shape[] {
    const count = this._items.length;
    const ret: Shape[] = [];
    for (let idx = count - 1; idx >= 0; --idx) {
      const v = this._items[idx];
      if (this.is_hit(v, rect, predicate)) ret.push(v);
    }
    return ret;
  }

  hit(rect: IRotatedRect, predicate?: IHitPredicate): Shape | null {
    const count = this._items.length;
    for (let idx = count - 1; idx >= 0; --idx) {
      const v = this._items[idx];
      if (this.is_hit(v, rect, predicate)) return v;
    }
    return null;
  }
}
