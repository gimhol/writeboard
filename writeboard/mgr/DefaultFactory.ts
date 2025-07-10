import { Board, ILayerInits, Layer } from "../board";
import { BoardOptions } from "../board/Board";
import { IShapeDecoration } from "../board/IShapeDecoration";
import { DefaultShapeDecoration } from "../board/ShapeDecoration";
import { IShapeData } from "../shape/base/IShapeData";
import { Shape } from "../shape/base/Shape";
import { ShapeData } from "../shape/base/ShapeData";
import type { ShapeType } from "../shape/ShapeEnum";
import { InvalidTool } from "../tools/base/InvalidTool";
import type { ITool } from "../tools/base/Tool";
import type { ToolType } from "../tools/ToolEnum";
import { isNum, isStr } from "../utils/helper";
import { DefaultShapesMgr } from "./DefaultShapesMgr";
import { FactoryEnum, FactoryType } from "./FactoryEnum";
import { Gaia } from "./Gaia";
import { IFactory } from "./IFactory";
import { IResizerInfo } from "./IResizerInfo";
import { IRotatorInfo } from "./IRotatorInfo";
import { IShapesMgr } from "./IShapesMgr";

const Tag = '[DefaultFactory]';
export class DefaultFactory implements IFactory {
  private _z = 0;
  private _time = 0;
  private _shapeTemplates: { [key in ShapeType]?: ShapeData } = {}
  get type(): FactoryType {
    return FactoryEnum.Default
  }
  resizer: IResizerInfo = { size: 10 };
  rotator: IRotatorInfo = { size: 10, distance: 30 };
  shapeTemplate(type: ShapeType): ShapeData {
    const ret = this._shapeTemplates[type] || this.newShapeData(type)
    this._shapeTemplates[type] = ret
    return ret
  }
  setShapeTemplate(type: ShapeType, template: ShapeData): void {
    this._shapeTemplates[type] = template
  }
  newBoard(options: BoardOptions): Board {
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
    return Gaia.shape(type)?.(data) ?? new Shape(data, ShapeData);
  }
  newLayerId(): string {
    return `layer_${Date.now()}_${++this._time}`
  }
  newLayerName(): string {
    return `layer_${Date.now()}_${++this._time}`
  }
  newLayer(inits: Partial<ILayerInits> = {}): Layer {
    const {
      id = this.newLayerId(),
      name = this.newLayerName(),
      ...remains
    } = inits
    return new Layer({ id, name, ...remains });
  }

  private _shapeDecoration = new DefaultShapeDecoration

  shapeDecoration(_: Shape<ShapeData>): IShapeDecoration {
    return this._shapeDecoration
  }

  overbound(_: Shape<ShapeData>): number { return 1 }


  /** @deprecated */ fontFamilies = () => Array.from(Gaia.fonts.keys())
  /** @deprecated */ fontName = (f: string): string => (Gaia.fonts.get(f)?.name ?? f);
}

Gaia.registerFactory(FactoryEnum.Default, () => new DefaultFactory(), { name: 'bulit-in Factory', desc: 'bulit-in Factory' })