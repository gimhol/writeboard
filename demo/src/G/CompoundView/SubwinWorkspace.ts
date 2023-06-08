import { Image } from "../BaseView/Image";
import { Style } from "../BaseView/StyleType";
import { View } from "../BaseView/View";
import { Subwin } from "./Subwin";
import { EventType } from "../Events/EventType";
import { GetValue, Rect, getValue } from "../utils";

export interface SubwinWorkspaceInits {
  rect?: GetValue<Rect>;
  wins?: Subwin[];
  zIndex?: number;
}

export class IndicatorImage extends Image {
  constructor(inits: { src: string, style?: Style }) {
    super({ src: inits.src });
    this.styles
      .register('hover', {
        opacity: 0.8,
      })
      .register('normal', {
        width: 32,
        height: 32,
        zIndex: '10000',
        userSelect: 'none',
        background: '#000000FF',
        borderRadius: 5,
        opacity: 0.3,
        transition: 'all 200ms',
      })
      .register('', { ...inits.style })
      .add('normal', '')
      .refresh();
    this.draggable = false;
    this.hoverOb;
  }
  override onHover(hover: boolean): void {
    console.log(this.styles.applieds)
    this.styles[hover ? 'add' : 'remove']('hover').refresh()
  }
  override onBeforeRemoved(parent: View<keyof HTMLElementTagNameMap>): void {
    this.styles.remove('hover').refresh()
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

export class SubwinWorkspace<T extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap> extends View<T> {
  private _rect?: GetValue<Rect>;
  private _zIndex: number = 0;
  private _wins: Subwin[] = [];
  private _pointerdowns = new Map<Subwin, () => void>();
  private _draggingSubwin: Subwin | undefined;
  private _updateSubWinStyle() {
    this._wins.forEach((win, idx, arr) => {
      win.styles.apply('in_workspace', v => ({
        ...v, zIndex: `${this._zIndex + idx}`,
        maxWidth: '100%', maxHeight: '100%'
      }))
      idx < arr.length - 1 ? win.lower() : win.raise();
    });
  }
  private _handleClick = (target: Subwin) => {
    this._wins.splice(this._wins.indexOf(target), 1);
    this._wins.push(target);
    this._updateSubWinStyle();
  }

  private _dragInLeft = new IndicatorImage({
    src: './ic_dock_to_left.svg', style: {
      position: 'absolute', left: 16, top: '50%'
    }
  })
  private _dragInTop = new IndicatorImage({
    src: './ic_dock_to_top.svg', style: {
      position: 'absolute', left: '50%', top: 16
    }
  })
  private _dragInRight = new IndicatorImage({
    src: './ic_dock_to_right.svg', style: {
      position: 'absolute', right: 16, top: '50%'
    }
  })
  private _dragInBottom = new IndicatorImage({
    src: './ic_dock_to_bottom.svg', style: {
      position: 'absolute', left: '50%', bottom: 16
    }
  })

  constructor(element: HTMLElementTagNameMap[T], inits: SubwinWorkspaceInits);
  constructor(tagName: T, inits: SubwinWorkspaceInits);
  constructor(arg0: any, inits: SubwinWorkspaceInits) {
    super(arg0);
    this._rect = inits.rect;
    this._zIndex = inits?.zIndex ?? this._zIndex;
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
    subwin.styles.apply('drag_by_dragger', {
      left: '' + x + 'px',
      top: '' + y + 'px',
    });
  }

  private _onPointerMove = (e: PointerEvent) => {}

  private _onViewDragStart = (e: Event) => {
    this._draggingSubwin = View.try(e.target, Subwin);
    if (!this._draggingSubwin) { return; }

    this.addChild(this._dragInLeft);
    this.addChild(this._dragInRight);
    this.addChild(this._dragInTop);
    this.addChild(this._dragInBottom);
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

    this._dragInLeft.removeSelf();
    this._dragInRight.removeSelf();
    this._dragInTop.removeSelf();
    this._dragInBottom.removeSelf();

    const rect = getValue(this._rect);
    if (!rect) { return; }
    this.clampSubwin(subwin, rect);
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
  addSubWin(...subwins: Subwin[]) {
    this._wins.forEach(v => this.subwinListening(v, false));
    this._wins = Array.from(new Set(this._wins.concat(subwins)));
    this._wins.forEach(v => this.subwinListening(v, true));
    this._updateSubWinStyle();
  }
  removeSubwin(...subwins: Subwin[]) {
    subwins.forEach(v => this.subwinListening(v, false));
    this._wins.filter(v => subwins.indexOf(v) < 0);
    this._updateSubWinStyle();
  }
}
