/**
 * 表示图形能以何种方式被拉伸
 *
 * @export
 * @enum {number}
 */

export enum Resizable {
  /**
   * 禁止拉伸
   *
   * Not resizable.
   */
  None = 0,
  /**
   * 左上角控制点
   *
   * Top left handle.
   */
  TopLeft = 0b00000001,
  /**
   * 上边中点控制点
   *
   * Top middle handle.
   */
  Top = 0b00000010,
  /**
   * 右上角控制点
   *
   * Top right handle.
   */
  TopRight = 0b00000100,
  /**
   * 右边中点控制点
   *
   * Right middle handle.
   */
  Right = 0b00001000,
  /**
   * 右下角控制点
   *
   * Bottom right handle.
   */
  BottomRight = 0b00010000,
  /**
   * 下边中点控制点
   *
   * Bottom middle handle.
   */
  Bottom = 0b00100000,
  /**
   * 左下角控制点
   *
   * Bottom left handle.
   */
  BottomLeft = 0b01000000,
  /**
   * 左边中点控制点
   *
   * Left middle handle.
   */
  Left = 0b10000000,
  /**
   * 水平：只给左右两个中点控制点
   *
   * Horizontal: only the left / right middle handles.
   */
  Horizontal = 0b10001000,
  /**
   * 垂直：只给上下两个中点控制点
   *
   * Vertical: only the top / bottom middle handles.
   */
  Vertical = 0b00100010,
  /**
   * 四角：只给四个角控制点
   *
   * Corner: only the four corner handles.
   */
  Corner = 0b01010101,
  /**
   * 八向：四角 + 四边中点全都给
   *
   * All: the four corners plus the four middle handles.
   */
  All = 0b11111111
}
/**
 * 各方向的反向方向表：拖左上角等同于拖右下角
 *
 * Opposite of every direction: dragging the top left handle is the same as dragging the
 * bottom right one.
 */
export const opposites: Record<Resizable, Resizable> = {
  [Resizable.None]: Resizable.None,
  [Resizable.TopLeft]: Resizable.BottomRight,
  [Resizable.Top]: Resizable.Bottom,
  [Resizable.TopRight]: Resizable.BottomLeft,
  [Resizable.Right]: Resizable.Left,
  [Resizable.BottomRight]: Resizable.TopLeft,
  [Resizable.Bottom]: Resizable.Top,
  [Resizable.BottomLeft]: Resizable.TopRight,
  [Resizable.Left]: Resizable.Right,
  [Resizable.Horizontal]: Resizable.Horizontal,
  [Resizable.Vertical]: Resizable.Vertical,
  [Resizable.Corner]: Resizable.Corner,
  [Resizable.All]: Resizable.All,
}
/**
 * 各方向对应的弧度角：0 为上、顺时针递增，非单一方向（组合值）为 NaN
 *
 * Angle in radians of every direction: 0 is up and the value grows clockwise, while the
 * combined values are NaN.
 */
export const degrees: Record<Resizable, number> = {
  [Resizable.Top]: 0,
  [Resizable.TopRight]: 0.7853981633974483,
  [Resizable.Right]: 1.5707963267948966,
  [Resizable.BottomRight]: 2.356194490192345,
  [Resizable.Bottom]: 3.141592653589793,
  [Resizable.BottomLeft]: 3.9269908169872414,
  [Resizable.Left]: 4.71238898038469,
  [Resizable.TopLeft]: 5.497787143782138,
  [Resizable.None]: NaN,
  [Resizable.Horizontal]: NaN,
  [Resizable.Vertical]: NaN,
  [Resizable.Corner]: NaN,
  [Resizable.All]: NaN
}