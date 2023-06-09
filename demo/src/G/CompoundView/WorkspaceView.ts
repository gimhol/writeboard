import { Image } from "../BaseView/Image";
import { Style } from "../BaseView/StyleType";
import { View } from "../BaseView/View";
import { EventType } from "../Events/EventType";
import { GetValue, Rect, getValue } from "../utils";
import { Subwin } from "./Subwin";

export interface WorkspaceInits {
  rect?: GetValue<Rect>;
  wins?: Subwin[];
  zIndex?: number;
}

export class IndicatorImage extends Image {
  constructor(inits: { src: string, style?: Style }) {
    super({ src: inits.src });
    this.styles
      .register('', { ...inits.style })
      .register('hover', {
        opacity: 0.8,
      })
      .register('normal', {
        width: 48,
        height: 48,
        zIndex: '10000',
        userSelect: 'none',
        background: '#000000FF',
        borderRadius: 5,
        opacity: 0.0,
        transition: 'all 200ms',
        pointerEvents: 'all'
      })
      .add('normal', '')
      .refresh();
    this.draggable = false;
    this.hoverOb;
  }
  override onHover(hover: boolean): void {
    this.styles[hover ? 'add' : 'remove']('hover').refresh()
  }
  override onRemoved(): void {
    this.styles.remove('hover').refresh()
  }
  fakeIn() {
    this.styles.apply('appear', {
      opacity: 0.3,
      pointerEvents: 'all'
    });
  }
  fakeOut() {
    this.hoverOb.hover = false;
    this.onHover(false);
    this.styles.remove('appear').refresh();
  }
}

class IndicatorView extends View<'div'> {
  private _left = new IndicatorImage({ src: './ic_dock_to_left.svg' })
  private _top = new IndicatorImage({ src: './ic_dock_to_top.svg' })
  private _right = new IndicatorImage({ src: './ic_dock_to_right.svg' })
  private _bottom = new IndicatorImage({ src: './ic_dock_to_bottom.svg' })
  private _center = new IndicatorImage({ src: '' });
  constructor() {
    super('div');
    this.styles.apply('normal', {
      display: 'grid',
      gridTemplateColumns: '33% 33% 33%',
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: '10000'
    })
    this.addChild(
      new View('div'), this._top, new View('div'),
      this._left, this._center, this._right,
      new View('div'), this._bottom, new View('div'),
    )
  }
}
export class DockView extends View<'div'> {
  private _direction: 'h' | 'v' | '' = '';
  get direction() { return this._direction; }
  constructor()
  constructor(direction: 'h' | 'v');
  constructor(direction: 'h' | 'v' | '' = '') {
    super('div');
    this._direction = direction;
    if (direction === 'h') {
      this.styles.apply('', { display: "flex", flexDirection: 'row' })
    } else if (direction === 'v') {
      this.styles.apply('', { display: "flex", flexDirection: 'column' })
    }
    this.styles.applyCls('DockView')
    this.styles.apply('normal', {
      pointerEvents: 'none',
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      alignItems: 'stretch'
    })
  }
  setContent(view: View) {
    super.addChild(view);
  }

  override addChild(...children: View[]): this {
    children.forEach(v => v.removeSelf());
    super.addChild(...children);
    this.updateChildrenStyles(children);
    return this;
  }
  override insertChild(anchor: number | View, ...children: View[]): this {
    children.forEach(v => v.removeSelf());
    super.insertChild(anchor, ...children);
    this.updateChildrenStyles(children);
    return this;
  }
  private updateChildrenStyles(children: View[]) {
    children.forEach(v => {
      if (v instanceof DockView) {
        v.styles.apply('docked', {
          position: 'relative',
          flex: 1
        })
      } else if (v instanceof Subwin) {
        v.dragger.disabled = true;
        v.styles.apply('docked', {
          pointerEvents: 'all',
          position: 'relative',
          resize: 'none',
          width: 'unset',
          height: 'unset',
          left: 'unset',
          top: 'unset',
          boxShadow: 'unset',
          borderRadius: 0,
          zIndex: 'unset'
        })
      }
    });
  }
}

export class WorkspaceView<T extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap> extends View<T> {
  private _rect?: GetValue<Rect>;
  private _zIndex: number = 0;
  private _wins: Subwin[] = [];
  private _pointerdowns = new Map<Subwin, () => void>();
  private _draggingSubwin: Subwin | undefined;
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
  private _handleClick = (target: Subwin) => {
    this._wins.splice(this._wins.indexOf(target), 1);
    this._wins.push(target);
    this._updateUndockedWinsStyle();
  }

  private _dockLeft = new IndicatorImage({
    src: './ic_dock_to_left.svg', style: {
      position: 'absolute', left: 16, top: '50%'
    }
  })
  private _dockTop = new IndicatorImage({
    src: './ic_dock_to_top.svg', style: {
      position: 'absolute', left: '50%', top: 16
    }
  })
  private _dockRight = new IndicatorImage({
    src: './ic_dock_to_right.svg', style: {
      position: 'absolute', right: 16, top: '50%'
    }
  })
  private _dockBottom = new IndicatorImage({
    src: './ic_dock_to_bottom.svg', style: {
      position: 'absolute', left: '50%', bottom: 16
    }
  })
  private _dockView = new DockView();
  get dockView() { return this._dockView }
  dockToTop(subwin: Subwin): void {
    console.log(`[Workspace] dockToTop()`)
    if ('v' === this._dockView.direction) {
      this._dockView.insertChild(0, subwin);
    } else {
      this._dockView = new DockView('v').insertChild(0, this._dockView, subwin);
      this.addChild(this._dockView)
    }
  }
  dockToBottom(subwin: Subwin): void {
    console.log(`[Workspace] dockToBottom()`)
    if ('v' === this._dockView.direction) {
      this._dockView.addChild(subwin);
    } else {
      this._dockView.removeSelf();
      this._dockView = new DockView('v').addChild(this._dockView, subwin);
      this.addChild(this._dockView)
    }
  }
  dockToLeft(subwin: Subwin): void {
    console.log(`[Workspace] dockToLeft()`)
    if ('h' === this._dockView.direction) {
      this._dockView.insertChild(0, subwin);
    } else {
      this._dockView.removeSelf();
      this._dockView = new DockView('h').insertChild(0, this._dockView, subwin);
      this.addChild(this._dockView)
    }
  }
  dockToRight(subwin: Subwin): void {
    console.log(`[Workspace] dockToRight()`)
    if ('h' === this._dockView.direction) {
      this._dockView.addChild(subwin);
    } else {
      this._dockView = new DockView('h').addChild(this._dockView, subwin);
      this.addChild(this._dockView)
    }
  }
  freeSubwin(subwin: Subwin): void {
    subwin.styles.forgo('dock_in_workspace')
  }
  constructor(element: HTMLElementTagNameMap[T], inits: WorkspaceInits);
  constructor(tagName: T, inits: WorkspaceInits);
  constructor(arg0: any, inits: WorkspaceInits) {
    super(arg0);
    this.styles.applyCls('workspaceView')
    this._rect = inits.rect;
    this._zIndex = inits?.zIndex ?? this._zIndex;
    if (inits?.wins) {
      this.addSubWin(...inits.wins);
      this._updateUndockedWinsStyle();
    }
    this.addChild(this._dockView);
    this.addChild(this._dockLeft);
    this.addChild(this._dockRight);
    this.addChild(this._dockTop);
    this.addChild(this._dockBottom);

  }
  clampAllSubwin() {
    const rect = getValue(this._rect);
    if (!rect) { return; }
    this._wins.forEach(v => v.parent === this && this.clampSubwin(v, rect));
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
    subwin.styles.apply('drag_by_dragger', {
      left: '' + x + 'px',
      top: '' + y + 'px',
    });
  }
  private _onPointerMove = (e: PointerEvent) => { }
  private _onViewDragStart = (e: Event) => {
    this._draggingSubwin = View.try(e.target, Subwin);
    if (!this._draggingSubwin) { return; }
    this._dockLeft.fakeIn();
    this._dockRight.fakeIn();
    this._dockTop.fakeIn();
    this._dockBottom.fakeIn();
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

    if (this._dockBottom.hover) {
      this.dockToBottom(subwin);
    } else if (this._dockTop.hover) {
      this.dockToTop(subwin);
    } else if (this._dockLeft.hover) {
      this.dockToLeft(subwin);
    } else if (this._dockRight.hover) {
      this.dockToRight(subwin);
    } else {
      const rect = getValue(this._rect);
      if (!rect) { return; }
      this.clampSubwin(subwin, rect);
    }

    this._dockLeft.fakeOut();
    this._dockRight.fakeOut();
    this._dockTop.fakeOut();
    this._dockBottom.fakeOut();

    delete this._draggingSubwin;
  }

  private subwinListening(subwin: Subwin, listen: boolean) {
    if (listen) {
      const ondown = () => this._handleClick(subwin);
      this._pointerdowns.set(subwin, ondown);
      subwin.inner.addEventListener('pointerdown', ondown);
      subwin.inner.addEventListener('touchstart', ondown);
      subwin.inner.addEventListener(EventType.ViewDragStart, this._onViewDragStart)
      subwin.inner.addEventListener(EventType.ViewDragging, this._onViewDragging)
      subwin.inner.addEventListener(EventType.ViewDragEnd, this._onViewDragEnd)
    } else {
      const listener = this._pointerdowns.get(subwin);
      if (listener) {
        subwin.inner.removeEventListener('pointerdown', listener);
        subwin.inner.removeEventListener('touchstart', listener);
        subwin.inner.removeEventListener(EventType.ViewDragStart, this._onViewDragStart)
        subwin.inner.removeEventListener(EventType.ViewDragging, this._onViewDragging)
        subwin.inner.removeEventListener(EventType.ViewDragEnd, this._onViewDragEnd)
      }
    }
  }
  addSubWin(...subwins: Subwin[]): void {
    this._wins.forEach(v => this.subwinListening(v, false));
    this._wins = Array.from(new Set(this._wins.concat(subwins)));
    this._wins.forEach(v => this.subwinListening(v, true));
    this._updateUndockedWinsStyle();
  }
  removeSubwin(...subwins: Subwin[]): void {
    subwins.forEach(v => this.subwinListening(v, false));
    this._wins.filter(v => subwins.indexOf(v) < 0);
    this._updateUndockedWinsStyle();
  }
  get undockedWins(): Subwin[] {
    return <Subwin[]>this.children.filter(v => v instanceof Subwin)
  }
}
