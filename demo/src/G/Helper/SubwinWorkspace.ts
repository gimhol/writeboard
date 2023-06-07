import { EventType } from "../Events/EventType";
import { Subwin } from "../CompoundView/Subwin";
import { View } from "../BaseView/View";
import { GetValue, Rect, getValue } from "../utils";

export interface SubwinWorkspaceInits {
  view?: View;
  rect?: GetValue<Rect>;
  wins?: Subwin[];
  zIndex?: number;
}
export class SubwinWorkspace {
  private _view?: View;
  private _rect?: GetValue<Rect>;
  private _zIndex: number = 0;
  private _wins: Subwin[] = [];
  private _pointerdowns = new Map<Subwin, () => void>();
  private _updateSubWinStyle() {
    this._wins.forEach((win, idx, arr) => {
      win.styles().apply('in_workspace', v => ({
        ...v,
        zIndex: `${this._zIndex + idx}`
      }))
      idx < arr.length - 1 ? win.lower() : win.raise();
    });
  }
  private _handleClick = (target: Subwin) => {
    this._wins.splice(this._wins.indexOf(target), 1);
    this._wins.push(target);
    this._updateSubWinStyle();
  }
  constructor(inits: SubwinWorkspaceInits) {
    this._rect = inits.rect;
    this._zIndex = inits?.zIndex ?? this._zIndex;
    this._view = inits.view
    if (inits?.wins) {
      this.addSubWin(...inits.wins);
      this._updateSubWinStyle();
    }
  }
  clampAllSubwin() {
    const rect = getValue(this._rect);
    if (!rect) { return; }
    this._wins.forEach(v => this.clampSubwin(v, rect));
  }
  clampSubwin(subwin: Subwin, rect: Rect) {
    let {
      offsetLeft: x,
      offsetTop: y,
      offsetWidth: w,
      offsetHeight: h,
    } = subwin.inner
    if (x + w > rect.x + rect.w) { x = rect.x + rect.w - w }
    if (y + h > rect.y + rect.h) { y = rect.y + rect.h - h }
    if (y < rect.y) { y = rect.y; }
    if (x < rect.x) { x = rect.x; }
    subwin.styles().apply('drag_by_dragger', {
      left: '' + x + 'px',
      top: '' + y + 'px',
    });
  }
  private subwinListening(subwin: Subwin, listen: boolean) {
    if (listen) {
      const listener = () => this._handleClick(subwin);
      this._pointerdowns.set(subwin, listener);
      subwin.inner.addEventListener('pointerdown', listener);
      subwin.inner.addEventListener('touchstart', listener);
      subwin.inner.addEventListener(EventType.ViewDragStart, (e) => { })
      subwin.inner.addEventListener(EventType.ViewDragging, (e) => { })
      subwin.inner.addEventListener(EventType.ViewDragEnd, (e) => {
        const rect = getValue(this._rect);
        if (!rect) { return; }
        this.clampSubwin(subwin, rect);
      })
    } else {
      const listener = this._pointerdowns.get(subwin);
      if (listener) {
        subwin.inner.removeEventListener('pointerdown', listener);
        subwin.inner.removeEventListener('touchstart', listener);
      }
    }
  }
  addSubWin(...subwins: Subwin[]) {
    this._wins.forEach(v => this.subwinListening(v, false));
    this._wins = Array.from(new Set(this._wins.concat(subwins)));
    this._wins.forEach(v => this.subwinListening(v, true));
  }
  removeSubwin(...subwins: Subwin[]) {
    subwins.forEach(v => this.subwinListening(v, false));
    this._wins.filter(v => subwins.indexOf(v) < 0);
  }
}