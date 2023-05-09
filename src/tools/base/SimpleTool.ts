import { WhiteBoard } from "../../board/WhiteBoard"
import { IShapeGeoData, pickShapeGeoData, ShapesGeoEvent } from "../../event/Events"
import { Shape } from "../../shape/base/Shape"
import type { ShapeType } from "../../shape/ShapeEnum"
import type { IDot } from "../../utils/Dot"
import { RectHelper } from "../../utils/RectHelper"
import type { ToolType } from "../ToolEnum"
import type { ITool } from "./Tool"
const Tag = '[SimpleTool]'

type FnKeys = 'Control' | 'Alt' | 'Shift';
export class SimpleTool implements ITool {
  get type(): string { return this._type }
  private _type: ToolType
  private _shapeType: ShapeType
  constructor(type: ToolType, shapeType: ShapeType) {
    this._type = type
    this._shapeType = shapeType
    window.addEventListener('keydown', e => this.keydown(e));
    window.addEventListener('keyup', e => this.keyup(e))
  }
  protected _keys: { [key in FnKeys]?: boolean } = {}
  protected keydown(e: KeyboardEvent) {
    switch (e.key) {
      case 'Control':
      case 'Alt':
      case 'Shift':
        if (!this._keys[e.key]) {
          this._keys[e.key] = true;
          this.applyRect();
        }
        return;
    }
  }
  protected keyup(e: KeyboardEvent) {
    switch (e.key) {
      case 'Control':
      case 'Alt':
      case 'Shift':
        if (this._keys[e.key]) {
          this._keys[e.key] = false;
          this.applyRect();
        }
        return;
    }
  }
  holdingKey(...keys: FnKeys[]): boolean {
    for (let i = 0; i < keys.length; ++i) {
      if (!keys[i]) {
        return false;
      }
    }
    return true;
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
    this._curShape.data.layer = board.currentLayer().info.name;
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
  protected applyRect() {
    const { x, y, w, h } = this._rect.gen()
    this._curShape?.geo(x, y, w, h)
  }
  private updateGeo() {
    const shape = this._curShape
    const board = this.board
    if (!shape || !board) return

    if (this._prevData) {
      this.applyRect();
      return
    }

    this._prevData = pickShapeGeoData(shape.data)
    const prev = this._prevData
    const emitEvent = () => {
      const curr = pickShapeGeoData(shape.data)
      board.emit(new ShapesGeoEvent(this.type, { shapeDatas: [[curr, prev]] }))
      delete this._prevData
    }

    this.applyRect();
    setTimeout(emitEvent, 1000 / 60)
  }
  protected _prevData: IShapeGeoData | undefined
  protected _curShape: Shape | undefined
  protected _board: WhiteBoard | undefined
  protected _rect = new RectHelper()
}