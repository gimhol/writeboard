import { enumNameGetter } from "../utils/helper"

export enum ShapeEnum {
  Invalid = 0,
  Pen = 1,
  Rect = 2,
  Oval = 3,
  Text = 4,
  Polygon = 5,
  Tick = 6,
  Cross = 7,
  HalfTick = 8,
  Lines = 9,
  Img = 10,
}
export type ShapeType = ShapeEnum | string
export const getShapeName = enumNameGetter<ShapeType>("ShapeType", ShapeEnum)