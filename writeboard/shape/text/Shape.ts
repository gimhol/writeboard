import { ShapeEnum } from "../ShapeEnum"
import { Gaia } from "../../mgr/Gaia"
import { TextData } from "./Data"
import { Shape } from "../base"
import { Rect } from "../../utils/Rect"
import { IRect } from "../../utils/IRect"
import { TextSelection, ITextSelection } from "./TextSelection"

const measurer = document.createElement('canvas').getContext('2d')!
export interface ILineInfo extends TextMetrics {
  x: number
  y: number
  bl: number
  str: string
}
export class ShapeText extends Shape<TextData> {
  private _selection = new TextSelection;
  private _lines: ILineInfo[] = [];
  private _selectionRects: IRect[] = [];
  private _offscreen?: HTMLCanvasElement;

  get text() { return this.data.s }
  set text(v) { this.setText(v) }
  get selection() { return this._selection }
  set selection(v) { this.setSelection(v) }
  get selectionRects() { return this._selectionRects }

  private get offscreen(): HTMLCanvasElement {
    this._offscreen = this._offscreen || document.createElement('canvas');
    return this._offscreen;
  }

  constructor(data: Partial<TextData>) {
    super(data, TextData)
    this._calculateLines()
    this._calculateSectionRects()
  }

  get fontSize(): number { return this.data.font_size }

  set fontSize(v) {
    const prev = {}
    this.beginDirty(prev)
    this.data.font_size = v;
    this._calculateLines()
    this._calculateSectionRects()
    this.endDirty(prev)
  }

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

  setText(v: string, dirty: boolean = true) {
    if (this.data.s === v)
      return
    this.data.s = v
    this._calculateLines()
    dirty && this.endDirty()
  }

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