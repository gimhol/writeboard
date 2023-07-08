import { Gaia } from "../../mgr/Gaia"
import { ShapeEnum } from "../ShapeEnum"
import { ToolEnum } from "../../tools/ToolEnum"
import { SimpleTool as RectTool } from "../../tools/base/SimpleTool"
export { RectTool }

Gaia.registerTool(ToolEnum.Img,
  () => new RectTool(ToolEnum.Img, ShapeEnum.Img),
  { name: 'Image', desc: 'Image drawer', shape: ShapeEnum.Img })