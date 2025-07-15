/**
 * 表示图形能以何种方式被拉伸
 *
 * @export
 * @enum {number}
 */

export enum Resizable {
  /** 禁止 */ None = 0,
  TopLeft = 0b00000001,
  Top = 0b00000010,
  TopRight = 0b00000100,
  Right = 0b00001000,
  BottomRight = 0b00010000,
  Bottom = 0b00100000,
  BottomLeft = 0b01000000,
  Left = 0b10000000,
  /** 水平 */ Horizontal = 0b10001000,
  /** 垂直 */ Vertical = 0b00100010,
  /** 四角 */ Corner = 0b01010101,
  /** 八向 */ All = 0b11111111
}
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