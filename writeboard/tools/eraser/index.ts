import type { Board } from "../../board";
import { EventEnum } from "../../event";
import { Gaia } from "../../mgr/Gaia";
import { ShapeEnum, ShapePen, type Shape } from "../../shape";
import { IVector, Rect, type IDot } from "../../utils";
import type { ITool } from "../base";
import { ToolEnum } from "../ToolEnum";
import { worldPolylines } from "./geometry";
import { Indicator } from "./Indicator";

const is_same = (groups: IVector[][], polys: number[][]): boolean => {
  if (groups.length !== polys.length) return false
  for (let g = 0; g < groups.length; ++g) {
    const pts = groups[g]
    const coords = polys[g]
    if (pts.length * 2 !== coords.length) return false
    for (let i = 0, k = 0; i < pts.length; ++i, k += 2) {
      if (pts[i].x !== coords[k] || pts[i].y !== coords[k + 1]) return false
    }
  }
  return true
}

let strokeSeq = 0

/**
 * 橡皮擦：拖着一个方形框扫过板子，把框到的图形换成碎片
 * （删除原图形、把没被擦到的部分作为新的画笔图形加回去）
 *
 * The eraser: it drags a square box across the board and replaces the shapes it catches
 * with fragments (the originals are removed and the parts that were not erased are added
 * back as new pen shapes).
 */
export class EraserTool implements ITool {
  /**
   * 工具类型：固定为橡皮擦
   *
   * Tool type: always the eraser.
   */
  readonly type = ToolEnum.Eraser
  /**
   * 擦除指示框：跟着指针的方形框
   *
   * The eraser indicator box: a square following the pointer.
   */
  readonly indicator = new Indicator()
  /**
   * 所在板子（从指示框上读）
   *
   * The board it belongs to (read from the indicator box).
   */
  get board(): Board { return this.indicator.board!; }
  /**
   * 换绑板子（透传给指示框）
   *
   * Rebinds the board (forwarded to the indicator box).
   *
   * @param {Board} v 板子 / The board
   */
  set board(v: Board) { this.indicator.board = v; }
  /**
   * 切到橡皮擦时：隐藏指示框（指针一动再显示）
   *
   * Called when the eraser becomes active: hides the indicator box (it shows up again on
   * the next pointer move).
   */
  start(): void { console.log('[EraserTool::start]'); this.indicator.visible = false }
  /**
   * 切走时：结束当前事务并隐藏指示框
   *
   * Called when the eraser is switched away: ends the current gesture and hides the
   * indicator box.
   */
  end(): void {
    this._tx = void 0
    this.indicator.visible = false
    this.indicator.markDirty();
  }
  /**
   * 把指示框摆到指针处（居中）；板子关掉了自绘光标时直接隐藏
   *
   * Places the indicator box at the pointer (centered); it is hidden straight away when
   * the board turned self-drawn cursors off.
   *
   * @param {IDot} dot 指针位置（画布坐标）/ Pointer position (canvas coordinates)
   */
  update_geo(dot: IDot) {
    if (!this.board.customCursor) {
      this.indicator.visible = false
      return
    }
    if (!this.indicator.visible) this.indicator.visible = true
    this.indicator.move(
      dot.x - this.indicator.w / 2,
      dot.y - this.indicator.h / 2
    )
  }
  /**
   * 按下：开始一次擦除手势（取一个事务 id，整段手势只记一条撤回记录）
   *
   * Pressed: starts an erase gesture (it takes a transaction id so the whole gesture is
   * recorded as a single undo step).
   *
   * @param {IDot} dot 指针位置（画布坐标）/ Pointer position (canvas coordinates)
   */
  pointerDown(dot: IDot): void {
    this._tx = 'eraser:' + (++strokeSeq)
    this.indicator.press()
    this.pointerDraw(dot)
  }
  /**
   * 抬起：结束手势（清掉事务 id、指示框恢复半透明）
   *
   * Released: ends the gesture (clears the transaction id and restores the translucent
   * indicator box).
   *
   * @param {IDot} dot 指针位置（画布坐标）/ Pointer position (canvas coordinates)
   */
  pointerUp(dot: IDot): void {
    this._tx = void 0
    this.indicator.release();
  }
  /**
   * 指针离开板子：隐藏指示框
   *
   * The pointer left the board: hides the indicator box.
   */
  pointerLeave(): void {
    this.indicator.visible = false
  }
  protected _breakings: [Shape, IVector[][]][] = []
  /**
   * 当前手势的事务 id：结束时清空，不在手势中的增删按普通事件记录
   *
   * Transaction id of the current gesture: cleared when the gesture ends, so add /
   * remove outside a gesture are recorded as ordinary events.
   */
  private _tx: string | undefined = void 0
  protected _predicate_and_calc = (shape: Shape): boolean => {
    const polys = worldPolylines(shape)
    if (!polys)
      return false
    const coords_arr: IVector[][] = []
    for (const coords of polys) this.split(coords, coords_arr)
    if (is_same(coords_arr, polys))
      return false;
    this._breakings.push([shape, coords_arr]);
    return true;
  }

  private split(coords: number[], coords_arr: IVector[][]): void {
    const from = coords_arr.length
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
        if (coords_arr.length > from) coords_arr[coords_arr.length - 1].push(v)
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
  }

  /**
   * 拖动擦除：把框住的图形换成碎片（删除原图形、把没被擦到的部分加回去），
   * 并补发一次 ShapesDone，让碎片也能撤回
   *
   * Dragging to erase: replaces the boxed shapes with fragments (removes the originals and
   * adds back the parts that were not erased), plus one ShapesDone so the fragments can be
   * undone too.
   *
   * @param {IDot} dot 指针位置（画布坐标）/ Pointer position (canvas coordinates)
   */
  pointerDraw(dot: IDot): void {
    this.update_geo(dot);
    this._breakings.length = 0;
    this.board.hits(this.indicator.data, this._predicate_and_calc);
    const add_pens: Shape[] = [];
    const del_pens: Shape[] = [];
    for (const [shape, dots_arr] of this._breakings) {
      for (let dots of dots_arr) {
        const new_data = shape.data.copy();
        new_data.t = ShapeEnum.Pen
        new_data.id = this.board.factory.newShapeId(new_data)
        new_data.rotation = 0
        new_data.x = 0;
        new_data.y = 0;
        new_data.w = 0;
        new_data.h = 0;
        const new_pen = this.board.factory.newShape(new_data) as ShapePen;
        new_pen.applyDots(dots)
        add_pens.push(new_pen)
      }
      del_pens.push(shape);
    }
    this.board.remove(del_pens, this.emit_opts)
    this.board.add(add_pens, this.emit_opts)
    if (add_pens.length) {
      this.board.emit(EventEnum.ShapesDone, {
        operator: this.board.whoami,
        tx: this._tx,
        shapeDatas: add_pens.map(v => v.data.copy())
      })
    }
  }
  private get emit_opts() {
    const { board, _tx } = this
    return _tx ? { operator: board.whoami, tx: _tx } : true
  }
  /**
   * 指针移动（未按下）：只挪动指示框
   *
   * The pointer moved (no button pressed): only moves the indicator box.
   *
   * @param {IDot} dot 指针位置（画布坐标）/ Pointer position (canvas coordinates)
   */
  pointerMove(dot: IDot): void {
    this.update_geo(dot);
  }
  /**
   * 渲染指示框
   *
   * Renders the indicator box.
   *
   * @param {CanvasRenderingContext2D} ctx 画布上下文 / Canvas context
   */
  render(ctx: CanvasRenderingContext2D): void {
    this.indicator.render(ctx)
  }
}
Gaia.registerTool(ToolEnum.Eraser, () => new EraserTool, {
  name: 'Eraser',
  desc: 'erase pen shape'
})
