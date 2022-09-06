import { FactoryMgr } from "../../mgr/FactoryMgr"
import { ShapeEnum } from "../ShapeEnum"
import { ToolEnum } from "../../tools/ToolEnum"
import { SimpleTool as OvalTool } from "../../tools/base/SimpleTool"
export { OvalTool }

FactoryMgr.registerTool(ToolEnum.Oval,
  () => new OvalTool(ToolEnum.Oval, ShapeEnum.Oval),
  { name: 'oval', desc: 'oval drawer', shape: ShapeEnum.Oval })