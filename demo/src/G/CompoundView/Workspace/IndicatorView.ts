import { View } from "../../BaseView/View";
import { IndicatorImage } from "./IndicatorImage";

export class IndicatorView extends View<'div'> {
  private _left = new IndicatorImage({ src: './ic_dock_to_left.svg' }).styles.apply('override', {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  }).view;
  private _top = new IndicatorImage({ src: './ic_dock_to_top.svg' }).styles.apply('override', {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  }).view;
  private _right = new IndicatorImage({ src: './ic_dock_to_right.svg' }).styles.apply('override', {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  }).view;
  private _bottom = new IndicatorImage({ src: './ic_dock_to_bottom.svg' }).styles.apply('override', {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  }).view;
  private _center = new IndicatorImage({ src: './ic_dock_to_bottom.svg' }).styles.apply('override', {
    borderRadius: 0,
  }).view;
  constructor() {
    super('div');
    this.styles.applyCls('indicator_view')
    this.styles.register('normal', {
      position: 'absolute',
      opacity: 0,
      transition: 'opacity 200ms',
      zIndex: '9999',
      pointerEvents: 'none',
      boxSizing: 'border-box',
      border: '5px solid #0055ff88',
    }).register('appear', {
      opacity: 1,
      pointerEvents: 'all'
    }).apply('normal');

    const content = new View('div');
    content.styles.apply('', {
      position: 'fixed',
      zIndex: '9999',
      display: 'grid',
      transform: 'translate(-50%,-50%)',
      gridTemplateColumns: '48px 48px 48px',
      gridTemplateRows: '48px 48px 48px',
      gap: '0px',
    })
    content.addChild(
      new View('div'), this._top, new View('div'),
      this._left, this._center, this._right,
      new View('div'), this._bottom, new View('div')
    );
    this.addChild(content);
    new ResizeObserver(e => {
      const { left, top, width, height } = e[0]!.target.getBoundingClientRect();
      content.styles.apply('', v => ({
        ...v,
        left: left + width / 2,
        top: top + height / 2
      }))
    }).observe(this.inner)
  }
  fakeIn() {
    this.styles.add('appear').refresh();
    this.hoverOb.disabled = false;
    this._left.fakeIn();
    this._right.fakeIn();
    this._top.fakeIn();
    this._bottom.fakeIn();
    this._center.fakeIn();
  }
  fakeOut() {
    this.styles.remove('appear').refresh();
    this.hoverOb.disabled = true;
    this.onHover(false);

    this._left.fakeOut();
    this._right.fakeOut();
    this._top.fakeOut();
    this._bottom.fakeOut();
    this._center.fakeOut();
  }
}
