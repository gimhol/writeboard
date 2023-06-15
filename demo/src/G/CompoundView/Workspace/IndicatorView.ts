import { View } from "../../BaseView/View";
import { HoverOb } from "../../Observer/HoverOb";
import { IndicatorImage } from "./IndicatorImage";
const Tag = '[IndicatorView]'
export class IndicatorView extends View<'div'> {
  left = new IndicatorImage({ src: './ic_dock_to_left.svg' }).styles.apply('override', {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  }).view;
  top = new IndicatorImage({ src: './ic_dock_to_top.svg' }).styles.apply('override', {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  }).view;
  right = new IndicatorImage({ src: './ic_dock_to_right.svg' }).styles.apply('override', {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  }).view;
  bottom = new IndicatorImage({ src: './ic_dock_to_bottom.svg' }).styles.apply('override', {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  }).view;
  center = new IndicatorImage({ src: './ic_dock_to_bottom.svg' }).styles.apply('override', {
    borderRadius: 0,
  }).view;

  preview = new View('div').styles.apply('normal', {
    position: 'absolute',
    zIndex: 1,
    background: '#0055ff88',
    boxSizing: 'border-box',
    transition: 'all 200ms',
  }).view;

  private _following?: View;
  private _resizeOb: ResizeObserver;

  private _hovering: View | null = null;
  private _onHover = (hover: boolean, e: MouseEvent) => {
    const view = View.try(e.target, View);
    if (hover) {
      this._hovering = view;
    } else if (view === this._hovering) {
      this._hovering = null;
    } else {
      return;
    }

    switch (this._hovering) {
      case this.left:
        this.preview.styles.apply('show', v => ({ ...v, opacity: 1, top: 0, bottom: 0, left: 0, right: '66%' }));
        break;
      case this.right:
        this.preview.styles.apply('show', v => ({ ...v, opacity: 1, top: 0, bottom: 0, left: '66%', right: 0 }));
        break;
      case this.top:
        this.preview.styles.apply('show', v => ({ ...v, opacity: 1, top: 0, bottom: '66%', left: 0, right: 0 }));
        break;
      case this.bottom:
        this.preview.styles.apply('show', v => ({ ...v, opacity: 1, top: '66%', bottom: 0, left: 0, right: 0 }));
        break;
      case this.center:
        this.preview.styles.apply('show', v => ({ ...v, opacity: 1, top: 0, bottom: 0, left: 0, right: 0 }));
        break;
      default:
        this.preview.styles.apply('show', v => ({ ...v, opacity: 0 }))
        break;
    }

  };
  constructor() {
    super('div');
    this.styles.applyCls('indicator_view')
    this.styles.register('normal', {
      position: 'absolute',
      opacity: 0,
      transition: 'all 200ms',
      zIndex: '9999',
      pointerEvents: 'none',
      boxSizing: 'border-box',
      border: '5px solid #0055ff88',
    }).register('appear', {
      opacity: 1,
      pointerEvents: 'all'
    }).apply('normal');

    new HoverOb(this.left.inner).setCallback(this._onHover);
    new HoverOb(this.right.inner).setCallback(this._onHover);
    new HoverOb(this.center.inner).setCallback(this._onHover);
    new HoverOb(this.top.inner).setCallback(this._onHover);
    new HoverOb(this.bottom.inner).setCallback(this._onHover);
    const content = new View('div');
    content.styles.apply('', {
      position: 'absolute',
      display: 'grid',
      left: '50%',
      top: '50%',
      zIndex: 2,
      transform: 'translate(-50%,-50%)',
      gridTemplateColumns: 'auto auto auto',
      gridTemplateRows: 'auto auto auto',
      gap: '0px',
    })
    content.addChild(
      new View('div'), this.top, new View('div'),
      this.left, this.center, this.right,
      new View('div'), this.bottom, new View('div')
    );
    this.addChild(this.preview)
    this.addChild(content);
    this._resizeOb = new ResizeObserver(entries => {
      entries.forEach(e => {
        switch (e.target) {
          case this._following?.inner: {
            const { left, top, width, height } = e.target.getBoundingClientRect();
            this.styles.apply('normal', v => ({ ...v, left, top, width, height }))
            break;
          }
        }
      })
    })
  }


  fakeIn(v: View) {
    this._following = v;
    this._resizeOb.observe(this._following.inner);

    const { left, top, width, height } = v.inner.getBoundingClientRect();
    this.styles.apply('normal', v => ({ ...v, left, top, width, height }))

    this.styles.add('appear').refresh();
    this.hoverOb.disabled = false;
    this.left.fakeIn();
    this.right.fakeIn();
    this.top.fakeIn();
    this.bottom.fakeIn();
    this.center.fakeIn();
  }
  fakeOut() {

    if (this._following) {
      this._resizeOb.unobserve(this._following.inner);
      delete this._following;
    }

    this.styles.remove('appear').refresh();
    this.hoverOb.disabled = true;
    this.onHover(false);

    this.left.fakeOut();
    this.right.fakeOut();
    this.top.fakeOut();
    this.bottom.fakeOut();
    this.center.fakeOut();
  }
}
