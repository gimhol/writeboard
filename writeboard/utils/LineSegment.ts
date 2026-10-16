import { Line, type ILine } from "./Line";
import type { IVector } from "./IVector";

/**
 * 线段：与 Line 同一套端点，但只保留两端之间的部分，求交点时也只看这一段
 *
 * A line segment: the same two end points as Line, but only the part between them counts,
 * and the intersection only looks at that part.
 */
export class LineSegment extends Line {
  /**
   * 调试用的文字描述
   *
   * Text description for debugging.
   *
   * @return {string} 形如 LineSegment(x0=.., y0=.., x1=.., y1=..) 的字符串 / A string like LineSegment(x0=.., y0=.., x1=.., y1=..)
   */
  toString() {
    return `LineSegment(x0=${this.x0}, y0=${this.x0}, x1=${this.x1}, y1=${this.y1})`;
  }
  /**
   * 按一份线段数据新建一个 LineSegment 实例
   *
   * Creates a new LineSegment instance from segment data.
   *
   * @param {ILine} line 线段数据 / Segment data
   * @return {LineSegment} 新的 LineSegment 实例 / The new LineSegment instance
   */
  static create(line: ILine) {
    return new LineSegment(line.x0, line.y0, line.x1, line.y1);
  }

  /**
   * 求两条线段的交点：只有交点同时落在两条线段上才算（平行或共线时为 null）
   *
   * Intersection of two segments: only counted when the intersection lies on both
   * segments (null when they are parallel or collinear).
   *
   * @param {number} a_x0 线段 A 起点的 x / X of segment A's start point
   * @param {number} a_y0 线段 A 起点的 y / Y of segment A's start point
   * @param {number} a_x1 线段 A 终点的 x / X of segment A's end point
   * @param {number} a_y1 线段 A 终点的 y / Y of segment A's end point
   * @param {number} b_x0 线段 B 起点的 x / X of segment B's start point
   * @param {number} b_y0 线段 B 起点的 y / Y of segment B's start point
   * @param {number} b_x1 线段 B 终点的 x / X of segment B's end point
   * @param {number} b_y1 线段 B 终点的 y / Y of segment B's end point
   * @return {IVector | null} 交点，不相交时为 null / The intersection, or null when they do not intersect
   */
  static intersection(a_x0: number, a_y0: number, a_x1: number, a_y1: number, b_x0: number, b_y0: number, b_x1: number, b_y1: number): IVector | null {
    const denominator = (a_x0 - a_x1) * (b_y0 - b_y1) - (a_y0 - a_y1) * (b_x0 - b_x1);

    // 如果分母为0，表示线段平行或共线
    if (denominator === 0) {
      return null;
    }
    const t = ((a_x0 - b_x0) * (b_y0 - b_y1) - (a_y0 - b_y0) * (b_x0 - b_x1)) / denominator;
    const s = ((a_x0 - b_x0) * (a_y0 - a_y1) - (a_y0 - b_y0) * (a_x0 - a_x1)) / denominator;

    if (t < 0 || t > 1 || s < 0 || s > 1)
      return null;

    const x = a_x0 + t * (a_x1 - a_x0);
    const y = a_y0 + t * (a_y1 - a_y0);
    return { x, y };
  }
  /**
   * 求两个线段对象的交点
   *
   * Intersection of two segment objects.
   *
   * @param {ILine} a 线段 A / Segment A
   * @param {ILine} b 线段 B / Segment B
   * @return {IVector | null} 交点，不相交时为 null / The intersection, or null when they do not intersect
   */
  static intersection2(a: ILine, b: ILine): IVector | null {
    return LineSegment.intersection(a.x0, a.y0, a.x1, a.y1, b.x0, b.y0, b.x1, b.y1);
  }
}
