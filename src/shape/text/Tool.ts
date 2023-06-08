import { FactoryMgr } from "../../mgr/FactoryMgr"
import { ShapeEnum } from "../ShapeEnum"
import { ToolEnum } from "../../tools/ToolEnum"
import { WhiteBoard } from "../../board"
import { ShapeText } from "./Shape"
import { ITool } from "../../tools/base/Tool"
import { IDot } from "../../utils/Dot"
import { WhiteBoardEvent } from "../../event"
const Tag = '[TextTool]'

export class TextTool implements ITool {
  private _board: WhiteBoard | undefined
  private _curShape: ShapeText | undefined
  private _editor = document.createElement('textarea')
  private setCurShape = (shape?: ShapeText) => {
    const preShape = this._curShape
    if (preShape === shape) return
    preShape && (preShape.editing = false)
    this._curShape = shape
    shape && (shape.editing = true)
    if (shape) {
      this._updateEditorStyle(shape)
      this._editor.style.display = 'block'
      this._editor.value = shape.text
    } else {
      this._editor.style.display = 'gone'
    }
    if (preShape && !preShape.text) {
      const board = this.board
      if (!board) return
      board.remove(preShape)
    }
  }
  private _updateEditorStyle = (shape: ShapeText) => {
    this._editor.style.font = shape.data.font
    this._editor.style.left = shape.data.x + 'px'
    this._editor.style.top = shape.data.y + 'px'
    this._editor.style.minWidth = shape.data.w + 'px'
    this._editor.style.minHeight = shape.data.h + 'px'
    this._editor.style.maxWidth = shape.data.w + 'px'
    this._editor.style.maxHeight = shape.data.h + 'px'
    this._editor.style.paddingLeft = shape.data.t_l + 'px'
    this._editor.style.paddingTop = shape.data.t_t + 'px'
  }
  private _updateShapeText = () => {
    const shape = this._curShape
    if (!shape) return
    const prev = shape.data.copy()

    shape.setText(this._editor.value, false)
    shape.setSelection({
      start: this._editor.selectionStart,
      end: this._editor.selectionEnd
    })
    this._updateEditorStyle(shape)

    const board = this.board
    if (!board) return

    const curr = shape.data.copy()
    board.dispatchEvent(WhiteBoardEvent.shapesChanged({ shapeType: this.type, shapeDatas: [[curr, prev]] }))
  }

  constructor() {
    this._editor.wrap = 'off'
    this._editor.style.display = 'none'
    this._editor.style.position = 'absolute'
    this._editor.style.left = '0px'
    this._editor.style.top = '0px'
    this._editor.style.boxSizing = 'border-box'
    this._editor.style.outline = 'none'
    this._editor.style.border = 'none'
    this._editor.style.resize = 'none'
    this._editor.style.padding = '0px'
    this._editor.style.margin = '0px'
    this._editor.style.transition = 'none'
    this._editor.style.opacity = '0%'
  }

  start(): void {
    this._editor.addEventListener('input', this._updateShapeText)
    document.addEventListener('selectionchange', this._updateShapeText)
  }
  end(): void {
    this._editor.removeEventListener('input', this._updateShapeText)
    document.removeEventListener('selectionchange', this._updateShapeText)
    this.setCurShape()
  }
  get type() { return ToolEnum.Text }

  render(): void { }
  get board(): WhiteBoard | undefined {
    return this._board
  }
  set board(v: WhiteBoard | undefined) {
    this._board = v;
    this._board?.onscreen()?.parentElement?.appendChild(this._editor)
  }
  pointerMove(dot: IDot): void { }
  pointerDown(dot: IDot): void {
    const board = this.board
    if (!board)
      return
    let shapeText: ShapeText | undefined
    const shapes = board.hits({ ...dot, w: 0, h: 0 })
    for (let i = 0; i < shapes.length; ++i) {
      const shape = shapes[i]
      if (shape.data.type !== ShapeEnum.Text)
        continue
      shapeText = shapes[i] as ShapeText
      break
    }

    if (!shapeText && this._curShape) {
      return this.setCurShape()
    } else if (!shapeText) {
      const newShapeText = board.factory.newShape(ShapeEnum.Text) as ShapeText
      newShapeText.data.layer = board.layer().id;
      newShapeText.move(dot.x, dot.y)
      board.add(newShapeText)
      shapeText = newShapeText
    }
    this.setCurShape(shapeText)
    setTimeout(() => this._editor.focus(), 10)
  }
  pointerDraw(dot: IDot): void { }
  pointerUp(dot: IDot): void { }
}
FactoryMgr.registerTool(ToolEnum.Text,
  () => new TextTool,
  { name: 'text', desc: 'text drawer', shape: ShapeEnum.Text })