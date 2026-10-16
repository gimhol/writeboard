import { ShapeEnum } from "../ShapeEnum"
import { Gaia } from "../../mgr/Gaia"
import { TextData } from "./Data"
import { Shape } from "../base"
import { Rect } from "../../utils/Rect"
import { IRect } from "../../utils/IRect"
import { TextSelection, ITextSelection } from "./TextSelection"

let _measurer: CanvasRenderingContext2D | undefined
/**
 * 延迟创建文本测量用的画布上下文，
 * 避免在非 DOM 环境（如 Node）中引入本模块时抛错
 *
 * Creates the canvas context for text measuring lazily,
 * so importing this module in non-DOM environments (e.g. Node) does not throw.
 */
const getMeasurer = (): CanvasRenderingContext2D => {
  if (!_measurer) _measurer = document.createElement('canvas').getContext('2d')!
  return _measurer
}
/**
 * 排版后的一行文本：除 TextMetrics 外还记了绘制位置与原始字符串
 *
 * One laid out line of text: beyond TextMetrics it keeps the drawing position and the raw
 * string.
 */
export interface ILineInfo extends TextMetrics {
  /**
   * 本行的绘制起点 x（局部坐标，已含左边距）
   *
   * Drawing x of this line (local coordinates, the left padding is included).
   */
  x: number
  /**
   * 本行的行顶 y（局部坐标，已含上边距）
   *
   * Top y of this line (local coordinates, the top padding is included).
   */
  y: number
  /**
   * 本行的基线 y
   *
   * Baseline y of this line.
   */
  bl: number
  /**
   * 本行的文本（末尾带一个换行符，留作逐行排版用）
   *
   * The text of this line (a trailing newline is kept for the layout).
   */
  str: string
}
/**
 * 文本图形：自己排版（行 / 选区矩形），文字与光标都画在离屏画布上
 *
 * Text shape: it lays the text out itself (lines / selection rectangles) and draws both the
 * text and the cursor onto an offscreen canvas.
 */
export class ShapeText extends Shape<TextData> {
  private _selection = new TextSelection;
  private _lines: ILineInfo[] = [];
  private _selectionRects: IRect[] = [];
  private _offscreen?: HTMLCanvasElement;

  /**
   * 文本内容
   *
   * The text.
   */
  get text() { return this.data.s }
  set text(v) { this.setText(v) }
  /**
   * 当前选区（含光标位置：起终点相同时就是光标）
   *
   * The current selection (the cursor included: equal ends mean a plain cursor).
   */
  get selection() { return this._selection }
  set selection(v) { this.setSelection(v) }
  /**
   * 选区的绘制矩形（局部坐标，逐行一段）
   *
   * The drawing rectangles of the selection (local coordinates, one per line).
   */
  get selectionRects() { return this._selectionRects }

  private get offscreen(): HTMLCanvasElement {
    this._offscreen = this._offscreen || document.createElement('canvas');
    return this._offscreen;
  }

  /**
   * 按数据建一个文本图形，并先把行与选区矩形算好
   *
   * Builds a text shape from the given data and lays the lines and the selection rectangles
   * out first.
   *
   * @param {Partial<TextData>} data 图形数据 / Shape data
   */
  constructor(data: Partial<TextData>) {
    super(data, TextData)
    this._calculateLines()
    this._calculateSectionRects()
  }

  /**
   * 字号（设计单位 px）
   *
   * The font size (in design px).
   */
  get fontSize(): number { return this.data.font_size }

  /**
   * 设置字号并重新排版
   *
   * Sets the font size and lays the text out again.
   */
  set fontSize(v) {
    const prev = {}
    this.beginDirty(prev)
    this.data.font_size = v;
    this._calculateLines()
    this._calculateSectionRects()
    this.endDirty(prev)
  }

  /**
   * 合并一份文本数据：数据落完后重新排版
   *
   * Merges a piece of text data: the text is laid out again once the data is in place.
   *
   * @param {Partial<TextData>} data 要合并的数据 / The data to merge
   */
  override merge(data: Partial<TextData>) {
    const prev = this.data.copy()
    this.beginDirty(prev)
    this.data.merge(data)
    this._calculateLines()
    this._calculateSectionRects()
    this.endDirty(prev)
  }
  private _cursorFlashingTimer: number | undefined
  private _cursorVisible = false
  private _setCursorVisible(v: boolean = !this._cursorVisible) {
    this._cursorVisible = v
    this.endDirty()
  }
  private _setCursorFlashing(v: boolean) {
    if (v) this._cursorVisible = true
    if (v === !!this._cursorFlashingTimer)
      return
    clearInterval(this._cursorFlashingTimer)
    delete this._cursorFlashingTimer
    if (v) {
      this._cursorFlashingTimer = setInterval(() => this._setCursorVisible(), 500);
    } else {
      this._setCursorVisible(true)
    }
  }
  private _applyStyle(ctx: CanvasRenderingContext2D | null) {
    if (!ctx) return
    ctx.font = this.data.font
    ctx.fillStyle = this.data.fillStyle
    ctx.strokeStyle = this.data.strokeStyle
    ctx.lineWidth = this.data.lineWidth
    ctx.setLineDash([])
  }

  /**
   * 改文本内容并重新排版
   *
   * Changes the text and lays it out again.
   *
   * @param {string} v 新的文本 / The new text
   * @param {boolean} [dirty=true] 是否标脏 / Whether to mark the dirty area
   */
  setText(v: string, dirty: boolean = true) {
    if (this.data.s === v)
      return
    this.data.s = v
    this._calculateLines()
    dirty && this.endDirty()
  }

  /**
   * 改选区：重算选区矩形，两端相同时开光标闪烁、有选区时停闪
   *
   * Changes the selection: the selection rectangles are recomputed, the cursor starts blinking
   * while both ends are equal and stops while there is a real selection.
   *
   * @param {ITextSelection} [v] 新的选区，默认 [-1, -1]（无选区）/ The new selection, [-1, -1] (none) by default
   * @param {boolean} [dirty=true] 是否标脏 / Whether to mark the dirty area
   */
  setSelection(v: ITextSelection = { start: -1, end: -1 }, dirty: boolean = true) {
    if (this._selection.equal(v))
      return
    this._selection.start = v.start
    this._selection.end = v.end
    this._setCursorFlashing(v.start === v.end && v.start >= 0)
    this._calculateSectionRects()
    dirty && this.endDirty()
  }

  private _calculateLines() {
    const measurer = getMeasurer()
    this._applyStyle(measurer)
    let totalH = this.data.p
    let totalW = 0
    const text = this.text
    this._lines = text.split('\n').map(v => {
      const str = v + '\n'
      const tm = measurer.measureText(str)
      const y = totalH
      const bl = y + tm.fontBoundingBoxAscent
      totalW = Math.max(tm.width, totalW)
      totalH += tm.fontBoundingBoxAscent + tm.fontBoundingBoxDescent
      return { str, x: this.data.m, y, bl, ...tm }
    })
    totalH += this.data.q
    totalW += this.data.n + this.data.m
    this.resize(totalW, totalH)
  }

  private _calculateSectionRects() {
    const measurer = getMeasurer()
    this._applyStyle(measurer)
    const selection = this._selection
    let lineStart = 0
    let lineEnd = 0
    this._selectionRects = []
    for (let i = 0; i < this._lines.length; ++i) {
      const { str, y, x } = this._lines[i]
      lineEnd += str.length
      if (lineEnd <= selection.start) {
        lineStart = lineEnd
        continue
      }
      if (lineStart > selection.end)
        break
      const pre = str.substring(0, selection.start - lineStart)
      const mid = str.substring(selection.start - lineStart, selection.end - lineStart)
      const tm0 = measurer.measureText(pre)
      const tm1 = measurer.measureText(mid)
      const left = x + tm0.width
      const top = y
      const height = tm1.fontBoundingBoxAscent + tm1.fontBoundingBoxDescent
      this._selectionRects.push(new Rect(left, top, Math.max(2, tm1.width), height))
      lineStart = lineEnd
    }
  }

  /**
   * 绘制文本：编辑中先画编辑框，再把离屏画布上的文字（含光标 / 选区底色）贴到板上
   *
   * Draws the text: the editing frame comes first while editing, then the offscreen canvas
   * (carrying the text, the cursor and the selection background) is blitted onto the board.
   *
   * @param {CanvasRenderingContext2D} ctx 画布上下文 / Canvas context
   */
  render(ctx: CanvasRenderingContext2D) {
    if (!this.visible) return
    const needStroke = this.data.strokeStyle && this.data.lineWidth
    const needFill = this.data.fillStyle

    if (!this.editing && !needStroke && !needFill) {
      return super.render(ctx)
    }
    this.beginDraw(ctx)
    if (this.editing) {
      const { x, y, w, h } = this.drawingRect()
      let lineWidth = 1
      let halfLineW = lineWidth / 2
      ctx.lineWidth = lineWidth
      ctx.strokeStyle = this.data.fillStyle || 'white'
      ctx.setLineDash([])
      ctx.strokeRect(x + halfLineW, y + halfLineW, w - lineWidth, h - lineWidth)
    }
    if (needStroke || needFill) {
      const { x, y, w, h } = this.drawingRect();
      const { offscreen } = this;
      offscreen.width = w;
      offscreen.height = h;
      const octx = offscreen.getContext('2d')!;
      this._applyStyle(octx)
      octx.globalCompositeOperation = 'source-over'
      for (let i = 0; i < this._lines.length; ++i) {
        const line = this._lines[i]
        needFill && octx.fillText(line.str, line.x, line.bl)
        needStroke && octx.strokeText(line.str, line.x, line.bl)
      }

      if (this._cursorVisible && this.editing) {
        octx.globalCompositeOperation = 'xor'
        octx.fillStyle = this._cursorFlashingTimer ? this.data.fillStyle : '#2f71ff'
        for (let i = 0; i < this._selectionRects.length; ++i) {
          const rect = this._selectionRects[i]
          ctx.fillStyle = 'white'
          ctx.fillRect(x + rect.x, y + rect.y, rect.w, rect.h)
          octx.fillRect(rect.x, rect.y, rect.w, rect.h)
        }
      }
      ctx.drawImage(offscreen, x, y);
    }
    this.endDraw(ctx)
    return super.render(ctx)
  }
}

Gaia.registerShape(ShapeEnum.Text,
  () => new TextData,
  d => new ShapeText(d))