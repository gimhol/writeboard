import { View } from "./View";
import { HoverOb } from "./HoverOb";

export class IconButton extends View<'button'> {
  constructor(init?: { text?: string; title?: string; size?: 's' | 'm' }) {
    super('button');
    this._inner.style.userSelect = 'none';
    this._inner.style.cursor = 'pointer';
    this._inner.style.textAlign = 'center';
    this._inner.style.transition = 'all 200ms';
    this._inner.style.padding = '0px';
    this._inner.innerText = init?.text ?? '';
    this._inner.title = init?.title ?? '';
    new HoverOb(this._inner, hover => {
      this._inner.style.background = hover ? '#00000022' : '';
    });
    switch (init?.size) {
      case 's': {
        this._inner.style.width = '18px';
        this._inner.style.height = '18px';
        this._inner.style.lineHeight = '18px';
        this._inner.style.borderRadius = '5px';
        this._inner.style.fontSize = '12px';
        break;
      }
      default: {
        this._inner.style.width = '24px';
        this._inner.style.height = '24px';
        this._inner.style.lineHeight = '24px';
        this._inner.style.borderRadius = '5px';
        this._inner.style.fontSize = '16px';
        break;
      }
    }
  }
  onClick(cb: (self: IconButton) => void): IconButton {
    return super.onClick(cb as any) as any;
  }
}
