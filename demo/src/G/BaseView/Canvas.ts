import { View } from "./View";

export class Canvas extends View<'canvas'> {
  set width(v) { this.inner.width = v; }
  get width() { return this.inner.width; }
  set height(v) { this.inner.height = v; }
  get height() { return this.inner.height; }
  constructor() { super('canvas'); }
}