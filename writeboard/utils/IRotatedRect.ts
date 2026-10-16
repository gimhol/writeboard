import type { IRect } from "./IRect";


/**
 * 可带旋转的矩形：在轴对齐矩形之上加一个绕矩形中心的旋转弧度 r（缺省视为 0）
 *
 * A rectangle that may be rotated: an axis-aligned rectangle plus a rotation r in
 * radians around the centre of the rectangle (undefined counts as 0).
 */
export interface IRotatedRect extends IRect { r?: number; }
