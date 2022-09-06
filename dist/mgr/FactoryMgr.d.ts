import type { IShapeData, ShapeData, Shape } from "../shape/base";
import type { IFactory } from "./Factory";
import type { ITool } from "../tools/base/Tool";
import type { FactoryType } from "./FactoryEnum";
import { ToolType } from "../tools/ToolEnum";
import { ShapeType } from "../shape/ShapeEnum";
export interface IFactoryInfomation {
    readonly name: string;
    readonly desc: string;
}
export interface IFactoryCreater {
    (): IFactory;
}
export interface IToolInfomation {
    readonly name: string;
    readonly desc: string;
    readonly shape?: ShapeType;
}
export interface IShapeInfomation {
    readonly name: string;
    readonly desc: string;
    readonly type: ShapeType;
}
export interface IToolCreater {
    (): ITool;
}
export interface IShapeDataCreater<D extends IShapeData> {
    (): D;
}
export interface IShapeCreater<D extends IShapeData> {
    (data: D): Shape;
}
export declare class FactoryMgr {
    static tools: {
        [key in ToolType]?: IToolCreater;
    };
    static toolInfos: {
        [key in ToolType]?: IToolInfomation;
    };
    static shapeDatas: {
        [key in ToolType]?: IShapeDataCreater<any>;
    };
    static shapes: {
        [key in ToolType]?: IShapeCreater<any>;
    };
    static shapeInfos: {
        [key in ShapeType]?: IShapeInfomation;
    };
    static factorys: {
        [key in FactoryType]?: IFactoryCreater;
    };
    static factoryInfos: {
        [key in FactoryType]?: IFactoryInfomation;
    };
    static listFactories(): FactoryType[];
    static createFactory(type: FactoryType): IFactory;
    static registerFactory(type: FactoryType, creator: IFactoryCreater, info: IFactoryInfomation): void;
    static listTools(): ToolType[];
    static toolInfo(type: ToolType): IToolInfomation | undefined;
    static registerTool(type: ToolType, creator: IToolCreater, info?: Partial<IToolInfomation>): void;
    static listShapes(): ShapeType[];
    static registerShape<D extends ShapeData>(type: ShapeType, dataCreator: IShapeDataCreater<D>, shapeCreator: IShapeCreater<D>, info?: Partial<IShapeInfomation>): void;
    static shapeInfo(type: ShapeType): IShapeInfomation | undefined;
}
