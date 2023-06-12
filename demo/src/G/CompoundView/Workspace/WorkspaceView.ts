import { View } from "../../BaseView/View";
import { EventType } from "../../Events/EventType";
import { GetValue, Rect, getValue } from "../../utils";
import { Subwin } from "../Subwin";
import { Direction, DockView } from "./DockView";
import { IndicatorImage } from "./IndicatorImage";

export interface WorkspaceInits {
  rect?: GetValue<Rect>;
  wins?: Subwin[];
  zIndex?: number;
}

export class WorkspaceView<T extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap> extends View<T> {
  private _rect?: GetValue<Rect>;
  private _zIndex: number = 0;
  private _pointerdowns = new Map<Subwin, () => void>();
  private _draggingSubwin: Subwin | null = null;
  private _undockedWins: Subwin[] = [];
  private _updateUndockedWinsStyle() {
    this.undockedWins.forEach((win, idx, arr) => {
      win.styles.apply(
        'free_in_workspace', {
        zIndex: `${this._zIndex + idx}`,
        maxWidth: '100%',
        maxHeight: '100%'
      });
      idx < arr.length - 1 ? win.lower() : win.raise();
    });
  }
  private _handleClick = (subwin: Subwin) => {
    const idx = this._undockedWins.findIndex(a => a === subwin);
    this._undockedWins.splice(idx, 1);
    this._undockedWins.push(subwin);
    this._updateUndockedWinsStyle()
  };

  private _dockLeftIndicator = new IndicatorImage({
    src: './ic_dock_to_left.svg', style: {
      position: 'absolute', left: 16, top: 'calc(50% - 24px)'
    }
  })
  private _dockTopIndicator = new IndicatorImage({
    src: './ic_dock_to_top.svg', style: {
      position: 'absolute', left: 'calc(50% - 24px)', top: 16
    }
  })
  private _dockRightIndicator = new IndicatorImage({
    src: './ic_dock_to_right.svg', style: {
      position: 'absolute', right: 16, top: 'calc(50% - 24px)'
    }
  })
  private _dockBottomIndicator = new IndicatorImage({
    src: './ic_dock_to_bottom.svg', style: {
      position: 'absolute', left: 'calc(50% - 24px)', bottom: 16
    }
  })
  private _dockView = new DockView();
  get dockView() { return this._dockView }
  constructor(element: HTMLElementTagNameMap[T], inits: WorkspaceInits);
  constructor(tagName: T, inits: WorkspaceInits);
  constructor(arg0: any, inits: WorkspaceInits) {
    super(arg0);
    this.styles.applyCls('workspaceView')
    this._rect = inits.rect;
    this._zIndex = inits?.zIndex ?? this._zIndex;
    this.addChild(this._dockView);
    this.addChild(this._dockLeftIndicator);
    this.addChild(this._dockRightIndicator);
    this.addChild(this._dockTopIndicator);
    this.addChild(this._dockBottomIndicator);
    inits?.wins && this.addChild(...inits.wins);
  }
  dockToTop(subwin: Subwin): void {
    if (Direction.V === this._dockView.direction) {
      this._dockView.insertChild(0, subwin);
    } else {
      this._dockView = new DockView(Direction.V).insertChild(0, subwin, this._dockView);
      this.addChild(this._dockView)
    }
  }
  dockToBottom(subwin: Subwin): void {
    if (Direction.V === this._dockView.direction) {
      this._dockView.addChild(subwin);
    } else {
      this._dockView = new DockView(Direction.V).addChild(this._dockView, subwin);
      this.addChild(this._dockView)
    }
  }
  dockToLeft(subwin: Subwin): void {
    if (Direction.H === this._dockView.direction) {
      this._dockView.insertChild(0, subwin);
    } else {
      this._dockView = new DockView(Direction.H).insertChild(0, subwin, this._dockView);
      this.addChild(this._dockView)
    }
  }
  dockToRight(subwin: Subwin): void {
    if (Direction.H === this._dockView.direction) {
      this._dockView.addChild(subwin);
    } else {
      this._dockView = new DockView(Direction.H).addChild(this._dockView, subwin);
      this.addChild(this._dockView)
    }
  }
  freeSubwin(subwin: Subwin): this {
    if (!(subwin.parent instanceof DockView)) {
      console.error('subwin is not docked!')
      return this;
    }
    subwin.removeSelf();
    this.addChild(subwin);
    return this;
  }

  clampAllSubwin() {
    const rect = getValue(this._rect);
    if (!rect) { return; }
    this.children.forEach(v => (v instanceof Subwin) && this.clampSubwin(v, rect))
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
    subwin.styles.apply('view_dragger_pos', { left: x, top: y });
  }
  private _onPointerMove = (e: PointerEvent) => { }
  private _onViewDragStart = (e: Event) => {
    this._draggingSubwin = View.try(e.target, Subwin);
    if (!this._draggingSubwin) { return; }
    this._dockLeftIndicator.fakeIn();
    this._dockRightIndicator.fakeIn();
    this._dockTopIndicator.fakeIn();
    this._dockBottomIndicator.fakeIn();
    this.addEventListener('pointermove', this._onPointerMove, true)
  }
  private _onViewDragging = (e: Event) => {
    const subwin = View.try(e.target, Subwin);
    if (!subwin) { return; }
  }
  private _onViewDragEnd = (e: Event) => {
    const subwin = View.try(e.target, Subwin);
    if (!subwin) { return; }
    this.removeEventListener('pointermove', this._onPointerMove, true)

    if (this._dockBottomIndicator.hover) {
      this.dockToBottom(subwin);
    } else if (this._dockTopIndicator.hover) {
      this.dockToTop(subwin);
    } else if (this._dockLeftIndicator.hover) {
      this.dockToLeft(subwin);
    } else if (this._dockRightIndicator.hover) {
      this.dockToRight(subwin);
    } else {
      const rect = getValue(this._rect);
      if (!rect) { return; }
      this.clampSubwin(subwin, rect);
    }

    this._dockLeftIndicator.fakeOut();
    this._dockRightIndicator.fakeOut();
    this._dockTopIndicator.fakeOut();
    this._dockBottomIndicator.fakeOut();
    this._draggingSubwin = null;
  }

  private subwinListening(subwin: Subwin, listen: boolean) {
    if (listen) {
      const ondown = () => this._handleClick(subwin);
      this._pointerdowns.set(subwin, ondown);
      subwin.addEventListener('pointerdown', ondown);
      subwin.addEventListener('touchstart', ondown, { passive: true });
      subwin.addEventListener(EventType.ViewDragStart, this._onViewDragStart)
      subwin.addEventListener(EventType.ViewDragging, this._onViewDragging)
      subwin.addEventListener(EventType.ViewDragEnd, this._onViewDragEnd)
    } else {
      const listener = this._pointerdowns.get(subwin);
      if (listener) {
        subwin.removeEventListener('pointerdown', listener);
        subwin.removeEventListener('touchstart', listener);
        subwin.removeEventListener(EventType.ViewDragStart, this._onViewDragStart)
        subwin.removeEventListener(EventType.ViewDragging, this._onViewDragging)
        subwin.removeEventListener(EventType.ViewDragEnd, this._onViewDragEnd)
      }
    }
  }
  override addChild(...children: View[]): this {
    super.addChild(...children);
    children.forEach(v => {
      if (v instanceof Subwin) {
        this.subwinListening(v, true);
        this._undockedWins.push(v)
      }
    });
    this._updateUndockedWinsStyle();
    return this;
  }
  override insertChild(anchorOrIdx: number | View, ...children: View[]): this {
    super.insertChild(anchorOrIdx, ...children);
    children.forEach(v => {
      if (v instanceof Subwin) {
        this.subwinListening(v, true);
        this._undockedWins.push(v)
      }
    });
    this._updateUndockedWinsStyle();
    return this;
  }
  override removeChild(...children: View[]): this {
    children.forEach(v => {
      if (v instanceof Subwin) {
        this.subwinListening(v, false)
        const idx = this._undockedWins.findIndex(b => b === v)
        idx >= 0 && this._undockedWins.splice(idx, 1);
      }
    });
    this._updateUndockedWinsStyle();
    return this;
  }
  get undockedWins(): Subwin[] {
    return this._undockedWins;
  }
}
