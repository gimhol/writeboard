import type { Shape } from "../../shape";

export interface IShapeGroupMember {
  shape: Shape;
  
  /** 相对角度 */
  rotation: number;
}
