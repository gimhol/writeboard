import { IShapeData, ShapeData } from "../shape/base/Data";
import { IShapesMgr, DefaultShapesMgr } from "./ShapesMgr";
import { Shape } from "../shape/base/Shape";
import type { ITool } from "../tools/base/Tool";
import { InvalidTool } from "../tools/base/InvalidTool";
import { FactoryEnum, FactoryType } from "./FactoryEnum";
import { Gaia } from "./Gaia";
import { Board, ILayerInits, Layer } from "../board";
import { BoardOptions } from "../board/Board";
import type { ShapeType } from "../shape/ShapeEnum";
import type { ToolType } from "../tools/ToolEnum";
import { FontFamilysChecker } from "../fonts/checker";
import { builtInFontFamilies, builtInFontNames } from "../fonts/builtInFontFamilies";
import { isNum, isStr } from "../utils/helper";

export interface IFactory {
  get type(): FactoryType;
  shapeTemplate(shapeType: ShapeType): ShapeData;
  setShapeTemplate(shapeType: ShapeType, template: ShapeData): void;
  newWhiteBoard(options: BoardOptions): Board;
  newShapesMgr(): IShapesMgr;
  newTool(toolType: ToolType): ITool;
  newShapeData(shapeType: ShapeType): ShapeData;
  newId(data: ShapeData): string;
  newZ(data: ShapeData): number;
  newShape(shapeType: ShapeType): Shape;
  newShape(shapeData: IShapeData): Shape;
  newLayerId(): string;
  newLayerName(): string;
  newLayer(inits: ILayerInits): Layer;
  fontFamilies(): string[];
  fontName(fontFamily: string): string;
}

const Tag = '[DefaultFactory]';
export class DefaultFactory implements IFactory {
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
  newWhiteBoard(options: BoardOptions): Board {
    return new Board(this, options)
  }
  newShapesMgr(): IShapesMgr {
    return new DefaultShapesMgr();
  }
  newTool(toolType: ToolType): ITool {
    const create = Gaia.tool(toolType);
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
    const create = Gaia.shapeData(shapeType);
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
    const isNew = isNum(v) || isStr(v)
    const type: ShapeType = isNew ? v : v.t
    const data = this.newShapeData(type)
    const template = isNew ? this.shapeTemplate(v) : v
    data.read(template);
    if (isNew) {
      data.id = this.newId(data);
      data.z = this.newZ(data);
    }
    return Gaia.shape(type)?.(data) ?? new Shape(data);
  }
  newLayerId(): string {
    return `layer_${Date.now()}_${++this._time}`
  }
  newLayerName(): string {
    return `layer_${Date.now()}_${++this._time}`
  }
  newLayer(inits: ILayerInits): Layer {
    return new Layer(inits);
  }
  fontFamilies(): string[] {
    return FontFamilysChecker.check(builtInFontFamilies)
  }
  fontName(fontFamily: string): string {
    return builtInFontNames[fontFamily] ?? fontFamily;
  }
}

Gaia.registerFactory(FactoryEnum.Default, () => new DefaultFactory(), { name: 'bulit-in Factory', desc: 'bulit-in Factory' })