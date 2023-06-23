import { View } from "../../BaseView/View";
import { DockableEventType, EventMap, EventType } from "../../Events/EventType";
import { GetValue, Rect, getValue } from "../../utils";
import { Subwin } from "../SubWin";
import { DockView } from "./DockView";
import { DockableDirection } from "./DockableDirection";
import { IndicatorImage } from "./IndicatorImage";
import { List } from "../../Helper/List";
import { IndicatorView } from "./IndicatorView";
import { IDockable as IDockable } from "./Dockable";
import { HoverOb } from "../../Observer/HoverOb";
import DockResultPreview from "../DockResultPreview";
import { DockPosition } from "../DockPosition";

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
    type: DockPosition.ToLeft, style: {
      position: 'absolute', left: 16, top: 'calc(50% - 24px)'
    }
  })
  private _dockTopIndicator = new IndicatorImage({
    type: DockPosition.ToTop, style: {
      position: 'absolute', left: 'calc(50% - 24px)', top: 16
    }
  })
  private _dockRightIndicator = new IndicatorImage({
    type: DockPosition.ToRight, style: {
      position: 'absolute', right: 16, top: 'calc(50% - 24px)'
    }
  })
  private _dockBottomIndicator = new IndicatorImage({
    type: DockPosition.ToBottom, style: {
      position: 'absolute', left: 'calc(50% - 24px)', bottom: 16
    }
  })

  private _dockResultPreview = new DockResultPreview()
    .addIndicator(DockPosition.ToLeft, this._dockLeftIndicator)
    .addIndicator(DockPosition.ToRight, this._dockRightIndicator)
    .addIndicator(DockPosition.ToTop, this._dockTopIndicator)
    .addIndicator(DockPosition.ToBottom, this._dockBottomIndicator);


  private _dockIndicator = new IndicatorView();
  private _rootDockView = new DockView().asRoot(true).setWorkspace(this);
  private _deepestDockView = this._rootDockView.addEventListener(DockableEventType.Docked, e => {
    let ele: View | null = View.try(e.target, View);
    while (ele) {
      if (ele instanceof DockView) {
        ele.styles.apply(DockView.StyleName.MaxDocked)
      }
      ele = ele.parent;
    }
  });
  public get rootDockView() { return this._rootDockView }
  public get deepestDockView() { return this._deepestDockView };
  public constructor(element: HTMLElementTagNameMap[T], inits: WorkspaceInits);
  public constructor(tagName: T, inits: WorkspaceInits);
  public constructor(arg0: any, inits: WorkspaceInits) {
    super(arg0);
    this.styles.addCls('workspaceView')
    this._rect = inits.rect;
    this._zIndex = inits?.zIndex ?? this._zIndex;
    this.addChild(this._rootDockView);
    this.addChild(this._dockResultPreview)
    this.addChild(this._dockLeftIndicator);
    this.addChild(this._dockRightIndicator);
    this.addChild(this._dockTopIndicator);
    this.addChild(this._dockBottomIndicator);
    this.addChild(this._dockIndicator);
    inits?.wins && this.addChild(...inits.wins);
  }
  public dockToRoot(target: IDockable, direction: DockableDirection, pos: 'start' | 'end') {
    const way = pos === 'start' ? 'unshift' : 'push';
    if (direction === this._rootDockView.direction) {
      this._rootDockView[way]([target]);
    } else {
      const temp = this._rootDockView.asRoot(false)
      this._rootDockView = new DockView(direction).asRoot(true).setWorkspace(this);
      this._rootDockView[way](pos === 'start' ? [target, temp] : [temp, target]);
      this.addChild(this._rootDockView);
    }
    (target instanceof Subwin) && this._dockedWins.insert(0, target);
    (target instanceof Subwin) && target.styles.forgo('free_in_workspace');
    this._updateUndockedWinsStyle();
  }

  public dockAround(target: IDockable, anchor: IDockable, direction: DockableDirection, pos: 'start' | 'end') {
    // if (anchor !== this._deepestDockView) {
    //   console.warn('[WorkspaceView] dockAround() failed, Not support dock around to this anchor yet, anchor:', anchor);
    //   return;
    // }
    const { parent } = anchor.dockableView();
    if (!(parent instanceof DockView)) {
      console.warn('[WorkspaceView] dockAround() failed, only support dock into DockView, but got:', parent);
      return;
    }
    if (parent.direction === direction) {
      if (pos === 'start') {
        parent.dockBefore(anchor, [target]);
      } else {
        parent.dockAfter(anchor, [target]);
      }
    } else {
      const dockView = new DockView(direction).setWorkspace(this);
      parent.replace(anchor, dockView);
      if (pos === 'start') {
        dockView.push([target, anchor]);
      } else {
        dockView.push([anchor, target]);
      }
    }
    (target instanceof Subwin) && this._dockedWins.insert(0, target);
    (target instanceof Subwin) && target.styles.forgo('free_in_workspace');
    this._updateUndockedWinsStyle();
  }
  undock(target: IDockable): this {
    const view = target.dockableView();
    if (!(view instanceof Subwin)) {
      console.warn('[Workspace] only support undock SubWin, but got:', view)
      return this;
    }
    const parent = view.parent;
    if (!(parent instanceof DockView)) {
      console.warn('[Workspace] only support undock SubWin from dockView, trying to undock', view, 'from', parent)
      return this;
    }
    parent.remove(view);
    this.addChild(target.dockableView());

    if (parent.children.length <= 1) {
      const child = parent.children[0]!

      parent.parent?.replaceChild(child, parent);
      if (parent === this._rootDockView) {
        this._rootDockView = child as DockView;
        this._rootDockView.asRoot(true);
      }
    }
    this._updateUndockedWinsStyle();
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
    subwin.move(x, y);
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
        this._dockIndicator.fakeIn(draggingIn);
      } else {
        this._dockIndicator.fakeOut();
      }
    }
  }

  private _onSubwinDragEnd = (e: Event) => {
    const subwin = View.try(e.target, Subwin);
    if (!subwin) { return; }
    if (this._dockBottomIndicator.hover) {
      this.dockToRoot(subwin, DockableDirection.V, 'end');
    } else if (this._dockTopIndicator.hover) {
      this.dockToRoot(subwin, DockableDirection.V, 'start');
    } else if (this._dockLeftIndicator.hover) {
      this.dockToRoot(subwin, DockableDirection.H, 'start');
    } else if (this._dockRightIndicator.hover) {
      this.dockToRoot(subwin, DockableDirection.H, 'end');
    } else if (this._dockIndicator._bottom.hover) {
      this.dockAround(subwin, this._draggingIn!, DockableDirection.V, 'end')
    } else if (this._dockIndicator._top.hover) {
      this.dockAround(subwin, this._draggingIn!, DockableDirection.V, 'start')
    } else if (this._dockIndicator._left.hover) {
      this.dockAround(subwin, this._draggingIn!, DockableDirection.H, 'start')
    } else if (this._dockIndicator._right.hover) {
      this.dockAround(subwin, this._draggingIn!, DockableDirection.H, 'end')
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
  public override addChild(...children: View[]): this {
    super.addChild(...children);
    this._updateUndockedWinsStyle();
    return this;
  }
  public override insertBefore(anchorOrIdx: number | View, ...children: View[]): this {
    super.insertBefore(anchorOrIdx, ...children);
    this._updateUndockedWinsStyle();
    return this;
  }
  public override removeChild(...children: View[]): this {
    super.removeChild(...children)
    this._updateUndockedWinsStyle();
    return this;
  }

  protected override _handleAddedChildren(children: View[]) {
    // console.log('[Workspace]_handleAddedChildren', children)
    children.forEach(v => {
      if (!(v instanceof Subwin)) { return; }
      v.setWorkspace(this);
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
      this._dockedWins.delete(v);
    });
    super._handleAddedChildren(children)
  }

  protected override _prehandleRemovedChildren(children: View[]) {
    // console.log('[Workspace]_prehandleRemovedChildren', children)
    children.forEach(child => {
      if (!(child instanceof Subwin)) { return; }
      const listener = this._pointerdowns.get(child);
      if (listener) {
        child.removeEventListener('pointerdown', listener);
        child.removeEventListener('touchstart', listener);
      }
      this._undockedWins.delete(child)
    });
    return super._prehandleRemovedChildren(children)
  }
}
