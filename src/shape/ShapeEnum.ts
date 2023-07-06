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
export function getShapeName(type: ShapeType): string {
  switch (type) {
    case ShapeEnum.Invalid: return 'ShapeEnum.Invalid'
    case ShapeEnum.Pen: return 'ShapeEnum.Pen'
    case ShapeEnum.Rect: return 'ShapeEnum.Rect'
    case ShapeEnum.Oval: return 'ShapeEnum.Oval'
    case ShapeEnum.Text: return 'ShapeEnum.Text'
    case ShapeEnum.Polygon: return 'ShapeEnum.Polygon'
    case ShapeEnum.Tick: return 'ShapeEnum.Tick'
    case ShapeEnum.Cross: return 'ShapeEnum.Cross'
    case ShapeEnum.HalfTick: return 'ShapeEnum.HalfTick'
    case ShapeEnum.Lines: return 'ShapeEnum.Lines'
    case ShapeEnum.Img: return 'ShapeEnum.Img'
    default: return type
  }
}