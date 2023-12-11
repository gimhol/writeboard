import { RectHelper } from "../../utils/RectHelper"
import { ShapeData } from "../../shape/base/Data"
import { Gaia } from "../../mgr/Gaia"
import { ShapeRect } from "../../shape/rect/Shape"
import { ToolEnum, ToolType } from "../ToolEnum"
import { ResizeDirection, Shape } from "../../shape/base"
import { IVector, Vector } from "../../utils/Vector"
import { IDot } from "../../utils/Dot"
import { ITool } from "../base/Tool"
import { Board } from "../../board"
import { Events } from "../../event/Events"
import { EventEnum } from "../../event"
import { IRect, Rect } from "../../utils/Rect"
import { ShapeText, TextTool } from "../../shape"
import { Arrays, Degrees, Numbers } from "../../utils"
export enum SelectorStatus {
  Invalid = 0,
  ReadyForDragging,
  Dragging,
  ReadyForSelecting,
  Selecting,
  ReadyForResizing,
  Resizing,
}
const Tag = '[SelectorTool]'
export class SelectorTool implements ITool {
  get type(): ToolType { return ToolEnum.Selector }
  private _doubleClickTimer = 0;
  private _rect = new ShapeRect(new ShapeData)
  private _rectHelper = new RectHelper()
  private _status = SelectorStatus.Invalid
  private _prevPos: IVector = { x: 0, y: 0 }
  private _resizerDirection = ResizeDirection.None
  private _resizerAnchor: IVector = { x: 0, y: 0 }
  private _resizingShape?: Shape;
  private _resizerOffset: IVector = { x: 0, y: 0 }
  private _windowPointerDown = () => this.deselect();

  private _shapes: {
    shape: Shape,
    prevData: Events.IShapeGeoData,
    startData: Events.IShapeGeoData,
  }[] = []

  get board(): Board { return this._rect.board!!; }
  set board(v: Board) { this._rect.board = v!!; }
  get rect(): RectHelper { return this._rectHelper }
  constructor() {
    this._rect.data.lineWidth = 2
    this._rect.data.strokeStyle = '#003388FF'
    this._rect.data.fillStyle = '#00338855'
  }
  render(ctx: CanvasRenderingContext2D): void {
    this._rect.render(ctx)
  }
  start(): void {
    this.board.element.style.cursor = ''
    document.addEventListener('pointerdown', this._windowPointerDown)
  }
  end(): void {
    this.board.element.style.cursor = ''
    document.removeEventListener('pointerdown', this._windowPointerDown)
    this.deselect();
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
      }
      if (startX === undefined) {
        x = x === undefined ? v.data.x : Math.min(x, v.data.x);
        y = y === undefined ? v.data.y : Math.min(y, v.data.y);
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
    this._shapes.forEach(v => {
      v.prevData = Events.pickShapePosData(v.shape.data)
      !v.shape.locked && v.shape.moveBy(diffX, diffY)
    })
    return this;
  }

  pointerDown(dot: IDot): void {
    const { board, _status } = this
    if (!board || _status !== SelectorStatus.Invalid) {
      return;
    }

    const { x, y } = dot
    this._rectHelper.start(x, y)
    this.updateGeo()
    const shapes = board.hits({ x, y, w: 0, h: 0 }); // 点击位置的全部图形
    let shape: Shape | undefined;
    for (let i = 0; i < shapes.length; ++i) { // 找到距离用户最近的未锁定图形
      if (!shapes[i].locked) {
        shape = shapes[i];
        break;
      }
    }

    if (!shape || shape.locked) {
      // 点击的位置无任何未锁定图形，则框选图形, 并取消选择以选择的图形
      this._status = SelectorStatus.ReadyForSelecting;
      this._rect.visible = true;
      this.deselect();
    } else if (!shape.selected) {
      // 点击位置存在图形，且图形未被选择，则选择点中的图形。
      this._status = SelectorStatus.ReadyForDragging;
      board.setSelects([shape], true)
    } else {
      // 点击位置存在图形，且图形已被选择，则判断是否点击尺寸调整。
      const dot = shape.map2me(x, y).plus(shape.data)
      const [direction, resizerRect] = shape.resizeDirection(dot.x, dot.y);
      if (direction) {
        this._resizerDirection = direction;
        this._resizingShape = shape
        switch (direction) {
          case ResizeDirection.Top:
            this._resizerOffset.x = 0
            this._resizerOffset.y = resizerRect!.top - dot.y
            this._resizerAnchor = shape.rotatedMidBottom;
            break
          case ResizeDirection.Bottom:
            this._resizerOffset.x = 0
            this._resizerOffset.y = resizerRect!.bottom - dot.y
            this._resizerAnchor = shape.rotatedMidTop;
            break
          case ResizeDirection.Left:
            this._resizerOffset.x = resizerRect!.left - dot.x
            this._resizerOffset.y = 0
            this._resizerAnchor = shape.rotatedMidRight;
            break
          case ResizeDirection.Right:
            this._resizerOffset.x = resizerRect!.right - dot.x
            this._resizerOffset.y = 0
            this._resizerAnchor = shape.rotatedMidLeft;
            break
          case ResizeDirection.TopLeft:
            this._resizerOffset.x = resizerRect!.left - dot.x
            this._resizerOffset.y = resizerRect!.top - dot.y
            this._resizerAnchor = shape.rotatedBottomRight;
            break
          case ResizeDirection.TopRight:
            this._resizerOffset.x = resizerRect!.right - dot.x
            this._resizerOffset.y = resizerRect!.top - dot.y
            this._resizerAnchor = shape.rotatedBottomLeft;
            break
          case ResizeDirection.BottomLeft:
            this._resizerOffset.x = resizerRect!.left - dot.x
            this._resizerOffset.y = resizerRect!.bottom - dot.y
            this._resizerAnchor = shape.rotatedTopRight;
            break
          case ResizeDirection.BottomRight:
            this._resizerOffset.x = resizerRect!.right - dot.x
            this._resizerOffset.y = resizerRect!.bottom - dot.y
            this._resizerAnchor = shape.rotatedTopLeft;
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
    const result = Arrays.find(this.board.selects, it => {
      const { x, y } = it.map2me(dot.x, dot.y).plus(it.data)
      const [direction] = it.resizeDirection(x, y)
      if (direction != ResizeDirection.None) return [direction, it] as const
    })
    let cursor: string = '';
    if (result) {
      const [direction, shape] = result;
      let { rotation: deg } = shape
      const { x, y } = shape.map2me(dot.x, dot.y).plus(shape.data)
      deg = Degrees.normalized(deg + (direction - 1) * 0.25 * Math.PI);
      switch (Math.floor((25 + Degrees.angle(deg)) / 45) % 8) {
        case 0: case 4: cursor = 'ns-resize'; break;
        case 2: case 6: cursor = 'ew-resize'; break;
        case 3: case 7: cursor = 'nw-resize'; break;
        case 1: case 5: cursor = 'ne-resize'; break;
      }
    }
    this.board.element.style.cursor = cursor;
  }

  pointerDraw(dot: IDot): void {
    const board = this.board
    if (!board) return
    switch (this._status) {
      case SelectorStatus.ReadyForSelecting: // let it fall-through
        if (Vector.manhattan(this._prevPos, dot) < 5) { return; }
        this._status = SelectorStatus.Selecting;
      case SelectorStatus.Selecting: {
        this._rectHelper.end(dot.x, dot.y)
        this.updateGeo();
        board.selectAt(this._rect.data, true);
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
        const shape = this._resizingShape!
        const geo = shape.getGeo()
        const rs = board.factory.resizer.size
        const { y: roy, x: rox } = this._resizerOffset
        const { x, y } = shape.map2me(dot.x, dot.y).plus(shape)
        {
          const { left: l, right: r, bottom: b, top: t } = geo
          switch (this._resizerDirection) {
            case ResizeDirection.Top:
              geo.top = Math.min(roy + y, b - rs * 2)
              break
            case ResizeDirection.Bottom:
              geo.bottom = Math.max(roy + y, t + rs * 2)
              break
            case ResizeDirection.Left:
              geo.left = Math.min(rox + x, r - rs * 2)
              break
            case ResizeDirection.Right:
              geo.right = Math.max(rox + x, l + rs * 2)
              break
            case ResizeDirection.TopLeft:
              geo.top = Math.min(roy + y, b - rs * 2)
              geo.left = Math.min(rox + x, r - rs * 2)
              break
            case ResizeDirection.TopRight:
              geo.top = Math.min(roy + y, b - rs * 2)
              geo.right = Math.max(rox + x, l + rs * 2)
              break
            case ResizeDirection.BottomLeft:
              geo.bottom = Math.max(roy + y, t + rs * 2)
              geo.left = Math.min(rox + x, r - rs * 2)
              break
            case ResizeDirection.BottomRight:
              geo.bottom = Math.max(roy + y, t + rs * 2)
              geo.right = Math.max(rox + x, l + rs * 2)
              break
          }
        }
        const degree: number = shape.data.r ?? 0
        let direction: number = degree
        const { x: x1, y: y1, w: w1, h: h1 } = shape.data
        const { x: bx1, y: by1, w: bw1, h: bh1 } = shape.boundingRect()
        shape.markDirty()
        // shape.data.x = geo.x
        // shape.data.y = geo.y
        // shape.data.w = geo.w
        // shape.data.h = geo.h
        // const { x: x2, y: y2, w: w2, h: h2 } = shape.data
        // const { x: bx2, y: by2, w: bw2, h: bh2 } = shape.boundingRect()

        console.log('achor: ', this._resizerAnchor)
        direction = Degrees.normalized(degree + (this._resizerDirection - 1) * 0.25 * Math.PI);

        let midX = 0
        let midY = 0
        const sr = Math.sin(degree)
        const cr = Math.cos(degree)
        switch (this._resizerDirection) {
          case ResizeDirection.Top:
            midX = this._resizerAnchor.x + sr * geo.h / 2
            midY = this._resizerAnchor.y - cr * geo.h / 2
            break
          case ResizeDirection.Bottom:
            midX = this._resizerAnchor.x - sr * geo.h / 2
            midY = this._resizerAnchor.y + cr * geo.h / 2
            break
          case ResizeDirection.Right:
            midX = this._resizerAnchor.x + cr * geo.w / 2
            midY = this._resizerAnchor.y + sr * geo.w / 2
            break
          case ResizeDirection.Left: {
            midX = this._resizerAnchor.x - cr * geo.w / 2
            midY = this._resizerAnchor.y - sr * geo.w / 2
          }
          case ResizeDirection.TopRight: {
            const l = Math.sqrt(geo.w * geo.w + geo.h * geo.h)
            const s = degree - Math.atan2(geo.h, geo.w)
            const sr = Math.sin(s)
            const cr = Math.cos(s)
            midX = this._resizerAnchor.x + cr * l / 2
            midY = this._resizerAnchor.y + sr * l / 2
            break
          }
          case ResizeDirection.BottomLeft: {
            const l = Math.sqrt(geo.w * geo.w + geo.h * geo.h)
            const s = degree - Math.atan2(geo.h, geo.w)
            const sr = Math.sin(s)
            const cr = Math.cos(s)
            midX = this._resizerAnchor.x - cr * l / 2
            midY = this._resizerAnchor.y - sr * l / 2
            break
          }
          case ResizeDirection.TopLeft: {
            const l = Math.sqrt(geo.w * geo.w + geo.h * geo.h)
            const s = degree + Math.atan2(geo.h, geo.w)
            const sr = Math.sin(s)
            const cr = Math.cos(s)
            midX = this._resizerAnchor.x - cr * l / 2
            midY = this._resizerAnchor.y - sr * l / 2
            break
          }
          case ResizeDirection.BottomRight: {
            const l = Math.sqrt(geo.w * geo.w + geo.h * geo.h)
            const s = degree + Math.atan2(geo.h, geo.w)
            const sr = Math.sin(s)
            const cr = Math.cos(s)
            midX = this._resizerAnchor.x + cr * l / 2
            midY = this._resizerAnchor.y + sr * l / 2
            break
          }
        }

        shape.data.x = midX - geo.w / 2
        shape.data.y = midY - geo.h / 2
        shape.data.w = geo.w
        shape.data.h = geo.h
        shape.markDirty()
        this.emitGeoEvent(false)
        return
      }
    }
  }

  pointerUp(): void {
    if (this._status === SelectorStatus.ReadyForDragging) {
      // 双击判定
      if (!this._doubleClickTimer) {
        this._doubleClickTimer = setTimeout(() => this._doubleClickTimer = 0, 500);
      } else {
        clearTimeout(this._doubleClickTimer);
        this._doubleClickTimer = 0;
        this.doubleClick();
      }
    }
    if (this._status === SelectorStatus.Dragging) {
      this.emitGeoEvent(true)
    }
    this._rect.visible = false
    this._rectHelper.clear()
    this._status = SelectorStatus.Invalid
  }

  doubleClick() {
    const { board } = this
    if (!board) { return; };

    // 双击某个文本时，切换到文本编辑工具，编辑此文本，当文本编辑框失去焦点时，回到选择器工具；
    if (this._shapes.length && this._shapes[0].shape instanceof ShapeText) {
      board.setToolType(ToolEnum.Text);
      const textTool = board.tool as TextTool;

      textTool.selectorCallback = () => board.setToolType(ToolEnum.Selector);
      textTool.editor.addEventListener('blur', textTool.selectorCallback, { once: true });
      textTool.connect(this._shapes[0].shape);
    }
  }
  private _waiting = false
  emitGeoEvent(immediate: boolean): void {
    if (this._waiting && !immediate)
      return
    this._waiting = true
    const board = this.board
    if (!board) return
    board.emitEvent(EventEnum.ShapesGeoChanging, {
      operator: board.whoami,
      tool: this.type,
      shapeDatas: this._shapes.map(v => {
        const ret: [Events.IShapeGeoData, Events.IShapeGeoData] = [
          Events.pickShapeGeoData(v.shape.data), v.prevData
        ]
        return ret
      })
    });
    setTimeout(() => { this._waiting = false }, 1000 / 30)

    if (immediate) {
      board.emitEvent(EventEnum.ShapesGeoChanged, {
        operator: board.whoami,
        tool: this.type,
        shapeDatas: this._shapes.map(v => {
          const ret: [Events.IShapeGeoData, Events.IShapeGeoData] = [
            Events.pickShapeGeoData(v.shape.data), v.startData
          ]
          return ret
        })
      });
    }
  }
  private updateGeo() {
    const { x, y, w, h } = this._rectHelper.gen()
    this._rect.geo(x, y, w, h)
  }
}

Gaia.registerTool(ToolEnum.Selector, () => new SelectorTool, {
  name: 'Selector',
  desc: 'pick shapes'
})
