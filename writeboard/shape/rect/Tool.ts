import { Gaia } from "../../mgr/Gaia"
import { ShapeEnum } from "../ShapeEnum"
import { ToolEnum } from "../../tools/ToolEnum"
import { SimpleTool } from "../../tools/base/SimpleTool"
/**
 * 矩形工具：按住 Shift 时拖出正方形，其余情况四角拖矩形
 *
 * Rectangle tool: hold Shift to drag out a square, otherwise a rectangle is dragged from
 * one corner.
 */
export class RectTool extends SimpleTool {
  /**
   * 建一个矩形工具
   *
   * Builds a rectangle tool.
   */
  constructor() {
    super(ToolEnum.Rect, ShapeEnum.Rect);
  }

  /**
   * 按当前按键算出实际矩形：按住 Shift 时以起点为角画正方形
   *
   * Computes the actual rectangle from the pressed keys: a square anchored at the start point
   * while Shift is held.
   */
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