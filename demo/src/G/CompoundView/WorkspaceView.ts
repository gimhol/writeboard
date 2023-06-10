import { Image } from "../BaseView/Image";
import { Style } from "../BaseView/StyleType";
import { View } from "../BaseView/View";
import { EventType } from "../Events/EventType";
import { HoverOb } from "../Observer/HoverOb";
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
        pointerEvents: 'none'
      }).register('appear', {
        opacity: 0.3,
        pointerEvents: 'all'
      })
      .add('normal', '')
      .refresh();
    this.draggable = false;
  }
  override onHover(hover: boolean): void {
    this.styles[hover ? 'add' : 'remove']('hover').refresh()
  }
  override onRemoved(): void {
    this.styles.remove('hover').refresh()
  }
  fakeIn() {
    this.styles.add('appear').refresh();
    this.hoverOb.disabled = false;
  }
  fakeOut() {
    this.styles.remove('appear').refresh();
    this.hoverOb.disabled = true;
    this.onHover(false);
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
  setContent(view: View) { super.addChild(view); }
  createResizer() {
    const aaa = new View('div');
    const w = this.direction === 'h' ? 1 : undefined
    const h = this.direction === 'v' ? 1 : undefined
    aaa.styles.apply('', {
      width: w,
      maxWidth: w,
      minWidth: w,
      height: h,
      maxHeight: h,
      minHeight: h,
      overflow: 'visible',
      zIndex: 1,
      position: 'relative',
      backgroundColor: 'black',
    });
    const bbb = new View('div');
    bbb.styles.register('hover', {
      backgroundColor: '#00000088',
    }).apply('', {
      left: this.direction === 'h' ? -3 : 0,
      right: this.direction === 'h' ? -3 : 0,
      top: this.direction === 'v' ? -3 : 0,
      bottom: this.direction === 'v' ? -3 : 0,
      position: 'absolute',
      transition: 'background-color 200ms',
      cursor: this.direction === 'h' ? 'col-resize' : 'row-resize',
      pointerEvents: 'all'
    });
    new HoverOb(bbb.inner, (hover) => bbb.styles[hover ? 'add' : 'remove']('hover').refresh())
    aaa.addChild(bbb);
    return aaa
  }
  override addChild(...children: View[]): this {
    children.forEach(v => v.removeSelf());
    const beginAnchor = this.children[this.children.length - 1];
    for (let i = 1; i < children.length; i += 2) {
      children.splice(i, 0, this.createResizer());
    }
    if (beginAnchor) {
      children.splice(0, 0, this.createResizer());
    }
    super.addChild(...children);
    this.updateChildrenStyles(children);
    return this;
  }
  override insertChild(anchor: number | View, ...children: View[]): this {
    children.forEach(v => v.removeSelf());
    const idx = typeof anchor === 'number' ? anchor : this.children.indexOf(anchor);
    const beginAnchor = this.children[idx - 1];
    const endAnchor = this.children[idx];

    for (let i = 1; i < children.length; i += 2) {
      children.splice(i, 0, this.createResizer());
    }
    if (beginAnchor) {
      children.splice(0, 0, this.createResizer());
    }
    if (endAnchor) {
      children.push(this.createResizer());
    }

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
          zIndex: 'unset',
          border: 'none'
        })
      }
    });
  }
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
    if ('v' === this._dockView.direction) {
      this._dockView.insertChild(0, subwin);
    } else {
      this._dockView = new DockView('v').insertChild(0, subwin, this._dockView);
      this.addChild(this._dockView)
    }
  }
  dockToBottom(subwin: Subwin): void {
    if ('v' === this._dockView.direction) {
      this._dockView.addChild(subwin);
    } else {
      this._dockView.removeSelf();
      this._dockView = new DockView('v').addChild(this._dockView, subwin);
      this.addChild(this._dockView)
    }
  }
  dockToLeft(subwin: Subwin): void {
    if ('h' === this._dockView.direction) {
      this._dockView.insertChild(0, subwin);
    } else {
      this._dockView.removeSelf();
      this._dockView = new DockView('h').insertChild(0, subwin, this._dockView);
      this.addChild(this._dockView)
    }
  }
  dockToRight(subwin: Subwin): void {
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
