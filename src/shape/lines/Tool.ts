import { Board } from "../../board/Board"
import { ToolEnum } from "../../tools/ToolEnum"
import { FactoryMgr } from "../../mgr/FactoryMgr"
import { ShapeStraightLine } from "./Shape"
import { ShapeEnum } from "../ShapeEnum"
import { LinesData } from "./Data"
import { IDot } from "../../utils/Dot"
import { ITool } from "../../tools/base/Tool"
import { WhiteBoardEvent } from "../../event"
const Tag = '[LinesTool]'
export class LinesTool implements ITool {
  private _pressingShift = false;
  private _keydown = (e: KeyboardEvent) => {
    if (e.key === 'Shift') {
      this._pressingShift = true;
    }
  }
  private _keyup = (e: KeyboardEvent) => {
    if (e.key === 'Shift') {
      this._pressingShift = false;
    }
  }
  private _blur = (e: Event) => {
    this._pressingShift = false;
  }
  start(): void {
    window.addEventListener('keydown', this._keydown, true);
    window.addEventListener('keyup', this._keyup, true);
    window.addEventListener('blur', this._blur, true);
  }
  end(): void {
    window.removeEventListener('keydown', this._keydown, true);
    window.removeEventListener('keyup', this._keyup, true);
    window.addEventListener('blur', this._blur, true);
  }

  get type(): string { return ToolEnum.Lines }

  render(): void { }
  get board(): Board | undefined {
    return this._board
  }
  set board(v: Board | undefined) {
    this._board = v
  }
  addDot(dot: IDot, type?: 'first') {
    const shape = this._curShape
    const board = this.board
    if (!shape || !board) return
    if (this._prevData)
      return shape.appendDot(dot, type);

    const emitEvent = () => {
      const prev = this._prevData
      if (!prev) return
      const curr = shape.data.copy()
      curr.coords.splice(0, prev.coords.length)
      board.dispatchEvent(
        WhiteBoardEvent.shapesChanged({ shapeType: this.type, shapeDatas: [[curr, prev]] })
      )
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
  moveDot(dot: IDot) {
    const shape = this._curShape
    const board = this.board
    if (!shape || !board) return
    if (this._prevData)
      return shape.editDot(dot);

    const emitEvent = () => {
      const prev = this._prevData
      if (!prev) return
      const curr = shape.data.copy()
      curr.coords.splice(0, prev.coords.length)
      board.dispatchEvent(
        WhiteBoardEvent.shapesChanged({ shapeType: this.type, shapeDatas: [[curr, prev]] })
      )
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

  pointerMove(dot: IDot): void {
    if (this._curShape) {
      this.moveDot(dot);
    }
  }
  pointerDown(dot: IDot): void {
    const board = this.board
    if (!board) { return; }
    if (!this._curShape) {
      this._curShape = board.factory.newShape(ShapeEnum.Lines) as ShapeStraightLine
      this._curShape.data.layer = board.layer().id;
      this._curShape.data.editing = true
      board.add(this._curShape);
      this.addDot(dot, 'first');
    }
    this.addDot(dot)
  }
  pointerDraw(dot: IDot): void {
    this.moveDot(dot);
  }
  pointerUp(dot: IDot): void {
    const shape = this._curShape;
    if (!shape) { return; }
    if (!this._pressingShift) {
      shape.data.editing = false;
      delete this._curShape;
    } else {
      this.addDot(dot)
    }
  }
  private _prevData: LinesData | undefined
  private _curShape: ShapeStraightLine | undefined
  private _board: Board | undefined
}

FactoryMgr.registerTool(ToolEnum.Lines,
  () => new LinesTool(),
  { name: 'lines', desc: 'lines', shape: ShapeEnum.Lines })