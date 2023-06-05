import { Subwin } from "./Subwin";
import { GetStyle } from "./View";
export interface SubwinWorkspaceInits {
  wins?: Subwin[];
  zIndex?: number;
}
export class SubwinWorkspace {
  private _zIndex: number = 0;
  private _wins: Subwin[] = [];
  private _pointerdowns = new Map<Subwin, () => void>();

  private _handleClick = (target: Subwin) => {
    this._wins.splice(this._wins.indexOf(target), 1);
    this._wins.push(target);
    this._wins.forEach((win, idx, arr) => {
      win.styleHolder().applyStyle('in_workspace', v => ({
        ...v,
        zIndex: `${this._zIndex + idx}`
      }))

      if (idx < arr.length - 1) {
        const style: GetStyle = {
          opacity: '0.8'
        };
        win.header.styleHolder().applyStyle('not_top_in_workspace', style);
        win.content?.styleHolder().applyStyle('not_top_in_workspace', style);
        win.footer?.styleHolder().applyStyle('not_top_in_workspace', style);
      } else {
        win.header.styleHolder().forgoStyle('not_top_in_workspace');
        win.content?.styleHolder().forgoStyle('not_top_in_workspace');
        win.footer?.styleHolder().forgoStyle('not_top_in_workspace');
      }
    });
  };
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
        v.inner.removeEventListener('touchstart', l);
      }
    });
    this._wins = Array.from(new Set(this._wins.concat(subWins)));
    this._wins.forEach((v, idx) => {
      const l = () => this._handleClick(v);
      this._pointerdowns.set(v, l);
      v.inner.addEventListener('pointerdown', l);
      v.inner.addEventListener('touchstart', l);
      v.inner.style.zIndex = `${this._zIndex + idx}`;
    });
  }
}
