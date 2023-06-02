import { FloatingSubwinFooter } from "./FloatingSubwinFooter";
import { FloatingSubwinHeader } from "./FloatingSubwinHeader";
import { View } from "./View";


export class FloatingSubwin extends View<'div'> {
  private _header = new FloatingSubwinHeader();
  private _footer = new FloatingSubwinFooter();
  private _content?: View | null;

  get header() { return this._header; };
  get footer() { return this._footer; };

  get content() { return this._content; }
  set content(v) {
    if (this._content) { this.removeChild(this._content); }
    this._content = v;
    if (v) { this.insertBefore(v, this._footer); }
  }
  constructor() {
    super('div');
    this._inner.style.left = '' + 100 + 'px';
    this._inner.style.top = '' + 100 + 'px';
    this._inner.style.position = 'fixed';
    this._inner.style.background = '#555555';
    this._inner.style.zIndex = '10000';
    this._inner.style.minWidth = '200px';
    this._inner.style.minHeight = '200px';
    this._inner.style.width = '200px';
    this._inner.style.height = '200px';
    this._inner.style.overflow = 'hidden';
    this._inner.style.border = '1px solid black';
    this._inner.style.resize = 'both';
    this._inner.style.boxShadow = '5px 5px 10px 10px #00000022';
    this._inner.style.borderRadius = '5px';
    this._inner.style.display = 'flex';
    this._inner.style.flexDirection = 'column';
    this.addChild(this._header);
    this.addChild(this._footer);
  }
}
