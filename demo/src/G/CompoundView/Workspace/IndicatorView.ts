import { View } from "../../BaseView/View";
import { IndicatorImage } from "./IndicatorImage";

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
      new View('div'), this.top, new View('div'),
      this.left, this.center, this.right,
      new View('div'), this.bottom, new View('div')
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
    this.left.fakeIn();
    this.right.fakeIn();
    this.top.fakeIn();
    this.bottom.fakeIn();
    this.center.fakeIn();
  }
  fakeOut() {
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
