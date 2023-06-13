import { View } from "../../BaseView/View";
import { EventMap, EventType } from "../../Events/EventType";
import { GetValue, Rect, getValue } from "../../utils";
import { Subwin } from "../Subwin";
import { Direction, DockView } from "./DockView";
import { IndicatorImage } from "./IndicatorImage";
import { List } from "../../Helper/List";
import { IndicatorView } from "./IndicatorView";

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
  private _undockedWins = new List<Subwin>();
  private _dockedWins = new List<Subwin>();
  private _draggingIn: Subwin | DockView | undefined;
  private _updateUndockedWinsStyle() {
    this._undockedWins.forEach((win, idx, arr) => {
      win.styles.apply(
        'free_in_workspace', {
        zIndex: `${this._zIndex + arr.length - idx}`,
        maxWidth: '100%',
        maxHeight: '100%'
      });
      idx > 0 ? win.lower() : win.raise();
      ++idx;
    });
  }
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
  private _dockIndicator = new IndicatorView();
  private _rootDockView = new DockView();
  private _deepestDockView = this._rootDockView;

  get dockView() { return this._rootDockView }
  constructor(element: HTMLElementTagNameMap[T], inits: WorkspaceInits);
  constructor(tagName: T, inits: WorkspaceInits);
  constructor(arg0: any, inits: WorkspaceInits) {
    super(arg0);
    this.styles.applyCls('workspaceView')
    this._rect = inits.rect;
    this._zIndex = inits?.zIndex ?? this._zIndex;
    this.addChild(this._rootDockView);
    this.addChild(this._dockLeftIndicator);
    this.addChild(this._dockRightIndicator);
    this.addChild(this._dockTopIndicator);
    this.addChild(this._dockBottomIndicator);
    this.addChild(this._dockIndicator);
    inits?.wins && this.addChild(...inits.wins);
  }
  dockToTop(subwin: Subwin, view?: View): void {
    this._dockedWins.insert(0, subwin);
    const dockView = (view === this._deepestDockView && view.parent instanceof DockView) ? view.parent : undefined;
    if (dockView?.direction === Direction.V) {
      dockView.insertChildBefore(view!, subwin)
    } else if (dockView?.direction === Direction.H) {
      const childDockView = new DockView(Direction.V);
      dockView.replaceChild(childDockView, view!)
      childDockView.addChild(subwin, view!);
    } else if (Direction.V === this._rootDockView.direction) {
      this._rootDockView.insertChildBefore(0, subwin);
    } else {
      this._rootDockView = new DockView(Direction.V).insertChildBefore(0, subwin, this._rootDockView);
      this.addChild(this._rootDockView)
    }
  }
  dockToBottom(subwin: Subwin, view?: View): void {
    this._dockedWins.insert(0, subwin);
    if (Direction.V === this._rootDockView.direction) {
      this._rootDockView.addChild(subwin);
    } else {
      this._rootDockView = new DockView(Direction.V).addChild(this._rootDockView, subwin);
      this.addChild(this._rootDockView);
    }
  }
  dockToLeft(subwin: Subwin, view?: View): void {
    this._dockedWins.insert(0, subwin);
    const dockView = (view === this._deepestDockView && view?.parent instanceof DockView) ? view.parent : undefined;
    if (dockView?.direction === Direction.H) {
      dockView.insertChildBefore(view!, subwin)
    } else if (dockView?.direction === Direction.V) {
      const childDockView = new DockView(Direction.H);
      dockView.replaceChild(childDockView, view!)
      childDockView.addChild(subwin, view!);
    } else if (Direction.H === this._rootDockView.direction) {
      this._rootDockView.insertChildBefore(0, subwin);
    } else {
      this._rootDockView = new DockView(Direction.H).insertChildBefore(0, subwin, this._rootDockView);
      this.addChild(this._rootDockView)
    }
  }
  dockToRight(subwin: Subwin, view?: View): void {
    this._dockedWins.insert(0, subwin);
    if (Direction.H === this._rootDockView.direction) {
      this._rootDockView.addChild(subwin);
    } else {
      this._rootDockView = new DockView(Direction.H).addChild(this._rootDockView, subwin);
      this.addChild(this._rootDockView)
    }
  }
  undockSubwin(subwin: Subwin): this {
    if (!(subwin.parent instanceof DockView)) {
      console.error('subwin is not docked!')
      return this;
    }
    let dockView = subwin.parent;
    subwin.removeSelf();
    this._dockedWins.delete(subwin);
    this.addChild(subwin);
    if (dockView.children.length <= 1) {
      dockView.parent?.removeChild(dockView)
    }
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

  private _onSubwinDragStart = (e: EventMap[EventType.ViewDragStart]) => {
    this._draggingSubwin = View.try(e.target, Subwin);
    if (!this._draggingSubwin) { return; }
    this._dockLeftIndicator.fakeIn();
    this._dockRightIndicator.fakeIn();
    this._dockTopIndicator.fakeIn();
    this._dockBottomIndicator.fakeIn();
  }

  private _onSubwinDragging = (e: EventMap[EventType.ViewDragging]) => {
    const subwin = View.try(e.target, Subwin);
    if (!subwin) { return; }
    const { pageX, pageY, dragger: { offsetX, offsetY } } = e.detail
    const mouseX = pageX;
    const mouseY = pageY;
    let draggingIn: Subwin | DockView | undefined = this._undockedWins.findR(v => {
      const { left, right, top, bottom } = v.inner.getBoundingClientRect();
      return v != subwin && mouseX >= left && mouseX <= right && mouseY >= top && mouseY <= bottom;
    }) ?? this._dockedWins.findR(v => {
      const { left, right, top, bottom } = v.inner.getBoundingClientRect();
      return v != subwin && mouseX >= left && mouseX <= right && mouseY >= top && mouseY <= bottom;
    })
    if (!draggingIn && this._deepestDockView !== this._rootDockView) {
      const { left, right, top, bottom } = this._deepestDockView.inner.getBoundingClientRect();
      if (mouseX >= left && mouseX <= right && mouseY >= top && mouseY <= bottom) {
        draggingIn = this._deepestDockView;
      }
    }

    if (this._draggingIn !== draggingIn) {
      this._draggingIn = draggingIn;
      if (draggingIn) {
        const { left, top, width, height } = draggingIn.inner.getBoundingClientRect();
        this._dockIndicator.styles.apply('normal', v => ({
          ...v, left, top, width, height
        }))
        this._dockIndicator.fakeIn();
      } else {
        this._dockIndicator.fakeOut();
      }
    }
  }

  private _onSubwinDragEnd = (e: Event) => {
    const subwin = View.try(e.target, Subwin);
    if (!subwin) { return; }
    if (this._dockBottomIndicator.hover) {
      this.dockToBottom(subwin);
    } else if (this._dockTopIndicator.hover) {
      this.dockToTop(subwin);
    } else if (this._dockLeftIndicator.hover) {
      this.dockToLeft(subwin);
    } else if (this._dockRightIndicator.hover) {
      this.dockToRight(subwin);
    } else if (this._dockIndicator.bottom.hover) {
      this.dockToBottom(subwin, this._draggingIn);
    } else if (this._dockIndicator.top.hover) {
      this.dockToTop(subwin, this._draggingIn);
    } else if (this._dockIndicator.left.hover) {
      this.dockToLeft(subwin, this._draggingIn);
    } else if (this._dockIndicator.right.hover) {
      this.dockToRight(subwin, this._draggingIn);
    } else {
      const rect = getValue(this._rect);
      if (!rect) { return; }
      this.clampSubwin(subwin, rect);
    }
    this._dockLeftIndicator.fakeOut();
    this._dockRightIndicator.fakeOut();
    this._dockTopIndicator.fakeOut();
    this._dockBottomIndicator.fakeOut();
    this._dockIndicator.fakeOut();
    this._draggingSubwin = null;
    this._draggingIn = undefined;
  }

  private _handleAddedChildren(children: View[]) {
    children.forEach(v => {
      if (!(v instanceof Subwin)) { return; }
      v.workspace = this;
      v.addEventListener(EventType.ViewDragStart, this._onSubwinDragStart)
      v.addEventListener(EventType.ViewDragging, this._onSubwinDragging)
      v.addEventListener(EventType.ViewDragEnd, this._onSubwinDragEnd)
      const ondown = () => {
        this._undockedWins.delete(v).insert(0, v);
        this._updateUndockedWinsStyle()
      };
      this._pointerdowns.set(v, ondown);
      v.addEventListener('pointerdown', ondown);
      v.addEventListener('touchstart', ondown, { passive: true });
      this._undockedWins.insert(0, v)
    });
  }

  private _handleRemovedChildren(children: View[]) {
    children.forEach(child => {
      if (!(child instanceof Subwin)) { return; }
      const listener = this._pointerdowns.get(child);
      if (listener) {
        child.removeEventListener('pointerdown', listener);
        child.removeEventListener('touchstart', listener);
      }
      this._undockedWins.delete(child)
    });
  }

  override addChild(...children: View[]): this {
    super.addChild(...children);
    this._handleAddedChildren(children);
    this._updateUndockedWinsStyle();
    return this;
  }
  override insertChildBefore(anchorOrIdx: number | View, ...children: View[]): this {
    super.insertChildBefore(anchorOrIdx, ...children);
    this._handleAddedChildren(children);
    this._updateUndockedWinsStyle();
    return this;
  }
  override removeChild(...children: View[]): this {
    this._updateUndockedWinsStyle();
    this._handleRemovedChildren(children);
    return this;
  }
}
