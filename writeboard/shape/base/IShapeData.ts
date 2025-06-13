import { ShapeType } from "../ShapeEnum";
import { IShapeStatus } from "./IShapeStatus";
import { IShapeStyle } from "./IShapeStyle";

export interface IShapeData {
  /** style */
  a?: IShapeStyle;

  /** status */
  b?: IShapeStatus;

  /** scale x */
  c?: number;

  /** scale y */
  d?: number;

  /** group id */
  g?: string;

  /* height */
  h: number;

  /** id */
  i: string;

  /** layerId */
  l?: string;

  /** rotation */
  r?: number;

  /** ShapeType */
  t: ShapeType;

  /** width */
  w: number;

  /** position x */
  x: number;

  /** position y */
  y: number;

  /** z-index */
  z: number;
}
