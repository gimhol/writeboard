import { Shape } from "../../shape";


export interface IPickTarget {
  shape: Shape;
  midX: number;
  midY: number;
  rotation: number;
}
