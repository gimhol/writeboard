import type { Board } from "../../board";
import { Gaia } from "../../mgr/Gaia";
import { ShapeEnum, ShapePen, type Shape } from "../../shape";
import { IVector, Rect, type IDot } from "../../utils";
import type { ITool } from "../base";
import { ToolEnum } from "../ToolEnum";
import { Indicator } from "./Indicator";

export class EraserTool implements ITool {
  readonly type = ToolEnum.Eraser
  readonly indicator = new Indicator()
  get board(): Board { return this.indicator.board!!; }
  set board(v: Board) { this.indicator.board = v; }
  start(): void { console.log('[EraserTool::start]') }
  end(): void {
    this.indicator.markDirty();
  }
  update_geo(dot: IDot) {
    this.indicator.move(
      dot.x - this.indicator.w / 2,
      dot.y - this.indicator.h / 2
    )
  }
  pointerDown(dot: IDot): void {
    this.indicator.data.strokeStyle = '#000000FF'
    this.indicator.data.fillStyle = '#FFFFFFFF'
    this.indicator.markDirty();
    this.pointerDraw(dot)
  }
  pointerUp(dot: IDot): void {
    this.indicator.data.strokeStyle = '#00000055'
    this.indicator.data.fillStyle = '#FFFFFF55'
    this.indicator.markDirty();
  }
  protected _breakings: [ShapePen, IVector[][]][] = []
  protected _predicate_and_calc = (shape: Shape): boolean => {
    if (shape.type !== ShapeEnum.Pen || shape.type !== ShapeEnum.Pen)
      return false
    const pen = shape as ShapePen
    const { coords } = pen.data;
    const coords_arr: IVector[][] = []
    let hit_1 = Rect.hit(this._bounding, { x: coords[0], y: coords[1] })
    for (let i = 2; i < coords.length; i += 2) {
      const x0 = coords[i - 2];
      const y0 = coords[i - 1];

      const x1 = coords[i];
      const y1 = coords[i + 1];
      const hit_2 = Rect.hit(this._bounding, { x: x1, y: y1 })

      /* 线段的两个端点都在矩形内，该线段被擦除 */
      if (hit_1 && hit_2)
        continue;

      const intersections = Rect.line_segment_intersection(this._bounding, { x0, y0, x1, y1 });

      /* 线段的端点，一个在内，一个在外，线段与矩形交点应只有1个 */
      if (hit_1 != hit_2 && intersections.length != 1)
        debugger;

      /* 线段的端点，都在矩形外，线段与矩形交点应只有2个或0个 */
      if (!hit_1 && !hit_2 && intersections.length != 0 && intersections.length != 2)
        debugger;

      const append_prev_lines = (v: IVector) => {
        if (coords_arr.length) coords_arr[coords_arr.length - 1].push(v)
        else coords_arr.push([{ x: x0, y: y0 }, v])
      }
      const create_next_lines = (v: IVector) => coords_arr.push([v, { x: x1, y: y1 }])
      if (!hit_1 && hit_2) {
        /* 线段起点在矩形外，线段终点在矩形内 */
        append_prev_lines(intersections[0])
      } else if (hit_1 && !hit_2) {
        /* 线段起点在矩形内，线段终点在矩形外 */
        create_next_lines(intersections[0])
      } else if (intersections.length === 2) {
        /* 原线段穿过矩形 */
        append_prev_lines(intersections[0])
        create_next_lines(intersections[1])
      } else if (!intersections.length) {
        append_prev_lines({ x: x1, y: y1 })
      }
      hit_1 = hit_2;
    }
    if (coords_arr.length === 1 && coords_arr[0].length === pen.data.coords.length)
      return false;
    this._breakings.push([pen as ShapePen, coords_arr]);
    return true;
  }

  pointerDraw(dot: IDot): void {
    this.update_geo(dot);
    this._breakings.length = 0;
    this.board.hits(this.indicator.data, this._predicate_and_calc);
    const add_pens: Shape[] = [];
    const del_pens: Shape[] = [];
    for (const [pen, coords_arr] of this._breakings) {
      for (let i = 0; i < coords_arr.length; ++i) {
        const new_coords = coords_arr[i]
        const new_data = pen.data.copy();
        new_data.id = this.board.factory.newId(new_data)
        new_data.coords.length = 0;
        new_data.x = 0;
        new_data.y = 0;
        new_data.w = 0;
        new_data.h = 0;
        const new_pen = this.board.factory.newShape(new_data) as ShapePen;
        for (let j = 0; j < new_coords.length; ++j) {
          const { x, y } = new_coords[j];
          const t = j === 0 ? 'first' : j == new_coords.length - 1 ? 'last' : void 0
          new_pen.appendDot({ x, y, p: 0 }, t)
        }
        add_pens.push(new_pen)
      }
      del_pens.push(pen);
    }
    this.board.add(add_pens, true)
    this.board.remove(del_pens, true)
  }
  pointerMove(dot: IDot): void {
    this.update_geo(dot);
  }
  render(ctx: CanvasRenderingContext2D): void {
    this.indicator.render(ctx)
  }
}
Gaia.registerTool(ToolEnum.Eraser, () => new EraserTool, {
  name: 'Eraser',
  desc: 'erase pen shape'
})
