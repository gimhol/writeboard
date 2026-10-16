import { ShapeEnum } from "../ShapeEnum"
import { IShapeData, ShapeData } from "../base"

/**
 * 直线的数据：除公共字段外只多一条折线的坐标
 *
 * Lines data: beyond the common fields it only adds the coordinates of one polyline.
 */
export interface ILinesData extends IShapeData {
  /**
   * 坐标（短键 u），扁平的 [x0, y0, x1, y1, ...]
   *
   * coords (short key `u`), flat [x0, y0, x1, y1, ...]
   */
  u: number[]
}
/**
 * 直线数据的默认实现
 *
 * Default implementation of the lines data.
 */
export class LinesData extends ShapeData implements ILinesData {
  /**
   * 扁平坐标（短键 u）
   *
   * The flat coordinates (short key `u`).
   */
  u: number[] = []

  /**
   * 坐标，u 的别名
   *
   * The coordinates, an alias of u.
   */
  get coords(): number[] { return this.u }
  set coords(v: number[]) { this.u = v }

  /**
   * 直线只描边，不填充
   *
   * A line is never filled.
   *
   * @default false
   */
  override get needFill(): boolean {
    return false;
  }
  /**
   * 建一份直线数据：默认红色描边、线宽 2、圆头圆角
   *
   * Builds lines data: a red stroke of width 2 with round caps and joins by default.
   *
   * @param {Partial<LinesData>} [other] 初始数据 / The initial data
   */
  constructor(other?: Partial<LinesData>) {
    super(other)
    this.type = ShapeEnum.Lines;
    this.strokeStyle = '#ff0000';
    this.lineCap = 'round';
    this.lineJoin = 'round';
    this.lineWidth = 2;
    if (other) this.read(other)
  }
  /**
   * 读入一份直线数据：坐标整份拷进来；序列化短键 u 与友好名 coords 都认
   *
   * Reads a piece of lines data: the coordinates are copied, and both the short key `u` and
   * the friendly name coords are accepted.
   *
   * @param {Partial<LinesData>} other 要读入的数据 / The data to read
   * @return {this} 本对象（便于链式调用）/ This instance (chainable)
   */
  override read(other: Partial<LinesData>) {
    super.read(other)
    const { coords } = other
    const { u = coords } = other
    if (Array.isArray(u)) this.coords = [...u]
    return this
  }
  /**
   * 合并一份直线数据：坐标整份替换（直线不支持追加分片）
   *
   * Merges a piece of lines data: the coordinates are replaced as a whole (lines do not
   * support appended slices).
   *
   * @param {Partial<LinesData>} other 要合并的数据 / The data to merge
   * @return {this} 本对象（便于链式调用）/ This instance (chainable)
   */
  override merge(other: Partial<LinesData>) {
    super.read(other)
    const { coords } = other
    const { u = coords } = other
    if (Array.isArray(u)) this.coords = [...u]
    return this
  }
}
