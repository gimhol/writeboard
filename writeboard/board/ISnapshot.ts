import { IShapeData } from "../shape/base";
import { ILayerInfo } from "./Layer";

export interface ISnapshot {
  v: number;
  x: number;
  y: number;
  w: number;
  h: number;
  l: ILayerInfo[];
  s: IShapeData[];
}
