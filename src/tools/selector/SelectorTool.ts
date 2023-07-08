import { RectHelper } from "../../utils/RectHelper"
import { ShapeData } from "../../shape/base/Data"
import { Gaia } from "../../mgr/Gaia"
import { ShapeRect } from "../../shape/rect/Shape"
import { ToolEnum, ToolType } from "../ToolEnum"
import { Shape } from "../../shape/base"
import { IVector, Vector } from "../../utils/Vector"
import { IDot } from "../../utils/Dot"
import { ITool } from "../base/Tool"
import { Board } from "../../board"
import { Events } from "../../event/Events"
import { EventEnum } from "../../event"
import { IRect, Rect } from "../../utils/Rect"
import { ShapeText, TextTool } from "../../shape"
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
  private _resizerRect?: Rect;

  private _shapes: {
    shape: Shape,
    prevData: Events.IShapePositionData
  }[] = []

  get board(): Board | undefined { return this._rect.board; }
  set board(v: Board | undefined) { this._rect.board = v; }
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
  }
  end(): void {
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
        y: v.data.y
      }
      if (startX === undefined) {
        x = x === undefined ? v.data.x : Math.min(x, v.data.x);
        y = y === undefined ? v.data.y : Math.min(y, v.data.y);
      }
      return {
        shape: v,
        prevData: data
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
      v.prevData = Events.pickShapePositionData(v.shape.data)
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
    for (let i = 0; i <= shapes.length; ++i) { // 找到距离用户最近的未锁定图形
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
      const [direction, resizerRect] = shape.resizeDirection(dot.x, dot.y);
      if (direction) {
        this._resizerRect = resizerRect;
        this._status = SelectorStatus.ReadyForResizing;
        board.setSelects([shape], true)
      } else {
        this._status = SelectorStatus.ReadyForDragging;
      }
    }
    this.connect(board.selects, x, y);
  }
  pointerMove(): void { }
  pointerDraw(dot: IDot): void {
    const board = this.board
    if (!board) return
    switch (this._status) {
      case SelectorStatus.ReadyForSelecting: // let it fall-through
        if (Vector.manhattan(this._prevPos, dot) < 5) { return; }
      case SelectorStatus.Selecting: {
        this._status = SelectorStatus.Selecting;
        this._rectHelper.end(dot.x, dot.y)
        this.updateGeo();
        board.selectAt(this._rect.data, true);
        return
      }
      case SelectorStatus.ReadyForDragging: // let it fall-through
        if (Vector.manhattan(this._prevPos, dot) < 5) { return; }
      case SelectorStatus.Dragging: {
        this._status = SelectorStatus.Dragging;
        this.move(dot.x, dot.y).emitMovedEvent(false);
        return
      }
      case SelectorStatus.ReadyForResizing: // let it fall-through
        if (Vector.manhattan(this._prevPos, dot) < 5) { return; }
      case SelectorStatus.Resizing: {
        this._status = SelectorStatus.Resizing;
        this.emitMovedEvent(false)
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
      this.emitMovedEvent(true)
    }
    this._rect.visible = false
    this._rectHelper.clear()
    this._status = SelectorStatus.Invalid
  }
  doubleClick() {
    const { board } = this
    if (!board) { return; };
    console.log(this._shapes.length)

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
  emitMovedEvent(immediately: boolean): void {
    if (this._waiting && !immediately)
      return
    this._waiting = true
    const board = this.board
    if (!board) return
    board.emitEvent(EventEnum.ShapesMoved, {
      shapeDatas: this._shapes.map(v => {
        const ret: [Events.IShapePositionData, Events.IShapePositionData] = [
          Events.pickShapePositionData(v.shape.data), v.prevData
        ]
        return ret
      })
    });
    setTimeout(() => { this._waiting = false }, 1000 / 30)
  }
  private updateGeo() {
    const { x, y, w, h } = this._rectHelper.gen()
    this._rect.geo(x, y, w, h)
  }
}

Gaia.registerTool(ToolEnum.Selector, () => new SelectorTool, {
  name: 'selector',
  desc: 'selector'
})
