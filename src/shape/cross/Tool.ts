import { Gaia } from "../../mgr/Gaia"
import { ShapeEnum } from "../ShapeEnum"
import { ToolEnum } from "../../tools/ToolEnum"
import { SimpleTool as CrossTool } from "../../tools/base/SimpleTool"
export { CrossTool }

Gaia.registerTool(ToolEnum.Cross,
  () => new CrossTool(ToolEnum.Cross, ShapeEnum.Cross),
  { name: 'Cross', desc: 'cross drawer', shape: ShapeEnum.Cross })