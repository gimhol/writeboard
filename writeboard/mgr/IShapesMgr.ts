import { Shape } from "../shape/base/Shape"
import { IRotatedRect } from "../utils/IRotatedRect"

/**
 * 命中判定：给一个图形与一个命中范围，返回它是否算命中（返回值按真假使用）
 *
 * Hit predicate: given a shape and an area, returns whether it counts as a hit (the return
 * value is used as a boolean).
 *
 * @param {Shape} shape 待判定的图形 / The shape to test
 * @param {IRotatedRect} rect 命中范围 / The hit area
 * @return {any} 命中结果 / Hit result
 */
export interface IHitPredicate {
  (shape: Shape, rect: IRotatedRect): any
}
/**
 * 接口：图形管理器，管着一块板子上的全部图形（增删查、命中、z 序、组合）
 *
 * Interface: shapes manager, it owns every shape of one board (add / remove / find, hit
 * tests, z order and groups).
 */
export interface IShapesMgr {
  /**
   * 查找指定ID的图形
   *
   * Finds the shape with the given id, or null when there is no such shape.
   *
   * @param {string} id 指定ID
   * @return {(Shape | null)} 存在时，返回图形，否则返回undefined
   * @memberof IShapesMgr
   */
  find(id: string): Shape | null

  /**
   * 获取全部图形
   *
   * Gets every shape.
   *
   * @return {Shape[]} 全部图形
   * @memberof IShapesMgr
   */
  shapes(): Shape[]

  /**
   * 加图形：返回真正加进去的数量（id 已存在的会被跳过）
   *
   * Adds shapes and returns how many were actually added (duplicate ids are skipped).
   *
   * @param {Shape[]} items 图形 / Shapes
   * @return {number} 真正加进去的数量 / How many were added
   */
  add(items: Shape[]): number

  /**
   * 删图形：返回真正删掉的数量（不在管理器里的会被跳过）
   *
   * Removes shapes and returns how many were actually removed (ones that are not in the
   * manager are skipped).
   *
   * @param {Shape[]} items 图形 / Shapes
   * @return {number} 真正删掉的数量 / How many were removed
   */
  remove(items: Shape[]): number

  /**
   * 统计这批图形里有多少已经在本管理器中（按 id 判断）
   *
   * Counts how many of these shapes are already in this manager (matched by id).
   *
   * @param {Shape[]} items 图形 / Shapes
   * @return {number} 已存在的数量 / How many already exist
   */
  exists(items: Shape[]): number

  /**
   * 取范围内 z 最高的那个图形（没有则 null）
   *
   * Gets the shape with the highest z inside the area (null when there is none).
   *
   * @param {IRotatedRect} rect 范围 / The area
   * @param {IHitPredicate} [predicate] 更精细的判定 / A finer-grained predicate
   * @return {Shape | null} 命中的图形 / The shape that was hit
   */
  hit(rect: IRotatedRect, predicate?: IHitPredicate): Shape | null

  /**
   * 取范围内的全部图形（按 z 从高到低）
   *
   * Gets every shape inside the area (from the highest z down).
   *
   * @param {IRotatedRect} rect 范围 / The area
   * @param {IHitPredicate} [predicate] 更精细的判定 / A finer-grained predicate
   * @return {Shape[]} 命中的图形 / The shapes that were hit
   */
  hits(rect: IRotatedRect, predicate?: IHitPredicate): Shape[];

  /**
   * 取 z 最小的图形（最先画的那个）
   *
   * Gets the shape with the smallest z (the one drawn first).
   *
   * @return {Shape | null} 图形（空板子时为 null）/ The shape (null when the board is empty)
   */
  minZ(): Shape | null;
  /**
   * 取 z 最大的图形（最后画的那个）
   *
   * Gets the shape with the largest z (the one drawn last).
   *
   * @return {Shape | null} 图形（空板子时为 null）/ The shape (null when the board is empty)
   */
  maxZ(): Shape | null;

  /**
   * 列出全部组合 id
   *
   * Lists every group id.
   *
   * @return {string[]} 组合 id / Group ids
   */
  groups(): string[];
  /**
   * 取某个组合里的全部图形
   *
   * Gets every shape of a group.
   *
   * @param {string} groupd_id 组合 id / Group id
   * @return {Shape[]} 该组合的图形 / The shapes of that group
   */
  shapes_by_group(groupd_id: string): Shape[];
  /**
   * 按各图形当前的 groupId 刷新组合表（换组 / 取消组合后调用）
   *
   * Refreshes the group map against each shape's current groupId (call it after regrouping
   * or ungrouping).
   *
   * @param {Shape[]} shapes 要刷新的图形 / The shapes to refresh
   */
  update_items_group(shapes: Shape[]): void;
}

