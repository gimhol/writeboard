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
    this.indicator.press()
    this.pointerDraw(dot)
  }
  pointerUp(dot: IDot): void {
    this.indicator.release();
  }
  protected _breakings: [ShapePen, IVector[][]][] = []
  protected _predicate_and_calc = (shape: Shape): boolean => {
    if (shape.type !== ShapeEnum.Pen)
      return false
    const pen = shape as ShapePen
    const coords = pen.data.coords2world;
    const coords_arr: IVector[][] = []

    let hit_1 = false;
    for (let i = 2; i < coords.length; i += 2) {
      const a = { x: coords[i - 2], y: coords[i - 1] }
      const b = { x: coords[i + 0], y: coords[i + 1] }

      if (i == 2) hit_1 = Rect.hit(this.indicator.data, a)
      const hit_2 = Rect.hit(this.indicator.data, b)

      /* 线段的两个端点都在矩形内，该线段被擦除 */
      if (hit_1 && hit_2)
        continue;

      const intersections = Rect.line_segment_intersection(this.indicator.data, { x0: a.x, y0: a.y, x1: b.x, y1: b.y });

      /* 线段的端点，一个在内，一个在外，线段与矩形交点应只有1个 */
      if (hit_1 != hit_2 && intersections.length != 1)
        debugger;

      /* 线段的端点，都在矩形外，线段与矩形交点应只有2个或0个 */
      if (!hit_1 && !hit_2 && intersections.length != 0 && intersections.length != 2)
        debugger;

      const append_prev_lines = (v: IVector) => {
        if (coords_arr.length) coords_arr[coords_arr.length - 1].push(v)
        else coords_arr.push([a, v])
      }
      const create_next_lines = (v: IVector) => coords_arr.push([v, b])
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
        append_prev_lines(b)
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
    for (const [pen, dots_arr] of this._breakings) {
      for (let dots of dots_arr) {
        const new_data = pen.data.copy();
        new_data.id = this.board.factory.newId(new_data)
        new_data.rotation = 0
        new_data.x = 0;
        new_data.y = 0;
        new_data.w = 0;
        new_data.h = 0;
        const new_pen = this.board.factory.newShape(new_data) as ShapePen;
        new_pen.applyDots(dots)
        add_pens.push(new_pen)
      }
      del_pens.push(pen);
    }
    this.board.remove(del_pens, true)
    this.board.add(add_pens, true)
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
