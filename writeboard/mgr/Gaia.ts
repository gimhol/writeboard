
import { Board } from "../board"
import { Events } from "../event"
import { BUILT_IN_FONTS, FontFamilysChecker, IFontInfo } from "../fonts"
import type {
  CrossData, CrossTool, HalfTickData, HalfTickTool, LinesData, LinesTool, OvalData, OvalTool, PenData, PenTool,
  PolygonData, PolygonTool, RectData, RectTool, ShapeCross, ShapeEnum, ShapeHalfTick, ShapeLines, ShapeOval, ShapePen,
  ShapePolygon, ShapeRect, ShapeText, ShapeTick, TextData, TextTool, TickData, TickTool
} from "../shape"
import type { IShapeData, Shape, ShapeData } from "../shape/base"
import { ShapeType, getShapeName } from "../shape/ShapeEnum"
import { SelectorTool } from "../tools"
import type { ITool } from "../tools/base/Tool"
import { ToolEnum, ToolType, getToolName } from "../tools/ToolEnum"
import { getFactoryName, type FactoryEnum, type FactoryType } from "./FactoryEnum"
import type { IFactory } from "./IFactory"

/**
 * 工厂的展示信息
 *
 * Display info of a factory.
 */
export interface IFactoryInfomation {
  /**
   * 工厂名
   *
   * Factory name
   */
  readonly name: string
  /**
   * 工厂说明
   *
   * Factory description
   */
  readonly desc: string
}
/**
 * 工厂构造函数：调用一次得到一个新的工厂实例
 *
 * Factory creator: calling it returns a new factory instance.
 */
export interface IFactoryCreater<F extends IFactory = IFactory> { (): F }
/**
 * 工具的展示信息
 *
 * Display info of a tool.
 */
export interface IToolInfomation<S extends ShapeType | undefined = ShapeType | undefined> {
  /**
   * 工具名
   *
   * Tool name
   */
  readonly name: string
  /**
   * 工具说明
   *
   * Tool description
   */
  readonly desc: string
  /**
   * 工具画出来的图形类型；不产生图形的工具（如选择器）为 undefined
   *
   * Shape type the tool draws, or undefined for tools that do not create shapes
   * (e.g. the selector)
   */
  readonly shape: S
}
/**
 * 图形的展示信息
 *
 * Display info of a shape.
 */
export interface IShapeInfomation<S extends ShapeType = ShapeType> {
  /**
   * 图形名
   *
   * Shape name
   */
  readonly name: string
  /**
   * 图形说明
   *
   * Shape description
   */
  readonly desc: string
  /**
   * 图形类型
   *
   * Shape type
   */
  readonly type: S
}
/**
 * 工具构造函数：调用一次得到一个新的工具实例
 *
 * Tool creator: calling it returns a new tool instance.
 */
export interface IToolCreater<T extends ITool = ITool> { (): T }
/**
 * 图形数据构造函数：调用一次得到一份新的（空白）图形数据
 *
 * Shape data creator: calling it returns a new (blank) shape data.
 */
export interface IShapeDataCreater<D extends IShapeData = IShapeData> { (): D }
/**
 * 图形构造函数：按图形数据建一个图形
 *
 * Shape creator: builds a shape from shape data.
 */
export interface IShapeCreater<D extends IShapeData, S extends Shape = Shape> { (data: D): S }

const Tag = 'Gaia'
/**
 * 全局登记表：工厂 / 工具 / 图形 / 撤销动作处理器 / 字体都登记在这里，
 * 板子与各个静态入口都从它取。整个库用一套登记表，只注册一次即可。
 *
 * Global registry: factories, tools, shapes, action handlers and fonts are registered
 * here, and both boards and the public entry points read from it. One registry is shared
 * by the whole library, so everything only has to be registered once.
 *
 * @see {IFactory}
 * @see {ITool}
 * @see {ActionHandler}
 */
export class Gaia {
  private static _fonts = new Map<string, IFontInfo>();
  private static _tools = new Map<ToolType, IToolCreater>();
  private static _toolInfos = new Map<ToolType, IToolInfomation>()
  private static _shapeDatas = new Map<ShapeType, IShapeDataCreater<any>>()
  private static _shapes = new Map<ShapeType, IShapeCreater<any>>()
  private static _shapeInfos = new Map<ShapeType, IShapeInfomation>()
  private static _factorys = new Map<FactoryType, IFactoryCreater>()
  private static _factoryInfos = new Map<FactoryType, IFactoryInfomation>()
  private static _fonts_ininted = false

  /**
   * 全部已登记的字体（第一次访问时自动把内置字体登记进来）
   *
   * All registered fonts (the built-in ones are registered lazily on first access).
   *
   * @return {ReadonlyMap<string, IFontInfo>} 字体表：家族名 → 字体信息 / Font map: family → font info
   */
  static get fonts(): ReadonlyMap<string, IFontInfo> {
    if (!this._fonts_ininted) {
      this.registerFont(BUILT_IN_FONTS)
      this._fonts_ininted = true;
    }
    return this._fonts;
  }

  /**
   * 字体支持检查函数：登记字体时用它筛掉当前环境没有的家族
   *（默认 = FontFamilysChecker.check，可整体替换）
   *
   * Font support checker: used when registering fonts to filter out families the current
   * environment does not have (defaults to FontFamilysChecker.check, can be replaced).
   */
  static checkFont: (fontFamily: string) => boolean = FontFamilysChecker.check;

  /**
   * 登记一批字体：已登记过的跳过；环境不支持的（checkFont 返回 false）只告警、不登记
   *
   * Registers fonts: already registered families are skipped, and families the
   * environment does not support (checkFont returns false) are only warned about.
   *
   * @param {IFontInfo[]} infos 字体信息列表 / Font info list
   */
  static registerFont(infos: IFontInfo[]) {
    for (const info of infos) {
      if (this._fonts.has(info.family)) {
        console.warn(`[${Tag}::registerFont] font info already exists, family: "${info.family}"`);
        continue;
      }
      const ok = this.checkFont(info.family)
      if (ok) this._fonts.set(info.family, info)
      else console.warn(`[${Tag}::registerFont] font not supported, family: "${info.family}", name: "${info.name}", desc: "${info.desc}"`)
    };
  }

  /**
   * 注册工厂
   *
   * Registers a factory: an existing one is only warned about, then overridden.
   *
   * @static
   * @param {FactoryType} type 工厂类型 / Factory type
   * @param {IFactoryCreater} creator 工厂构造函数 / Factory creator
   * @param {IFactoryInfomation} info 工厂信息 / Factory info
   * @memberof Gaia
   */
  static registerFactory(type: FactoryType, creator: IFactoryCreater, info: Partial<IFactoryInfomation> = {}): void {
    if (this._factorys.has(type)) {
      console.warn(`[${Tag}::registerFactory] factory '${type}' already exists!`);
    } else if (this._factoryInfos.has(type)) {
      console.warn(`[${Tag}::registerFactory] factory info '${type}' already exists!`);
    }

    this.overrideFactory(type, creator, info);
  }

  /**
   * 覆盖 / 补齐工厂登记：只传 creator 就只换实现，只传 info 就只换展示信息，都不传则什么都不做
   *（info 里的 name / desc 缺省时按类型名拼，如 “Default Factory”）
   *
   * Overrides or fills in a factory registration: only `creator` replaces the
   * implementation, only `info` replaces the display info, none does nothing.
   * Name / desc inside `info` fall back to the type name (e.g. "Default Factory").
   *
   * @param {FactoryType} type 工厂类型 / Factory type
   * @param {IFactoryCreater} [creator] 工厂构造函数 / Factory creator
   * @param {Partial<IFactoryInfomation>} [info] 工厂信息 / Factory info
   */
  static overrideFactory(type: FactoryType, creator?: IFactoryCreater, info?: Partial<IFactoryInfomation>): void {
    if (creator) this._factorys.set(type, creator);
    if (info) {
      const factoryName = getFactoryName(type) + ' Factory'
      this._factoryInfos.set(type, { name: info.name ?? factoryName, desc: info.desc ?? factoryName });
    }
  }

  /**
   * 列出工厂类型
   *
   * Lists the registered factory types.
   *
   * @static
   * @return {FactoryType[]} 已登记的工厂类型 / Registered factory types
   * @memberof Gaia
   */
  static listFactories(): FactoryType[] {
    return Array.from(this._factoryInfos.keys())
  }

  /**
   * 按已知工厂类型取工厂构造函数（未登记时返回 undefined），返回值带该类型的具体类型
   *
   * Gets the factory creator of a known factory type (undefined when it is not
   * registered); the return type follows the given type.
   *
   * @param {K} type 已知的工厂类型 / A known factory type
   * @return {FactoryEnumFactoryMap[K]} 该类型的工厂构造函数 / The factory creator of that type
   */
  static factory<K extends keyof FactoryEnumFactoryMap>(type: K): FactoryEnumFactoryMap[K];
  /**
   * 按任意工厂类型取工厂构造函数（未登记时返回 undefined）
   *
   * Gets the factory creator for any factory type (undefined when it is not registered).
   *
   * @param {FactoryType} type 工厂类型 / Factory type
   * @return {IFactoryCreater | undefined} 工厂构造函数 / Factory creator
   */
  static factory(type: FactoryType): IFactoryCreater | undefined;
  static factory(type: FactoryType): IFactoryCreater | undefined {
    return this._factorys.get(type);
  }

  /**
   * 登记工具：已登记的只告警，然后覆盖（工具信息里的 name / desc 缺省用类型名，shape 可缺省）
   *
   * Registers a tool: an existing one is only warned about, then overridden (name / desc
   * fall back to the type name, shape may be omitted).
   *
   * @param {ToolType} type 工具类型 / Tool type
   * @param {IToolCreater} creator 工具构造函数 / Tool creator
   * @param {Partial<IToolInfomation>} [info] 工具信息 / Tool info
   */
  static registerTool(type: ToolType, creator: IToolCreater, info: Partial<IToolInfomation> = {}): void {
    if (this._tools.has(type)) {
      console.warn(`${Tag}::registerTool`, `tool '${type}' already exists!`);
    } else if (this._toolInfos.has(type)) {
      console.warn(`${Tag}::registerTool`, `tool info '${type}' already exists!`);
    }
    this.overrideTool(type, creator, info);
  }

  /**
   * 覆盖 / 补齐工具登记：只传 creator 就只换实现，只传 info 就只换展示信息
   *
   * Overrides or fills in a tool registration: only `creator` replaces the
   * implementation, only `info` replaces the display info.
   *
   * @param {ToolType} type 工具类型 / Tool type
   * @param {IToolCreater} [creator] 工具构造函数 / Tool creator
   * @param {Partial<IToolInfomation>} [info] 工具信息 / Tool info
   */
  static overrideTool(type: ToolType, creator?: IToolCreater, info?: Partial<IToolInfomation>): void {
    if (creator) this._tools.set(type, creator)
    if (info) {
      const toolName = getToolName(type)
      this._toolInfos.set(type, {
        shape: info?.shape,
        name: info?.name || toolName,
        desc: info?.desc || toolName,
      })
    }
  }

  /**
   * 列出已登记的工具类型
   *
   * Lists the registered tool types.
   *
   * @return {ToolType[]} 已登记的工具类型 / Registered tool types
   */
  static listTools(): ToolType[] {
    return Array.from(this._tools.keys());
  }

  /**
   * 按已知工具类型取工具构造函数（未登记时返回 undefined），返回值带该类型的具体类型
   *
   * Gets the tool creator of a known tool type (undefined when it is not registered); the
   * return type follows the given type.
   *
   * @param {K} type 已知的工具类型 / A known tool type
   * @return {ToolEnumToolMap[K]} 该类型的工具构造函数 / The tool creator of that type
   */
  static tool<K extends keyof ToolEnumToolMap>(type: K): ToolEnumToolMap[K];
  /**
   * 按任意工具类型取工具构造函数（未登记时返回 undefined）
   *
   * Gets the tool creator for any tool type (undefined when it is not registered).
   *
   * @param {ToolType} type 工具类型 / Tool type
   * @return {IToolCreater | undefined} 工具构造函数 / Tool creator
   */
  static tool(type: ToolType): IToolCreater | undefined;
  static tool(type: ToolType): IToolCreater | undefined {
    return this._tools.get(type);
  }

  /**
   * 按已知工具类型取工具信息（未登记时返回 undefined），返回值带该类型的具体类型
   *
   * Gets the tool info of a known tool type (undefined when it is not registered); the
   * return type follows the given type.
   *
   * @param {K} type 已知的工具类型 / A known tool type
   * @return {ToolEnumToolInfoMap[K]} 该类型的工具信息 / The tool info of that type
   */
  static toolInfo<K extends keyof ToolEnumToolInfoMap>(type: K): ToolEnumToolInfoMap[K];
  /**
   * 按任意工具类型取工具信息（未登记时返回 undefined）
   *
   * Gets the tool info for any tool type (undefined when it is not registered).
   *
   * @param {ToolType} type 工具类型 / Tool type
   * @return {IToolInfomation | undefined} 工具信息 / Tool info
   */
  static toolInfo(type: ToolType): IToolInfomation | undefined;
  static toolInfo(type: ToolType): IToolInfomation | undefined {
    return this._toolInfos.get(type);
  }
  /**
   * 就地修改已知工具类型的展示信息（未登记过则什么都不做），回调参数带该类型的具体类型
   *
   * Edits the display info of a known tool type in place (does nothing when it was never
   * registered); the callback argument follows the given type.
   *
   * @param {K} type 已知的工具类型 / A known tool type
   * @param {Function} func 收旧信息、返回新信息 / Receives the old info and returns the new one
   */
  static editToolInfo<K extends keyof ToolEnumToolInfoMap>(type: K, func: (i: ToolEnumToolInfoMap[K]) => ToolEnumToolInfoMap[K]): void;
  /**
   * 就地修改任意工具类型的展示信息（未登记过则什么都不做）
   *
   * Edits the display info of any tool type in place (does nothing when it was never
   * registered).
   *
   * @param {ToolType} type 工具类型 / Tool type
   * @param {Function} func 收旧信息、返回新信息 / Receives the old info and returns the new one
   */
  static editToolInfo(type: ToolType, func: (i: IToolInfomation) => IToolInfomation): void;
  static editToolInfo(type: ToolType, func: (i: IToolInfomation) => IToolInfomation): void {
    let info = this._toolInfos.get(type);
    if (!info) { return; }
    info = func(info);
    this._toolInfos.set(type, info);
  }
  /**
   * 登记图形：数据构造函数、图形构造函数与展示信息一起登记；已登记过的只告警，然后覆盖
   *
   * Registers a shape: the data creator, the shape creator and the display info are
   * registered together; existing ones are only warned about, then overridden.
   *
   * @param {ShapeType} type 图形类型 / Shape type
   * @param {IShapeDataCreater<D>} dataCreator 图形数据构造函数 / Shape data creator
   * @param {IShapeCreater<D>} shapeCreator 图形构造函数 / Shape creator
   * @param {Partial<IShapeInfomation>} [info] 图形信息 / Shape info
   */
  static registerShape<D extends ShapeData>(
    type: ShapeType,
    dataCreator: IShapeDataCreater<D>,
    shapeCreator: IShapeCreater<D>,
    info: Partial<IShapeInfomation> = {}
  ): void {
    if (this._shapeInfos.has(type)) {
      console.warn(`${Tag}::registerShape`, `shape info '${type}' already exists!`);
    } else if (this._shapeDatas.has(type)) {
      console.warn(`${Tag}::registerShape`, `shape data'${type}' already exists!`);
    } else if (this._shapes.has(type)) {
      console.warn(`${Tag}::registerShape`, `shape '${type}' already exists!`);
    }
    this.overrideShape(type, dataCreator, shapeCreator, info)
  }

  /**
   * 覆盖 / 补齐图形登记：任一项不传则保留原来的；info 里的 name / desc 缺省用类型名
   *
   * Overrides or fills in a shape registration: anything omitted keeps its previous
   * value, and name / desc fall back to the type name.
   *
   * @param {ShapeType} type 图形类型 / Shape type
   * @param {IShapeDataCreater<D>} [dataCreator] 图形数据构造函数 / Shape data creator
   * @param {IShapeCreater<D>} [shapeCreator] 图形构造函数 / Shape creator
   * @param {Partial<IShapeInfomation>} [info] 图形信息 / Shape info
   */
  static overrideShape<D extends ShapeData>(
    type: ShapeType,
    dataCreator?: IShapeDataCreater<D>,
    shapeCreator?: IShapeCreater<D>,
    info?: Partial<IShapeInfomation>
  ): void {
    if (info) {
      const shapeName = getShapeName(type)
      this._shapeInfos.set(type, {
        name: info.name || shapeName,
        desc: info.desc || shapeName,
        type
      })
    }
    if (dataCreator) this._shapeDatas.set(type, dataCreator);
    if (shapeCreator) this._shapes.set(type, shapeCreator);
  }

  /**
   * 列出已登记的图形类型
   *
   * Lists the registered shape types.
   *
   * @return {ShapeType[]} 已登记的图形类型 / Registered shape types
   */
  static listShapes(): ShapeType[] {
    return Array.from(this._shapes.keys());
  }

  /**
   * 按已知图形类型取图形信息（未登记时返回 undefined），返回值带该类型的具体类型
   *
   * Gets the shape info of a known shape type (undefined when it is not registered); the
   * return type follows the given type.
   *
   * @param {K} type 已知的图形类型 / A known shape type
   * @return {ShapEnumShapeInfoMap[K]} 该类型的图形信息 / The shape info of that type
   */
  static shapeInfo<K extends keyof ShapEnumShapeInfoMap>(type: K): ShapEnumShapeInfoMap[K];
  /**
   * 按任意图形类型取图形信息（未登记时返回 undefined）
   *
   * Gets the shape info for any shape type (undefined when it is not registered).
   *
   * @param {ShapeType} type 图形类型 / Shape type
   * @return {IShapeInfomation | undefined} 图形信息 / Shape info
   */
  static shapeInfo(type: ShapeType): IShapeInfomation | undefined;
  static shapeInfo(type: ShapeType): IShapeInfomation | undefined {
    return this._shapeInfos.get(type)
  }

  /**
   * 按已知图形类型取图形数据构造函数（未登记时返回 undefined），返回值带该类型的具体类型
   *
   * Gets the shape data creator of a known shape type (undefined when it is not
   * registered); the return type follows the given type.
   *
   * @param {K} type 已知的图形类型 / A known shape type
   * @return {ShapeEnumShapeDataMap[K]} 该类型的图形数据构造函数 / The shape data creator of that type
   */
  static shapeData<K extends keyof ShapeEnumShapeDataMap>(type: K): ShapeEnumShapeDataMap[K];
  /**
   * 按任意图形类型取图形数据构造函数（未登记时返回 undefined）
   *
   * Gets the shape data creator for any shape type (undefined when it is not registered).
   *
   * @param {ShapeType} type 图形类型 / Shape type
   * @return {IShapeDataCreater<any> | undefined} 图形数据构造函数 / Shape data creator
   */
  static shapeData(type: ShapeType): IShapeDataCreater<any> | undefined;
  static shapeData(type: ShapeType): IShapeDataCreater<any> | undefined {
    return this._shapeDatas.get(type);
  }

  /**
   * 按已知图形类型取图形构造函数（未登记时返回 undefined），返回值带该类型的具体类型
   *
   * Gets the shape creator of a known shape type (undefined when it is not registered);
   * the return type follows the given type.
   *
   * @param {K} type 已知的图形类型 / A known shape type
   * @return {ShapeEnumShapeMap[K]} 该类型的图形构造函数 / The shape creator of that type
   */
  static shape<K extends keyof ShapeEnumShapeDataMap>(type: K): ShapeEnumShapeMap[K];
  /**
   * 按任意图形类型取图形构造函数（未登记时返回 undefined）
   *
   * Gets the shape creator for any shape type (undefined when it is not registered).
   *
   * @param {ShapeType} type 图形类型 / Shape type
   * @return {IShapeCreater<any> | undefined} 图形构造函数 / Shape creator
   */
  static shape(type: ShapeType): IShapeCreater<any> | undefined;
  static shape(type: ShapeType): IShapeCreater<any> | undefined {
    return this._shapes.get(type);
  }

  /**
   * 登记一种事件类型的撤销动作处理器（同类型重复登记会覆盖前一个）
   *
   * Registers the undo handler of one event type (registering the same type twice keeps
   * the last one).
   *
   * @param {string} eventType 事件类型（EventEnum 的值）/ Event type (a value of EventEnum)
   * @param {ActionHandler} handler 动作处理器 / Action handler
   */
  static registAction<K extends keyof Events.IDetailMap>(eventType: K, handler: ActionHandler<Events.IDetailMap[K]>): void;
  static registAction(eventType: string, handler: ActionHandler): void {
    this._actionHandler.set(eventType, handler);
  }
  /**
   * 列出已登记动作处理器的事件类型
   *
   * Lists the event types that have a registered action handler.
   *
   * @return {string[]} 事件类型 / Event types
   */
  static listActions(): string[] { return Array.from(this._actionHandler.keys()) }
  /**
   * 取某事件类型的动作处理器（未登记时返回 undefined）
   *
   * Gets the action handler of an event type (undefined when it is not registered).
   *
   * @param {string} eventType 事件类型 / Event type
   * @return {ActionHandler | undefined} 动作处理器 / Action handler
   */
  static action(eventType: string): ActionHandler | undefined {
    return this._actionHandler.get(eventType);
  }
  private static _actionHandler = new Map<string, ActionHandler>()
}

/**
 * 可撤销动作的处理器：按事件类型各登记一个，撤回队列（ActionQueue）靠它做撤回 / 重做
 *
 * Handler of an undoable action: one per event type, used by the ActionQueue for
 * undo / redo.
 */
export interface ActionHandler<D = any> {
  /**
   * 这个事件算不算一次可撤销的动作（好比同一个事件在不同工具下处理方式不同）
   *
   * Whether this event counts as an undoable action (the same event may differ per tool)
   */
  isAction(board: Board, e: D): boolean,
  /**
   * 撤回：把这次动作改回去
   *
   * Undo: reverts the action.
   */
  undo(board: Board, e: D): void;
  /**
   * 重做：把这次动作再做一遍
   *
   * Redo: applies the action again.
   */
  redo(board: Board, e: D): void;
}

/**
 * 工厂类型 → 工厂构造函数 的映射（让 Gaia.factory 能按类型推断返回值）
 *
 * Factory type → factory creator map (lets Gaia.factory infer the return type).
 */
export interface FactoryEnumFactoryMap {
  /* Built-in factory */
  [FactoryEnum.Default]: IFactoryCreater
}

/**
 * 工具类型 → 工具构造函数 的映射（让 Gaia.tool 能按类型推断返回值）
 *
 * Tool type → tool creator map (lets Gaia.tool infer the return type).
 */
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

/**
 * 工具类型 → 工具信息 的映射（让 Gaia.toolInfo 能按类型推断返回值）
 *
 * Tool type → tool info map (lets Gaia.toolInfo infer the return type).
 */
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


/**
 * 图形类型 → 图形信息 的映射（让 Gaia.shapeInfo 能按类型推断返回值）
 *
 * Shape type → shape info map (lets Gaia.shapeInfo infer the return type).
 */
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

/**
 * 图形类型 → 图形数据构造函数 的映射（让 Gaia.shapeData 能按类型推断返回值）
 *
 * Shape type → shape data creator map (lets Gaia.shapeData infer the return type).
 */
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

/**
 * 图形类型 → 图形构造函数 的映射（让 Gaia.shape 能按类型推断返回值）
 *
 * Shape type → shape creator map (lets Gaia.shape infer the return type).
 */
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