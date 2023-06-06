import { SubwinFooter } from "./SubwinFooter";
import { SubwinHeader } from "./SubwinHeader";
import type { SubwinWorkspace } from "./SubwinWorkspace";
import { View } from "./View";

export class Subwin extends View<'div'> {
  private _workspace?: SubwinWorkspace;
  private _header = new SubwinHeader();
  private _footer = new SubwinFooter();
  private _content?: View | null;
  get workspace() { return this._workspace; }
  set workspace(v) { this._workspace = v; }
  get header() { return this._header; };
  get footer() { return this._footer; };
  get content() { return this._content; }
  set content(v) {
    if (this._content) { this.removeChild(this._content); }
    this._content = v;
    if (v) { this.insertBefore(this._footer, v); }
  }

  constructor() {
    super('div');
    this.styles().apply('normal', {
      left: '' + 100 + 'px',
      top: '' + 100 + 'px',
      position: 'fixed',
      background: '#555555',
      overflow: 'hidden',
      border: '1px solid black',
      resize: 'both',
      boxShadow: '5px 5px 10px 10px #00000022',
      borderRadius: 5,
      display: 'flex',
      flexDirection: 'column',
    })
    this.addChild(this._header);
    this.addChild(this._footer);
  }
}

