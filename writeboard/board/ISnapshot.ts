import type { IShapeData } from "../shape/base/IShapeData";
import type { ILayerInfo } from "./Layer";

export interface ISnapshot {
  v: number;
  x: number;
  y: number;
  w: number;
  h: number;
  l: ILayerInfo[];
  s: IShapeData[];
}
