export enum ShapeEnum {
  Invalid = 0,
  Pen = 1,
  Rect = 2,
  Oval = 3,
  Text = 4,
  Polygon = 5,
}
export type ShapeType = ShapeEnum | string
export function getShapeName(type: ShapeType): string {
  switch (type) {
    case ShapeEnum.Invalid: return 'ShapeEnum.Invalid'
    case ShapeEnum.Pen: return 'ShapeEnum.Pen'
    case ShapeEnum.Rect: return 'ShapeEnum.Rect'
    case ShapeEnum.Oval: return 'ShapeEnum.Oval'
    case ShapeEnum.Text: return 'ShapeEnum.Text'
    case ShapeEnum.Polygon: return 'ShapeEnum.Polygon'
    default: return type
  }
}