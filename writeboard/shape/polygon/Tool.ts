import { Gaia, IToolInfomation } from "../../mgr/Gaia"
import { ShapeEnum } from "../ShapeEnum"
import { ToolEnum } from "../../tools/ToolEnum"
import { SimpleTool as PolygonTool } from "../../tools/base/SimpleTool"
export { PolygonTool }

/**
 * 多边形工具的展示信息
 *
 * Display info of the polygon tool.
 */
const desc: IToolInfomation = {
  name: 'Polygon', desc: 'Polygon Drawer', shape: ShapeEnum.Polygon
}
Gaia.registerTool(ToolEnum.Polygon,
  () => new PolygonTool(ToolEnum.Polygon, ShapeEnum.Polygon), desc)