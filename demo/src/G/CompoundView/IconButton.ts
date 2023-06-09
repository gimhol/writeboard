import { Button, ButtonInits, ButtonState, ButtonStyleNames } from "../BaseView/Button";
import { Image } from "../BaseView/Image";
import { CssObjectFit } from "../BaseView/StyleType";
export interface IconButtonInits extends ButtonInits {
  src?: string;
  srcs?: [string, string];
}
export class IconButton extends Button {
  protected _srcs = new Map<ButtonState, string>();

  constructor(inits?: IconButtonInits) {
    super(inits);
    this.styles
      .register(ButtonStyleNames.Small, v => ({
        ...v, width: v.height
      })).register(ButtonStyleNames.Middle, v => ({
        ...v, width: v.height
      })).register(ButtonStyleNames.Large, v => ({
        ...v, width: v.height
      }));
    this.updateSize();

    if (inits?.srcs) {
      this._srcs.set(ButtonState.Normal, inits.srcs[0])
      this._srcs.set(ButtonState.Checked, inits.srcs[1])
    } else if (inits?.src) {
      this._srcs.set(ButtonState.Normal, inits.src)
      this._srcs.set(ButtonState.Checked, inits.src)
    }

    const content = new Image({
      style: {
        width: '100%',
        height: '100%',
        objectFit: CssObjectFit.Contain,
      }
    })
    this._contents.set(ButtonState.Normal, content)
    this._contents.set(ButtonState.Checked, content)
    this.updateContent();
  }

  override updateContent(): void {
    const src = this._srcs.get(
      this._checked ? ButtonState.Checked : ButtonState.Normal
    );
    if (!src) {
      return super.updateContent();
    }
    const content = this._contents.get(
      this._checked ? ButtonState.Checked : ButtonState.Normal
    );
    if (content instanceof Image) {
      content.src = src;
    } else {
      super.updateContent();
    }
  }
}
