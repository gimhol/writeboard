
/**
 * 接口：旋转柄（图形被选中后上方那根带圆点的柄）的配置
 *
 * Interface: config of the rotate grip (the stalk with a round knob above a selected
 * shape).
 */
export interface IRotatorInfo {
  /**
   * 旋转柄圆点的尺寸（画布坐标）
   *
   * Size of the grip's knob (canvas coordinates).
   */
  size: number;
  /**
   * 旋转柄到图形包围盒的距离（画布坐标）
   *
   * Distance from the grip to the shape's bounding box (canvas coordinates).
   */
  distance: number;
}
