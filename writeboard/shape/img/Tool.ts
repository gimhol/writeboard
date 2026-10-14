import { Gaia } from "../../mgr/Gaia"
import { ShapeEnum } from "../ShapeEnum"
import { ToolEnum } from "../../tools/ToolEnum"
import { SimpleTool } from "../../tools/base/SimpleTool"

Gaia.registerTool(ToolEnum.Img,
  () => new SimpleTool(ToolEnum.Img, ShapeEnum.Img),
  { name: 'Image', desc: 'Image drawer', shape: ShapeEnum.Img })