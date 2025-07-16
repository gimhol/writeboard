import { Shape } from "../shape";
import { IRotatedRect, RotatedRect } from "../utils";
import { IHitPredicate, IShapesMgr } from "./IShapesMgr";

const Tag = 'DefaultShapesMgr'
export class DefaultShapesMgr implements IShapesMgr {
  protected _group_shapes_map = new Map<string, Set<Shape>>();
  protected _items: Shape[] = [];
  protected _kvs: {
    [id in string]?: Shape;
  } = {};

  find(id: string) {
    return this._kvs[id] || null;
  }

  shapes(): Shape[] { return this._items; }

  exists(items: Shape[]): number {
    let ret = 0;
    items.forEach(v => {
      if (this._kvs[v.data.id])
        ++ret;
    });
    return ret;
  }

  add(items: Shape[]): number {
    let ret = 0;
    items.forEach(item => {
      if (this._kvs[item.data.id])
        return console.warn(`[${Tag}::add] can not add "${item.data.id}", already exists!`);
      this._kvs[item.data.id] = item;
      this._items.push(item);
      this.ensure_shapes_set_by_group(item.groupId).add(item)
      ++ret;
    });
    this._items.sort((a, b) => a.data.z - b.data.z);
    return ret;
  }

  remove(items: Shape[]): number {
    let ret = 0;
    items.forEach(item => {
      const idx = this._items.findIndex(v => v === item);
      if (idx < 0)
        return;
      this._items = this._items.filter((_, i) => i !== idx);
      delete this._kvs[item.data.id];
      this._group_shapes_map.get(item.groupId)?.delete(item)
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

  minZ(): Shape | null {
    return this._items[0] ?? null
  }

  maxZ(): Shape | null {
    return this._items[this._items.length - 1] ?? null
  }

  groups(): string[] {
    return Array.from(this._group_shapes_map.keys())
  }

  private ensure_shapes_set_by_group(groupd_id: string): Set<Shape> {
    let set = this._group_shapes_map.get(groupd_id);
    if (set) return set
    set = new Set<Shape>();
    this._group_shapes_map.set(groupd_id, set);
    return set
  }

  shapes_by_group(groupd_id: string): Shape[] {
    const set = this._group_shapes_map.get(groupd_id);
    if (!set) return [];
    return Array.from(set);
  }

  update_items_group(shapes: Shape[]): void {
    for (const shape of shapes) {
      for (const [g, s] of this._group_shapes_map) {
        if (g !== shape.groupId && s.has(shape)) {
          s.delete(shape)
          break;
        }
      }
      this.ensure_shapes_set_by_group(shape.groupId).add(shape)
    }
  }
}
