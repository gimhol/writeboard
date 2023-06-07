import { View } from "./View";

export class Canvas extends View<'canvas'> {
  set width(v) { this._inner.width = v; }
  get width() { return this._inner.width; }
  set height(v) { this._inner.height = v; }
  get height() { return this._inner.height; }
  constructor() { super('canvas'); }
}