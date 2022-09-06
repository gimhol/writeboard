
import type { IShapeData, ShapeData, Shape } from "../shape/base"
import type { IFactory } from "./Factory"
import type { ITool } from "../tools/base/Tool"
import type { FactoryType } from "./FactoryEnum"
import { ToolType, getToolName } from "../tools/ToolEnum"
import { ShapeType, getShapeName } from "../shape/ShapeEnum"

const Tag = '[Factory]'
export interface IFactoryInfomation {
  readonly name: string
  readonly desc: string
}
export interface IFactoryCreater { (): IFactory }
export interface IToolInfomation {
  readonly name: string
  readonly desc: string
  readonly shape?: ShapeType
}
export interface IShapeInfomation {
  readonly name: string
  readonly desc: string
  readonly type: ShapeType
}
export interface IToolCreater { (): ITool }
export interface IShapeDataCreater<D extends IShapeData> { (): D }
export interface IShapeCreater<D extends IShapeData> { (data: D): Shape }
export class FactoryMgr {
  static tools: { [key in ToolType]?: IToolCreater } = {}
  static toolInfos: { [key in ToolType]?: IToolInfomation } = {}
  static shapeDatas: { [key in ToolType]?: IShapeDataCreater<any> } = {}
  static shapes: { [key in ToolType]?: IShapeCreater<any> } = {}
  static shapeInfos: { [key in ShapeType]?: IShapeInfomation } = {}
  static factorys: { [key in FactoryType]?: IFactoryCreater } = {}
  static factoryInfos: { [key in FactoryType]?: IFactoryInfomation } = {}
  static listFactories(): FactoryType[] {
    return Object.keys(this.factoryInfos)
  }
  static createFactory(type: FactoryType): IFactory {
    const create = this.factorys[type]
    if (!create) {
      const error = new Error(`${Tag}create("${type}"), ${type} is not registered`)
      throw error
    }
    const ret = create()
    if (ret.type !== type) {
      console.warn(Tag, `create("${type}"), ${type} is not corrent! check member 'type' of your Factory!`)
    }
    return ret
  }
  static registerFactory(type: FactoryType, creator: IFactoryCreater, info: IFactoryInfomation) {
    this.factorys[type] = creator
    this.factoryInfos[type] = info
  }

  static listTools(): ToolType[] {
    return Object.keys(this.tools)
  }
  static toolInfo(type: ToolType) {
    return this.toolInfos[type]
  }
  static registerTool(type: ToolType, creator: IToolCreater, info?: Partial<IToolInfomation>) {
    this.tools[type] = creator
    this.toolInfos[type] = {
      ...info,
      name: info?.name || getToolName(type),
      desc: info?.desc || getToolName(type),
    }
  }

  static listShapes(): ShapeType[] {
    return Object.keys(this.shapes)
  }
  static registerShape<D extends ShapeData>(
    type: ShapeType,
    dataCreator: IShapeDataCreater<D>,
    shapeCreator: IShapeCreater<D>,
    info?: Partial<IShapeInfomation>
  ) {
    this.shapeDatas[type] = dataCreator
    this.shapes[type] = shapeCreator
    this.shapeInfos[type] = {
      name: info?.name || getShapeName(type),
      desc: info?.desc || getShapeName(type),
      type
    }
  }
  static shapeInfo(type: ShapeType) {
    return this.shapeInfos[type]
  }
}