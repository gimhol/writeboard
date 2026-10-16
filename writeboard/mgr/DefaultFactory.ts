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
import { Indicator } from "../tools/Indicator";
import type { ICursorInfo } from "./ICursorInfo";
import type { IPenInfo } from "./IPenInfo";

const Tag = '[DefaultFactory]';
/**
 * 默认工厂：内置的图形 / 工具 / 图层 / 板子都由它创建，各类可调参数
 *（缩放控制点、旋转柄、画笔、自绘光标）也挂在它身上、按板生效
 *
 * The default factory: it creates the built-in shapes / tools / layers / boards, and the
 * tunable parameters (resize handles, rotate grip, pen, self-drawn cursor) live on it and
 * apply per board.
 */
export class DefaultFactory implements IFactory {
  private _z = 0;
  private _time = 0;
  private _shapeTemplates: { [key in ShapeType]?: ShapeData } = {}
  /**
   * 工厂类型：内置的默认工厂
   *
   * Factory type: the built-in default factory.
   */
  get type(): FactoryType {
    return FactoryEnum.Default
  }
  /**
   * 缩放控制点的配置
   *
   * Config of the resize handles.
   */
  resizer: IResizerInfo = { size: 10 };
  /**
   * 旋转柄的配置
   *
   * Config of the rotate grip.
   */
  rotator: IRotatorInfo = { size: 10, distance: 30 };
  /**
   * 画笔的配置（平滑强度）
   *
   * Config of the pen (smoothing strength).
   */
  pen: IPenInfo = { stabilizer: 0 };
  /**
   * 工具自绘光标的配置（十字刻度 + 中心圆）
   *
   * Config of the tool's self-drawn cursor (crosshair ticks plus a center dot).
   */
  cursor: ICursorInfo = { tickLen: 6, tickGap: 3, minRadius: 1, lineWidth: 1 };
  /**
   * 取某类图形的模板（新建图形时把模板数据读进去）；没有就现建一个并缓存下来
   *
   * Gets the template of a shape type (the data is read into every new shape of that
   * type); a missing one is created and cached.
   *
   * @param {ShapeType} type 图形类型 / Shape type
   * @return {ShapeData} 该类型的模板数据 / Template data of that type
   */
  shapeTemplate(type: ShapeType): ShapeData {
    const ret = this._shapeTemplates[type] || this.newShapeData(type)
    this._shapeTemplates[type] = ret
    return ret
  }
  /**
   * 换掉某类图形的模板
   *
   * Replaces the template of a shape type.
   *
   * @param {ShapeType} type 图形类型 / Shape type
   * @param {ShapeData} template 新模板数据 / New template data
   */
  setShapeTemplate(type: ShapeType, template: ShapeData): void {
    this._shapeTemplates[type] = template
  }
  /**
   * 新建一块板子
   *
   * Creates a board.
   *
   * @param {BoardOptions} options 板子选项 / Board options
   * @return {Board} 新板子 / The new board
   */
  newBoard(options: BoardOptions): Board {
    return new Board(this, options)
  }
  /**
   * 新建图形管理器（默认实现 DefaultShapesMgr）
   *
   * Creates a shapes manager (DefaultShapesMgr by default).
   *
   * @return {IShapesMgr} 图形管理器 / The shapes manager
   */
  newShapesMgr(): IShapesMgr {
    return new DefaultShapesMgr();
  }
  /**
   * 按类型新建工具：类型没登记时告警并回退到 InvalidTool
   *
   * Creates a tool by type: an unregistered type warns and falls back to InvalidTool.
   *
   * @param {ToolType} toolType 工具类型 / Tool type
   * @return {ITool} 工具实例 / The tool instance
   */
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
  /**
   * 按类型新建（空白）图形数据：类型没登记时告警并回退到 ShapeData
   *
   * Creates new (blank) shape data by type: an unregistered type warns and falls back to
   * ShapeData.
   *
   * @param {ShapeType} shapeType 图形类型 / Shape type
   * @return {ShapeData} 图形数据 / The shape data
   */
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
  /**
   * 生成图形 id：类型名 + 时间戳 + 自增序号
   *
   * Builds a shape id: type name + timestamp + a running counter.
   *
   * @param {IShapeData} data 图形数据（用它的 t 作前缀）/ Shape data (its t is used as the prefix)
   * @return {string} 新 id / The new id
   */
  newShapeId(data: IShapeData): string {
    return data.t + '_' + Date.now() + (++this._time);
  }
  /**
   * 生成图形的 z（叠放次序）：时间戳 + 自增序号，越晚越大
   *
   * Builds a shape's z (the stacking order): timestamp + a running counter, so later means
   * larger.
   *
   * @param {IShapeData} data 图形数据（未使用）/ Shape data (unused)
   * @return {number} 新 z / The new z
   */
  newShapeZ(data: IShapeData): number {
    return Date.now() + (++this._z);
  }
  /**
   * 按图形类型新建图形，模板取该类图形的模板数据（会补上新 id 与 z）
   *
   * Creates a shape by shape type; the template comes from that type's template data (a new
   * id and z are filled in).
   *
   * @param {ShapeType} shapeType 图形类型 / Shape type
   * @return {Shape} 图形实例 / The shape instance
   */
  newShape(shapeType: ShapeType): Shape;
  /**
   * 按现有图形数据新建图形，数据原样读进去（保留数据里的 id 与 z）
   *
   * Creates a shape from existing shape data, read in as-is (the id and z inside the data
   * are kept).
   *
   * @param {IShapeData} shapeData 图形数据 / Shape data
   * @return {Shape} 图形实例 / The shape instance
   */
  newShape(shapeData: IShapeData): Shape;
  newShape(v: ShapeType | IShapeData): Shape {
    const isNew = isNum(v) || isStr(v)
    const type: ShapeType = isNew ? v : v.t
    const data = this.newShapeData(type)
    const template = isNew ? this.shapeTemplate(v) : v
    data.read(template);
    if (isNew) {
      data.id = this.newShapeId(data);
      data.z = this.newShapeZ(data);
    }
    return Gaia.shape(type)?.(data) ?? new Shape(data, ShapeData);
  }
  /**
   * 生成图层 id
   *
   * Builds a layer id.
   *
   * @return {string} 新图层 id / The new layer id
   */
  newLayerId(): string {
    return `layer_${Date.now()}_${++this._time}`
  }
  /**
   * 生成图层名字（与 id 同规则：layer_时间戳_序号）
   *
   * Builds a layer name (the same rule as the id: layer_timestamp_counter).
   *
   * @return {string} 新图层名 / The new layer name
   */
  newLayerName(): string {
    return `layer_${Date.now()}_${++this._time}`
  }
  /**
   * 新建图层：id / 名字没传就现生成，其余选项透传给 Layer
   *
   * Creates a layer: id / name are generated when missing and the rest of the options are
   * forwarded to Layer.
   *
   * @param {Partial<ILayerInits>} [inits] 图层初始选项 / Initial layer options
   * @return {Layer} 新图层 / The new layer
   */
  newLayer(inits: Partial<ILayerInits> = {}): Layer {
    const {
      id = this.newLayerId(),
      name = this.newLayerName(),
      ...remains
    } = inits
    return new Layer({ id, name, ...remains });
  }

  /**
   * 新建图形装饰（选中框 / 锁定图标等）：默认实现是 DefaultShapeDecoration
   *
   * Creates the shape decoration (selection box / lock icon and so on); the default
   * implementation is DefaultShapeDecoration.
   *
   * @param {Board} board 装饰所属的板子 / The board the decoration belongs to
   * @return {IShapeDecoration} 图形装饰 / The shape decoration
   */
  newShapeDecoration(board: Board): IShapeDecoration {
    return new DefaultShapeDecoration(board)
  }

  /**
   * 新建工具的自绘光标（十字刻度 + 中心圆）
   *
   * Creates the tool's self-drawn cursor (crosshair ticks plus a center circle).
   *
   * @return {Indicator} 光标 / The cursor
   */
  newIndicator(): Indicator {
    return new Indicator()
  }

  /**
   * 图形可以超出自己包围盒的范围：默认实现固定返回 1（按包围盒判定就够）
   *
   * How far a shape may stick out of its own bounding box: the default implementation
   * always returns 1 (the bounding box is enough).
   *
   * @param {Shape<ShapeData>} _ 图形（未使用）/ The shape (unused)
   * @return {number} 外扩范围 / The overbound
   */
  overbound(_: Shape<ShapeData>): number { return 1 }

  /**
   * 生成组合 id（时间戳 + 成员数 + 自增序号）
   *
   * Builds a group id (timestamp + member count + a running counter).
   *
   * @param {Shape<ShapeData>[]} shapes 同组的图形 / The shapes of the group
   * @return {string} 新组合 id / The new group id
   */
  newGroupId(shapes: Shape<ShapeData>[]): string {
    return `group_${Date.now()}${shapes.length}${++this._time}`
  }
  /** @deprecated */ fontFamilies = () => Array.from(Gaia.fonts.keys())
  /** @deprecated */ fontName = (f: string): string => (Gaia.fonts.get(f)?.name ?? f);
}

Gaia.registerFactory(FactoryEnum.Default, () => new DefaultFactory(), { name: 'bulit-in Factory', desc: 'bulit-in Factory' })