import { Board } from "../../board/Board"
import { Events as Event, EventEnum, Events } from "../../event"
import { Shape } from "../../shape/base/Shape"
import type { ShapeType } from "../../shape/ShapeEnum"
import type { IDot } from "../../utils/Dot"
import { RectHelper } from "../../utils/RectHelper"
import { ToolEnum, type ToolType } from "../ToolEnum"
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
  }
  protected _keys = new Map<FnKeys, boolean>()

  protected keydown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Control':
      case 'Alt':
      case 'Shift':
        this._keys.set(e.key, true);
        this.applyRect();
        return;
    }
  }
  protected keyup = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'Control':
      case 'Alt':
      case 'Shift':
        this._keys.set(e.key, false);
        this.applyRect();
        return;
    }
  }
  holdingKey(...keys: FnKeys[]): boolean {
    for (let i = 0; i < keys.length; ++i) {
      if (!this._keys.get(keys[i])) {
        return false;
      }
    }
    return true;
  }
  start(): void {
    window.addEventListener('keydown', this.keydown);
    window.addEventListener('keyup', this.keyup)
  }
  end(): void {
    window.removeEventListener('keydown', this.keydown);
    window.removeEventListener('keyup', this.keyup)
    delete this._curShape
  }
  render(): void { }
  get board(): Board | undefined {
    return this._board
  }
  set board(v: Board | undefined) {
    this._board = v
  }
  pointerMove(dot: IDot): void { }
  pointerDown(dot: IDot): void {
    const { x, y } = dot
    const board = this.board
    if (!board) return
    this._curShape = board.factory.newShape(this._shapeType)
    this._curShape.data.layer = board.layer().id;
    const shape = this._curShape
    if (!shape) return
    board.add(shape, true)
    this._rect.start(x, y)
    this.updateGeo(0)
  }
  pointerDraw(dot: IDot): void {
    const { x, y } = dot
    this._rect.end(x, y)
    this.updateGeo(1)
  }
  pointerUp(dot: IDot): void {
    const { x, y } = dot
    this._rect.end(x, y)
    this.updateGeo(2)
    delete this._curShape
  }
  protected applyRect() {
    const { x, y, w, h } = this._rect.gen()
    this._curShape?.geo(x, y, w, h)
  }
  private updateGeo(state: 0 | 1 | 2) {
    const shape = this._curShape
    const board = this.board
    if (!shape || !board) return

    switch (state) {
      case 0: {
        this._prevData = Event.pickShapeGeoData(shape.data)
        this._startData = this._prevData;
        this.applyRect();
        break;
      }
      case 1: {
        this.applyRect();
        const curr = Event.pickShapeGeoData(shape.data);
        board.emitEvent(EventEnum.ShapesGeoChanging, {
          shapeDatas: [[curr, this._prevData!]]
        })
        this._prevData = curr;
        break;
      }
      case 2: {
        this.applyRect();
        const curr = Event.pickShapeGeoData(shape.data);
        board.emitEvent(EventEnum.ShapesGeoChanging, {
          shapeDatas: [[curr, this._prevData!]]
        })
        board.emitEvent(EventEnum.ShapesGeoChanged, {
          shapeDatas: [[curr, this._startData!]]
        })
        board.emitEvent(EventEnum.ShapesDone, {
          shapeDatas: [shape.data.copy()]
        })
        this._prevData = curr;
        break;
      }
    }
  }
  protected _startData: Event.IShapeGeoData | undefined
  protected _prevData: Event.IShapeGeoData | undefined
  protected _curShape: Shape | undefined
  protected _board: Board | undefined
  protected _rect = new RectHelper()
}