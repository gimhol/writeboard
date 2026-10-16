import { Board } from "../../board"
import { EventEnum } from "../../event"
import { Events } from "../../event/Events"
import { Gaia } from "../../mgr/Gaia"
import { ShapePen, ShapeText, TextTool } from "../../shape"
import { opposites, Resizable, Shape } from "../../shape/base"
import { Arrays, Degrees, IRotatedRect, Polygon, Rect, RotatedRect } from "../../utils"
import { IDot } from "../../utils/Dot"
import { IVector } from "../../utils/IVector"
import { RectHelper } from "../../utils/RectHelper"
import { throttle } from "../../utils/Throttle"
import { Vector } from "../../utils/Vector"
import { ToolEnum, ToolType } from "../ToolEnum"
import { ITool } from "../base/Tool"
import { ShapeGroup } from "./ShapeGroup"
import { ShapeRotator } from "./ShapeRotator"
import { ShapeSelector } from "./ShapeSelector"
/**
 * 选择器工具的状态机：指针按下后先进 Ready* 状态，位移超过阈值才真正开始
 * 拖动 / 框选 / 缩放 / 旋转，抬起后回到 Idle
 *
 * State machine of the selector tool: pressing moves into a Ready* state and only after
 * the movement passes a threshold does dragging / selecting / resizing / rotating really
 * start; releasing goes back to Idle.
 */
export enum SelectorStatus {
  /**
   * 空闲：没有正在进行的操作
   *
   * Idle: nothing is in progress.
   */
  Idle = 0,
  /**
   * 已按下（准备拖动）：还没超过「算作拖动」的位移阈值
   *
   * Pressed and waiting to drag: the movement has not passed the drag threshold yet.
   */
  ReadyForDragging,
  /**
   * 拖动中：正在按指针位移移动图形
   *
   * Dragging: the shapes are following the pointer.
   */
  Dragging,
  /**
   * 已按下（准备框选）：还没超过「算作框选」的位移阈值
   *
   * Pressed and waiting to select: the movement has not passed the marquee threshold yet.
   */
  ReadyForSelecting,
  /**
   * 框选中：选框跟着指针变大
   *
   * Selecting: the marquee follows the pointer.
   */
  Selecting,
  /**
   * 已按下缩放柄（准备缩放）
   *
   * Pressed on a resize handle and waiting to resize.
   */
  ReadyForResizing,
  /**
   * 缩放中：正在按指针位置改图形几何
   *
   * Resizing: the shape geometry follows the pointer.
   */
  Resizing,
  /**
   * 已按下旋转柄（准备旋转）
   *
   * Pressed on the rotate grip and waiting to rotate.
   */
  ReadyForRotating,
  /**
   * 旋转中：图形跟着指针转
   *
   * Rotating: the shape follows the pointer around.
   */
  Rotating,
}
const { min, max, atan2, floor } = Math
/**
 * 一次缩放的上下文：拖哪个方向、以谁为锚点、按下时指针在控制点里的偏移，以及被缩放的图形
 *
 * Context of one resize: which direction is being dragged, which point is the anchor, the
 * offset of the pointer inside the handle, and the shape being resized.
 */
class ResizeInfo {
  /**
   * 缩放方向（四边 / 四角），Resizable.None = 不缩放
   *
   * Resize direction (edges / corners); Resizable.None = not resizing.
   */
  direction: Resizable = Resizable.None
  /**
   * 锚点：缩放过程中保持不动的那个角 / 边中点
   *
   * The anchor: the corner / edge midpoint that stays put while resizing.
   */
  anchor: IVector = { x: 0, y: 0 };
  /**
   * 按下时指针相对控制点的偏移，缩放时用它把指针位置换算回控制点位置
   *
   * Offset of the pointer inside the handle when it was pressed, used to map the pointer
   * back to the handle position while resizing.
   */
  offset: IVector = { x: 0, y: 0 };
  /**
   * 正在被缩放的图形（没有时为 null）
   *
   * The shape being resized (null when there is none).
   */
  shape: Shape | null = null;
  /**
   * 清空这次缩放的上下文（回到 Idle 时调用）
   *
   * Clears this resize context (called when going back to Idle).
   */
  reset() {
    this.direction = Resizable.None;
    this.offset.x = this.offset.y = this.anchor.x = this.anchor.y = 0;
    this.shape = null
  }
}
/**
 * 选择工具：点选 / 框选图形，并负责拖动、缩放、旋转，以及选中框（ShapeGroup）与
 * 旋转柄（ShapeRotator）的渲染；右键按下走「框选」流程，右键只点一下则选中指针下的图形
 *
 * The selector tool: picks shapes by click or marquee and handles dragging, resizing and
 * rotating, plus rendering the group box (ShapeGroup) and the rotate grip (ShapeRotator).
 * The secondary button starts a marquee, and a plain secondary click selects the shape
 * under the pointer.
 */
export class SelectorTool implements ITool {
  /**
   * 工具类型：固定为选择器
   *
   * Tool type: always the selector.
   */
  get type(): ToolType { return ToolEnum.Selector }
  private _doubleClickTimer = 0;
  private _picking = new ShapeGroup()
  private _selector = new ShapeSelector()
  private _rectHelper = new RectHelper()
  private _status = SelectorStatus.Idle
  private _prevPos: IVector = { x: 0, y: 0 }
  private _resizer = new ResizeInfo();
  private _rotator = new ShapeRotator()
  private _windowPointerDown = () => this.deselect();
  private _shapes: {
    shape: Shape,
    prevData: Events.IShapeGeoData,
    startData: Events.IShapeGeoData,
  }[] = []
  private _rightPick: Shape | null = null

  /**
   * 多选时的组合框（框住全部选中图形）
   *
   * The group box used for multi-selection (it wraps every selected shape).
   */
  get picking() { return this._picking }
  /**
   * 当前缩放的上下文（方向 / 锚点 / 偏移 / 图形）
   *
   * Context of the resize in progress (direction / anchor / offset / shape).
   */
  get resizer() { return this._resizer }
  /**
   * 所在板子
   *
   * The board it belongs to.
   */
  get board(): Board { return this._selector.board!; }
  /**
   * 换绑板子：把选框 / 旋转柄 / 组合框都挂到新板子上，并立即同步当前选中状态
   *
   * Rebinds the board: attaches the marquee / rotate grip / group box to the new board and
   * syncs the current selection right away.
   *
   * @param {Board} v 板子 / The board
   */
  set board(v: Board) {
    this._selector.board = v;
    this._rotator.board = v;
    this._picking.board = v;
    v.on(EventEnum.ShapesSelected, this.onSelectChanged)
    v.on(EventEnum.ShapesDeselected, this.onSelectChanged)
    /* 立即同步当前选中状态：Ctrl+A 之类「先用别的工具选中、再切到选择器」的场景，
       选中事件在工具实例创建前就播完了——不同步的话多选的组合框永远不会显示 */
    this.onSelectChanged()
  }
  private onSelectChanged = () => {
    this._picking.reset();
    const { selects } = this.board;
    if (selects.length > 1) {
      this._picking.setMembers(selects);
      this._rotator.follow(this._picking);
    } else if (selects.length == 1) {
      this._rotator.follow(selects[0])
    } else {
      this._picking.reset();
    }
  }

  /**
   * 框选用的矩形助手（记录按下点到当前点的范围）
   *
   * The rect helper used by the marquee (it tracks the range from the press point to the
   * current one).
   */
  get rect(): RectHelper { return this._rectHelper }

  /**
   * 设置板子元素的鼠标指针样式（'' = 用默认箭头）
   *
   * Sets the CSS cursor of the board element ('' = the default arrow).
   *
   * @param {string} v 光标样式 / The cursor style
   */
  set cursor(v: string) {
    this.board.element.style.cursor = v;
  }

  /**
   * 渲染选框 / 旋转柄 / 组合框（都在图形层上）
   *
   * Renders the marquee / rotate grip / group box (all on the shape layer).
   *
   * @param {CanvasRenderingContext2D} ctx 画布上下文 / Canvas context
   */
  render(ctx: CanvasRenderingContext2D): void {
    this._selector.render(ctx)
    this._rotator.render(ctx)
    this._picking.render(ctx)
  }
  /**
   * 切到选择工具时：恢复默认光标，并监听 document 上的 pointerdown
   *（点空白处就取消选择）
   *
   * Called when the selector becomes active: restores the default cursor and listens for
   * pointerdown on the document (pressing empty space clears the selection).
   */
  start(): void {
    this.board.element.style.cursor = ''
    document.addEventListener('pointerdown', this._windowPointerDown)
  }
  /**
   * 切走时：恢复光标、停掉监听、取消选择并让旋转柄停止跟随
   *
   * Called when the selector is switched away: restores the cursor, stops the listener,
   * clears the selection and makes the rotate grip stop following.
   */
  end(): void {
    this.board.element.style.cursor = ''
    document.removeEventListener('pointerdown', this._windowPointerDown)
    this.deselect();
    this._rotator.unfollow()
  }
  /**
   * 取消当前选择（等价于 board.deselect(true)，会广播取消选中事件）
   *
   * Clears the current selection (the same as board.deselect(true), and it emits the
   * deselected events).
   */
  deselect() {
    const { board } = this;
    if (!board) { return; }
    board.deselect(true);
  }
  /**
   * 记录这次手势要操作的图形（已知是一组图形），并把鼠标起点当作参照点。
   * 参照点取各图形坐标的最小值，所以整组拖动时不会跑偏。
   *
   * Records the shapes this gesture operates on (a known list) and uses the pointer start
   * as the reference point. The reference is the smallest coordinate among the shapes, so
   * the group does not drift while dragging.
   *
   * @param {Shape[]} shapes 参与手势的图形 / The shapes taking part in the gesture
   * @return {this} 自身，便于链式调用 / Itself, for chaining
   */
  connect(shapes: Shape[]): this;
  /**
   * 记录这次手势要操作的图形（任意一组），并显式给出参照点
   *
   * Records the shapes this gesture operates on (any list) with an explicit reference
   * point.
   *
   * @param {Shape[]} shapes 参与手势的图形 / The shapes taking part in the gesture
   * @param {number} startX 参照点 x / Reference point x
   * @param {number} startY 参照点 y / Reference point y
   * @return {this} 自身，便于链式调用 / Itself, for chaining
   */
  connect(shapes: Shape[], startX: number, startY: number): this;
  connect(shapes: Shape[], startX?: number, startY?: number): this {
    let x = startX;
    let y = startY;
    this._shapes = shapes.map(v => {
      const data = {
        i: v.data.i,
        x: v.data.x,
        y: v.data.y,
        w: v.data.w,
        h: v.data.h,
        r: v.data.r,
      }
      if (startX === void 0) {
        x = x === void 0 ? v.data.x : min(x, v.data.x);
        y = y === void 0 ? v.data.y : min(y, v.data.y);
      }
      return {
        shape: v,
        prevData: data,
        startData: data,
      }
    })
    this._prevPos = { x: x!, y: y! }
    return this;
  }

  /**
   * 把这一组图形移到指针处（按当前指针与上次位置的差值移动）
   *
   * Moves the group to the pointer (by the difference between the current pointer and the
   * previous position).
   *
   * @param {number} curX 当前指针 x / Current pointer x
   * @param {number} curY 当前指针 y / Current pointer y
   * @return {this} 自身，便于链式调用 / Itself, for chaining
   */
  move(curX: number, curY: number): this {
    return this.moveBy(
      curX - this._prevPos.x,
      curY - this._prevPos.y
    );
  }

  /**
   * 按给定位移移动这一组图形与组合框（锁定的图形保持不动）
   *
   * Moves the group and the group box by the given delta (locked shapes stay put).
   *
   * @param {number} diffX x 方向位移 / Delta x
   * @param {number} diffY y 方向位移 / Delta y
   * @return {this} 自身，便于链式调用 / Itself, for chaining
   */
  moveBy(diffX: number, diffY: number): this {
    this._prevPos.x += diffX;
    this._prevPos.y += diffY;
    for (let i = 0, len = this._shapes.length; i < len; ++i) {
      const v = this._shapes[i]
      const {
        rotatedTopLeft: a, rotatedTopRight: b,
        rotatedBottomLeft: c, rotatedBottomRight: d,
        locked,
      } = v.shape
      if (locked) continue;
      v.prevData = Events.pickShapePosData(v.shape.data)
      v.shape.moveBy(diffX, diffY)
    }
    this._picking.moveBy(diffX, diffY)
    return this;
  }

  /**
   * 按下：按指针落在哪儿决定进入拖动 / 缩放 / 旋转 / 框选，并记下相应的起点与参照点
   *
   * Pressed: decides whether this becomes a drag / resize / rotate / marquee based on what
   * the pointer hit, and records the matching start state and reference point.
   *
   * @param {IDot} dot 指针位置（画布坐标）/ Pointer position (canvas coordinates)
   * @param {number} [button] 按键：0 左键、2 右键 / Button: 0 primary, 2 secondary
   */
  pointerDown(dot: IDot, button?: number): void {
    const { board, _status } = this
    if (_status !== SelectorStatus.Idle) return

    const { x, y } = dot
    if (button === 2) {
      this._rectHelper.start(x, y)
      this.updateGeo()
      this._prevPos = { x, y }
      const [hit] = board.hits({ x, y, w: 0, h: 0 })
      this._rightPick = hit && !hit.locked ? hit : null
      this._status = SelectorStatus.ReadyForSelecting
      this._selector.visible = true
      return
    }
    if (this._rotator.pointerDown(dot)) {
      this._status = SelectorStatus.ReadyForRotating;
      this.connect([this._rotator.target!], x, y);
      return
    }
    if (this._picking.hit(dot)) {
      this._status = SelectorStatus.ReadyForDragging;
      this.connect(board.selects, x, y);
      return
    }

    this._rectHelper.start(x, y)
    this.updateGeo()

    /* 点击位置的全部图形 */
    let shapes = board.hits({ x, y, w: 0, h: 0 });
    if (!shapes.length) shapes = board.hits({ x: x - 15, y: y - 15, w: 30, h: 30 }, this._pen_in_click);


    const shape = Arrays.firstOf(shapes, it => (it.selected && !it.locked) ? it : null) || shapes[0]

    if (!shape || shape.locked) {
      // 点击的位置无任何未锁定图形，则框选图形, 并取消选择以选择的图形
      this._status = SelectorStatus.ReadyForSelecting;
      this._selector.visible = true;
      this.deselect();
    } else if (!shape.selected) {
      // 点击位置存在图形，且图形未被选择，则选择点中的图形。
      this._status = SelectorStatus.ReadyForDragging;
      this._rotator.follow(shape)
      board.setSelects([shape], true)
    } else {
      // 点击位置存在图形，且图形已被选择，则判断是否点击尺寸调整。
      const dot = shape.map2me(x, y).plus(shape.data)
      const [direction, resizerRect] = shape.resizableDirection(x, y);
      if (direction) {
        this._resizer.direction = direction;
        this._resizer.shape = shape
        this._resizer.anchor = shape.getRotatedDot(opposites[direction]);
        switch (direction) {
          case Resizable.Top:
            this._resizer.offset.x = 0
            this._resizer.offset.y = resizerRect!.top - dot.y
            break
          case Resizable.Bottom:
            this._resizer.offset.x = 0
            this._resizer.offset.y = resizerRect!.bottom - dot.y
            break
          case Resizable.Left:
            this._resizer.offset.x = resizerRect!.left - dot.x
            this._resizer.offset.y = 0
            break
          case Resizable.Right:
            this._resizer.offset.x = resizerRect!.right - dot.x
            this._resizer.offset.y = 0
            break
          case Resizable.TopLeft:
            this._resizer.offset.x = resizerRect!.left - dot.x
            this._resizer.offset.y = resizerRect!.top - dot.y
            break
          case Resizable.TopRight:
            this._resizer.offset.x = resizerRect!.right - dot.x
            this._resizer.offset.y = resizerRect!.top - dot.y
            break
          case Resizable.BottomLeft:
            this._resizer.offset.x = resizerRect!.left - dot.x
            this._resizer.offset.y = resizerRect!.bottom - dot.y
            break
          case Resizable.BottomRight:
            this._resizer.offset.x = resizerRect!.right - dot.x
            this._resizer.offset.y = resizerRect!.bottom - dot.y
            break
        }
        this._status = SelectorStatus.ReadyForResizing;
        board.setSelects([shape], true)
      } else {
        this._status = SelectorStatus.ReadyForDragging;
      }
    }
    this.connect(board.selects, x, y);
  }

  /**
   * 指针移动（未按下）：只把鼠标指针样式换成相应的提示（旋转柄 / 缩放控制点 / 可移动）
   *
   * The pointer moved (no button pressed): only switches the CSS cursor to the matching
   * hint (rotate grip / resize handle / movable).
   *
   * @param {IDot} dot 指针位置（画布坐标）/ Pointer position (canvas coordinates)
   */
  pointerMove(dot: IDot): void {
    if (this._rotator.hit(dot)) {
      this.cursor = 'crosshair';
      return;
    }

    const temp = this._picking.hit(dot)
    if (temp) {
      this.cursor = this.getReiszerCursor(temp[0], this._picking);
      return;
    }

    const result = Arrays.firstOf(this.board.selects, it => {
      const { x, y } = it.map2me(dot.x, dot.y).plus(it.data)
      if (it.locked) return null;
      const hit = it.getGeo().hit({ x, y })
      if (!hit) return null;
      const [direction] = it.resizableDirection(dot.x, dot.y)
      return [direction, it] as const
    })
    this.cursor = result ? this.getReiszerCursor(...result) : ''
  }


  private getReiszerCursor(direction: Resizable, shape: Shape) {
    if (!direction || !this.board.shapeResizble) return 'move';
    const a = shape.getRotatedDot(direction);
    a.x -= shape.midX;
    a.y -= shape.midY;
    const d = atan2(a.x, -a.y)
    const which: number = floor(
      Degrees.normalized(0.39269908169872414 + d) / 0.7853981633974483
    ) % 8;
    switch (which) {
      case 0: return 'ns-resize';
      case 4: return 'ns-resize';
      case 2: return 'ew-resize';
      case 6: return 'ew-resize';
      case 3: return 'se-resize';
      case 7: return 'nw-resize';
      case 1: return 'ne-resize';
      case 5: return 'sw-resize';
    }
    return '';
  }

  /**
   * 点选的精确判定：画笔要真的压到笔迹上才算命中（其它图形按包围盒判定）
   *
   * Precise test for clicking: a pen shape only counts when the pointer really lands on
   * its stroke (other shapes are tested by their bounding box).
   *
   * @param {Shape} shape 待判定的图形 / The shape to test
   * @param {IRotatedRect} rect 命中范围 / The hit area
   * @return {boolean} 是否命中 / Whether it was hit
   */
  _pen_in_click = (shape: Shape, rect: IRotatedRect) => {
    // 当点击位置未命中
    if (!ShapePen.is(shape)) return false;
    return this._pen_in_rect(shape, rect)
  }

  /**
   * 框选时画笔的精确判定：笔迹与矩形有交叠才算命中
   *
   * Precise test for pen shapes while marquee-selecting: the stroke has to overlap the rect
   * to count as a hit.
   *
   * @param {Shape} shape 待判定的图形 / The shape to test
   * @param {IRotatedRect} rect 命中范围 / The hit area
   * @return {boolean} 是否命中 / Whether it was hit
   */
  _pen_in_rect = (shape: Shape, rect: IRotatedRect) => {
    if (!ShapePen.is(shape)) return true;
    const lw = shape.lineWidth;
    const rect_r = (rect.r ? RotatedRect : Rect).ensure({
      x: rect.x - lw / 2,
      y: rect.y - lw / 2,
      w: rect.w + lw,
      h: rect.h + lw,
      r: rect.r
    })
    const data = shape.data;
    const { coords, rotation = 0 } = data;
    const src = data.src_rect;
    const ox = shape.x - src.x;
    const oy = shape.y - src.y;
    const dots = rect_r.dots;
    if (ox || oy || rotation) {
      const { x: mx, y: my } = src.mid();
      for (const dot of dots) {
        const map = Vector.rotated2(dot.x - ox, dot.y - oy, mx, my, -rotation);
        dot.x = map.x;
        dot.y = map.y;
      }
    }
    for (let i = 2; i < coords.length; i += 2) {
      const a = coords[i - 2]
      const b = coords[i - 1]
      const c = coords[i + 0]
      const d = coords[i + 1]
      if (
        (i === 2 && Polygon.contain_dot2(dots, a, b)) ||
        Polygon.contain_dot2(dots, c, d) ||
        Polygon.intersect_linesegment(dots, a, b, c, d)
      ) {
        return true
      }
    }
    return false
  }

  /**
   * 拖动：按当前状态执行旋转 / 框选 / 拖动 / 缩放，并随时发出几何变化事件
   *
   * Dragging: runs the rotate / marquee / drag / resize matching the current state and
   * keeps emitting the geometry events as it goes.
   *
   * @param {IDot} dot 指针位置（画布坐标）/ Pointer position (canvas coordinates)
   */
  pointerDraw(dot: IDot): void {
    const board = this.board
    if (!board) return
    switch (this._status) {
      case SelectorStatus.ReadyForRotating: // let it fall-through
        this._status = SelectorStatus.Rotating;
      case SelectorStatus.Rotating:
        this._rotator.pointerDraw(dot);
        this.emitGeoEvent(false);
        break;
      case SelectorStatus.ReadyForSelecting: // let it fall-through
        if (Vector.manhattan(this._prevPos, dot) < 5) { return; }
        this._status = SelectorStatus.Selecting;
      case SelectorStatus.Selecting: {
        this._rectHelper.end(dot.x, dot.y)
        this.updateGeo();
        board.selectAt(this._selector.data, true, this._pen_in_rect);
        return
      }
      case SelectorStatus.ReadyForDragging: // let it fall-through
        if (Vector.manhattan(this._prevPos, dot) < 5) { return; }
        this._status = SelectorStatus.Dragging;
      case SelectorStatus.Dragging: {
        this.move(dot.x, dot.y).emitGeoEvent(false);
        return
      }
      case SelectorStatus.ReadyForResizing: // let it fall-through
        if (Vector.manhattan(this._prevPos, dot) < 5) { return; }
        this._status = SelectorStatus.Resizing;
      case SelectorStatus.Resizing: {
        const { shape, offset, anchor, direction } = this._resizer
        if (!shape) return
        const geo = shape.getGeo()
        const minsize = board.factory.resizer.size * 3
        const { x, y } = shape.map2me(dot.x, dot.y).plus(shape).plus(offset)
        const { left: l, right: r, bottom: b, top: t } = geo
        this.cursor = this.getReiszerCursor(direction, shape);
        switch (direction) {
          case Resizable.Top:
            geo.top = min(y, b - minsize)
            break
          case Resizable.Bottom:
            geo.bottom = max(y, t + minsize)
            break
          case Resizable.Left:
            geo.left = min(x, r - minsize)
            break
          case Resizable.Right:
            geo.right = max(x, l + minsize)
            break
          case Resizable.TopLeft:
            geo.top = min(y, b - minsize)
            geo.left = min(x, r - minsize)
            break
          case Resizable.TopRight:
            geo.top = min(y, b - minsize)
            geo.right = max(x, l + minsize)
            break
          case Resizable.BottomLeft:
            geo.bottom = max(y, t + minsize)
            geo.left = min(x, r - minsize)
            break
          case Resizable.BottomRight:
            geo.bottom = max(y, t + minsize)
            geo.right = max(x, l + minsize)
            break
          default:
            break;
        }
        shape.beginDirty(Rect.pure2(shape))
        shape.geo(geo.x, geo.y, geo.w, geo.h, false);
        const o = Vector.minus(anchor, shape.getRotatedDot(opposites[direction]))
        shape.moveBy(o.x, o.y, false)
        shape.endDirty(Rect.pure2(shape))
        this.emitGeoEvent(false)
        return
      }
    }
  }

  /**
   * 抬起：右键只在「点了一下没拖动」时选中指针下的图形；左键结束手势并发出落定的
   * 几何事件（拖动时顺带做双击判定），最后把选框 / 缩放上下文与状态清干净
   *
   * Released: the secondary button only selects the shape under the pointer when it did not
   * drag; the primary one ends the gesture and emits the settled geometry events (and
   * doubles as the double click test while it was a drag), then everything goes back to
   * Idle.
   *
   * @param {IDot} [_dot] 指针位置（画布坐标，未使用）/ Pointer position (canvas coordinates, unused)
   * @param {number} [button] 按键：0 左键、2 右键 / Button: 0 primary, 2 secondary
   */
  pointerUp(_dot?: IDot, button?: number): void {
    if (button === 2) {
      const hit = this._rightPick
      if (this._status === SelectorStatus.ReadyForSelecting && hit && !hit.selected) {
        this.board.setSelects([hit], true)
      }
      this._rightPick = null
    } else switch (this._status) {
      case SelectorStatus.ReadyForDragging: {
        // 双击判定
        if (!this._doubleClickTimer) {
          this._doubleClickTimer = setTimeout(() => this._doubleClickTimer = 0, 500);
        } else {
          clearTimeout(this._doubleClickTimer);
          this._doubleClickTimer = 0;
          this.doubleClick();
        }
        break;
      }
      case SelectorStatus.Resizing:
        this.resizer.shape?.markDirty()
        // let it fall-throught
      case SelectorStatus.Rotating:
      case SelectorStatus.Dragging: {
        this.emitGeoEvent.enforce(true)
        break;
      }
    }
    /* 拖拽选框 / 调节被恢复前先按旧范围清脏：不标脏会留下残留的选框线 */
    if (this._selector.visible) this._selector.markDirty()
    this._selector.visible = false;
    this._rectHelper.clear();
    this._resizer.reset();
    this._status = SelectorStatus.Idle;
  }

  /**
   * 双击：双击文本时临时切到文本工具编辑它，编辑框失焦后回到选择器
   *
   * Double click: double clicking text switches to the text tool to edit it for a while,
   * and losing focus of the editor goes back to the selector.
   */
  doubleClick() {
    const { board } = this
    if (!board) { return; };

    // 双击某个文本时，切换到文本编辑工具，编辑此文本，当文本编辑框失去焦点时，回到选择器工具；
    if (this._shapes.length && this._shapes[0].shape instanceof ShapeText) {
      board.setToolType(ToolEnum.Text);
      const textTool = board.tool as TextTool;

      textTool.selectorCallback = () => {
        board.setToolType(ToolEnum.Selector);
        textTool.end()
      };
      textTool.editor.addEventListener('blur', textTool.selectorCallback, { once: true });
      textTool.connect(this._shapes[0].shape);
    }
  }

  /**
   * 发几何事件（30fps 节流）：拖动过程中发 ShapesGeoChanging，
   * isLast 为 true 时发落定的 ShapesGeoChanged
   *
   * Emits the geometry events (throttled to 30fps): ShapesGeoChanging while dragging, and
   * the settled ShapesGeoChanged when isLast is true.
   *
   * @param {boolean} isLast 是否为落定那次（true = ShapesGeoChanged）/ Whether this is the final one (true = ShapesGeoChanged)
   */
  emitGeoEvent = throttle(1000 / 30, (isLast: boolean) => {
    const { board, _shapes } = this;
    if (!board || !_shapes.length) return;
    if (isLast) {
      board.emit(EventEnum.ShapesGeoChanged, {
        operator: board.whoami,
        tool: this.type,
        shapeDatas: this._shapes.map(v => [
          Events.pickShapeGeoData(v.shape.data), v.startData
        ] as const)
      });
    } else {
      board.emit(EventEnum.ShapesGeoChanging, {
        operator: board.whoami,
        tool: this.type,
        shapeDatas: this._shapes.map(v => [
          Events.pickShapeGeoData(v.shape.data), v.prevData
        ] as const)
      });
    }
  })

  private updateGeo() {
    const { x, y, w, h } = this._rectHelper.gen()
    this._selector.geo(x, y, w, h)
  }
}

Gaia.registerTool(ToolEnum.Selector, () => new SelectorTool, {
  name: 'Selector',
  desc: 'pick shapes'
})
