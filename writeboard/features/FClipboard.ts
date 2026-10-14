
import type { Board } from "../board";
import { EventEnum } from "../event/EventType";
import { ShapeEnum } from "../shape";
import type { IShapeData, ShapeText } from "../shape";

export class FClipboard {
  private shapesMark = "write_board_shapes:"
  private board: Board
  private pasteAt: { x: number; y: number } | undefined = void 0
  constructor(board: Board) {
    this.board = board
  }
  cut() {
    this.copy()
    this.board.removeSelected(true)
  }
  copy() {
    const datas = this.board.selects.map(shape => shape.data)
    const blob = new Blob([this.shapesMark, JSON.stringify(datas)], { type: 'text/plain' })
    navigator.clipboard.write([
      new ClipboardItem({ "text/plain": Promise.resolve(blob) })
    ]).catch(e => {
      console.error(e)
    })
  }

  paste(at?: { x: number; y: number }): Promise<void> {
    this.pasteAt = at
    return navigator.clipboard.read()
      .then(items => Promise.all(items.map(this.handleClipboardItem)))
      .then(() => { })
      .catch(e => console.error(e))
  }

  private handleClipboardItem = (item: ClipboardItem) => {
    if (item.types.indexOf("image/png") >= 0)
      return item.getType("image/png").then(this.pastePNG)
    else if (item.types.indexOf("image/jpeg") >= 0)
      return item.getType("image/jpeg").then(this.pasteJPG)
    else if (item.types.indexOf("text/plain") >= 0)
      return item.getType("text/plain").then(it => it.text()).then(this.pasteTXT)
    return Promise.resolve()
  }

  private pastePNG = (blob: Blob) => {
    console.log("TODO: handlePastePng")
  }

  private pasteJPG = (blob: Blob) => {
    console.log("TODO: handlePasteJpg")
  }

  private pasteTXT = (txt: string) => {
    if (txt.startsWith(this.shapesMark))
      this.pasteShapes(JSON.parse(txt.substring(this.shapesMark.length)))
    else
      this.pasteTextShape(txt)
  }

  /** 把纯文本粘贴成文本图形（样式取黑板当前的文本模板，位置取视口中心） */
  private pasteTextShape = (txt: string) => {
    const text = txt.replace(/\r\n?/g, '\n').replace(/\n+$/, '')
    if (!text.trim()) return

    const board = this.board
    const shape = board.factory.newShape(ShapeEnum.Text) as ShapeText
    shape.data.layer = board.layer().id
    shape.setText(text, false)

    const { x, y } = board.world
    const { w, h } = board.viewport
    shape.move(-x + (w - shape.w) / 2, -y + (h - shape.h) / 2)

    board.add(shape, true)
    board.setSelects([shape], true)
    board.emit(EventEnum.ShapesDone, {
      operator: board.whoami,
      shapeDatas: [shape.data.copy()]
    })
  }

  private pasteShapes = (raws: IShapeData[]) => {
    const board = this.board
    const factory = board.factory
    const at = this.pasteAt
    this.pasteAt = void 0
    let dx = 10
    let dy = 10
    if (at && raws.length) {
      let minX = Number.POSITIVE_INFINITY
      let minY = Number.POSITIVE_INFINITY
      for (const raw of raws) {
        minX = Math.min(minX, raw.x)
        minY = Math.min(minY, raw.y)
      }
      dx = at.x - minX
      dy = at.y - minY
    }
    const shapes = raws.sort((a, b) => a.z - b.z).map(raw => {
      raw.i = factory.newShapeId(raw)
      raw.z = factory.newShapeZ(raw)
      raw.b && (raw.b.f = void 0)
      raw.x = raw.x + dx
      raw.y = raw.y + dy
      const shape = factory.newShape(raw)
      shape.selected = false
      return shape
    })
    board.add(shapes, true)
    board.setSelects(shapes, true)
    board.emit(EventEnum.ShapesDone, {
      operator: board.whoami,
      shapeDatas: raws
    })
  }
}