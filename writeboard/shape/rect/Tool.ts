import { Gaia } from "../../mgr/Gaia"
import { ShapeEnum } from "../ShapeEnum"
import { ToolEnum } from "../../tools/ToolEnum"
import { SimpleTool } from "../../tools/base/SimpleTool"
export class RectTool extends SimpleTool {
  constructor() {
    super(ToolEnum.Rect, ShapeEnum.Rect);
  }

  protected applyRect() {
    if (this.holdingKey('Shift')) {
      // 四角开始绘制正方形
      const f = this._rect.from;
      const t = this._rect.to;
      const r = Math.max(Math.abs(t.x - f.x), Math.abs(t.y - f.y));
      const x = t.x < f.x ? f.x - r : f.x;
      const y = t.y < f.y ? f.y - r : f.y;
      this._curShape?.geo(x, y, r, r);
    } else {
      // 四角开始绘制矩形
      return super.applyRect();
    }
  }
}

Gaia.registerTool(ToolEnum.Rect,
  () => new RectTool(),
  { name: 'Rectangle', desc: 'rect drawer', shape: ShapeEnum.Rect })