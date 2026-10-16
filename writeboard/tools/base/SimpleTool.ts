import type { Board } from "../../board/Board"
import { Events } from "../../event/Events"
import { EventEnum } from "../../event/EventType"
import { Shape } from "../../shape/base/Shape"
import type { ShapeType } from "../../shape/ShapeEnum"
import type { IDot } from "../../utils/Dot"
import { RectHelper } from "../../utils/RectHelper"
import type { ToolType } from "../ToolEnum"
import type { ITool } from "./Tool"
import { Indicator, placeIndicator } from "../Indicator"

/**
 * 需要监听的修饰键
 *
 * The modifier keys that are listened to.
 */
type FnKeys = 'Control' | 'Alt' | 'Shift';
/**
 * 默认的图形工具：按下开始、拖动改形状、抬起完成，画出矩形 / 椭圆 / 多边形 / 钩 / 叉 / 半勾等；
 * 形状范围由 RectHelper 决定，Shift / Alt / Ctrl 等修饰键怎么影响形状由子类决定
 *
 * The default shape tool: press to start, drag to shape, release to finish; it draws
 * rectangles / ellipses / polygons / ticks / crosses / half ticks and so on. The shape's
 * range comes from a RectHelper, and subclasses decide how the Shift / Alt / Ctrl modifiers
 * affect it.
 */
export class SimpleTool implements ITool {
  /**
   * 工具类型（也是登记表里的键）
   *
   * Tool type (also the key in the registry).
   */
  get type(): string { return this._type }
  private _type: ToolType
  private _shapeType: ShapeType
  /**
   * 新建一个图形工具
   *
   * Creates a shape tool.
   *
   * @param {ToolType} type 工具类型 / Tool type
   * @param {ShapeType} shapeType 工具画出来的图形类型 / Shape type the tool draws
   */
  constructor(type: ToolType, shapeType: ShapeType) {
    this._type = type
    this._shapeType = shapeType
  }
  protected _keys = new Map<FnKeys, boolean>()

  private _indicator: Indicator | undefined
  /**
   * 工具的自绘光标（十字刻度 + 中心圆），第一次访问时才创建
   *
   * The tool's self-drawn cursor (crosshair ticks plus a center circle), created on first
   * access.
   */
  get indicator(): Indicator { return this._indicator ?? (this._indicator = new Indicator()) }

  protected keydown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Control':
      case 'Alt':
      case 'Shift':
        this._keys.set(e.key, true);
        this.applyRect();
        return;
    }
  }
  protected keyup = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Control':
      case 'Alt':
      case 'Shift':
        this._keys.set(e.key, false);
        this.applyRect();
        return;
    }
  }
  /**
   * 判断这些修饰键此刻是不是都按着（例如 holdingKey('Alt')）
   *
   * Tells whether all of these modifier keys are currently held (e.g. holdingKey('Alt')).
   *
   * @param {FnKeys} keys 要检查的修饰键 / The modifier keys to check
   * @return {boolean} 是否全部按下 / Whether all of them are held down
   */
  holdingKey(...keys: FnKeys[]): boolean {
    for (let i = 0; i < keys.length; ++i) {
      if (!this._keys.get(keys[i])) {
        return false;
      }
    }
    return true;
  }
  /**
   * 切换到本工具时的回调：隐藏光标，并开始监听修饰键的按下与松开
   *
   * Called when this tool becomes active: hides the cursor and starts listening for the
   * modifier keys going down and up.
   */
  start(): void {
    this.indicator.visible = false
    window.addEventListener('keydown', this.keydown);
    window.addEventListener('keyup', this.keyup)
  }
  /**
   * 切走时的回调：停掉键盘监听、丢掉还没完成的图形、隐藏光标
   *
   * Called when this tool is switched away: stops the key listeners, drops the shape that
   * was in progress and hides the cursor.
   */
  end(): void {
    window.removeEventListener('keydown', this.keydown);
    window.removeEventListener('keyup', this.keyup)
    delete this._curShape
    this.indicator.visible = false
    this.indicator.markDirty()
  }
  /**
   * 渲染自绘光标
   *
   * Renders the self-drawn cursor.
   *
   * @param {CanvasRenderingContext2D} ctx 画布上下文 / Canvas context
   */
  render(ctx: CanvasRenderingContext2D): void { this.indicator.render(ctx) }
  /**
   * 工具所属的板子（未挂到板子上时为 undefined）
   *
   * Board the tool belongs to (undefined while it is not attached to a board).
   */
  get board(): Board | undefined {
    return this._board
  }
  /**
   * 挂载 / 换绑所属板子：同时按新板子的工厂新建一个自绘光标
   *
   * Attaches or rebinds the owning board: it also builds a new self-drawn cursor from the
   * new board's factory.
   *
   * @param {Board | undefined} v 板子 / The board
   */
  set board(v: Board | undefined) {
    this._board = v
    this._indicator = v?.factory.newIndicator()
    if (this._indicator) this._indicator.board = v
  }
  /**
   * 指针移动：把自绘光标挪到指针处
   *
   * The pointer moved: places the self-drawn cursor at the pointer.
   *
   * @param {IDot} dot 指针位置（画布坐标）/ Pointer position (canvas coordinates)
   */
  pointerMove(dot: IDot): void {
    this.updateIndicator(dot)
  }
  /**
   * 按下：新建图形并加进板子、记下起始几何（进入绘制状态）
   *
   * Pressed: creates a shape, adds it to the board and records the starting geometry (the
   * drawing state begins).
   *
   * @param {IDot} dot 指针位置（画布坐标）/ Pointer position (canvas coordinates)
   */
  pointerDown(dot: IDot): void {
    const { x, y } = dot
    const board = this.board
    if (!board) return
    this.updateIndicator(dot)
    this.indicator.press()
    this._curShape = board.factory.newShape(this._shapeType)
    this._curShape.data.layer = board.layer().id;
    const shape = this._curShape
    if (!shape) return
    board.add(shape, true)
    this._rect.start(x, y)
    this.updateGeo(0)
  }
  /**
   * 拖动：按当前指针位置改形状，并发出 ShapesGeoChanging 事件
   *
   * Dragging: reshapes the shape to the current pointer position and emits a
   * ShapesGeoChanging event.
   *
   * @param {IDot} dot 指针位置（画布坐标）/ Pointer position (canvas coordinates)
   */
  pointerDraw(dot: IDot): void {
    this.updateIndicator(dot)
    const { x, y } = dot
    this._rect.end(x, y)
    this.updateGeo(1)
  }
  /**
   * 抬起：落定形状，依次发出 ShapesGeoChanging / ShapesGeoChanged / ShapesDone 事件
   *
   * Released: settles the shape and emits ShapesGeoChanging / ShapesGeoChanged / ShapesDone.
   *
   * @param {IDot} dot 指针位置（画布坐标）/ Pointer position (canvas coordinates)
   */
  pointerUp(dot: IDot): void {
    const { x, y } = dot
    this._rect.end(x, y)
    this.updateGeo(2)
    delete this._curShape
    this.updateIndicator(dot)
    this.indicator.release()
  }
  /**
   * 指针离开板子：隐藏自绘光标
   *
   * The pointer left the board: hides the self-drawn cursor.
   */
  pointerLeave(): void {
    this.indicator.visible = false
  }
  private updateIndicator(dot: IDot): void {
    placeIndicator(this.indicator, this.board, this._shapeType, dot)
  }
  protected applyRect() {
    const { x, y, w, h } = this._rect.gen()
    this._curShape?.geo(x, y, w, h)
  }
  private updateGeo(state: 0 | 1 | 2) {
    const shape = this._curShape
    const board = this.board
    if (!shape || !board) return

    switch (state) {
      case 0: {
        this._prevData = Events.pickShapeGeoData(shape.data)
        this._startData = this._prevData;
        this.applyRect();
        break;
      }
      case 1: {
        this.applyRect();
        const curr = Events.pickShapeGeoData(shape.data);
        board.emit(EventEnum.ShapesGeoChanging, {
          operator: board.whoami,
          tool: this.type,
          shapeDatas: [[curr, this._prevData!]]
        })
        this._prevData = curr;
        break;
      }
      case 2: {
        this.applyRect();
        const curr = Events.pickShapeGeoData(shape.data);
        board.emit(EventEnum.ShapesGeoChanging, {
          operator: board.whoami,
          tool: this.type,
          shapeDatas: [[curr, this._prevData!]]
        })
        board.emit(EventEnum.ShapesGeoChanged, {
          operator: board.whoami,
          tool: this.type,
          shapeDatas: [[curr, this._startData!]]
        })
        board.emit(EventEnum.ShapesDone, {
          operator: board.whoami,
          shapeDatas: [shape.data.copy()]
        })
        this._prevData = curr;
        break;
      }
    }
  }
  protected _startData: Events.IShapeGeoData | undefined
  protected _prevData: Events.IShapeGeoData | undefined
  protected _curShape: Shape | undefined
  protected _board: Board | undefined
  protected _rect = new RectHelper()
}