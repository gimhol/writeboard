export interface ILayerInfoInit {
  readonly name: string;
}
export interface ILayerInits {
  readonly info: ILayerInfoInit;
  readonly onscreen: HTMLCanvasElement;
}
export interface ILayerInfo {
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
  protected _name: string;
  get name() { return this._name };
  constructor(inits: ILayerInfoInit) {
    this._name = inits.name;
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
  set opacity(v) { this._offscreen.style.opacity = '' + v };

  constructor(inits: ILayerInits) {
    this._info = new LayerInfo(inits.info);
    this._onscreen = inits.onscreen;
    this._ctx = this._onscreen.getContext('2d')!
    this._offscreen = document.createElement('canvas')
    this._offscreen.width = inits.onscreen.width;
    this._offscreen.height = inits.onscreen.height;
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