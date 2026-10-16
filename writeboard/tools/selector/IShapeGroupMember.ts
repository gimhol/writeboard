import type { Shape } from "../../shape";

/**
 * 组合框里的一个成员：除了图形本身，还记着它与组合框之间的角度差
 *
 * One member of a group box: besides the shape itself it remembers the angle difference
 * between the member and the group box.
 */
export interface IShapeGroupMember {
  /**
   * 成员图形
   *
   * The member shape.
   */
  shape: Shape;
  
  /**
   * 相对角度
   *
   * Relative angle: the member's rotation minus the group box's rotation.
   */
  rotation: number;
}
