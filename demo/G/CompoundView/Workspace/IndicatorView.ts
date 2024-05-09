import { View } from "../../BaseView/View";
import { DockPosition } from "../DockPosition";
import DockResultPreview from "../DockResultPreview";
import { IndicatorImage } from "./IndicatorImage";
const Tag = '[IndicatorView]'
export class IndicatorView extends View<'div'> {
  _left = new IndicatorImage({ type: DockPosition.ToLeft }).styles.apply('override', {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  }).view;

  _top = new IndicatorImage({ type: DockPosition.ToTop }).styles.apply('override', {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  }).view;

  _right = new IndicatorImage({ type: DockPosition.ToRight }).styles.apply('override', {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  }).view;

  _bottom = new IndicatorImage({ type: DockPosition.ToBottom }).styles.apply('override', {
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  }).view;

  _center = new IndicatorImage({ type: DockPosition.ToCenter }).styles.apply('override', {
    borderRadius: 0,
  }).view;

  private _dockPreview = new DockResultPreview()
    .addIndicator(DockPosition.ToLeft, this._left)
    .addIndicator(DockPosition.ToRight, this._right)
    .addIndicator(DockPosition.ToTop, this._top)
    .addIndicator(DockPosition.ToBottom, this._bottom)
    .addIndicator(DockPosition.ToCenter, this._center);

  private _following?: View;

  private _onResize: ResizeObserverCallback = (entries) => {
    entries.forEach(e => {
      switch (e.target) {
        case this._following?.inner: {
          const { left, top, width, height } = e.target.getBoundingClientRect();
          this.styles.apply('normal', { left, top, width, height })
          break;
        }
      }
    })
  }
  
  private _resizeOb = new ResizeObserver(this._onResize)

  constructor() {
    super('div');
    this.styles.addCls('g_indicator_view');

    const content = new View('div');
    content.styles.addCls('content')
    content.addChild(
      new View('div'), this._top, new View('div'),
      this._left, this._center, this._right,
      new View('div'), this._bottom, new View('div')
    );
    this.addChild(this._dockPreview)
    this.addChild(content);
  }

  fakeIn(v: View) {
    this._following = v;
    this._resizeOb.observe(this._following.inner);
    const { left, top, width, height } = v.inner.getBoundingClientRect();
    this.styles.apply('normal', { left, top, width, height })
    this.styles.addCls('g_indicator_view_appear');
    this.hoverOb.disabled = false;
    this._left.fakeIn();
    this._right.fakeIn();
    this._top.fakeIn();
    this._bottom.fakeIn();
    this._center.fakeIn();
  }

  fakeOut() {
    if (this._following) {
      this._resizeOb.unobserve(this._following.inner);
      delete this._following;
    }
    this.styles.delCls('g_indicator_view_appear');
    this.hoverOb.disabled = true;
    this.onHover(false);

    this._left.fakeOut();
    this._right.fakeOut();
    this._top.fakeOut();
    this._bottom.fakeOut();
    this._center.fakeOut();
  }
}
