import { Gaia } from "../../mgr/Gaia"
import { ShapeEnum } from "../ShapeEnum"
import { ToolEnum } from "../../tools/ToolEnum"
import { SimpleTool as TickTool } from "../../tools/base/SimpleTool"
export { TickTool }

Gaia.registerTool(ToolEnum.Tick,
  () => new TickTool(ToolEnum.Tick, ShapeEnum.Tick),
  { name: 'tick', desc: 'tick drawer', shape: ShapeEnum.Tick })