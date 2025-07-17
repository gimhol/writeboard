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
export class PenTool implements ITool {
  readonly type: string = ToolEnum.Pen
  board: Board | undefined = void 0;

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
    this._curShape = board.factory.newShape(ShapeEnum.Pen) as ShapePen
    this._curShape.data.layer = board.layer().id;
    this._curShape.data.editing = true
    board.add(this._curShape, true)
    this.addDot(dot, 'first')
  }
  pointerDraw(dot: IDot): void {
    this.addDot(dot, 'mid')
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