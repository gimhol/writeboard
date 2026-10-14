import { Gaia } from "../../mgr/Gaia"
import { ShapeEnum } from "../ShapeEnum"
import { ToolEnum } from "../../tools/ToolEnum"
import { SimpleTool } from "../../tools/base/SimpleTool"
export class OvalTool extends SimpleTool {
  constructor() {
    super(ToolEnum.Oval, ShapeEnum.Oval);
  }

  protected applyRect() {
    if (this.holdingKey('Shift', 'Alt')) {
      // 从圆心开始绘制正圆
      const f = this._rect.from;
      const t = this._rect.to;
      const r = Math.sqrt(Math.pow(f.y - t.y, 2) + Math.pow(f.x - t.x, 2));
      const x = f.x - r;
      const y = f.y - r;
      this._curShape?.geo(x, y, r * 2, r * 2);
    } else if (this.holdingKey('Shift')) {
      // 四角开始绘制正圆
      const f = this._rect.from;
      const t = this._rect.to;
      const r = Math.max(Math.abs(t.x - f.x), Math.abs(t.y - f.y));
      const x = t.x < f.x ? f.x - r : f.x;
      const y = t.y < f.y ? f.y - r : f.y;
      this._curShape?.geo(x, y, r * 2, r * 2);
    } else if (this.holdingKey('Alt')) {
      // 圆心开始绘制椭圆
      const f = this._rect.from;
      const t = this._rect.to;
      const rx = Math.abs(t.x - f.x);
      const ry = Math.abs(t.y - f.y);
      this._curShape?.geo(f.x - rx, f.y - ry, rx * 2, ry * 2);
    } else {
      // 四角开始绘制椭圆
      return super.applyRect();
    }
  }
}

Gaia.registerTool(ToolEnum.Oval,
  () => new OvalTool(),
  { name: 'Oval', desc: 'oval drawer', shape: ShapeEnum.Oval })