import { Board } from "../../board"
import { EventEnum } from "../../event"
import { Gaia } from "../../mgr/Gaia"
import styles from "../../styles.module.scss"
import { ToolEnum } from "../../tools/ToolEnum"
import { ITool } from "../../tools/base/Tool"
import { IDot } from "../../utils/Dot"
import { ShapeEnum } from "../ShapeEnum"
import { TextData } from "./Data"
import { ShapeText } from "./Shape"

export class TextTool implements ITool {
  readonly type: string = ToolEnum.Text;
  readonly editor = document.createElement('textarea');

  private _board: Board | undefined;
  private _curShape: ShapeText | undefined;
  private _prevData: TextData | undefined;
  selectorCallback?: (this: HTMLTextAreaElement, ev: FocusEvent) => void
  private _newTxt: boolean = false
  private set curShape(shape: ShapeText | undefined) {
    const preShape = this._curShape;
    if (preShape === shape) return;

    this._curShape = shape;
    if (shape) {
      shape.editing = true
      this._updateEditorStyle(shape)
      this.editor.style.display = 'block'
      this.editor.value = shape.text
    } else {
      this.editor.style.display = 'none'
    }

    if (preShape) {
      preShape.editing = false;
      if (!preShape.text && !this._newTxt) {
        const board = this.board;
        if (!board) return;
        preShape.merge(this._prevData!);
        board.remove(preShape, true);
      } else if (this._newTxt) {
        this._newTxt = false;
        this._board?.emit(EventEnum.ShapesDone, {
          operator: this._board.whoami,
          shapeDatas: [preShape.data.copy()]
        })
      }
    }

    this._prevData = shape?.data.copy();
  }
  private _updateEditorStyle = (shape: ShapeText) => {
    const { board } = this;
    if (!board) return;
    this.editor.style.font = shape.data.font
    this.editor.style.left = board.world.x + shape.data.x + 'px'
    this.editor.style.top = board.world.y + shape.data.y + 'px'
    this.editor.style.minWidth = shape.data.w + 'px'
    this.editor.style.minHeight = shape.data.h + 'px'
    this.editor.style.maxWidth = shape.data.w + 'px'
    this.editor.style.maxHeight = shape.data.h + 'px'
    this.editor.style.paddingLeft = shape.data.t_l + 'px'
    this.editor.style.paddingTop = shape.data.t_t + 'px'
    this.editor.style.transform = `rotate(${(180 * shape.data.rotation / Math.PI).toFixed(4)}deg) scale(${shape.data.scaleX},${shape.data.scaleY})`
  }
  private _updateShapeText = () => {
    const shape = this._curShape
    if (!shape) return
    const prev = shape.data.copy()

    shape.setText(this.editor.value, false)
    shape.setSelection({
      start: this.editor.selectionStart,
      end: this.editor.selectionEnd
    })
    this._updateEditorStyle(shape)

    const board = this.board
    if (!board) return

    const curr = shape.data.copy()
    board.emit(EventEnum.ShapesChanging, {
      operator: board.whoami,
      shapeDatas: [[curr, prev]]
    })
  }

  constructor() {
    this.editor.wrap = 'off';
    this.editor.classList.add(styles.text_editor);
  }

  start(): void {
    this.editor.addEventListener('keydown', this._keydown)
    this.editor.addEventListener('input', this._updateShapeText)
    document.addEventListener('selectionchange', this._updateShapeText)
    document.addEventListener('pointerdown', this._docPointerdown)
  }
  end(): void {
    this.editor.remove()
    this.editor.removeEventListener('keydown', this._keydown)
    this.editor.removeEventListener('input', this._updateShapeText)
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
  get board(): Board | undefined {
    return this._board
  }
  set board(v: Board | undefined) {
    this._board = v;
    const pe = this._board?.element
    if (pe && this.editor.parentElement !== pe) {
      pe.appendChild(this.editor)
    }
  }
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
      this._newTxt = true;
      const newShapeText = board.factory.newShape(ShapeEnum.Text) as ShapeText;
      newShapeText.data.layer = board.layer().id;
      newShapeText.move(dot.x, dot.y);
      board.add(newShapeText, true)
      shapeText = newShapeText
    }
    this.connect(shapeText);
  }

  connect(shapeText: ShapeText): void {
    const { board } = this;
    if (!board) { return; }
    this.curShape = shapeText
    setTimeout(() => this.editor.focus(), 10)
  }
}
Gaia.registerTool(ToolEnum.Text,
  () => new TextTool,
  { name: 'Text', desc: 'enter some text', shape: ShapeEnum.Text })