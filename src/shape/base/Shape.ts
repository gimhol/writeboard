import { Board } from "../../board/Board";
import { IRect, Rect } from "../../utils/Rect";
import { IVector } from "../../utils/Vector";
import { ShapeEnum, ShapeType } from "../ShapeEnum";
import { ShapeData } from "./Data";

export enum ResizeDirection {
  None = 0,
  Top = 'Top',
  Bottom = 'Bottom',
  Left = 'Left',
  Right = 'Right',
  TopLeft = 'TopLeft',
  TopRight = 'TopRight',
  BottomLeft = 'BottomLeft',
  BottomRight = 'BottomRight',
}

/**
 * 表示图形能以何种方式被拉伸
 *
 * @export
 * @enum {number}
 */
export enum Resizable {
  /**
   * 图形不能被拉伸
   */
  None = 0,

  /**
   * 八方向拉伸
   */
  All = 1,
}

/**
 * 一切图形的基类
 *
 * @export
 * @class Shape 图形基类
 * @template D 图形数据类
 */
export class Shape<D extends ShapeData = ShapeData> {
  private _data: D;
  private _board?: Board;
  protected _resizable: Resizable = Resizable.None;
  constructor(data: D) {
    this._data = data
  }

  /**
   * 图形的数据
   *
   * @readonly
   * @type {D}
   * @memberof Shape
   */
  get data(): D { return this._data as D }

  /**
   * 图形类型
   * 
   * 当图形为内置图形时，值为ShapeEnum，否则为字符串
   *
   * @readonly
   * @see {ShapeEnum}
   * @type {ShapeType}
   * @memberof Shape
   */
  get type(): ShapeType { return this._data.type }

  /**
   * 图形属于哪个黑板
   *
   * @type {(Board | undefined)}
   * @memberof Shape
   */
  get board(): Board | undefined { return this._board }
  set board(v: Board | undefined) { this._board = v }

  /**
   * 图形是否可见，
   * 
   * 当不可见时，图形将在渲染时被忽略
   *
   * @type {boolean}
   * @memberof Shape
   */
  get visible(): boolean { return !!this._data.visible }
  set visible(v: boolean) {
    if (!!this._data.visible === v) return
    this._data.visible = v
    this.markDirty()
  }

  /**
   * 是否正在编辑中
   * 
   * TODO
   *
   * @type {boolean}
   * @memberof Shape
   */
  get editing(): boolean { return !!this._data.editing }
  set editing(v: boolean) {
    if (this._data.editing === v) return
    this._data.editing = v
    this.markDirty()
  }

  /**
   * 图形是否被选中
   * 
   * 选中图形后，图形将呈现为被选中状态，其他一些对图形的操作均需要选中图形
   *
   * @type {boolean}
   * @memberof Shape
   */
  get selected(): boolean { return !!this._data.selected }
  set selected(v: boolean) {
    if (this._data.selected === v) return
    this._data.selected = v
    this.markDirty()
  }

  /**
   * 图形是否可以被用户修改尺寸
   * 
   * 当不为Resizable.None时，选中的图形将出现控制点，
   * 此时可以点击拖拽控制点来修改图形的尺寸
   *
   * @readonly
   * @type {Resizable}
   * @memberof Shape
   */
  get resizable(): Resizable { return this._resizable; }

  /**
   * 图形是否被锁定
   * 
   * 被锁定的图形将不能被编辑，选中图形时，选中图形将显示为被锁定
   *
   * @type {boolean}
   * @memberof Shape
   */
  get locked(): boolean { return this._data.locked }
  set locked(v: boolean) {
    if (this._data.locked === v) return
    this._data.locked = v
    this.markDirty()
  }

  /**
   * 图形能否交互
   * 
   * 当ghost为true时，只能看见这个图形，而不能选中并与其产生交互。
   * 利用这个属性，可以实现比较特殊的功能，比如：背景图
   *
   * @type {boolean}
   * @memberof Shape
   */
  get ghost(): boolean { return this._data.ghost }
  set ghost(v: boolean) {
    if (this._data.ghost === v) return
    this._data.ghost = v
    this.markDirty()
  }

  /**
   * 图形描边宽度
   * 若图形不存在描边，则为0
   *
   * @type {number}
   * @memberof Shape
   */
  get lineWidth(): number { return this._data.lineWidth }
  set lineWidth(v: number) {
    if (!this._data.needStroke) { return; }
    this.markDirty()
    this._data.lineWidth = Math.max(0, v);
    this.markDirty()
  }

  merge(data: Partial<ShapeData>): void {
    this.markDirty()
    this.data.merge(data)
    this.markDirty()
  }

  markDirty(rect?: IRect): void {
    rect = rect ?? this.boundingRect();
    this.board?.markDirty(rect)
  }

  /**
   * 移动图形
   * 
   * @param x x坐标
   * @param y y坐标
   * @returns void
   */
  move(x: number, y: number): void {
    if (x === this._data.x && y === this._data.y)
      return
    this.markDirty()
    this._data.x = x
    this._data.y = y
    this.markDirty()
  }

  resize(w: number, h: number): void {
    if (w === this._data.w && h === this._data.h)
      return
    this.markDirty()
    this._data.w = w
    this._data.h = h
    this.markDirty()
  }

  rotateBy(d: number): void {
    this.markDirty()
    this._data.rotation += d
    this.markDirty()
  }

  rotateTo(d: number): void {
    if (d == this._data.rotation) return
    this.markDirty()
    this._data.rotation = d
    this.markDirty()
  }

  getGeo(): Rect {
    return new Rect(
      this._data.x,
      this._data.y,
      this._data.w,
      this._data.h
    )
  }
  setGeo(rect: Rect): void {
    this.geo(rect.x, rect.y, rect.w, rect.h)
  }
  geo(x: number, y: number, w: number, h: number): void {
    if (x === this._data.x &&
      y === this._data.y &&
      w === this._data.w &&
      h === this._data.h)
      return
    this.markDirty()
    this._data.x = x
    this._data.y = y
    this._data.w = w
    this._data.h = h
    this.markDirty()
  }

  moveBy(x: number, y: number): void {
    this.markDirty()
    this._data.x += x
    this._data.y += y
    this.markDirty()
  }

  resizeBy(w: number, h: number): void {
    this.markDirty()
    this._data.w += w
    this._data.h += h
    this.markDirty()
  }

  geoBy(x: number, y: number, w: number, h: number): void {
    this.markDirty()
    this._data.x += x
    this._data.y += y
    this._data.w += w
    this._data.h += h
    this.markDirty()
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.visible) return
    const { ghost, locked } = this;
    if (this.selected && !ghost) {
      // 虚线其实相当损耗性能
      const lineWidth = locked ? 2 : 1
      const halfLineW = lineWidth / 2
      ctx.lineWidth = lineWidth
      this.beginDraw(ctx)
      let { x, y, w, h } = this.selectorRect()
      ctx.beginPath()
      ctx.rect(x, y, w, h)
      ctx.closePath()

      ctx.strokeStyle = locked ? '#ffffff88' : '#ffffff'
      ctx.setLineDash([])
      ctx.stroke()
      ctx.strokeStyle = locked ? '#00000088' : '#000000'
      ctx.setLineDash(locked ? [lineWidth * 8] : [lineWidth * 4])
      ctx.stroke()

      if (!locked && this._resizable === Resizable.All) {
        ctx.fillStyle = 'white'
        ctx.setLineDash([]);
        const {
          s, lx, rx, ty, by, mx, my,
        } = this.getResizerNumbers(x, y, w, h)

        // top resizer
        ctx.beginPath()
        ctx.rect(mx, ty, s, s)
        ctx.fill()
        ctx.stroke()

        // bottom resizer
        ctx.beginPath()
        ctx.rect(mx, by, s, s)
        ctx.fill()
        ctx.stroke()

        // left resizer
        ctx.beginPath()
        ctx.rect(lx, my, s, s)
        ctx.fill()
        ctx.stroke()

        // right resizer
        ctx.beginPath()
        ctx.rect(rx, my, s, s)
        ctx.fill()
        ctx.stroke()

        // top-left resizer
        ctx.beginPath()
        ctx.rect(lx, ty, s, s)
        ctx.fill()
        ctx.stroke()

        // top-right resizer
        ctx.beginPath()
        ctx.rect(rx, ty, s, s)
        ctx.fill()
        ctx.stroke()

        // bottom-left resizer
        ctx.beginPath()
        ctx.rect(lx, by, s, s)
        ctx.fill()
        ctx.stroke()

        // bottom-right resizer
        ctx.beginPath()
        ctx.rect(rx, by, s, s)
        ctx.fill()
        ctx.stroke()
      }
      this.endDraw(ctx)
    }
  }

  /**
   * 绘制矩形
   * 
   * @returns 
   */
  drawingRect(): IRect {
    const d = this._data
    return {
      x: Math.floor(d.x),
      y: Math.floor(d.y),
      w: Math.floor(d.w),
      h: Math.floor(d.h)
    }
  }

  selectorRect(): IRect {
    const { w, h, locked, lineWidth } = this.data
    const hlw = Math.floor(lineWidth / 2)
    const offset = locked ? 0 : 0.5
    return {
      x: offset - hlw,
      y: offset - hlw,
      w: Math.floor(w + hlw * 2) - 1,
      h: Math.floor(h + hlw * 2) - 1
    }
  }

  /**
   * 获取包围盒矩形
   *
   * @return {IRect} 包围盒矩形
   * @memberof Shape
   */
  boundingRect(): IRect {
    const d = this.data
    const offset = (d.lineWidth % 2) ? 1 : 0
    const overDraw1 = 1
    const overDraw2 = overDraw1 * 2
    if (!d.r)
      return {
        x: Math.floor(d.x - d.lineWidth / 2 - overDraw1),
        y: Math.floor(d.y - d.lineWidth / 2 - overDraw1),
        w: Math.ceil(d.w + d.lineWidth + offset + overDraw2),
        h: Math.ceil(d.h + d.lineWidth + offset + overDraw2)
      }

    const w = Math.abs(d.w * Math.cos(d.r)) + Math.abs(d.h * Math.sin(d.r))
    const h = Math.abs(d.w * Math.sin(d.r)) + Math.abs(d.h * Math.cos(d.r))
    const x = d.x - (w - d.w) / 2
    const y = d.y - (h - d.h) / 2
    return {
      x: Math.floor(x - d.lineWidth / 2 - overDraw1),
      y: Math.floor(y - d.lineWidth / 2 - overDraw1),
      w: Math.ceil(w + d.lineWidth + offset + overDraw2),
      h: Math.ceil(h + d.lineWidth + offset + overDraw2)
    }
  }

  getResizerNumbers(x: number, y: number, w: number, h: number) {
    const lw = 1
    const hlw = lw / 2
    const s = this._board?.factory.resizer.size || 10;
    return {
      s,
      lx: x,
      rx: x + w - s,
      ty: y,
      by: y + h - s,
      mx: Math.floor(x + (w - s) / 2) - hlw,
      my: Math.floor(y + (h - s) / 2) - hlw,
    }
  }

  map2me(pointerX: number, pointerY: number): IVector {
    const { r, x, y, w, h } = this.data
    if (!r) return { x: pointerX, y: pointerY }
    const x2 = x + w / 2
    const y2 = y + h / 2
    const cr = Math.cos(-r)
    const sr = Math.sin(-r)
    const dx = pointerX - x2
    const dy = pointerY - y2
    return {
      x: dx * cr - dy * sr + x2,
      y: dx * sr + dy * cr + y2
    }
  }

  resizeDirection(pointerX: number, pointerY: number): [ResizeDirection, Rect | undefined] {
    if (!this.selected || !this._resizable || this.ghost || this.locked) {
      return [ResizeDirection.None, undefined];
    }
    const { x: l, y: t } = this.data
    const { x, y, w, h } = this.selectorRect();
    const { s, lx, rx, ty, by, mx, my } = this.getResizerNumbers(l + x, t + y, w, h)

    const pos = { x: pointerX, y: pointerY }
    const rect = new Rect(0, 0, s, s);

    rect.moveTo(mx, ty)
    if (rect.hit(pos)) {
      return [ResizeDirection.Top, rect];
    }
    rect.moveTo(mx, by);
    if (rect.hit(pos)) {
      return [ResizeDirection.Bottom, rect];
    }
    rect.moveTo(lx, my);
    if (rect.hit(pos)) {
      return [ResizeDirection.Left, rect];
    }
    rect.moveTo(rx, my);
    if (rect.hit(pos)) {
      return [ResizeDirection.Right, rect];
    }

    rect.moveTo(lx, ty)
    if (rect.hit(pos)) {
      return [ResizeDirection.TopLeft, rect];
    }
    rect.moveTo(rx, ty);
    if (rect.hit(pos)) {
      return [ResizeDirection.TopRight, rect];
    }
    rect.moveTo(lx, by);
    if (rect.hit(pos)) {
      return [ResizeDirection.BottomLeft, rect];
    }
    rect.moveTo(rx, by);
    if (rect.hit(pos)) {
      return [ResizeDirection.BottomRight, rect];
    }
    return [ResizeDirection.None, undefined]
  }

  protected beginDraw(ctx: CanvasRenderingContext2D): void {
    let { x, y, w, h, rotation } = this.data
    ctx.save()
    x = Math.floor(x)
    y = Math.floor(y)
    const hw = Math.floor(w / 2)
    const hh = Math.floor(h / 2)
    if (rotation) {
      ctx.translate(x + hw, y + hh)
      ctx.rotate(rotation)
      ctx.translate(- hw, - hh)
    } else {
      ctx.translate(x, y)
    }
  }
  protected endDraw(ctx: CanvasRenderingContext2D): void {
    ctx.restore()
  }
}