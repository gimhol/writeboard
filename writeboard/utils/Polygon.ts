import { IPolygon } from "./IPolygon";
import { IRotatedRect } from "./IRotatedRect";
import { Rect } from "./Rect";
import { RotatedRect } from "./RotatedRect";
import { Vector } from "./Vector";
import { IVector } from "./IVector";
import { LineSegment } from "./LineSegment";

/**
 * 多边形：顶点按顺序首尾相连，相邻两点是一条边；内部按世界坐标（或图形自身坐标系）存放
 *
 * A polygon: the vertices are joined in order, two neighbours form an edge; the vertices
 * are stored in world coordinates (or in the coordinate system of the shape itself).
 */
export class Polygon implements IPolygon {
  /**
   * 顶点列表（已转成 Vector 实例）
   *
   * Vertex list (already turned into Vector instances).
   */
  dots: Vector[];
  /**
   * 按一组顶点建多边形，顶点会被拷贝成 Vector 实例
   *
   * Builds a polygon from a list of vertices; every vertex is copied into a Vector
   * instance.
   *
   * @param {IVector[]} dots 顶点列表 / Vertex list
   * @default []
   */
  constructor(dots: IVector[] = []) {
    this.dots = dots.map(dot => Vector.create(dot))
  }
  /**
   * 读入另一个多边形的顶点（会拷贝成新的 Vector 实例），覆盖自身的
   *
   * Reads the vertices of another polygon (copied into new Vector instances) and
   * overwrites this one's.
   *
   * @param {IPolygon} o 源多边形 / Source polygon
   * @return {this} 自身，便于链式调用 / This instance, for chaining
   */
  read(o: IPolygon): this {
    this.dots = o.dots.map(dot => Vector.create(dot));
    return this;
  }
  /**
   * 调试用的文字描述（只带顶点个数）
   *
   * Text description for debugging (it only carries the vertex count).
   *
   * @return {string} 形如 Polygon(dots.length=..) 的字符串 / A string like Polygon(dots.length=..)
   */
  toString(): string {
    return `Polygon(dots.length=${this.dots.length})`
  }
  /**
   * 把一个（可旋转的）矩形转成四个顶点的多边形
   *
   * Turns a (possibly rotated) rectangle into a polygon of four vertices.
   *
   * @param {IRotatedRect} rect 矩形，带 r 则按旋转矩形处理 / The rectangle, treated as rotated when r is set
   * @return {Polygon} 四边形的多边形 / The polygon of four vertices
   */
  static from_rect(rect: IRotatedRect): Polygon {
    const R = rect.r ? RotatedRect : Rect
    return new Polygon(R.ensure(rect).dots)
  }
  /**
   * 求多边形与线段 (a → b) 的交点，逐个多边形边检查，返回碰到的第一个
   *
   * Intersection of a polygon and the segment (a → b): it walks the polygon edges and
   * returns the first hit.
   *
   * @param {IVector[]} polygon 多边形的顶点 / Vertices of the polygon
   * @param {number} ax 线段起点的 x / X of the segment's start point
   * @param {number} ay 线段起点的 y / Y of the segment's start point
   * @param {number} bx 线段终点的 x / X of the segment's end point
   * @param {number} by 线段终点的 y / Y of the segment's end point
   * @return {IVector | null} 交点，不相交时为 null / The intersection, or null when they do not intersect
   */
  static intersect_linesegment(polygon: IVector[], ax: number, ay: number, bx: number, by: number): IVector | null {
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const a = polygon[j];
      const b = polygon[i];
      const dot = LineSegment.intersection(a.x, a.y, b.x, b.y, ax, ay, bx, by);
      if (dot) return dot;
    }
    return null
  }
  /**
   * 判断点是否在多边形内（含落在顶点上的情况）
   *
   * Whether a point is inside a polygon (points on a vertex count as inside).
   *
   * @param {IVector[]} polygon 多边形的顶点 / Vertices of the polygon
   * @param {IVector} d 待判断的点 / The point to test
   * @return {boolean} 在内部或顶点上时返回 true / True when it is inside or on a vertex
   */
  static contain_dot(polygon: IVector[], d: IVector) {
    return this.contain_dot2(polygon, d.x, d.y);
  }
  /**
   * 判断点 (x, y) 是否在多边形内：射线法，从点往右发一条射线数穿过几条边
   *
   * Whether the point (x, y) is inside a polygon: the ray casting method, counting how
   * many edges a ray pointing right crosses.
   *
   * @param {IVector[]} polygon 多边形的顶点 / Vertices of the polygon
   * @param {number} x 待判断点的 x / X of the point to test
   * @param {number} y 待判断点的 y / Y of the point to test
   * @return {boolean} 在内部或顶点上时返回 true / True when it is inside or on a vertex
   */
  static contain_dot2(polygon: IVector[], x: number, y: number) {
    let inside = false;

    // 遍历多边形的每条边
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const a = polygon[j];
      const b = polygon[i];

      // 检查点是否在边的端点上
      if (Vector.equal2(a.x, a.y, x, y) || Vector.equal2(b.x, b.y, x, y)) {
        return true; // 点在顶点上
      }

      // 判断射线与边是否相交
      const intersect = ((b.y > y) !== (a.y > y)) && (x < (a.x - b.x) * (y - b.y) / (a.y - b.y) + b.x);

      if (intersect) inside = !inside;
    }

    return inside;
  }
}
