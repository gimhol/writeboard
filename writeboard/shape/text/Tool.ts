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

/**
 * 文本工具：点空白新建文本、点已有文本重新编辑，实际输入交给一个悬浮的 textarea
 *
 * Text tool: a click on an empty spot creates a text, a click on an existing one edits it
 * again, and the typing itself is handed to a floating textarea.
 */
export class TextTool implements ITool {
  /**
   * 工具类型
   *
   * Tool type.
   */
  readonly type: string = ToolEnum.Text;
  /**
   * 跟着图形走的输入框：位置 / 字体 / 内边距都按图形数据同步
   *
   * The input box that follows the shape: its position / font / paddings are kept in sync
   * with the shape data.
   */
  readonly editor = document.createElement('textarea');

  private _board: Board | undefined;
  private _curShape: ShapeText | undefined;
  private _prevData: TextData | undefined;
  /**
   * 编辑器获得焦点时回调（外部可拿它做失焦处理）
   *
   * Called while the editor gets focused (an outside caller may use it to handle blur).
   */
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
      } else {
        this._board?.emit(EventEnum.ShapesChanged, {
          operator: this._board.whoami,
          shapeDatas: [[preShape.data.copy(), this._prevData!.copy()]]
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

  /**
   * 建一个文本工具：输入框换成裸 textarea（关闭换行、带上编辑器样式）
   *
   * Builds a text tool: the input box is a plain textarea (no wrapping, with the editor
   * styles attached).
   */
  constructor() {
    this.editor.wrap = 'off';
    this.editor.classList.add(styles.text_editor);
  }

  /**
   * 工具激活：给编辑器与文档挂上输入 / 选区 / 指针监听
   *
   * The tool is activated: the input / selection / pointer listeners are attached to the
   * editor and the document.
   */
  start(): void {
    this.editor.addEventListener('keydown', this._keydown)
    this.editor.addEventListener('input', this._updateShapeText)
    document.addEventListener('selectionchange', this._updateShapeText)
    document.addEventListener('pointerdown', this._docPointerdown)
  }
  /**
   * 工具停用：移除监听并把编辑器从文档里拿掉，结束当前编辑
   *
   * The tool is deactivated: the listeners are removed, the editor is taken out of the
   * document and the current edit is finished.
   */
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
  /**
   * 文本属于哪块黑板
   *
   * The board the text belongs to.
   */
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
  /**
   * 指针落下：命中文本则接着编辑，否则新建一条文本；点空白则先结束当前编辑
   *
   * The pointer went down: a hit on a text continues editing it, otherwise a new text is
   * created; a click on an empty spot finishes the current edit first.
   *
   * @param {IDot} dot 落点（世界坐标）/ The position of the pointer (world space)
   */
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

  /**
   * 接到一条文本上：把它置为当前编辑对象，稍后把焦点交给输入框
   *
   * Attaches to a text: it becomes the current editing target and the input box is focused
   * shortly after.
   *
   * @param {ShapeText} shapeText 要编辑的文本图形 / The text shape to edit
   */
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