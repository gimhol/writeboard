export declare enum ShapeEnum {
    Invalid = 0,
    Pen = 1,
    Rect = 2,
    Oval = 3,
    Text = 4,
    Polygon = 5
}
export declare type ShapeType = ShapeEnum | string;
export declare function getShapeName(type: ShapeType): string;
