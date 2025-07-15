import { Board } from "../../board"
import { EventEnum } from "../../event"
import { Events } from "../../event/Events"
import { Gaia } from "../../mgr/Gaia"
import { ShapePen, ShapeText, TextTool } from "../../shape"
import { degrees, opposites, Resizable, Shape } from "../../shape/base"
import { Arrays, Degrees, IRotatedRect, Polygon, Rect, RotatedRect } from "../../utils"
import { IDot } from "../../utils/Dot"
import { IVector } from "../../utils/IVector"
import { RectHelper } from "../../utils/RectHelper"
import { throttle } from "../../utils/Throttle"
import { Vector } from "../../utils/Vector"
import { ToolEnum, ToolType } from "../ToolEnum"
import { ITool } from "../base/Tool"
import { ShapePicking } from "./ShapePicking"
import { ShapeRotator } from "./ShapeRotator"
import { ShapeSelector } from "./ShapeSelector"
export enum SelectorStatus {
  Idle = 0,
  ReadyForDragging,
  Dragging,
  ReadyForSelecting,
  Selecting,
  ReadyForResizing,
  Resizing,
  ReadyForRotating,
  Rotating,
}
export class SelectorTool implements ITool {
  get type(): ToolType { return ToolEnum.Selector }
  private _doubleClickTimer = 0;
  private _picking = new ShapePicking()
  private _selector = new ShapeSelector()
  private _rectHelper = new RectHelper()
  private _status = SelectorStatus.Idle
  private _prevPos: IVector = { x: 0, y: 0 }
  private _resizer = {
    direction: Resizable.None,
    anchor: { x: 0, y: 0 },
    offset: { x: 0, y: 0 },
    shape: <Shape | null>null
  }
  private _rotator = new ShapeRotator()
  private _windowPointerDown = () => this.deselect();

  private _shapes: {
    shape: Shape,
    prevData: Events.IShapeGeoData,
    startData: Events.IShapeGeoData,
  }[] = []

  get board(): Board { return this._selector.board!!; }
  set board(v: Board) {
    this._selector.board = v;
    this._rotator.board = v;
    this._picking.board = v;
    v.addEventListener(EventEnum.ShapesSelected, this.onSelectChanged)
    v.addEventListener(EventEnum.ShapesDeselected, this.onSelectChanged)
  }
  private onSelectChanged = () => {
    this._picking.reset();
    const { selects } = this.board;
    if (selects.length > 1) {
      this._picking.setShapes(selects);
      this._rotator.follow(this._picking);
    } else if (selects.length == 1) {
      this._rotator.follow(selects[0])
    } else {
      this._picking.reset();
    }
  }

  get rect(): RectHelper { return this._rectHelper }

  set cursor(v: string) {
    this.board.element.style.cursor = v;
  }

  render(ctx: CanvasRenderingContext2D): void {
    this._selector.render(ctx)
    this._rotator.render(ctx)
    this._picking.render(ctx)
  }
  start(): void {
    this.board.element.style.cursor = ''
    document.addEventListener('pointerdown', this._windowPointerDown)
  }
  end(): void {
    this.board.element.style.cursor = ''
    document.removeEventListener('pointerdown', this._windowPointerDown)
    this.deselect();
    this._rotator.unfollow()
  }
  deselect() {
    const { board } = this;
    if (!board) { return; }
    board.deselect(true);
  }
  connect(shapes: Shape[]): this;
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
        x = x === void 0 ? v.data.x : Math.min(x, v.data.x);
        y = y === void 0 ? v.data.y : Math.min(y, v.data.y);
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

  move(curX: number, curY: number): this {
    return this.moveBy(
      curX - this._prevPos.x,
      curY - this._prevPos.y
    );
  }

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

  pointerDown(dot: IDot): void {
    const { board, _status } = this
    if (_status !== SelectorStatus.Idle) return;

    const { x, y } = dot
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
    const d = Math.atan2(a.x, -a.y)
    const which: number = Math.floor(
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

  _pen_in_click = (shape: Shape, rect: IRotatedRect) => {
    // 当点击位置未命中
    if (!ShapePen.is(shape)) return false;
    return this._pen_in_rect(shape, rect)
  }

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
    const { dots } = rect_r;
    const { coords } = shape.data;
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
    console.log('' + rect_r, '' + new Vector(coords[0], coords[1]))
    return false
  }

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
        const rs = board.factory.resizer.size
        const { x, y } = shape.map2me(dot.x, dot.y).plus(shape).plus(offset)
        const { left: l, right: r, bottom: b, top: t } = geo
        this.cursor = this.getReiszerCursor(direction, shape);
        switch (direction) {
          case Resizable.Top:
            geo.top = Math.min(y, b - rs * 3)
            break
          case Resizable.Bottom:
            geo.bottom = Math.max(y, t + rs * 3)
            break
          case Resizable.Left:
            geo.left = Math.min(x, r - rs * 3)
            break
          case Resizable.Right:
            geo.right = Math.max(x, l + rs * 3)
            break
          case Resizable.TopLeft:
            geo.top = Math.min(y, b - rs * 3)
            geo.left = Math.min(x, r - rs * 3)
            break
          case Resizable.TopRight:
            geo.top = Math.min(y, b - rs * 3)
            geo.right = Math.max(x, l + rs * 3)
            break
          case Resizable.BottomLeft:
            geo.bottom = Math.max(y, t + rs * 3)
            geo.left = Math.min(x, r - rs * 3)
            break
          case Resizable.BottomRight:
            geo.bottom = Math.max(y, t + rs * 3)
            geo.right = Math.max(x, l + rs * 3)
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

  pointerUp(): void {
    switch (this._status) {
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
      case SelectorStatus.Rotating:
      case SelectorStatus.Resizing:
      case SelectorStatus.Dragging: {
        this.emitGeoEvent.enforce(true)
        break;
      }
    }
    this._selector.visible = false
    this._rectHelper.clear()
    this._status = SelectorStatus.Idle
  }

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

  emitGeoEvent = throttle(1000 / 30, (isLast: boolean) => {
    const { board, _shapes } = this;
    if (!board || !_shapes.length) return;
    if (isLast) {
      board.emitEvent(EventEnum.ShapesGeoChanged, {
        operator: board.whoami,
        tool: this.type,
        shapeDatas: this._shapes.map(v => [
          Events.pickShapeGeoData(v.shape.data), v.startData
        ] as const)
      });
    } else {
      board.emitEvent(EventEnum.ShapesGeoChanging, {
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
