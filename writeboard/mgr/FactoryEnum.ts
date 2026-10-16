import { enumNameGetter } from "../utils/helper"

/**
 * 工厂类型枚举：每个成员的值就是该工厂在登记表里用的类型名
 *
 * Factory type enum: each member's value is the type name that factory uses in the
 * registry.
 */
export enum FactoryEnum {
  /**
   * 无效工厂（0）
   *
   * Invalid factory (0).
   */
  Invalid = 0,
  /**
   * 内置的默认工厂
   *
   * The built-in default factory.
   */
  Default = 1,
}
/**
 * 任意工厂类型：既可以是内置的 FactoryEnum，也可以是自定义工厂的类型名
 *
 * Any factory type: either a built-in FactoryEnum value or the type name of a custom
 * factory.
 */
export type FactoryType = FactoryEnum | string
/**
 * 按工厂类型取展示用的名字，形如 “FactoryEnum.Default”；找不到对应成员时原样返回类型名
 *
 * Gets the display name of a factory type, like "FactoryEnum.Default"; returns the type
 * name as-is when no matching member exists.
 *
 * @param {FactoryType} value 工厂类型 / Factory type
 * @return {string} 工厂名 / Factory name
 */
export const getFactoryName = enumNameGetter<FactoryType>("FactoryEnum", FactoryEnum)