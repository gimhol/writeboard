import { Board } from "../../board/Board"
import { EventEnum } from "../../event"
import { Gaia } from "../../mgr/Gaia"
import { ITool } from "../../tools/base/Tool"
import { ToolEnum } from "../../tools/ToolEnum"
import { IDot } from "../../utils/Dot"
import { ShapeEnum } from "../ShapeEnum"
import { ChangeType, PenData } from "./Data"
import { ShapePen } from "./Shape"
import { Indicator, placeIndicator } from "../../tools/Indicator"
const Tag = '[PenTool]'
/** 平滑拖尾上限（屏幕像素）：写快时平滑点离输入太远就收紧，保证笔画不会大幅落后于笔尖 */
const STABILIZER_MAX_LAG = 12
/** 平滑斜坡点数：起笔前几个点少滤一点，起笔 / 钩子不缩水 */
const STABILIZER_RAMP = 5
/**
 * 画笔工具：按下建一条笔迹，拖动时平滑地追加点，抬起时收尾并广播完成事件
 *
 * Pen tool: a press starts a stroke, dragging appends smoothed points, and releasing finishes
 * it and emits the done event.
 */
export class PenTool implements ITool {
  /**
   * 工具类型
   *
   * Tool type.
   */
  readonly type: string = ToolEnum.Pen

  private _indicator: Indicator | undefined
  /**
   * 自绘光标：懒创建一个，板子换了会换成新板的配置
   *
   * The self drawn cursor: it is created lazily and follows the pen config of the current
   * board.
   */
  get indicator(): Indicator { return this._indicator ?? (this._indicator = new Indicator()) }

  /**
   * 笔迹属于哪块黑板
   *
   * The board the stroke belongs to.
   */
  get board(): Board | undefined { return this._board }
  set board(v: Board | undefined) {
    this._board = v
    this._indicator = v?.factory.newIndicator()
    if (this._indicator) this._indicator.board = v
  }
  private _board: Board | undefined = void 0;

  /** 平滑（防抖）的跟随点（设计 / 世界坐标）：原始输入先滤一道再进笔画 */
  protected _stabilized: { x: number; y: number } | undefined
  /** 起笔以来已滤过的点数（供斜坡用） */
  protected _stabCount = 0

  /**
   * 工具激活：先把自绘光标藏起来
   *
   * The tool is activated: the self drawn cursor is hidden first.
   */
  start(): void {
    this.indicator.visible = false
  }
  /**
   * 工具停用：未抬笔则按当前坐标收尾，然后藏光标
   *
   * The tool is deactivated: an unfinished stroke is finished with the current coordinates,
   * then the cursor is hidden.
   */
  end(): void {
    const shape = this._curShape
    if (shape && shape.data.coords.length >= 2) {
      const { coords } = shape.data
      this.pointerUp({
        x: coords[coords.length - 2],
        y: coords[coords.length - 1],
        p: 0
      })
    }
    delete this._curShape;
    this.indicator.visible = false
    this.indicator.markDirty()
  }

  /**
   * 落笔：新建一条空笔迹（editing 为 true）入板，并记下起笔点
   *
   * The pen went down: an empty stroke is added to the board with editing on, and the first
   * point is recorded.
   *
   * @param {IDot} dot 落点（世界坐标）/ The position of the pointer (world space)
   */
  pointerDown(dot: IDot): void {
    const board = this.board
    if (!board) return;
    this.updateIndicator(dot)
    this.indicator.press()
    this._stabilized = { x: dot.x, y: dot.y }
    this._stabCount = 0
    this._curShape = board.factory.newShape(ShapeEnum.Pen) as ShapePen
    this._curShape.data.layer = board.layer().id;
    this._curShape.data.editing = true
    board.add(this._curShape, true)
    this.addDot(dot, 'first')
  }
  /**
   * 拖动中：把平滑后的点接到笔迹末尾（这一阶段不会发事件）
   *
   * While dragging: the smoothed point is appended to the stroke (this stage emits no event).
   *
   * @param {IDot} dot 指针位置（世界坐标）/ The position of the pointer (world space)
   */
  pointerDraw(dot: IDot): void {
    this.updateIndicator(dot)
    this.addDot(this.stabilize(dot), 'mid')
  }
  /**
   * 抬笔：收尾最后一个点、关掉 editing，并广播 ShapesDone（带整份数据）
   *
   * The pen went up: the last point is finished, editing is turned off and ShapesDone is
   * emitted with the whole data.
   *
   * @param {IDot} dot 指针位置（世界坐标）/ The position of the pointer (world space)
   */
  pointerUp(dot: IDot): void {
    const shape = this._curShape
    if (shape) {
      shape.data.editing = false;
      this.addDot(dot, 'last')
      this.board?.emit(EventEnum.ShapesDone, {
        operator: this.board.whoami,
        shapeDatas: [shape!.data.copy()]
      })
      delete this._curShape;
    }
    this._stabilized = undefined
    this.updateIndicator(dot)
    this.indicator.release()
  }
  /**
   * 只在移动（没按下）：只跟新自绘光标的位置
   *
   * Moving without pressing: only the position of the self drawn cursor is refreshed.
   *
   * @param {IDot} dot 指针位置（世界坐标）/ The position of the pointer (world space)
   */
  pointerMove(dot: IDot): void {
    this.updateIndicator(dot)
  }
  /**
   * 指针离开板子：藏起自绘光标
   *
   * The pointer left the board: the self drawn cursor is hidden.
   */
  pointerLeave(): void {
    this.indicator.visible = false
  }
  /**
   * 绘制工具自己的东西：只有自绘光标
   *
   * Draws what belongs to the tool itself: only the self drawn cursor.
   *
   * @param {CanvasRenderingContext2D} ctx 画布上下文 / Canvas context
   */
  render(ctx: CanvasRenderingContext2D): void {
    this.indicator.render(ctx)
  }

  private updateIndicator(dot: IDot): void {
    placeIndicator(this.indicator, this.board, ShapeEnum.Pen, dot)
  }

  /**
   * 平滑 / 防抖：输出点向输入点低通跟随（强度取 factory.pen.stabilizer，每块板可以不一样）。
   * 拖尾有上限（按屏幕像素折算成设计单位），所以写快 / 画大笔也不会把笔画甩在笔尖后面。
   *
   * Smoothing / debouncing: the output point follows the input with a low pass filter (the
   * strength comes from factory.pen.stabilizer, and it may differ per board). The lag is
   * capped (screen pixels converted into design units), so fast writing / big strokes never
   * leave the stroke far behind the pen tip.
   *
   * @param {IDot} dot 原始输入点 / The raw input point
   * @return {IDot} 平滑后的点 / The smoothed point
   */
  protected stabilize(dot: IDot): IDot {
    const out = this._stabilized
    const s = Math.min(1, Math.max(0, this.board?.factory?.pen?.stabilizer ?? 0))
    if (!out || s <= 0) {
      this._stabilized = { x: dot.x, y: dot.y }
      return dot
    }
    /* 强度 → 跟随系数 k（越小越平滑、越滞后） */
    const k = Math.max(0.06, 1 - s * 0.92)
    const ramp = Math.min(1, this._stabCount / STABILIZER_RAMP)
    const kk = 1 - (1 - k) * ramp
    this._stabCount++
    out.x += (dot.x - out.x) * kk
    out.y += (dot.y - out.y) * kk
    /* 拖尾封顶：离输入太远就往回收紧 */
    const dx = dot.x - out.x
    const dy = dot.y - out.y
    const dist = Math.hypot(dx, dy)
    const maxLag = STABILIZER_MAX_LAG / (this.board?.screenScale || 1)
    if (dist > maxLag) {
      const t = (dist - maxLag) / dist
      out.x += dx * t
      out.y += dy * t
    }
    return { x: out.x, y: out.y, p: dot.p }
  }
  protected _prevData: PenData | undefined
  protected _curShape: ShapePen | undefined
  /**
   * 往当前笔迹加一个点，并以 30fps 的节奏广播 ShapesChanging 分片（变更方式为 Append）
   *
   * Adds one point to the current stroke and emits a ShapesChanging slice at 30fps (the change
   * type is Append).
   *
   * @param {IDot} dot 点的位置 / The position of the point
   * @param {'first' | 'last' | 'mid'} type 点的角色：起笔 / 收笔 / 中间 / The role of the point: first / last / middle
   */
  protected addDot(dot: IDot, type: 'first' | 'last' | 'mid') {
    const shape = this._curShape
    const board = this.board
    if (!shape || !board) return
    if (this._prevData)
      return shape.appendDot(dot, type)

    const emitEvent = () => {
      const prev = this._prevData
      if (!prev) return
      const curr = shape.data.copy()
      curr.dotsType = ChangeType.Append
      curr.del_coords(0, prev.coords.length)

      board.emit(EventEnum.ShapesChanging, {
        operator: board.whoami,
        shapeDatas: [[curr, prev]]
      })
      delete this._prevData
    }
    this._prevData = shape.data.copy()
    const prev = this._prevData
    if (prev.coords.length <= 0) {
      shape.appendDot(dot, type)
      emitEvent()
    } else {
      shape.appendDot(dot, type)
      setTimeout(emitEvent, 1000 / 30)
    }

  }
}

Gaia.registerTool(ToolEnum.Pen,
  () => new PenTool(),
  { name: 'Pen', desc: 'simple pen', shape: ShapeEnum.Pen })