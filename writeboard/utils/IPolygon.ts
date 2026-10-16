import type { IVector } from "./IVector";


/**
 * 多边形：按顺序首尾相连的一组顶点
 *
 * A polygon: a list of vertices joined in order, the last one back to the first.
 */
export interface IPolygon {
  /**
   * 顶点列表（按多边形顺序，相邻两点之间是一条边）
   *
   * Vertex list, in polygon order; two neighbouring vertices form an edge.
   */
  dots: IVector[];
}
