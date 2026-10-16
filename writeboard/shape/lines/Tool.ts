import { Board } from "../../board/Board"
import { ToolEnum } from "../../tools/ToolEnum"
import { Gaia } from "../../mgr/Gaia"
import { ShapeLines } from "./Shape"
import { ShapeEnum } from "../ShapeEnum"
import { LinesData } from "./Data"
import { IDot } from "../../utils/Dot"
import { ITool } from "../../tools/base/Tool"
import { EventEnum, Events } from "../../event"
import { Indicator, placeIndicator } from "../../tools/Indicator"
const Tag = '[LinesTool]'
/**
 * 直线工具：按住 Shift 可以一笔连画多段折线，按住 Ctrl 时末尾段吸附到最近的 45° 方向
 *
 * Lines tool: hold Shift to keep drawing extra segments in one stroke, and hold Ctrl to snap
 * the last segment to the nearest 45 degree direction.
 */
export class LinesTool implements ITool {
  private _indicator: Indicator | undefined
  /**
   * 自绘光标：懒创建一个，板子换了会换成新板的配置
   *
   * The self drawn cursor: it is created lazily and follows the pen config of the current
   * board.
   */
  get indicator(): Indicator { return this._indicator ?? (this._indicator = new Indicator()) }
  private _pressingShift = false;
  private _pressingControl = false;
  private _keydown = (e: KeyboardEvent) => {
    if (e.key === 'Shift') {
      this._pressingShift = true;
    } else if (e.key === 'Control') {
      this._pressingControl = true;
    }
  }
  private _keyup = (e: KeyboardEvent) => {
    if (e.key === 'Shift') {
      this._pressingShift = false;
    } else if (e.key === 'Control') {
      this._pressingControl = false;
    }
  }
  private _blur = (e: Event) => {
    this._pressingShift = false;
    this._pressingControl = false;
  }
  /**
   * 工具激活：藏光标，并在 window 上监听 Shift / Ctrl 的状态
   *
   * The tool is activated: the cursor is hidden and the Shift / Ctrl state is tracked on the
   * window.
   */
  start(): void {
    this.indicator.visible = false
    window.addEventListener('keydown', this._keydown, true);
    window.addEventListener('keyup', this._keyup, true);
    window.addEventListener('blur', this._blur, true);
  }
  /**
   * 工具停用：移除按键监听并藏光标
   *
   * The tool is deactivated: the key listeners are removed and the cursor is hidden.
   */
  end(): void {
    window.removeEventListener('keydown', this._keydown, true);
    window.removeEventListener('keyup', this._keyup, true);
    window.removeEventListener('blur', this._blur, true);
    this.indicator.visible = false
    this.indicator.markDirty()
  }

  /**
   * 工具类型
   *
   * Tool type.
   */
  get type(): string { return ToolEnum.Lines }

  /**
   * 绘制工具自己的东西：只有自绘光标
   *
   * Draws what belongs to the tool itself: only the self drawn cursor.
   *
   * @param {CanvasRenderingContext2D} ctx 画布上下文 / Canvas context
   */
  render(ctx: CanvasRenderingContext2D): void { this.indicator.render(ctx) }
  /**
   * 直线属于哪块黑板
   *
   * The board the line belongs to.
   */
  get board(): Board | undefined {
    return this._board
  }
  set board(v: Board | undefined) {
    this._board = v
    this._indicator = v?.factory.newIndicator()
    if (this._indicator) this._indicator.board = v
  }
  /**
   * 接一个新点（Shift 连画时用），并以 30fps 的节奏广播 ShapesChanging 分片
   *
   * Appends a new point (used while Shift keeps the stroke alive) and emits a ShapesChanging
   * slice at 30fps.
   *
   * @param {IDot} dot 点的位置 / The position of the point
   * @param {'first'} [type] 传 'first' 时当作起点 / Pass 'first' to treat it as the start
   */
  addDot(dot: IDot, type?: 'first') {
    const shape = this._curShape
    const board = this.board
    if (!shape || !board) return
    if (this._prevData)
      return shape.pushDot(dot, type);

    const emitEvent = () => {
      const prev = this._prevData
      if (!prev) return
      const curr = shape.data.copy()
      curr.coords.splice(0, prev.coords.length)
      board.emit(EventEnum.ShapesChanging, {
        operator: board.whoami,
        shapeDatas: [[curr, prev]]
      });
      delete this._prevData
    }
    this._prevData = shape.data.copy()
    const prev = this._prevData
    if (prev.coords.length <= 0) {
      shape.pushDot(dot, type)
      emitEvent()
    } else {
      shape.pushDot(dot, type)
      setTimeout(emitEvent, 1000 / 30)
    }
  }
  /**
   * 拖末尾那个点：按住 Ctrl 时先把方向吸附到 45° 的整数倍，再以 30fps 的节奏广播分片
   *
   * Drags the last point: while Ctrl is held the direction is snapped to a multiple of 45
   * degrees first, then a slice is emitted at 30fps.
   *
   * @param {IDot} dot 末尾点的新位置 / The new position of the last point
   */
  moveDot(dot: IDot) {


    const shape = this._curShape
    const board = this.board
    if (!shape || !board) return

    if (this._pressingControl && shape.data.coords.length >= 4) {
      const prevX = shape.data.coords[shape.data.coords.length - 4];
      const prevY = shape.data.coords[shape.data.coords.length - 3];
      const angle = Math.atan2(dot.y - prevY, dot.x - prevX) * 180 / Math.PI;
      const o = Math.sqrt((Math.pow(dot.x - prevX, 2) + Math.pow(dot.y - prevY, 2)) / 2)
      if (angle > 22.5 && angle <= 67.5) {
        dot.x = prevX + o;
        dot.y = prevY + o;
      } else if (angle > 67.5 && angle <= 112.5) {
        dot.x = prevX;
      } else if (angle > 112.5 && angle <= 157.5) {
        dot.x = prevX - o;
        dot.y = prevY + o;
      } else if (angle > 157.5 || angle <= -157.5) {
        dot.y = prevY;
      } else if (angle <= -112.5 && angle > -157.5) {
        dot.x = prevX - o;
        dot.y = prevY - o;
      } else if (angle <= -67.5 && angle > -112.5) {
        dot.x = prevX;
      } else if (angle <= -22.5 && angle > -67.5) {
        dot.x = prevX + o;
        dot.y = prevY - o;
      } else {
        dot.y = prevY;
      }
    }

    if (this._prevData)
      return shape.editDot(dot);

    const emitEvent = () => {
      const prev = this._prevData
      if (!prev) return
      const curr = shape.data.copy()
      curr.coords.splice(0, prev.coords.length)
      board.emit(EventEnum.ShapesChanging, {
        operator: board.whoami,
        shapeDatas: [[curr, prev]]
      })
      delete this._prevData
    }
    this._prevData = shape.data.copy()
    const prev = this._prevData
    if (prev.coords.length <= 0) {
      shape.editDot(dot)
      emitEvent()
    } else {
      shape.editDot(dot)
      setTimeout(emitEvent, 1000 / 30)
    }
  }

  /**
   * 指针移动：先跟新光标，正在画时拖动末尾那个点
   *
   * The pointer moved: the cursor is refreshed first, and the last point is dragged while a
   * line is being drawn.
   *
   * @param {IDot} dot 指针位置（世界坐标）/ The position of the pointer (world space)
   */
  pointerMove(dot: IDot): void {
    this.updateIndicator(dot)
    if (this._curShape) {
      this.moveDot(dot);
    }
  }
  /**
   * 落笔：新建一条两点（首尾重合）的直线入板
   *
   * The pen went down: a new line with two coincident points is added to the board.
   *
   * @param {IDot} dot 落点（世界坐标）/ The position of the pointer (world space)
   */
  pointerDown(dot: IDot): void {
    const board = this.board
    if (!board) { return; }
    this.updateIndicator(dot)
    this.indicator.press()
    if (!this._curShape) {
      this._curShape = board.factory.newShape(ShapeEnum.Lines) as ShapeLines
      this._curShape.data.layer = board.layer().id;
      this._curShape.data.editing = true
      board.add(this._curShape, true);
      this.addDot(dot, 'first');
      this.addDot(dot)
    }
  }
  /**
   * 拖动中：移动末尾那个点（这一阶段不会发事件）
   *
   * While dragging: the last point is moved (this stage emits no event).
   *
   * @param {IDot} dot 指针位置（世界坐标）/ The position of the pointer (world space)
   */
  pointerDraw(dot: IDot): void {
    this.updateIndicator(dot)
    this.moveDot(dot);
  }
  /**
   * 抬笔：按住 Shift 则只接一个新点继续画，否则收尾并广播 ShapesDone
   *
   * The pen went up: with Shift held only a new point is appended, otherwise the line is
   * finished and ShapesDone is emitted.
   *
   * @param {IDot} dot 指针位置（世界坐标）/ The position of the pointer (world space)
   */
  pointerUp(dot: IDot): void {
    this.updateIndicator(dot)
    this.indicator.release()
    const shape = this._curShape;
    if (!shape) { return; }
    if (!this._pressingShift) {
      shape.data.editing = false;
      this._board?.emit(EventEnum.ShapesDone, {
        operator: this._board.whoami,
        shapeDatas: [shape.data.copy()]
      })
      delete this._curShape;
    } else {
      this.addDot(dot)
    }
  }
  private _prevData: LinesData | undefined
  private _curShape: ShapeLines | undefined
  private _board: Board | undefined

  /**
   * 指针离开板子：藏起自绘光标
   *
   * The pointer left the board: the self drawn cursor is hidden.
   */
  pointerLeave(): void {
    this.indicator.visible = false
  }
  private updateIndicator(dot: IDot): void {
    placeIndicator(this.indicator, this.board, ShapeEnum.Lines, dot)
  }
}

Gaia.registerTool(ToolEnum.Lines,
  () => new LinesTool(),
  { name: 'Lines', desc: 'lines', shape: ShapeEnum.Lines })