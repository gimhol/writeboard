import { RectHelper } from "../../utils/RectHelper"
import { ShapeData } from "../../shape/base/Data"
import { Gaia } from "../../mgr/Gaia"
import { ShapeRect } from "../../shape/rect/Shape"
import { ToolEnum, ToolType } from "../ToolEnum"
import { Shape } from "../../shape/base"
import { IVector } from "../../utils/Vector"
import { IDot } from "../../utils/Dot"
import { ITool } from "../base/Tool"
import { Board } from "../../board"
import { Events } from "../../event/Events"
import { EventEnum } from "../../event"
import { Rect } from "../../utils/Rect"
export enum SelectorStatus {
  Invalid = 0,
  Dragging = 1,
  Selecting = 2,
  Resizing = 3,
}
const Tag = '[SelectorTool]'
export class SelectorTool implements ITool {
  get type(): ToolType { return ToolEnum.Selector }
  private _rect = new ShapeRect(new ShapeData)
  private _rectHelper = new RectHelper()
  private _status = SelectorStatus.Invalid
  private _prevPos: IVector = { x: 0, y: 0 }
  private _resizerRect?: Rect;

  private _shapes: {
    shape: Shape,
    prevData: Events.IShapePositionData
  }[] = []
  get board(): Board | undefined {
    return this._rect.board
  }
  set board(v: Board | undefined) {
    this._rect.board = v
  }
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
    const shapes = board.deselect();
    if (shapes.length) {
      board.emitEvent(EventEnum.ShapesDeselected, shapes.map(v => v.data));
    }
  }
  pointerDown(dot: IDot): void {
    const { x, y } = dot
    this._prevPos = { x, y }
    const board = this.board
    if (!board) return
    switch (this._status) {
      case SelectorStatus.Invalid:
        this._rectHelper.start(x, y)
        this.updateGeo()
        const shape = board.hit({ x, y, w: 0, h: 0 });
        if (!shape) {
          // 点击的位置无任何图形，则框选图形, 并取消选择以选择的图形
          this._status = SelectorStatus.Selecting;
          this._rect.visible = true;
          this.deselect();
        } else if (!shape.selected) {
          // 点击位置存在图形，且图形未被选择，则选择点中的图形。
          this._status = SelectorStatus.Dragging;
          const [selecteds, deselecteds] = board.setSelects([shape])
          selecteds.length && board.emitEvent(EventEnum.ShapesSelected, selecteds.map(v => v.data));
          deselecteds.length && board.emitEvent(EventEnum.ShapesDeselected, deselecteds.map(v => v.data));

        } else {
          // 点击位置存在图形，且图形已被选择，则判断是否点击尺寸调整。
          const [direction, resizerRect] = shape.resizeDirection(dot.x, dot.y);
          if (direction) {
            this._resizerRect = resizerRect;
            this._status = SelectorStatus.Resizing;
            const [selecteds, deselecteds] = board.setSelects([shape])
            selecteds.length && board.emitEvent(EventEnum.ShapesSelected, selecteds.map(v => v.data));
            deselecteds.length && board.emitEvent(EventEnum.ShapesDeselected, deselecteds.map(v => v.data));
          } else {
            this._status = SelectorStatus.Dragging;
          }
        }
        this._shapes = board.selects.map(v => {
          const data = {
            i: v.data.i,
            x: v.data.x,
            y: v.data.y
          }
          return {
            shape: v,
            prevData: data
          }
        })
        return
    }
  }
  pointerMove(): void { }
  pointerDraw(dot: IDot): void {
    const diffX = dot.x - this._prevPos.x
    const diffY = dot.y - this._prevPos.y
    this._prevPos = dot
    const board = this.board
    if (!board) return
    switch (this._status) {
      case SelectorStatus.Selecting: {
        this._rectHelper.end(dot.x, dot.y)
        this.updateGeo();
        const [selecteds, deselecteds] = board.selectAt(this._rect.data)
        selecteds.length && board.emitEvent(EventEnum.ShapesSelected, selecteds.map(v => v.data));
        deselecteds.length && board.emitEvent(EventEnum.ShapesDeselected, deselecteds.map(v => v.data));
        return
      }
      case SelectorStatus.Dragging: {
        this._shapes.forEach(v => {
          v.prevData = Events.pickShapePositionData(v.shape.data)
          v.shape.moveBy(diffX, diffY)
        })
        this.emitEvent(false)
        return
      }
      case SelectorStatus.Resizing: {
        // TODO: RESIZE SHAPE AND EMIT EVENT HERE -GIM
        // this._shapes.forEach(v => {
        //   v.prevData = Events.pickShapePositionData(v.shape.data)
        //   v.shape.moveBy(diffX, diffY)
        // })
        this.emitEvent(false)
        return
      }
    }
  }
  private _waiting = false
  private emitEvent(immediately: boolean): void {
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
  pointerUp(): void {
    this._status = SelectorStatus.Invalid
    this._rect.visible = false
    this._rectHelper.clear()
    this.emitEvent(true)
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
