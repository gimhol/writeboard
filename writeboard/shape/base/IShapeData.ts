import { ShapeType } from "../ShapeEnum";
import { IShapeStatus } from "./IShapeStatus";
import { IShapeStyle } from "./IShapeStyle";

/**
 * 一切图形数据共有的字段：为了压缩体积，字段名都取紧凑短键
 *
 * Fields shared by every shape data: the names are compact short keys to keep the payload
 * small.
 *
 * @see {ShapeData}
 */
export interface IShapeData {
  /**
   * 样式：描边 / 填充 / 线宽等绘制参数（短键 a）
   *
   * Style: stroke / fill / line width and other drawing options (short key `a`).
   */
  a?: IShapeStyle;

  /**
   * 状态位：可见 / 选中 / 编辑中 / 锁定 / ghost（短键 b）
   *
   * Status flags: visible / selected / editing / locked / ghost (short key `b`).
   */
  b?: IShapeStatus;

  /**
   * 横向缩放比例，未缩放时不存（短键 c）
   *
   * Horizontal scale, omitted while it is 1 (short key `c`).
   */
  c?: number;

  /**
   * 纵向缩放比例，未缩放时不存（短键 d）
   *
   * Vertical scale, omitted while it is 1 (short key `d`).
   */
  d?: number;

  /**
   * 所属编组的 id，未编组时不存（短键 g）
   *
   * Id of the group this shape belongs to, omitted when it is not grouped (short key `g`).
   */
  g?: string;

  /**
   * 高度（短键 h）
   *
   * Height (short key `h`).
   */
  /* height */
  h: number;

  /**
   * 图形 id，全局唯一（短键 i）
   *
   * Shape id, unique across the board (short key `i`).
   */
  i: string;

  /**
   * 所在图层的 id，查不到时会被归到当前编辑图层（短键 l）
   *
   * Id of the layer this shape lives on; a dangling one is remapped to the current
   * editing layer (short key `l`).
   */
  l?: string;

  /**
   * 旋转弧度，绕图形自身中心旋转，未旋转时不存（短键 r）
   *
   * Rotation in radians around the shape center, omitted while it is 0 (short key `r`).
   */
  r?: number;

  /**
   * 图形类型（短键 t）
   *
   * Shape type (short key `t`).
   *
   * @see {ShapeType}
   */
  t: ShapeType;

  /**
   * 宽度（短键 w）
   *
   * Width (short key `w`).
   */
  w: number;

  /**
   * 左上角的世界坐标 x（短键 x）
   *
   * World x of the top left corner (short key `x`).
   */
  x: number;

  /**
   * 左上角的世界坐标 y（短键 y）
   *
   * World y of the top left corner (short key `y`).
   */
  y: number;

  /**
   * 图层内层级（短键 z）：数字越大越靠上
   *
   * Order inside the layer (short key `z`): a larger number is drawn on top.
   */
  z: number;
}
