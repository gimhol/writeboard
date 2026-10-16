import { Shape } from "../shape";
import { IRotatedRect, RotatedRect } from "../utils";
import { IHitPredicate, IShapesMgr } from "./IShapesMgr";

const Tag = 'DefaultShapesMgr'
/**
 * 默认的图形管理器：用一个数组按 z 从低到高保存全部图形，另外维护
 * id → 图形 与 组合 id → 图形集合 两张表用于快速查找
 *
 * The default shapes manager: it keeps every shape in an array ordered by z (ascending),
 * plus an id → shape map and a group id → shape set map for fast lookups.
 */
export class DefaultShapesMgr implements IShapesMgr {
  protected _group_shapes_map = new Map<string, Set<Shape>>();
  protected _items: Shape[] = [];
  protected _kvs: {
    [id in string]?: Shape;
  } = {};

  /**
   * 按 id 找图形（找不到返回 null）
   *
   * Finds a shape by id (returns null when it does not exist).
   *
   * @param {string} id 图形 id / Shape id
   * @return {Shape | null} 图形 / The shape
   */
  find(id: string) {
    return this._kvs[id] || null;
  }

  /**
   * 取全部图形（按 z 从小到大，直接返回内部数组，不要改动它）
   *
   * Gets every shape (ordered by z, ascending; the internal array is returned as-is, do not
   * mutate it).
   *
   * @return {Shape[]} 全部图形 / Every shape
   */
  shapes(): Shape[] { return this._items; }

  /**
   * 统计这批图形里有多少已经在本管理器中（按 id 判断）
   *
   * Counts how many of these shapes are already in this manager (matched by id).
   *
   * @param {Shape[]} items 图形 / Shapes
   * @return {number} 已存在的数量 / How many already exist
   */
  exists(items: Shape[]): number {
    let ret = 0;
    items.forEach(v => {
      if (this._kvs[v.data.id])
        ++ret;
    });
    return ret;
  }

  /**
   * 加图形：id 已存在的（重复）只告警并跳过，加完按 z 重新排序
   *
   * Adds shapes: existing ones (duplicate ids) only warn and are skipped, then the array is
   * sorted by z again.
   *
   * @param {Shape[]} items 图形 / Shapes
   * @return {number} 真正加进去的数量 / How many were actually added
   */
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

  /**
   * 删图形：不在本管理器里的跳过，同时从 id 表与组合表里摘掉
   *
   * Removes shapes: ones that are not in this manager are skipped, and they are taken out
   * of the id map and the group map as well.
   *
   * @param {Shape[]} items 图形 / Shapes
   * @return {number} 真正删掉的数量 / How many were actually removed
   */
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

  /**
   * 命中判定：幽灵图形（ghost）不算命中，先看包围盒（obb）是否与范围相交，
   * 再（如果给了）跑自定义判定
   *
   * Hit test: ghost shapes never count, it first checks whether the bounding box (obb)
   * meets the area and then runs the custom predicate (when one was given).
   *
   * @param {Shape} shape 待判定的图形 / The shape to test
   * @param {IRotatedRect} rect 命中范围 / The hit area
   * @param {IHitPredicate} [predicate] 更精细的判定 / A finer-grained predicate
   * @return {boolean} 是否命中 / Whether it was hit
   */
  is_hit(shape: Shape, rect: IRotatedRect, predicate?: IHitPredicate): boolean {
    if (shape.ghost) return false;
    if (!RotatedRect.hit(shape.obb(), rect)) return false;
    if (!predicate) return true;
    return predicate(shape, rect);
  }

  /**
   * 取范围内的全部图形（按 z 从高到低，也就是绘制顺序的倒序）
   *
   * Gets every shape inside the area (from the highest z down, i.e. the reverse of the
   * drawing order).
   *
   * @param {IRotatedRect} rect 范围 / The area
   * @param {IHitPredicate} [predicate] 更精细的判定 / A finer-grained predicate
   * @return {Shape[]} 命中的图形 / The shapes that were hit
   */
  hits(rect: IRotatedRect, predicate?: IHitPredicate): Shape[] {
    const count = this._items.length;
    const ret: Shape[] = [];
    for (let idx = count - 1; idx >= 0; --idx) {
      const v = this._items[idx];
      if (this.is_hit(v, rect, predicate)) ret.push(v);
    }
    return ret;
  }

  /**
   * 取范围内 z 最高的那个图形（没有则 null）
   *
   * Gets the shape with the highest z inside the area (null when there is none).
   *
   * @param {IRotatedRect} rect 范围 / The area
   * @param {IHitPredicate} [predicate] 更精细的判定 / A finer-grained predicate
   * @return {Shape | null} 命中的图形 / The shape that was hit
   */
  hit(rect: IRotatedRect, predicate?: IHitPredicate): Shape | null {
    const count = this._items.length;
    for (let idx = count - 1; idx >= 0; --idx) {
      const v = this._items[idx];
      if (this.is_hit(v, rect, predicate)) return v;
    }
    return null;
  }

  /**
   * 取 z 最小的图形（最先画的那个）
   *
   * Gets the shape with the smallest z (the one drawn first).
   *
   * @return {Shape | null} 图形（空板子时为 null）/ The shape (null when the board is empty)
   */
  minZ(): Shape | null {
    return this._items[0] ?? null
  }

  /**
   * 取 z 最大的图形（最后画的那个）
   *
   * Gets the shape with the largest z (the one drawn last).
   *
   * @return {Shape | null} 图形（空板子时为 null）/ The shape (null when the board is empty)
   */
  maxZ(): Shape | null {
    return this._items[this._items.length - 1] ?? null
  }

  /**
   * 列出全部组合 id
   *
   * Lists every group id.
   *
   * @return {string[]} 组合 id / Group ids
   */
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

  /**
   * 取某个组合里的全部图形
   *
   * Gets every shape of a group.
   *
   * @param {string} groupd_id 组合 id / Group id
   * @return {Shape[]} 该组合的图形 / The shapes of that group
   */
  shapes_by_group(groupd_id: string): Shape[] {
    const set = this._group_shapes_map.get(groupd_id);
    if (!set) return [];
    return Array.from(set);
  }

  /**
   * 按各图形当前的 groupId 刷新组合表（换组 / 取消组合后调用）
   *
   * Refreshes the group map against each shape's current groupId (call it after regrouping
   * or ungrouping).
   *
   * @param {Shape[]} shapes 要刷新的图形 / The shapes to refresh
   */
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
