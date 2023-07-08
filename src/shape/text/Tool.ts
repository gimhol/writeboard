import { Board } from "../../board"
import { EventEnum } from "../../event"
import { Gaia } from "../../mgr/Gaia"
import { ToolEnum } from "../../tools/ToolEnum"
import { ITool } from "../../tools/base/Tool"
import { Css } from "../../utils/Css"
import { IDot } from "../../utils/Dot"
import { ShapeEnum } from "../ShapeEnum"
import { ShapeText } from "./Shape"

Css.add(`
.g_whiteboard_text_editor {
  display: none;
  position: absolute;
  left: 0px;
  top: 0px;
  boxSizing: border-box;
  outline: none;
  border: none;
  resize: none;
  padding: 0px;
  margin: 0px;
  transition: none;
  opacity: 0%;
}`)

export class TextTool implements ITool {
  private _board: Board | undefined
  private _curShape: ShapeText | undefined
  private _editor = document.createElement('textarea')
  selectorCallback?: (this: HTMLTextAreaElement, ev: FocusEvent) => void
  private set curShape(shape: ShapeText | undefined) {
    const preShape = this._curShape;
    if (preShape === shape) return;

    this._curShape = shape;
    if (shape) {
      shape.editing = true
      this._updateEditorStyle(shape)
      this._editor.style.display = 'block'
      this._editor.value = shape.text
    } else {
      this._editor.style.display = 'none'
    }

    if (preShape) {
      preShape.editing = false;
      if (!preShape.text) {
        const board = this.board;
        if (!board) return;
        board.remove(preShape, true)
      }
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
    board.emitEvent(EventEnum.ShapesChanged, {
      shapeType: this.type,
      shapeDatas: [[curr, prev]]
    })
  }

  constructor() {
    this._editor.wrap = 'off';
    this._editor.classList.add('g_whiteboard_text_editor');
  }

  start(): void {
    this._editor.addEventListener('keydown', this._keydown)
    this._editor.addEventListener('input', this._updateShapeText)
    document.addEventListener('selectionchange', this._updateShapeText)
    document.addEventListener('pointerdown', this._docPointerdown)
  }
  end(): void {
    this._editor.removeEventListener('keydown', this._keydown)
    this._editor.removeEventListener('input', this._updateShapeText)
    document.removeEventListener('selectionchange', this._updateShapeText)
    document.removeEventListener('pointerdown', this._docPointerdown)
    this.curShape = undefined;
  }
  private _docPointerdown = (e: PointerEvent) => {
    this.curShape = undefined;
  }
  private _keydown = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === 'Enter') {
      this.curShape = undefined;
    } else if (e.key === 'Escape') {
      this.curShape = undefined;
    }
    e.stopPropagation()
  }
  get type() { return ToolEnum.Text }
  get board(): Board | undefined {
    return this._board
  }
  set board(v: Board | undefined) {
    this._board = v;
    this._board?.onscreen()?.parentElement?.appendChild(this._editor)
  }
  get editor() { return this._editor; }
  render(): void { }
  pointerMove(dot: IDot): void { }
  pointerDown(dot: IDot): void {
    const { board } = this
    if (!board) { return; }
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
      this.curShape = undefined;
      return
    } else if (!shapeText) {
      const newShapeText = board.factory.newShape(ShapeEnum.Text) as ShapeText
      newShapeText.data.layer = board.layer().id;
      newShapeText.move(dot.x, dot.y)
      board.add(newShapeText, true)
      shapeText = newShapeText
    }
    this.connect(shapeText);
  }
  pointerDraw(dot: IDot): void { }
  pointerUp(dot: IDot): void { }

  connect(shapeText: ShapeText): void {
    const { board } = this;
    if (!board) { return; }
    this.curShape = shapeText
    setTimeout(() => this._editor.focus(), 10)
  }
}
Gaia.registerTool(ToolEnum.Text,
  () => new TextTool,
  { name: 'Text', desc: 'enter some text', shape: ShapeEnum.Text })