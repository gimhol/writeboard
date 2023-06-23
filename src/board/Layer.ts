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

  constructor(inits: ILayerInits) {
    this._info = new LayerInfo(inits.info);
    this._onscreen = inits.onscreen ?? document.createElement('canvas');
    this._onscreen.setAttribute('layer_id', this.id);
    this._onscreen.setAttribute('layer_name', this.name);
    this._onscreen.tabIndex = 0;
    this._onscreen.draggable = false;
    this._onscreen.style.position = 'absolute';
    this._onscreen.style.touchAction = 'none';
    this._onscreen.style.userSelect = 'none';
    this._onscreen.style.left = '0px';
    this._onscreen.style.right = '0px';
    this._onscreen.style.top = '0px';
    this._onscreen.style.bottom = '0px';
    this._onscreen.style.transition = 'opacity 200ms';
    this._onscreen.style.outline = 'none';
    this._onscreen.addEventListener('pointerdown', () => {
      this._onscreen.focus();
    }, { passive: true })
    this._ctx = this._onscreen.getContext('2d')!
    this._offscreen = document.createElement('canvas')
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
}