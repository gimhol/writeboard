import { Button, ButtonInits, ButtonStyles } from "./Button";
export interface IconButtonInits extends ButtonInits { }
export class IconButton extends Button {
  constructor(init?: IconButtonInits) {
    super(init);
    this.styles()
      .register(ButtonStyles.Small, style => ({
        ...style,
        width: style.height
      })).register(ButtonStyles.Middle, style => ({
        ...style,
        width: style.height
      })).register(ButtonStyles.Large, style => ({
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
