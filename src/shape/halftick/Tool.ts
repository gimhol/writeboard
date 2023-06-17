import { FactoryMgr } from "../../mgr/FactoryMgr"
import { ShapeEnum } from "../ShapeEnum"
import { ToolEnum } from "../../tools/ToolEnum"
import { SimpleTool as HalfTickTool } from "../../tools/base/SimpleTool"
export { HalfTickTool }

FactoryMgr.registerTool(ToolEnum.HalfTick,
  () => new HalfTickTool(ToolEnum.HalfTick, ShapeEnum.HalfTick),
  { name: 'half tick', desc: 'half tick drawer', shape: ShapeEnum.HalfTick })