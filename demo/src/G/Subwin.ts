import { SubwinFooter as SubwinFooter } from "./SubwinFooter";
import { SubwinHeader as SubwinHeader } from "./SubwinHeader";
import { View } from "./View";
export interface SubwinWorkspaceInits {
  wins?: Subwin[];
  zIndex?: number;
}
export class SubwinWorkspace {
  private _zIndex: number = 0;
  private _wins: Subwin[] = []
  private _pointerdowns = new Map<Subwin, () => void>();

  private _handleClick = (target: Subwin) => {
    this._wins.splice(this._wins.indexOf(target), 1);
    this._wins.push(target);
    this._wins.forEach((win, idx) => win.inner.style.zIndex = `${this._zIndex + idx}`);
  }
  constructor(inits: SubwinWorkspaceInits) {
    if (inits?.wins)
      this.addSubWin(...inits.wins);
    this._zIndex = inits?.zIndex ?? this._zIndex;
  }
  addSubWin(...subWins: Subwin[]) {
    this._wins.forEach(v => {
      const l = this._pointerdowns.get(v);
      if (l) {
        v.inner.removeEventListener('pointerdown', l);
        v.inner.removeEventListener('touchstart', l)
      }
    });
    this._wins = Array.from(new Set(this._wins.concat(subWins)));
    this._wins.forEach((v, idx) => {
      const l = () => this._handleClick(v);
      this._pointerdowns.set(v, l);
      v.inner.addEventListener('pointerdown', l)
      v.inner.addEventListener('touchstart', l)
      v.inner.style.zIndex = `${this._zIndex + idx}`
    });
  }
}
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
      minWidth: '225px',
      minHeight: '225px',
      width: '225px',
      height: '225px',
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
    this.onClick(() => {
    })
  }
}
