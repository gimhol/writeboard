
import type { Board, BoardOptions } from "../board/Board";
import type { IShapeDecoration } from "../board/IShapeDecoration";
import type { ILayerInits, Layer } from "../board/Layer";
import type { IShapeData } from "../shape/base/IShapeData";
import type { Shape } from "../shape/base/Shape";
import type { ShapeData } from "../shape/base/ShapeData";
import type { ShapeType } from "../shape/ShapeEnum";
import type { ITool, ToolType } from "../tools";
import type { Indicator } from "../tools/Indicator";
import type { FactoryType } from "./FactoryEnum";
import type { ICursorInfo } from "./ICursorInfo";
import type { IPenInfo } from "./IPenInfo";
import type { IResizerInfo } from "./IResizerInfo";
import type { IRotatorInfo } from "./IRotatorInfo";
import type { IShapesMgr } from "./IShapesMgr";

/**
 * 接口：工厂
 *
 * Interface: factory, the thing that creates boards, shapes, tools, layers and everything
 * around them.
 *
 * @export
 * @interface IFactory
 */
export interface IFactory {
  /**
   * 工厂类型（对应 FactoryEnum，也是登记表里的键）
   *
   * Factory type (a FactoryEnum value, also the key in the registry).
   */
  get type(): FactoryType;
  /**
   * 缩放控制点的配置
   *
   * Config of the resize handles.
   */
  get resizer(): IResizerInfo;
  /**
   * 旋转柄的配置
   *
   * Config of the rotate grip.
   */
  get rotator(): IRotatorInfo;
  /**
   * 画笔的配置
   *
   * Config of the pen.
   */
  get pen(): IPenInfo;
  /**
   * 工具自绘光标的配置
   *
   * Config of the tool's self-drawn cursor.
   */
  get cursor(): ICursorInfo;
  /**
   * 取某类图形的模板数据（新建图形时把模板读进去）
   *
   * Gets the template data of a shape type (it is read into every new shape of that type).
   *
   * @param {ShapeType} shapeType 图形类型 / Shape type
   * @return {ShapeData} 该类型的模板数据 / Template data of that type
   */
  shapeTemplate(shapeType: ShapeType): ShapeData;
  setShapeTemplate(shapeType: ShapeType, template: ShapeData): void;
  /**
   * 新建一块板子
   *
   * Creates a board.
   *
   * @param {BoardOptions} options 板子选项 / Board options
   * @return {Board} 新板子 / The new board
   */
  newBoard(options: BoardOptions): Board;
  /**
   * 新建图形管理器
   *
   * Creates a shapes manager.
   *
   * @return {IShapesMgr} 图形管理器 / The shapes manager
   */
  newShapesMgr(): IShapesMgr;
  /**
   * 按类型新建工具
   *
   * Creates a tool by type.
   *
   * @param {ToolType} toolType 工具类型 / Tool type
   * @return {ITool} 工具实例 / The tool instance
   */
  newTool(toolType: ToolType): ITool;
  /**
   * 按类型新建（空白）图形数据
   *
   * Creates new (blank) shape data by type.
   *
   * @param {ShapeType} shapeType 图形类型 / Shape type
   * @return {ShapeData} 图形数据 / The shape data
   */
  newShapeData(shapeType: ShapeType): ShapeData;
  /**
   * 生成图形 id
   *
   * Builds a shape id.
   *
   * @param {IShapeData} data 图形数据 / Shape data
   * @return {string} 新 id / The new id
   */
  newShapeId(data: IShapeData): string;
  /**
   * 生成图形的 z（叠放次序，越晚越大）
   *
   * Builds a shape's z (the stacking order, later means larger).
   *
   * @param {IShapeData} data 图形数据 / Shape data
   * @return {number} 新 z / The new z
   */
  newShapeZ(data: IShapeData): number;
  /**
   * 按图形类型新建图形（模板取该类图形的模板数据，并补上新 id 与 z）
   *
   * Creates a shape by shape type (the template comes from that type's template data, and
   * a new id and z are filled in).
   *
   * @param {ShapeType} shapeType 图形类型 / Shape type
   * @return {Shape} 图形实例 / The shape instance
   */
  newShape(shapeType: ShapeType): Shape;
  /**
   * 按现有图形数据新建图形（数据原样读进去）
   *
   * Creates a shape from existing shape data (the data is read in as-is).
   *
   * @param {IShapeData} shapeData 图形数据 / Shape data
   * @return {Shape} 图形实例 / The shape instance
   */
  newShape(shapeData: IShapeData): Shape;
  /**
   * 生成图层 id
   *
   * Builds a layer id.
   *
   * @return {string} 新图层 id / The new layer id
   */
  newLayerId(): string;
  /**
   * 生成图层名字
   *
   * Builds a layer name.
   *
   * @return {string} 新图层名 / The new layer name
   */
  newLayerName(): string;
  /**
   * 新建图层
   *
   * Creates a layer.
   *
   * @param {Partial<ILayerInits>} [inits] 图层初始选项（id / 名字缺省时自动生成）/ Initial layer options (id / name are generated when missing)
   * @return {Layer} 新图层 / The new layer
   */
  newLayer(inits?: Partial<ILayerInits>): Layer;
  /**
   * 新建图形装饰（选中框 / 锁定图标等）
   *
   * Creates the shape decoration (selection box / lock icon and so on).
   *
   * @param {Board} board 装饰所属的板子 / The board the decoration belongs to
   * @return {IShapeDecoration} 图形装饰 / The shape decoration
   */
  newShapeDecoration(board: Board): IShapeDecoration;
  /**
   * 新建工具的自绘光标（十字刻度 + 中心圆）
   *
   * Creates the tool's self-drawn cursor (crosshair ticks plus a center circle).
   *
   * @return {Indicator} 光标 / The cursor
   */
  newIndicator(): Indicator;
  /**
   * 图形可以超出自己包围盒的范围（命中判定与脏区会外扩这么多）
   *
   * How far a shape may stick out of its own bounding box (hit tests and dirty rects grow
   * by this much).
   *
   * @param {Shape} shape 图形 / The shape
   * @return {number} 外扩范围 / The overbound
   */
  overbound(shape: Shape): number;
  /**
   * 生成组合 id（把一批图形当作一个组合）
   *
   * Builds a group id (treats a batch of shapes as one group).
   *
   * @param {Shape<ShapeData>[]} shapes 同组的图形 / The shapes of the group
   * @return {string} 新组合 id / The new group id
   */
  newGroupId(shapes: Shape<ShapeData>[]): string;

  /** @deprecated */ fontFamilies(): string[];
  /** @deprecated */ fontName(fontFamily: string): string;
}
