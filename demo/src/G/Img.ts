import { Style } from "./Styles";
import { View } from "./View";
export interface ImgInit {
  src?: string;
  styles?: Style;
}
export class Img extends View<'img'>{
  get src() { return this._inner.src; }
  set src(v) { this._inner.src = v; }

  constructor(inits?: ImgInit) {
    super('img');
    inits?.src && (this.src = inits.src);
    inits?.styles && (this.styleHolder().applyStyle('', inits.styles))
  }
}