import { View } from "./View";
import { HoverOb } from "./HoverOb";
import { Style } from "./Styles";

export interface IIconButtonInits {
  text?: string;
  title?: string;
  size?: 's' | 'm'
}
export const style: Style = {

}

export class IconButton extends View<'button'> {
  constructor(init?: IIconButtonInits) {
    super('button');
    this.hoverOb();
    Object.assign(this._inner.style, style);
    this._inner.innerText = init?.text ?? '';
    this._inner.title = init?.title ?? '';
    this.saveStyle('normal', {
      userSelect: 'none',
      cursor: 'pointer',
      textAlign: 'center',
      transition: 'all 200ms',
      padding: '0px',
      background: 'transparent'
    })
    this.saveStyle('hover', {
      background: '#00000022'
    })
    this.saveStyle('small', {
      width: '18px',
      height: '18px',
      lineHeight: '18px',
      borderRadius: '5px',
      fontSize: '12px',
    })
    this.saveStyle('middle', {
      width: '24px',
      height: '24px',
      lineHeight: '24px',
      borderRadius: '5px',
      fontSize: '16px',
    })
    this.applyStyle('normal');
    switch (init?.size) {
      case 's':
        this.applyStyle('small');
        break;
      default:
        this.applyStyle('middle');
        break;
    }
  }
  override onHover(hover: boolean): void {
    hover ?
      this.applyStyle('hover') :
      this.applyStyle('normal')
  }
  onClick(cb: (self: IconButton) => void): IconButton {
    return super.onClick(cb as any) as any;
  }
}
