import { Button, ButtonInits, StyleNames } from "../BaseView/Button";
export interface IconButtonInits extends ButtonInits { }
export class IconButton extends Button {
  constructor(init?: IconButtonInits) {
    super(init);
    this.styles
      .register(StyleNames.Small, v => ({
        ...v,
        width: v.height
      })).register(StyleNames.Middle, v => ({
        ...v,
        width: v.height
      })).register(StyleNames.Large, v => ({
        ...v,
        width: v.height
      }));
    this.updateSize()
  }
}
