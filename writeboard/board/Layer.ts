import styles from "../styles.module.scss"
const { floor, min } = Math;
/**
 * 图层的基本信息（id 与名字）：可以被安全地序列化与传递
 *
 * Basic info of a layer (id and name), safe to serialise and to pass around.
 */
export interface ILayerInfo {
  /**
   * 图层 id（板内唯一）
   *
   * Layer id, unique inside one board.
   */
  id: string;
  /**
   * 图层名（只用于展示）
   *
   * Layer name (display only).
   */
  name: string;
}
/**
 * 创建图层时的初始化参数
 *
 * Init options used to create a layer.
 */
export interface ILayerInits extends ILayerInfo {
  /**
   * 现成的屏幕画布（缺省时新建一个）
   *
   * An existing on-screen canvas (a new one is created when omitted).
   */
  readonly onscreen?: HTMLCanvasElement;
}
/**
 * 图层：一块屏幕画布加一块离屏画布（离屏画布是渲染结果的权威副本）
 *
 * A layer: one on-screen canvas plus one off-screen canvas (the off-screen canvas is
 * the authoritative copy of what has been rendered).
 */
export interface ILayer {
  /**
   * 图层名（只用于展示）
   *
   * Layer name (display only).
   */
  readonly name: string;
  /**
   * 图层信息（id 与名字）
   *
   * Layer info (id and name).
   */
  readonly info: ILayerInfo;
  /**
   * 屏幕画布：挂在板元素上，用户看到的就是它
   *
   * On-screen canvas: attached to the board element, this is what the user sees.
   */
  readonly onscreen: HTMLCanvasElement;
  /**
   * 离屏画布：渲染结果的权威副本，脏区先画在它上面再拷到屏幕画布
   *
   * Off-screen canvas: the authoritative copy of the rendering, dirty regions are drawn
   * on it first and copied onto the on-screen canvas afterwards.
   */
  readonly offscreen: HTMLCanvasElement;
  /**
   * 屏幕画布的 2D 上下文
   *
   * 2D context of the on-screen canvas.
   */
  readonly ctx: CanvasRenderingContext2D;
  /**
   * 离屏画布的 2D 上下文
   *
   * 2D context of the off-screen canvas.
   */
  readonly octx: CanvasRenderingContext2D;
  /**
   * 图层不透明度（0 ~ 1，落在屏幕画布的 style 上）
   *
   * Layer opacity (0 ~ 1, stored in the style of the on-screen canvas).
   */
  opacity: number;
}

/**
 * 复用的临时画布：改 canvas.width / canvas.height 会清空位图，保留内容时先抄到它、改完尺寸再贴回
 *
 * Reusable scratch canvas: assigning canvas.width / canvas.height clears the bitmap, so
 * the old content is copied here first and painted back after the resize.
 */
let scratch: HTMLCanvasElement | undefined

/**
 * 图层信息的默认实现
 *
 * Default implementation of ILayerInfo.
 */
export class LayerInfo implements ILayerInfo {
  /**
   * 图层 id
   *
   * Layer id.
   */
  id: string;
  /**
   * 图层名
   *
   * Layer name.
   */
  name: string;
  /**
   * 用一份图层信息建一个副本
   *
   * Creates a copy from the given layer info.
   *
   * @param {ILayerInfo} inits 图层信息 / Layer info
   */
  constructor(inits: ILayerInfo) {
    this.id = inits.id;
    this.name = inits.name;
  }
  /**
   * 导出一份纯数据副本（不带类信息，便于序列化与传递）
   *
   * Exports a plain data copy (without the class, easy to serialise and to pass around).
   *
   * @return {ILayerInfo} 纯数据图层信息 / Plain layer info
   */
  pure(): ILayerInfo {
    return { id: this.id, name: this.name }
  }
}

/**
 * 图层：管着自己的屏幕画布与离屏画布，尺寸变化时两块一起调整
 *
 * A layer: owns its on-screen and off-screen canvas, which are resized together.
 */
export class Layer implements ILayer {
  protected _info: LayerInfo;
  protected _onscreen: HTMLCanvasElement;
  protected _offscreen: HTMLCanvasElement;
  protected _ctx: CanvasRenderingContext2D;
  protected _octx: CanvasRenderingContext2D;

  /**
   * 图层名
   *
   * Layer name.
   */
  get name() { return this._info.name };
  /**
   * 图层信息（id 与名字）
   *
   * Layer info (id and name).
   */
  get info() { return this._info };
  /**
   * 屏幕画布
   *
   * On-screen canvas.
   */
  get onscreen() { return this._onscreen };
  /**
   * 离屏画布（渲染结果的权威副本）
   *
   * Off-screen canvas (the authoritative copy of the rendering).
   */
  get offscreen() { return this._offscreen };
  /**
   * 屏幕画布的 2D 上下文
   *
   * 2D context of the on-screen canvas.
   */
  get ctx() { return this._ctx };
  /**
   * 离屏画布的 2D 上下文
   *
   * 2D context of the off-screen canvas.
   */
  get octx() { return this._octx };
  /**
   * 图层不透明度（0 ~ 1）
   *
   * Layer opacity (0 ~ 1).
   */
  get opacity() {
    const v = this._onscreen.style.opacity;
    return v === '' ? 1 : Number(v);
  };
  /**
   * 设置图层不透明度（0 ~ 1）
   *
   * Sets the layer opacity (0 ~ 1).
   */
  set opacity(v) { this._onscreen.style.opacity = '' + v };
  /**
   * 图层 id
   *
   * Layer id.
   */
  get id() { return this._info.id; }

  private _own_onscreen = false;
  private _own_offscreen = false;

  /**
   * 创建图层：没有现成的屏幕画布就新建一块，并配上一块同尺寸的离屏画布
   *
   * Creates a layer: an on-screen canvas is created unless one was given, together with
   * an off-screen canvas of the same size.
   *
   * @param {ILayerInits} inits 图层初始化参数 / Layer init options
   */
  constructor(inits: ILayerInits) {
    this._info = new LayerInfo(inits);
    this._onscreen = inits.onscreen ?? document.createElement('canvas');
    this._own_onscreen = !inits.onscreen;

    this._onscreen.setAttribute('layer_id', this.id);
    this._onscreen.setAttribute('layer_name', this.name);

    this._onscreen.draggable = false;
    this._onscreen.classList.add(styles.layer_onscreen_canvas);
    this._ctx = this._onscreen.getContext('2d')!

    this._offscreen = document.createElement('canvas')
    // this._offscreen.style.position = 'fixed'
    // this._offscreen.style.border = '1px solid black'
    // document.body.appendChild(this._offscreen)
    this._own_offscreen = true
    this._offscreen.width = this._onscreen.width;
    this._offscreen.height = this._onscreen.height;
    this._octx = this._offscreen.getContext('2d')!

  }
  /**
   * 图层宽度（画布像素）
   *
   * Layer width in canvas pixels.
   */
  get width() {
    return this._onscreen.width;
  }
  /**
   * 设置图层宽度（两块画布一起改）
   *
   * Sets the layer width (both canvases are resized).
   */
  set width(v: number) {
    this.resize(v, this.height);
  }
  /**
   * 图层高度（画布像素）
   *
   * Layer height in canvas pixels.
   */
  get height() {
    return this._onscreen.height;
  }
  /**
   * 设置图层高度（两块画布一起改）
   *
   * Sets the layer height (both canvases are resized).
   */
  set height(v: number) {
    this.resize(this.width, v);
  }

  /**
   * 调整图层画布尺寸（屏幕画布与离屏画布一起）
   *
   * Resizes the on-screen and the off-screen canvas of this layer together.
   * 画布尺寸只能取整；尺寸真的变了才会动画布（同值赋值也会清空位图）。
   *
   * Canvas sizes are integers and the canvases are only touched when the size really
   * changes (assigning the same value clears the bitmap too).
   *
   * @param {number} w 新宽度（画布像素）/ New width in canvas pixels
   * @param {number} h 新高度（画布像素）/ New height in canvas pixels
   * @param {boolean} [preserve] 是否保留旧内容：保留时先把旧内容抄到临时画布、改完尺寸再贴回，
   *   屏幕画布同步铺上离屏画布的对应区域（离屏画布是渲染结果的权威副本）
   *   Whether to keep the old pixels: they are copied to a scratch canvas before the
   *   resize and painted back afterwards, and the on-screen canvas gets the matching
   *   region of the off-screen one (the off-screen canvas is the authoritative copy)
   */
  resize(w: number, h: number, preserve = false) {
    const ow = this._onscreen.width
    const oh = this._onscreen.height
    const nw = floor(w)
    const nh = floor(h)
    if (ow === nw && oh === nh) return
    if (preserve && ow > 0 && oh > 0 && nw > 0 && nh > 0) {
      const temp = scratch ?? (scratch = document.createElement('canvas'))
      temp.width = ow
      temp.height = oh
      temp.getContext('2d')!.drawImage(this._offscreen, 0, 0)
      this._offscreen.width = nw
      this._offscreen.height = nh
      const cw = min(ow, nw)
      const ch = min(oh, nh)
      this._octx.drawImage(temp, 0, 0, cw, ch, 0, 0, cw, ch)
      // 改尺寸会重置上下文状态，这里直接按画布坐标铺，与 render() 的约定一致
      this._onscreen.width = nw
      this._onscreen.height = nh
      this._ctx.drawImage(this._offscreen, 0, 0, cw, ch, 0, 0, cw, ch)
    } else {
      this._offscreen.width = nw
      this._offscreen.height = nh
      this._onscreen.width = nw
      this._onscreen.height = nh
    }
  }
  /**
   * 销毁图层：自建的画布会被移出 DOM（外部传入的屏幕画布保留）
   *
   * Destroys the layer: canvases created by the layer are removed from the DOM, while an
   * on-screen canvas passed in from outside is left alone.
   */
  destroy() {
    if (this._own_onscreen) this._onscreen.remove();
    if (this._own_offscreen) this._offscreen.remove();
  }

  /**
   * @deprecated 拼写错误，请使用 destroy()
   * @deprecated misspelled, use destroy() instead
   */
  destory() { this.destroy(); }
}