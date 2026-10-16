import { IDot } from "../../utils/Dot";
import { ShapeEnum } from "../ShapeEnum";
import { IShapeData, ShapeData } from "../base";

/**
 * 多边形数据：除公共字段外只多一个顶点集
 *
 * Polygon data: beyond the common fields it only adds the vertices.
 */
export interface IPolygonData extends IShapeData {
  /**
   * 顶点集（短键 u），每个点自带压力 p
   *
   * dots (short key `u`), every point carries its own pressure p
   */
  u: IDot[];
}

/**
 * 多边形数据的默认实现
 *
 * Default implementation of the polygon data.
 */
export class PolygonData extends ShapeData implements IPolygonData {
  /**
   * 建一份多边形数据：默认红色填充、黑色描边、线宽 2
   *
   * Builds polygon data: a red fill, a black stroke and a width of 2 by default.
   *
   * @param {Partial<PolygonData>} [other] 初始数据 / The initial data
   */
  constructor(other?: Partial<PolygonData>) {
    super(other)
    this.type = ShapeEnum.Polygon
    this.fillStyle = '#ff0000'
    this.strokeStyle = '#000000'
    this.lineWidth = 2
    other && this.read(other)
  }

  /**
   * 顶点集（短键 u）
   *
   * The vertices (short key `u`).
   */
  u: IDot[] = []
  /**
   * 顶点集，u 的别名
   *
   * The vertices, an alias of u.
   */
  get dots(): IDot[] { return this.u }
  set dots(v: IDot[]) { this.u = v }

  /**
   * 读入一份多边形数据：顶点会逐个拷一份，避免两份数据共用同一个点对象
   *
   * Reads a piece of polygon data: every vertex is copied, so two data never share the same
   * point object.
   *
   * @param {Partial<PolygonData>} other 要读入的数据 / The data to read
   * @return {this} 本对象（便于链式调用）/ This instance (chainable)
   */
  override read(other: Partial<PolygonData>) {
    super.read(other)
    const { u = other.dots } = other
    if (u) this.u = u.map(v => ({ ...v }))
    return this
  }
}

