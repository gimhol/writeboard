import { Image } from "../../BaseView/Image";
import { Style } from "../../BaseView/StyleType";


export class IndicatorImage extends Image {
  constructor(inits: { src: string; style?: Style; }) {
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
        opacity: 0,
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
    this.styles[hover ? 'add' : 'remove']('hover').refresh();
  }
  override onRemoved(): void {
    this.styles.remove('hover').refresh();
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
