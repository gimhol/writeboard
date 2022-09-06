import { FactoryMgr } from "../../mgr/FactoryMgr"
import { ShapeEnum } from "../ShapeEnum"
import { ToolEnum } from "../../tools/ToolEnum"
import { SimpleTool as RectTool } from "../../tools/base/SimpleTool"
export { RectTool }

FactoryMgr.registerTool(ToolEnum.Rect,
  () => new RectTool(ToolEnum.Rect, ShapeEnum.Rect),
  { name: 'rect', desc: 'rect drawer', shape: ShapeEnum.Rect })