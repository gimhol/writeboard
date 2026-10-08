import { Board } from "../../board/Board"
import { EventEnum } from "../../event"
import { Gaia } from "../../mgr/Gaia"
import { ITool } from "../../tools/base/Tool"
import { ToolEnum } from "../../tools/ToolEnum"
import { IDot } from "../../utils/Dot"
import { ShapeEnum } from "../ShapeEnum"
import { ChangeType, PenData } from "./Data"
import { ShapePen } from "./Shape"
const Tag = '[PenTool]'
/** 平滑拖尾上限（屏幕像素）：写快时平滑点离输入太远就收紧，保证笔画不会大幅落后于笔尖 */
const STABILIZER_MAX_LAG = 12
/** 平滑斜坡点数：起笔前几个点少滤一点，起笔 / 钩子不缩水 */
const STABILIZER_RAMP = 5
export class PenTool implements ITool {
  readonly type: string = ToolEnum.Pen
  board: Board | undefined = void 0;

  /** 平滑（防抖）的跟随点（设计 / 世界坐标）：原始输入先滤一道再进笔画 */
  protected _stabilized: { x: number; y: number } | undefined
  /** 起笔以来已滤过的点数（供斜坡用） */
  protected _stabCount = 0

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
  }

  pointerDown(dot: IDot): void {
    const board = this.board
    if (!board) return;
    this._stabilized = { x: dot.x, y: dot.y }
    this._stabCount = 0
    this._curShape = board.factory.newShape(ShapeEnum.Pen) as ShapePen
    this._curShape.data.layer = board.layer().id;
    this._curShape.data.editing = true
    board.add(this._curShape, true)
    this.addDot(dot, 'first')
  }
  pointerDraw(dot: IDot): void {
    this.addDot(this.stabilize(dot), 'mid')
  }
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
  }

  /**
   * 平滑 / 防抖：输出点向输入点低通跟随（强度取 factory.pen.stabilizer，每块板可以不一样）。
   * 拖尾有上限（按屏幕像素折算成设计单位），所以写快 / 画大笔也不会把笔画甩在笔尖后面。
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