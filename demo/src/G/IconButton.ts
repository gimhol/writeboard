import { Button, ButtonInits, ButtonStyles } from "./Button";
export interface IconButtonInits extends ButtonInits { }
export class IconButton extends Button {
  constructor(init?: IconButtonInits) {
    super(init);
    this.styleHolder()
      .setStyle(ButtonStyles.Small, style => ({
        ...style,
        width: style.height
      })).setStyle(ButtonStyles.Middle, style => ({
        ...style,
        width: style.height
      })).setStyle(ButtonStyles.Large, style => ({
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
