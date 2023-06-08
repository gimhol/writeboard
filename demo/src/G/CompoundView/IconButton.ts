import { Button, ButtonInits, StyleNames } from "../BaseView/Button";
import { Image } from "../BaseView/Image";
import { CssObjectFit } from "../BaseView/StyleType";
export interface IconButtonInits extends ButtonInits {
  src?: string;
}
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
    this.updateSize();

    if (init?.src) {
      const content = new Image({
        src: init.src,
        styles: {
          width: '100%',
          height: '100%',
          objectFit: CssObjectFit.Contain,
        }
      })
      this._contents = [content, content]
      this.updateContent();
    }
  }
}
