
import type { Board, BoardOptions } from "../board/Board";
import type { IShapeDecoration } from "../board/IShapeDecoration";
import type { ILayerInits, Layer } from "../board/Layer";
import type { IShapeData } from "../shape/base/IShapeData";
import type { Shape } from "../shape/base/Shape";
import type { ShapeData } from "../shape/base/ShapeData";
import type { ShapeType } from "../shape/ShapeEnum";
import type { ITool, ToolType } from "../tools";
import type { FactoryType } from "./FactoryEnum";
import type { IResizerInfo } from "./IResizerInfo";
import type { IRotatorInfo } from "./IRotatorInfo";
import type { IShapesMgr } from "./IShapesMgr";

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
  newShapeDecoration(board: Board): IShapeDecoration;
  overbound(shape: Shape): number;
  newGroupId(shapes: Shape<ShapeData>[]): string;

  /** @deprecated */ fontFamilies(): string[];
  /** @deprecated */ fontName(fontFamily: string): string;
}
