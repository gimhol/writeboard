import { ToolsView } from "../layers_view";
import { SubwinFooter } from "./SubwinFooter";
import { SubwinHeader } from "./SubwinHeader";
import { View } from "./View";

export class Subwin extends View<'div'> {
  private _header = new SubwinHeader();
  private _footer = new SubwinFooter();
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
    this.styleHolder().applyStyle('normal', {
      left: '' + 100 + 'px',
      top: '' + 100 + 'px',
      position: 'fixed',
      background: '#555555',
      overflow: 'hidden',
      border: '1px solid black',
      resize: 'both',
      boxShadow: '5px 5px 10px 10px #00000022',
      borderRadius: '5px',
      display: 'flex',
      flexDirection: 'column',
    })
    this.addChild(this._header);
    this.addChild(this._footer);
  }
}

export class MergedSubwin extends Subwin {
  private subwins: Subwin[] = [];
  constructor() {
    super();
    this.header.iconView.inner.innerHTML = '▨'
    this.content = new View('div');
    this.content?.styleHolder().applyStyle('', {
      position: 'relative',
      flex: 1
    })
    this.styleHolder().applyStyle('normal', v => ({
      ...v,
      minWidth: '100px',
      minHeight: '100px',
    }))
    this.removeChild(this.footer);
  }
  addSubWin(subwin: Subwin) {
    if (this.subwins.indexOf(subwin) >= 0) { return; }

    this.subwins.push(subwin);
    subwin.styleHolder().applyStyle('merged', {
      'position': 'absolute',
      'left': '0px',
      'right': '0px',
      'top': '0px',
      'bottom': '0px',
      'border': 'none',
      'boxShadow': 'none',
    })
    subwin.header.styleHolder().applyStyle('merged', { display: 'none' })
    this.content?.addChild(subwin);
  }
}