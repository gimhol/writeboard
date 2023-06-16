import { RectHelper } from "../../utils/RectHelper"
import { ShapeData } from "../../shape/base/Data"
import { FactoryMgr } from "../../mgr/FactoryMgr"
import { ShapeRect } from "../../shape/rect/Shape"
import { ToolEnum, ToolType } from "../ToolEnum"
import { Shape } from "../../shape/base"
import { IVector } from "../../utils/Vector"
import { IDot } from "../../utils/Dot"
import { ITool } from "../base/Tool"
import { Board } from "../../board"
import { WhiteBoardEvent } from "../../event/Events"
export enum SelectorStatus {
  Invalid = 'SELECTOR_STATUS_INVALID',
  Dragging = 'SELECTOR_STATUS_DRAGGING',
  Selecting = 'SELECTOR_STATUS_SELECTING',
}
const Tag = '[SelectorTool]'
export class SelectorTool implements ITool {
  get type(): ToolType { return ToolEnum.Selector }
  private _rect = new ShapeRect(new ShapeData)
  private _rectHelper = new RectHelper()
  private _status = SelectorStatus.Invalid
  private _prevPos: IVector = { x: 0, y: 0 }
  private _shapes: {
    shape: Shape,
    prevData: WhiteBoardEvent.IShapePositionData
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
    this.board?.deselect()
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
        let shape = board.hit({ x, y, w: 0, h: 0 })
        if (!shape || !shape.selected)
          shape = board.selectNear({ x, y, w: 0, h: 0 })
        if (shape) {
          this._status = SelectorStatus.Dragging
        } else {
          this._status = SelectorStatus.Selecting
          this._rect.visible = true
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
        this.updateGeo()
        board.selectAt(this._rect.data)
        return
      }
      case SelectorStatus.Dragging: {
        this._shapes.forEach(v => {
          v.prevData = WhiteBoardEvent.pickShapePositionData(v.shape.data)
          v.shape.moveBy(diffX, diffY)
        })
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
    board.dispatchEvent(WhiteBoardEvent.shapesMoved({
      shapeDatas: this._shapes.map(v => {
        return [WhiteBoardEvent.pickShapePositionData(v.shape.data), v.prevData]
      })
    }))
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

FactoryMgr.registerTool(ToolEnum.Selector, () => new SelectorTool, {
  name: 'selector',
  desc: 'selector'
})
