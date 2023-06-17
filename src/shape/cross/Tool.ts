import { FactoryMgr } from "../../mgr/FactoryMgr"
import { ShapeEnum } from "../ShapeEnum"
import { ToolEnum } from "../../tools/ToolEnum"
import { SimpleTool as CrossTool } from "../../tools/base/SimpleTool"
export { CrossTool }

FactoryMgr.registerTool(ToolEnum.Cross,
  () => new CrossTool(ToolEnum.Cross, ShapeEnum.Cross),
  { name: 'cross', desc: 'cross drawer', shape: ShapeEnum.Cross })