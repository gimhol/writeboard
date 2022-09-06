import { IShapeData, ShapeData } from "../shape/base/Data";
import { IShapesMgr } from "./ShapesMgr";
import { Shape } from "../shape/base/Shape";
import type { ITool } from "../tools/base/Tool";
import { FactoryType } from "./FactoryEnum";
import { WhiteBoard } from "../board";
import { WhiteBoardOptions } from "../board/WhiteBoard";
import type { ShapeType } from "../shape/ShapeEnum";
import type { ToolType } from "../tools/ToolEnum";
export interface IFactory {
    get type(): FactoryType;
    shapeTemplate(shapeType: ShapeType): ShapeData;
    setShapeTemplate(shapeType: ShapeType, template: ShapeData): void;
    newWhiteBoard(options: WhiteBoardOptions): WhiteBoard;
    newShapesMgr(): IShapesMgr;
    newTool(toolType: ToolType): ITool;
    newShapeData(shapeType: ShapeType): ShapeData;
    newId(data: ShapeData): string;
    newZ(data: ShapeData): number;
    newShape(shapeType: ShapeType): Shape;
    newShape(shapeData: IShapeData): Shape;
}
export declare class Factory implements IFactory {
    private _z;
    private _time;
    private _shapeTemplates;
    get type(): FactoryType;
    shapeTemplate(type: ShapeType): ShapeData;
    setShapeTemplate(type: ShapeType, template: ShapeData): void;
    newWhiteBoard(options: WhiteBoardOptions): WhiteBoard;
    newShapesMgr(): IShapesMgr;
    newTool(toolType: ToolType): ITool;
    newShapeData(shapeType: ShapeType): ShapeData;
    newId(data: IShapeData): string;
    newZ(data: IShapeData): number;
    newShape(shapeType: ShapeType): Shape;
    newShape(shapeData: IShapeData): Shape;
}
