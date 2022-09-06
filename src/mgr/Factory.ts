import { IShapeData, ShapeData } from "../shape/base/Data";
import { IShapesMgr, ShapesMgr } from "./ShapesMgr";
import { Shape } from "../shape/base/Shape";
import type { ITool } from "../tools/base/Tool";
import { InvalidTool } from "../tools/base/InvalidTool";
import { FactoryEnum, FactoryType } from "./FactoryEnum";
import { FactoryMgr } from "./FactoryMgr";
import { WhiteBoard } from "../board";
import { WhiteBoardOptions } from "../board/WhiteBoard";
import type { ShapeType } from "../shape/ShapeEnum";
import type { ToolType } from "../tools/ToolEnum";

export interface IFactory {
  get type(): FactoryType
  shapeTemplate(shapeType: ShapeType): ShapeData
  setShapeTemplate(shapeType: ShapeType, template: ShapeData): void
  newWhiteBoard(options: WhiteBoardOptions): WhiteBoard
  newShapesMgr(): IShapesMgr
  newTool(toolType: ToolType): ITool
  newShapeData(shapeType: ShapeType): ShapeData
  newId(data: ShapeData): string
  newZ(data: ShapeData): number
  newShape(shapeType: ShapeType): Shape;
  newShape(shapeData: IShapeData): Shape;
}

const Tag = '[Factory]';
export class Factory implements IFactory {
  private _z = 0;
  private _time = 0;
  private _shapeTemplates: { [key in ShapeType]?: ShapeData } = {}
  get type(): FactoryType {
    return FactoryEnum.Default
  }
  shapeTemplate(type: ShapeType): ShapeData {
    const ret = this._shapeTemplates[type] || this.newShapeData(type)
    this._shapeTemplates[type] = ret
    return ret
  }
  setShapeTemplate(type: ShapeType, template: ShapeData): void {
    this._shapeTemplates[type] = template
  }
  newWhiteBoard(options: WhiteBoardOptions): WhiteBoard {
    return new WhiteBoard(this, options)
  }
  newShapesMgr(): IShapesMgr {
    return new ShapesMgr();
  }
  newTool(toolType: ToolType): ITool {
    const create = FactoryMgr.tools[toolType];
    if (!create) {
      console.warn(Tag, `newTool("${toolType}"), ${toolType} is not registered`);
      return new InvalidTool;
    }
    const ret = create();
    if (ret.type !== toolType) {
      console.warn(Tag, `newTool("${toolType}"), ${toolType} is not corrent! check member 'type' of your Tool!`);
    }
    return ret;
  }
  newShapeData(shapeType: ShapeType): ShapeData {
    const create = FactoryMgr.shapeDatas[shapeType];
    if (!create) {
      console.warn(Tag, `newShapeData("${shapeType}"), ${shapeType} is not registered`);
      return new ShapeData;
    }
    const ret = create();
    if (ret.type !== shapeType) {
      console.warn(Tag, `newShapeData("${shapeType}"), ${shapeType} is not corrent! check member 'type' of your ShapeData!`);
    }
    return ret;
  }
  newId(data: IShapeData): string {
    return data.t + '_' + Date.now() + (++this._time);
  }
  newZ(data: IShapeData): number {
    return Date.now() + (++this._z);
  }
  newShape(shapeType: ShapeType): Shape;
  newShape(shapeData: IShapeData): Shape;
  newShape(v: ShapeType | IShapeData): Shape {
    const isNew = typeof v === 'string' || typeof v === 'number'
    const type: ShapeType = isNew ? v : v.t
    const data = this.newShapeData(type)
    const template = isNew ? this.shapeTemplate(v) : v
    data.copyFrom(template);
    if (isNew) {
      data.id = this.newId(data);
      data.z = this.newZ(data);
    }
    const create = FactoryMgr.shapes[type];
    return create ? create(data) : new Shape(data);
  }
}

FactoryMgr.registerFactory(FactoryEnum.Default, () => new Factory(), { name: 'bulit-in Factory', desc: 'bulit-in Factory' })