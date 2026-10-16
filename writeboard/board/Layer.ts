import styles from "../styles.module.scss"
const { floor, min } = Math;
export interface ILayerInfo {
  id: string;
  name: string;
}
export interface ILayerInits extends ILayerInfo {
  readonly onscreen?: HTMLCanvasElement;
}
export interface ILayer {
  readonly name: string;
  readonly info: ILayerInfo;
  readonly onscreen: HTMLCanvasElement;
  readonly offscreen: HTMLCanvasElement;
  readonly ctx: CanvasRenderingContext2D;
  readonly octx: CanvasRenderingContext2D;
  opacity: number;
}

/** 复用的临时画布：改 canvas.width / canvas.height 会清空位图，保留内容时先抄到它、改完尺寸再贴回 */
let scratch: HTMLCanvasElement | undefined

export class LayerInfo implements ILayerInfo {
  id: string;
  name: string;
  constructor(inits: ILayerInfo) {
    this.id = inits.id;
    this.name = inits.name;
  }
  pure(): ILayerInfo {
    return { id: this.id, name: this.name }
  }
}

export class Layer implements ILayer {
  protected _info: LayerInfo;
  protected _onscreen: HTMLCanvasElement;
  protected _offscreen: HTMLCanvasElement;
  protected _ctx: CanvasRenderingContext2D;
  protected _octx: CanvasRenderingContext2D;

  get name() { return this._info.name };
  get info() { return this._info };
  get onscreen() { return this._onscreen };
  get offscreen() { return this._offscreen };
  get ctx() { return this._ctx };
  get octx() { return this._octx };
  get opacity() {
    const v = this._onscreen.style.opacity;
    return v === '' ? 1 : Number(v);
  };
  set opacity(v) { this._onscreen.style.opacity = '' + v };
  get id() { return this._info.id; }

  private _own_onscreen = false;
  private _own_offscreen = false;

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
  get width() {
    return this._onscreen.width;
  }
  set width(v: number) {
    this.resize(v, this.height);
  }
  get height() {
    return this._onscreen.height;
  }
  set height(v: number) {
    this.resize(this.width, v);
  }

  /**
   * 调整图层画布尺寸（屏幕画布与离屏画布一起）
   *
   * @description 画布尺寸只能取整；尺寸真的变了才会动画布（同值赋值也会清空位图）
   * @param {number} w 新宽度（画布像素）
   * @param {number} h 新高度（画布像素）
   * @param {boolean} [preserve] 是否保留旧内容：保留时先把旧内容抄到临时画布、改完尺寸再贴回，
   *   屏幕画布同步铺上离屏画布的对应区域（离屏画布是渲染结果的权威副本）
   * @memberof Layer
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