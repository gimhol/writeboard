
import type { IShapeData, ShapeData, Shape } from "../shape/base"
import type { IFactory } from "./Factory"
import type { ITool } from "../tools/base/Tool"
import type { FactoryEnum, FactoryType } from "./FactoryEnum"
import { ToolEnum, ToolType, getToolName } from "../tools/ToolEnum"
import { ShapeType, getShapeName } from "../shape/ShapeEnum"
import type { CrossData, CrossTool, HalfTickData, HalfTickTool, LinesData, LinesTool, OvalData, OvalTool, PenData, PenTool, PolygonData, PolygonTool, RectData, RectTool, ShapeCross, ShapeEnum, ShapeHalfTick, ShapeLines, ShapeOval, ShapePen, ShapePolygon, ShapeRect, ShapeText, ShapeTick, TextData, TextTool, TickData, TickTool } from "../shape"
import { SelectorTool } from "../tools"
import { Board } from "../board"
import { EventEnum, Events } from "../event"

export interface IFactoryInfomation {
  readonly name: string
  readonly desc: string
}
export interface IFactoryCreater<F extends IFactory = IFactory> { (): F }
export interface IToolInfomation<S extends ShapeType | undefined = ShapeType | undefined> {
  readonly name: string
  readonly desc: string
  readonly shape: S
}
export interface IShapeInfomation<S extends ShapeType = ShapeType> {
  readonly name: string
  readonly desc: string
  readonly type: S
}
export interface IToolCreater<T extends ITool = ITool> { (): T }
export interface IShapeDataCreater<D extends IShapeData = IShapeData> { (): D }
export interface IShapeCreater<D extends IShapeData, S extends Shape = Shape> { (data: D): S }

const Tag = '[Gaia]'
export class Gaia {
  private static _tools = new Map<ToolType, IToolCreater>();
  private static _toolInfos = new Map<ToolType, IToolInfomation>()
  private static _shapeDatas = new Map<ShapeType, IShapeDataCreater<any>>()
  private static _shapes = new Map<ShapeType, IShapeCreater<any>>()
  private static _shapeInfos = new Map<ShapeType, IShapeInfomation>()
  private static _factorys = new Map<FactoryType, IFactoryCreater>()
  private static _factoryInfos = new Map<FactoryType, IFactoryInfomation>()

  static registerFactory(type: FactoryType, creator: IFactoryCreater, info: IFactoryInfomation): void {
    if (this._factorys.has(type)) {
      console.warn(Tag, `registerFactory(), factory '${type}' already exists!`);
    } else if (this._factoryInfos.has(type)) {
      console.warn(Tag, `registerFactory(), factory info '${type}' already exists!`);
    }
    this._factorys.set(type, creator);
    this._factoryInfos.set(type, info);
  }
  static listFactories(): FactoryType[] {
    return Array.from(this._factoryInfos.keys())
  }

  static factory<K extends keyof FactoryEnumFactoryMap>(type: K): FactoryEnumFactoryMap[K];
  static factory(type: FactoryType): IFactoryCreater | undefined;
  static factory(type: FactoryType): IFactoryCreater | undefined {
    return this._factorys.get(type);
  }

  static registerTool(type: ToolType, creator: IToolCreater, info?: Partial<IToolInfomation>): void {
    if (this._tools.has(type)) {
      console.warn(Tag, `registerTool(), tool '${type}' already exists!`);
    } else if (this._toolInfos.has(type)) {
      console.warn(Tag, `registerTool(), tool info '${type}' already exists!`);
    }
    this._tools.set(type, creator);
    this._toolInfos.set(type, {
      shape: info?.shape,
      name: info?.name || getToolName(type),
      desc: info?.desc || getToolName(type),
    })
  }
  static listTools(): ToolType[] {
    return Array.from(this._tools.keys());
  }

  static tool<K extends keyof ToolEnumToolMap>(type: K): ToolEnumToolMap[K];
  static tool(type: ToolType): IToolCreater | undefined;
  static tool(type: ToolType): IToolCreater | undefined {
    return this._tools.get(type);
  }

  static toolInfo<K extends keyof ToolEnumToolInfoMap>(type: K): ToolEnumToolInfoMap[K];
  static toolInfo(type: ToolType): IToolInfomation | undefined;
  static toolInfo(type: ToolType): IToolInfomation | undefined {
    return this._toolInfos.get(type);
  }
  static editToolInfo<K extends keyof ToolEnumToolInfoMap>(type: K, func: (i: ToolEnumToolInfoMap[K]) => ToolEnumToolInfoMap[K]): void;
  static editToolInfo(type: ToolType, func: (i: IToolInfomation) => IToolInfomation): void;
  static editToolInfo(type: ToolType, func: (i: IToolInfomation) => IToolInfomation): void {
    let info = this._toolInfos.get(type);
    if (!info) { return; }
    info = func(info);
    this._toolInfos.set(type, info);
  }
  static registerShape<D extends ShapeData>(
    type: ShapeType,
    dataCreator: IShapeDataCreater<D>,
    shapeCreator: IShapeCreater<D>,
    info?: Partial<IShapeInfomation>
  ): void {
    if (this._shapeInfos.has(type)) {
      console.warn(Tag, `registerShape(), shape info '${type}' already exists!`);
    } else if (this._shapeDatas.has(type)) {
      console.warn(Tag, `registerShape(), shape data'${type}' already exists!`);
    } else if (this._shapes.has(type)) {
      console.warn(Tag, `registerShape(), shape '${type}' already exists!`);
    }
    this._shapeInfos.set(type, {
      name: info?.name || getShapeName(type),
      desc: info?.desc || getShapeName(type),
      type
    })
    this._shapeDatas.set(type, dataCreator);
    this._shapes.set(type, shapeCreator);
  }

  static listShapes(): ShapeType[] {
    return Array.from(this._shapes.keys());
  }

  static shapeInfo<K extends keyof ShapEnumShapeInfoMap>(type: K): ShapEnumShapeInfoMap[K];
  static shapeInfo(type: ShapeType): IShapeInfomation | undefined;
  static shapeInfo(type: ShapeType): IShapeInfomation | undefined {
    return this._shapeInfos.get(type)
  }

  static shapeData<K extends keyof ShapeEnumShapeDataMap>(type: K): ShapeEnumShapeDataMap[K];
  static shapeData(type: ShapeType): IShapeDataCreater<any> | undefined;
  static shapeData(type: ShapeType): IShapeDataCreater<any> | undefined {
    return this._shapeDatas.get(type);
  }

  static shape<K extends keyof ShapeEnumShapeDataMap>(type: K): ShapeEnumShapeMap[K];
  static shape(type: ShapeType): IShapeCreater<any> | undefined;
  static shape(type: ShapeType): IShapeCreater<any> | undefined {
    return this._shapes.get(type);
  }

  static registAction<K extends keyof Events.EventMap>(eventType: K, handler: ActionHandler<Events.EventMap[K]>): void;
  static registAction(eventType: string, handler: ActionHandler): void {
    this._actionHandler.set(eventType, handler);
  }
  static listActions(): string[] { return Array.from(this._actionHandler.keys()) }
  static action(eventType: string): ActionHandler | undefined {
    return this._actionHandler.get(eventType);
  }
  private static _actionHandler = new Map<string, ActionHandler>()
}

export interface ActionHandler<D = any> {
  undo(board: Board, e: D): void;
  redo(board: Board, e: D): void;
}

export interface FactoryEnumFactoryMap {
  /* Built-in factory */
  [FactoryEnum.Default]: IFactoryCreater
}

export interface ToolEnumToolMap {
  /* Built-in tool */
  [ToolEnum.Selector]: IToolCreater<SelectorTool>;
  [ToolEnum.Pen]: IToolCreater<PenTool>;
  [ToolEnum.Rect]: IToolCreater<RectTool>;
  [ToolEnum.Oval]: IToolCreater<OvalTool>;
  [ToolEnum.Text]: IToolCreater<TextTool>;
  [ToolEnum.Polygon]: IToolCreater<PolygonTool>;
  [ToolEnum.Tick]: IToolCreater<TickTool>;
  [ToolEnum.Cross]: IToolCreater<CrossTool>;
  [ToolEnum.HalfTick]: IToolCreater<HalfTickTool>;
  [ToolEnum.Lines]: IToolCreater<LinesTool>;
}

export interface ToolEnumToolInfoMap {
  /* Built-in tool info */
  [ToolEnum.Selector]: IToolInfomation<undefined>;
  [ToolEnum.Pen]: IToolInfomation<ShapeEnum.Pen>;
  [ToolEnum.Rect]: IToolInfomation<ShapeEnum.Rect>;
  [ToolEnum.Oval]: IToolInfomation<ShapeEnum.Oval>;
  [ToolEnum.Text]: IToolInfomation<ShapeEnum.Text>;
  [ToolEnum.Polygon]: IToolInfomation<ShapeEnum.Polygon>;
  [ToolEnum.Tick]: IToolInfomation<ShapeEnum.Tick>;
  [ToolEnum.Cross]: IToolInfomation<ShapeEnum.Cross>;
  [ToolEnum.HalfTick]: IToolInfomation<ShapeEnum.HalfTick>;
  [ToolEnum.Lines]: IToolInfomation<ShapeEnum.Lines>;
}


export interface ShapEnumShapeInfoMap {
  /* Built-in shape info */
  [ShapeEnum.Pen]: IShapeInfomation<ShapeEnum.Pen>;
  [ShapeEnum.Rect]: IShapeInfomation<ShapeEnum.Rect>;
  [ShapeEnum.Oval]: IShapeInfomation<ShapeEnum.Oval>;
  [ShapeEnum.Text]: IShapeInfomation<ShapeEnum.Text>;
  [ShapeEnum.Polygon]: IShapeInfomation<ShapeEnum.Polygon>;
  [ShapeEnum.Tick]: IShapeInfomation<ShapeEnum.Tick>;
  [ShapeEnum.Cross]: IShapeInfomation<ShapeEnum.Cross>;
  [ShapeEnum.HalfTick]: IShapeInfomation<ShapeEnum.HalfTick>;
  [ShapeEnum.Lines]: IShapeInfomation<ShapeEnum.Lines>;
}

export interface ShapeEnumShapeDataMap {
  /* Built-in shape data */
  [ShapeEnum.Pen]: IShapeDataCreater<PenData>;
  [ShapeEnum.Rect]: IShapeDataCreater<RectData>;
  [ShapeEnum.Oval]: IShapeDataCreater<OvalData>;
  [ShapeEnum.Text]: IShapeDataCreater<TextData>;
  [ShapeEnum.Polygon]: IShapeDataCreater<PolygonData>;
  [ShapeEnum.Tick]: IShapeDataCreater<TickData>;
  [ShapeEnum.Cross]: IShapeDataCreater<CrossData>;
  [ShapeEnum.HalfTick]: IShapeDataCreater<HalfTickData>;
  [ShapeEnum.Lines]: IShapeDataCreater<LinesData>;
}

export interface ShapeEnumShapeMap {
  /* Built-in shape data */
  [ShapeEnum.Pen]: IShapeCreater<PenData, ShapePen>;
  [ShapeEnum.Rect]: IShapeCreater<RectData, ShapeRect>;
  [ShapeEnum.Oval]: IShapeCreater<OvalData, ShapeOval>;
  [ShapeEnum.Text]: IShapeCreater<TextData, ShapeText>;
  [ShapeEnum.Polygon]: IShapeCreater<PolygonData, ShapePolygon>;
  [ShapeEnum.Tick]: IShapeCreater<TickData, ShapeTick>;
  [ShapeEnum.Cross]: IShapeCreater<CrossData, ShapeCross>;
  [ShapeEnum.HalfTick]: IShapeCreater<HalfTickData, ShapeHalfTick>;
  [ShapeEnum.Lines]: IShapeCreater<LinesData, ShapeLines>;
}