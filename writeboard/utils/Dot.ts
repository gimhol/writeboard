import { IVector } from "./IVector";

/**
 * 带压力值的点：除了位置，还记下写下这一点时的压力
 *
 * A dot carrying a pressure value: besides its position it remembers the pressure the
 * point was written with.
 */
export interface IDot extends IVector {
  /**
   * 压力值
   *
   * The pressure value.
   */
  p: number
}