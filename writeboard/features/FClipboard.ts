
import type { Board } from "../board";
import { EventEnum } from "../event/EventType";
import { ShapeEnum } from "../shape";
import type { IShapeData, ShapeText } from "../shape";

/**
 * 剪贴板：复制 / 剪切选中的图形，粘贴时分辨库内图形（带 write_board_shapes: 前缀的 JSON）
 * 与其它纯文本（粘成文本图形）
 *
 * Clipboard: copies / cuts the selected shapes and, while pasting, tells shapes of this
 * library (JSON behind a write_board_shapes: prefix) apart from any other plain text
 * (which becomes a text shape).
 */
export class FClipboard {
  private shapesMark = "write_board_shapes:"
  private board: Board
  private pasteAt: { x: number; y: number } | undefined = void 0
  /**
   * 建一个剪贴板并绑定到某块黑板
   *
   * Creates a clipboard bound to a board.
   *
   * @param {Board} board 黑板 / The board
   */
  constructor(board: Board) {
    this.board = board
  }
  /**
   * 剪切：先复制选中的图形，再把它们从板上删掉（删除会进撤回栈）
   *
   * Cuts the selected shapes: they are copied first and then removed from the board (the
   * removal goes into the undo stack).
   */
  cut() {
    this.copy()
    this.board.removeSelected(true)
  }
  /**
   * 复制选中的图形到系统剪贴板：图形数据序列化成 JSON，前面加 write_board_shapes: 前缀，
   * 粘贴时据它分辨是不是本库的内容
   *
   * Copies the selected shapes onto the clipboard: their data is serialised to JSON
   * behind the write_board_shapes: prefix, which tells the paste handler whether the
   * content comes from this library.
   */
  copy() {
    const datas = this.board.selects.map(shape => shape.data)
    const blob = new Blob([this.shapesMark, JSON.stringify(datas)], { type: 'text/plain' })
    navigator.clipboard.write([
      new ClipboardItem({ "text/plain": Promise.resolve(blob) })
    ]).catch(e => {
      console.error(e)
    })
  }

  /**
   * 从系统剪贴板粘贴：库内图形按原样式重建，其它纯文本粘成文本图形
   *
   * Pastes from the clipboard: shapes of this library are rebuilt with their original
   * style, while any other plain text becomes a text shape.
   *
   * @param {{x: number, y: number}} [at] 可选的落点（世界坐标，粘贴后图形左上角对齐它）
   *   / Optional drop point in world coordinates (the shapes are aligned to it)
   * @return {Promise<void>} 粘贴完成的 Promise / Promise resolved once pasting is done
   */
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

  /**
   * 把纯文本粘贴成文本图形（样式取黑板当前的文本模板，位置取视口中心）
   *
   * Pastes plain text as a text shape (styled like the current text template of the
   * board, placed in the middle of the viewport).
   *
   * @param {string} txt 纯文本 / Plain text
   */
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
      raw.l = board.layer().id
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
      shapeDatas: shapes.map((v) => v.data.copy())
    })
  }
}