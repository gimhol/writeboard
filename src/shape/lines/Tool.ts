import { Board } from "../../board/Board"
import { ToolEnum } from "../../tools/ToolEnum"
import { Gaia } from "../../mgr/Gaia"
import { ShapeLines } from "./Shape"
import { ShapeEnum } from "../ShapeEnum"
import { LinesData } from "./Data"
import { IDot } from "../../utils/Dot"
import { ITool } from "../../tools/base/Tool"
import { EventEnum, Events } from "../../event"
const Tag = '[LinesTool]'
export class LinesTool implements ITool {
  private _pressingShift = false;
  private _pressingControl = false;
  private _keydown = (e: KeyboardEvent) => {
    if (e.key === 'Shift') {
      this._pressingShift = true;
    } else if (e.key === 'Control') {
      this._pressingControl = true;
    }
  }
  private _keyup = (e: KeyboardEvent) => {
    if (e.key === 'Shift') {
      this._pressingShift = false;
    } else if (e.key === 'Control') {
      this._pressingControl = false;
    }
  }
  private _blur = (e: Event) => {
    this._pressingShift = false;
    this._pressingControl = false;
  }
  start(): void {
    window.addEventListener('keydown', this._keydown, true);
    window.addEventListener('keyup', this._keyup, true);
    window.addEventListener('blur', this._blur, true);
  }
  end(): void {
    window.removeEventListener('keydown', this._keydown, true);
    window.removeEventListener('keyup', this._keyup, true);
    window.removeEventListener('blur', this._blur, true);
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
      return shape.pushDot(dot, type);

    const emitEvent = () => {
      const prev = this._prevData
      if (!prev) return
      const curr = shape.data.copy()
      curr.coords.splice(0, prev.coords.length)
      board.emitEvent(EventEnum.ShapesChanged, {
        shapeType: this.type,
        shapeDatas: [[curr, prev]]
      });
      delete this._prevData
    }
    this._prevData = shape.data.copy()
    const prev = this._prevData
    if (prev.coords.length <= 0) {
      shape.pushDot(dot, type)
      emitEvent()
    } else {
      shape.pushDot(dot, type)
      setTimeout(emitEvent, 1000 / 30)
    }
  }
  moveDot(dot: IDot) {


    const shape = this._curShape
    const board = this.board
    if (!shape || !board) return

    if (this._pressingControl && shape.data.coords.length >= 4) {
      const prevX = shape.data.coords[shape.data.coords.length - 4];
      const prevY = shape.data.coords[shape.data.coords.length - 3];
      const angle = Math.atan2(dot.y - prevY, dot.x - prevX) * 180 / Math.PI;
      const o = Math.sqrt((Math.pow(dot.x - prevX, 2) + Math.pow(dot.y - prevY, 2)) / 2)
      if (angle > 22.5 && angle <= 67.5) {
        dot.x = prevX + o;
        dot.y = prevY + o;
      } else if (angle > 67.5 && angle <= 112.5) {
        dot.x = prevX;
      } else if (angle > 112.5 && angle <= 157.5) {
        dot.x = prevX - o;
        dot.y = prevY + o;
      } else if (angle > 157.5 || angle <= -157.5) {
        dot.y = prevY;
      } else if (angle <= -112.5 && angle > -157.5) {
        dot.x = prevX - o;
        dot.y = prevY - o;
      } else if (angle <= -67.5 && angle > -112.5) {
        dot.x = prevX;
      } else if (angle <= -22.5 && angle > -67.5) {
        dot.x = prevX + o;
        dot.y = prevY - o;
      } else {
        dot.y = prevY;
      }
    }

    if (this._prevData)
      return shape.editDot(dot);

    const emitEvent = () => {
      const prev = this._prevData
      if (!prev) return
      const curr = shape.data.copy()
      curr.coords.splice(0, prev.coords.length)
      board.emitEvent(EventEnum.ShapesChanged, {
        shapeType: this.type,
        shapeDatas: [[curr, prev]]
      })
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
      this._curShape = board.factory.newShape(ShapeEnum.Lines) as ShapeLines
      this._curShape.data.layer = board.layer().id;
      this._curShape.data.editing = true
      board.add(this._curShape, true);
      this.addDot(dot, 'first');
      this.addDot(dot)
    }
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
  private _curShape: ShapeLines | undefined
  private _board: Board | undefined
}

Gaia.registerTool(ToolEnum.Lines,
  () => new LinesTool(),
  { name: 'lines', desc: 'lines', shape: ShapeEnum.Lines })