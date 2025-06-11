import { Css } from "../utils/Css";
Css.add(`
/*whiteboard STYLES*/
.g_whiteboard_layer {
  position: absolute;
  touch-action: none;
  user-select: none;
  left: 0px;
  right: 0px;
  top: 0px;
  bottom: 0px;
  transition: opacity 200ms;
  outline: none;
}`)

export interface ILayerInfoInit {
  readonly id: string;
  readonly name: string;
}

export interface ILayerInits {
  readonly info: ILayerInfoInit;
  readonly onscreen?: HTMLCanvasElement;
}

export interface ILayerInfo {
  id: string;
  name: string;
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

export class LayerInfo implements ILayerInfo {
  id: string;
  name: string;
  constructor(inits: ILayerInfoInit) {
    this.id = inits.id;
    this.name = inits.name;
  }
}

export class Layer implements ILayer {
  protected _info: ILayerInfo;
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
  get opacity() { return Number(this._offscreen.style.opacity) };
  set opacity(v) { this._onscreen.style.opacity = '' + v };
  get id() { return this._info.id; }

  private _own_onscreen = false;
  private _own_offscreen = false;

  constructor(inits: ILayerInits) {
    this._info = new LayerInfo(inits.info);
    this._onscreen = inits.onscreen ?? document.createElement('canvas');
    this._own_onscreen = !inits.onscreen;

    this._onscreen.setAttribute('layer_id', this.id);
    this._onscreen.setAttribute('layer_name', this.name);

    this._onscreen.draggable = false;
    this._onscreen.classList.add('g_whiteboard_layer');
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
    this._onscreen.width = v;
    this._offscreen.width = v;
  }
  get height() {
    return this._onscreen.height;
  }
  set height(v: number) {
    this._onscreen.height = v;
    this._offscreen.height = v;
  }
  destory() {
    if (this._own_onscreen) this._onscreen.remove();
    if (this._own_offscreen) this._offscreen.remove();
  }
}