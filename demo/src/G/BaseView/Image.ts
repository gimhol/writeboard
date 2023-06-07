import { Style } from "./StyleType";
import { View } from "./View";
export interface ImageInit {
  src?: string;
  styles?: Style;
}
export class Image extends View<'img'>{
  get src() { return this._inner.src; }
  set src(v) { this._inner.src = v; }

  constructor(inits?: ImageInit) {
    super('img');
    inits?.src && (this.src = inits.src);
    inits?.styles && (this.styles().apply('_', inits.styles))
  }
}