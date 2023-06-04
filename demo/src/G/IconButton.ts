import { Button, ButtonInits } from "./Button";
export interface IconButtonInits extends ButtonInits { }
export class IconButton extends Button {
  constructor(init?: IconButtonInits) {
    super(init);
    this.styleHolder().setStyle('small', style => ({
      ...style,
      width: style.height
    })).setStyle('middle', style => ({
      ...style,
      width: style.height
    }));
    this.updateSize()
  }
  onClick(cb: (self: IconButton) => void): IconButton {
    this.cb = cb as any;
    return this;
  }
}
