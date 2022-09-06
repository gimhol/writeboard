import { WhiteBoard } from "../../board/WhiteBoard"
import { RectHelper } from "../../utils/RectHelper"
import { Shape } from "../../shape/base/Shape"
import { IShapeGeoData, pickShapeGeoData, ShapesGeoEvent } from "../../event/Events"
import type { ShapeType } from "../../shape/ShapeEnum"
import type { ToolType } from "../ToolEnum"
import type { ITool } from "./Tool"
import type { IDot } from "../../utils/Dot"
const Tag = '[SimpleTool]'
export class SimpleTool implements ITool {
  get type(): string { return this._type }
  private _type: ToolType
  private _shapeType: ShapeType
  constructor(type: ToolType, shapeType: ShapeType) {
    this._type = type
    this._shapeType = shapeType
  }
  start(): void {
  }
  end(): void {
    delete this._curShape
  }
  render(): void { }
  get board(): WhiteBoard | undefined {
    return this._board
  }
  set board(v: WhiteBoard | undefined) {
    this._board = v
  }
  pointerMove(dot: IDot): void { }
  pointerDown(dot: IDot): void {
    const { x, y } = dot
    const board = this.board
    if (!board) return
    this._curShape = board.factory.newShape(this._shapeType)
    const shape = this._curShape
    if (!shape) return
    board.add(shape)
    this._rect.start(x, y)
    this.updateGeo()
  }
  pointerDraw(dot: IDot): void {
    const { x, y } = dot
    this._rect.end(x, y)
    this.updateGeo()
  }
  pointerUp(dot: IDot): void {
    const { x, y } = dot
    this._rect.end(x, y)
    this.updateGeo()
    delete this._curShape
  }
  private updateGeo() {
    const { x, y, w, h } = this._rect.gen()

    const shape = this._curShape
    const board = this.board
    if (!shape || !board) return

    if (this._prevData) {
      shape.geo(x, y, w, h)
      return
    }

    this._prevData = pickShapeGeoData(shape.data)
    const prev = this._prevData
    const emitEvent = () => {
      const curr = pickShapeGeoData(shape.data)
      board.emit(new ShapesGeoEvent(this.type, { shapeDatas: [[curr, prev]] }))
      delete this._prevData
    }
    shape.geo(x, y, w, h)
    setTimeout(emitEvent, 1000 / 60)
  }
  private _prevData: IShapeGeoData | undefined
  private _curShape: Shape | undefined
  private _board: WhiteBoard | undefined
  private _rect = new RectHelper()
}