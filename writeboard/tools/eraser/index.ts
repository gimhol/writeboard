import type { Board } from "../../board";
import { Gaia } from "../../mgr/Gaia";
import { ShapeEnum, ShapePen, type PenData, type Shape } from "../../shape";
import { IVector, Rect, type IDot, type IRect } from "../../utils";
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
    this.indicator.data.strokeStyle = '#000000AA'
    this.indicator.data.fillStyle = '#FFFFFFAA'
    this.indicator.markDirty();
    this.pointerDraw(dot)
  }
  pointerUp(dot: IDot): void {
    this.indicator.data.strokeStyle = '#00000055'
    this.indicator.data.fillStyle = '#FFFFFF55'
    this.indicator.markDirty();
  }
  protected _breakings: [ShapePen, number[]][] = []
  protected _bounding: IRect = this.indicator.boundingRect()
  protected _predicate = (shape: Shape): boolean => {
    if (shape.type !== ShapeEnum.Pen || shape.type !== ShapeEnum.Pen)
      return false

    const new_coords_arr: IVector[][] = []
    const breaking_idx: number[] = []
    const { coords } = shape.data as PenData;
    for (let i = 0; i < coords.length; i += 2) {
      const x = coords[i];
      const y = coords[i + 1];
      const hit = Rect.hit(this._bounding, { x, y })
      if (hit) {
        breaking_idx.push(i);
      } else {
        const new_coords = new_coords_arr[new_coords_arr.length - 1] ?? (new_coords_arr[0] = [])
        new_coords.push({ x, y })
      }
    }
    if (breaking_idx.length <= 0)
      return false;
    this._breakings.push([shape as ShapePen, breaking_idx]);
    return true;
  }

  pointerDraw(dot: IDot): void {
    this.update_geo(dot);
    this._bounding = this.indicator.boundingRect();
    this._breakings.length = 0;
    this.board.hits(this._bounding, this._predicate);
    for (const [pen, idx_arr] of this._breakings) {
      if (!idx_arr.length) continue;

      let left = 0;
      for (let i = 0; i <= idx_arr.length; i++) {
        const right = i === idx_arr.length ? pen.data.coords.length : idx_arr[i];
        if (right <= left) {
          left = right + 2;
          continue;
        }
        const new_coords = pen.data.coords.slice(left, right)
        if (new_coords.length < 2) continue;

        left = right + 2;
        const new_data = pen.data.copy();
        new_data.id = this.board.factory.newId(new_data)
        new_data.coords.length = 0;
        new_data.x = 0;
        new_data.y = 0;
        new_data.w = 0;
        new_data.h = 0;
        const new_pen = this.board.factory.newShape(new_data) as ShapePen;
        for (let i = 0; i < new_coords.length; i += 2) {
          const x = new_coords[i];
          const y = new_coords[i + 1];
          const t = i === 0 ? 'first' : i == new_coords.length - 2 ? 'last' : void 0
          new_pen.appendDot({ x, y, p: 0 }, t)
        }
        this.board.add(new_pen, true)


      }
      this.board.remove(pen, true)
    }
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
  desc: 'erase pen'
})
