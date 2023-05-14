import { Shape } from "../shape/base/Shape";
import { IRect } from "../utils/Rect";
export interface IShapesMgr {
    finds(id: string[]): Shape[];
    find(id: string): Shape | undefined;
    shapes(): Shape[];
    add(...items: Shape[]): number;
    remove(...items: Shape[]): number;
    exists(...items: Shape[]): number;
    hit(rect: IRect): Shape | undefined;
    hits(rect: IRect): Shape[];
}
export declare class ShapesMgr implements IShapesMgr {
    finds(ids: string[]): Shape[];
    find(id: string): Shape<import("..").ShapeData> | undefined;
    private _items;
    private _kvs;
    shapes(): Shape[];
    exists(...items: Shape[]): number;
    add(...items: Shape[]): number;
    remove(...items: Shape[]): number;
    hits(rect: IRect): Shape[];
    hit(rect: IRect): Shape | undefined;
}
