import { BoardOptions, Board, ILayerInits, Layer, IShapeDecoration } from "../board";
import { type ShapeType, ShapeData, IShapeData, Shape } from "../shape";
import type { ToolType, ITool } from "../tools";
import { FactoryType } from "./FactoryEnum";
import { IResizerInfo } from "./IResizerInfo";
import { IRotatorInfo } from "./IRotatorInfo";
import { IShapesMgr } from "./IShapesMgr";

/**
 * 接口：工厂
 *
 * @export
 * @interface IFactory
 */
export interface IFactory {
  get type(): FactoryType;
  get resizer(): IResizerInfo;
  get rotator(): IRotatorInfo;

  shapeTemplate(shapeType: ShapeType): ShapeData;
  setShapeTemplate(shapeType: ShapeType, template: ShapeData): void;
  newBoard(options: BoardOptions): Board;
  newShapesMgr(): IShapesMgr;
  newTool(toolType: ToolType): ITool;
  newShapeData(shapeType: ShapeType): ShapeData;
  newId(data: IShapeData): string;
  newZ(data: IShapeData): number;
  newShape(shapeType: ShapeType): Shape;
  newShape(shapeData: IShapeData): Shape;
  newLayerId(): string;
  newLayerName(): string;
  newLayer(inits?: Partial<ILayerInits>): Layer;
  shapeDecoration(shape: Shape): IShapeDecoration;
  overbound(shape: Shape): number;


  /** @deprecated */ fontFamilies(): string[];
  /** @deprecated */ fontName(fontFamily: string): string;
}
