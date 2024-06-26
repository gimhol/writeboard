import { Gaia } from "../../mgr/Gaia"
import { ShapeEnum } from "../ShapeEnum"
import { ToolEnum } from "../../tools/ToolEnum"
import { SimpleTool as RectTool } from "../../tools/base/SimpleTool"
export { RectTool }

Gaia.registerTool(ToolEnum.Rect,
  () => new RectTool(ToolEnum.Rect, ShapeEnum.Rect),
  { name: 'Rectangle', desc: 'rect drawer', shape: ShapeEnum.Rect })