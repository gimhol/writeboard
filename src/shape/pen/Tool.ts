import { WhiteBoard } from "../../board/WhiteBoard"
import { ToolEnum } from "../../tools/ToolEnum"
import { FactoryMgr } from "../../mgr/FactoryMgr"
import { ShapePen } from "./Shape"
import { ShapeEnum } from "../ShapeEnum"
import { ShapesChangedEvent } from "../../event/Events"
import { DotsType, PenData } from "./Data"
import { IDot } from "../../utils/Dot"
import { ITool } from "../../tools/base/Tool"
const Tag = '[PenTool]'
export class PenTool implements ITool {
  start(): void {
  }
  end(): void {
    delete this._curShape
  }
  get type(): string { return ToolEnum.Pen }

  render(): void { }
  get board(): WhiteBoard | undefined {
    return this._board
  }
  set board(v: WhiteBoard | undefined) {
    this._board = v
  }
  addDot(dot: IDot, type?: 'first' | 'last') {
    const shape = this._curShape
    const board = this.board
    if (!shape || !board) return
    if (this._prevData)
      return shape.appendDot(dot, type)

    const emitEvent = () => {
      const prev = this._prevData
      if (!prev) return
      const curr = shape.data.copy()
      curr.dotsType = DotsType.Append
      curr.coords.splice(0, prev.coords.length)
      board.emit(new ShapesChangedEvent(this.type, { shapeDatas: [[curr, prev]] }))
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
  pointerMove(dot: IDot): void { }
  pointerDown(dot: IDot): void {
    const board = this.board
    if (!board) return
    this._curShape = board.factory.newShape(ShapeEnum.Pen) as ShapePen
    this._curShape.data.layer = board.currentLayer().info.name;
    this._curShape.data.editing = true
    board.add(this._curShape)
    this.addDot(dot, 'first')
  }
  pointerDraw(dot: IDot): void {
    this.addDot(dot)
  }
  pointerUp(dot: IDot): void {
    const shape = this._curShape
    if (shape)
      shape.data.editing = false
    this.addDot(dot, 'last')
    this.end()
  }
  private _prevData: PenData | undefined
  private _curShape: ShapePen | undefined
  private _board: WhiteBoard | undefined
}

FactoryMgr.registerTool(ToolEnum.Pen,
  () => new PenTool(),
  { name: 'pen', desc: 'simple pen', shape: ShapeEnum.Pen })