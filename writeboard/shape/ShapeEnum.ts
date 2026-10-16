import { enumNameGetter } from "../utils/helper"

/**
 * 内置图形类型的编号：自定义图形请用字符串类型，不走这张表
 *
 * Ids of the built-in shape types; custom shapes should use a string type instead and
 * stay out of this table.
 *
 * @see {ShapeType}
 */
export enum ShapeEnum {
  /**
   * 非法 / 未指定
   *
   * Invalid / unspecified.
   */
  Invalid = 0,
  /**
   * 画笔（自由笔迹）
   *
   * Pen (a free hand stroke).
   */
  Pen = 1,
  /**
   * 矩形
   *
   * Rectangle.
   */
  Rect = 2,
  /**
   * 椭圆
   *
   * Oval.
   */
  Oval = 3,
  /**
   * 文本
   *
   * Text.
   */
  Text = 4,
  /**
   * 多边形
   *
   * Polygon.
   */
  Polygon = 5,
  /**
   * 钩（对号）
   *
   * Tick (a check mark).
   */
  Tick = 6,
  /**
   * 叉（错号）
   *
   * Cross.
   */
  Cross = 7,
  /**
   * 半钩（对号上加一横）
   *
   * Half tick.
   */
  HalfTick = 8,
  /**
   * 直线
   *
   * Lines.
   */
  Lines = 9,
  /**
   * 图片
   *
   * Image.
   */
  Img = 10,
}
/**
 * 图形类型：内置图形取 ShapeEnum 的值，自定义图形为任意字符串
 *
 * Shape type: a ShapeEnum value for the built-in shapes, any string for custom ones.
 *
 * @see {ShapeEnum}
 */
export type ShapeType = ShapeEnum | string
/**
 * 按图形类型取类型名的函数：内置类型返回 `ShapeType.Pen` 这样的名字，自定义字符串原样返回
 *
 * Gets the name of a shape type: a `ShapeType.Pen`-like name for the built-in ones, the
 * string itself for custom types.
 *
 * @return {string} 类型名 / The type name
 */
export const getShapeName = enumNameGetter<ShapeType>("ShapeType", ShapeEnum)