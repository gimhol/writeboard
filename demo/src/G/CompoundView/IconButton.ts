import { Button, ButtonInits, ButtonState, ButtonStyleNames } from "../BaseView/Button";
import { Image } from "../BaseView/Image";
import { CssObjectFit } from "../BaseView/StyleType";
export interface IconButtonInits extends ButtonInits {
  src?: string;
  srcs?: [string, string];
}
export class IconButton extends Button {
  protected private?: Map<ButtonState, string>;
  get srcs(): Map<ButtonState, string> {
    this.private = this.private ?? new Map<ButtonState, string>();
    return this.private;
  }
  set srcs(v) {
    this.private = v;
    this.updateContent();
  }
  constructor() {
    super();
    this.styles
      .register(ButtonStyleNames.Small, v => ({
        ...v, width: v.height
      })).register(ButtonStyleNames.Middle, v => ({
        ...v, width: v.height
      })).register(ButtonStyleNames.Large, v => ({
        ...v, width: v.height
      }));
  }
  override init(inits?: IconButtonInits | undefined): this {
    const superInits: ButtonInits = {
      ...inits,
      content: new Image({
        style: {
          width: '100%',
          height: '100%',
          objectFit: CssObjectFit.Contain,
        }
      })
    }
    if (inits?.srcs) {
      this.srcs.set(ButtonState.Normal, inits.srcs[0])
      this.srcs.set(ButtonState.Checked, inits.srcs[1])
    } else if (inits?.src) {
      this.srcs.set(ButtonState.Normal, inits.src)
      this.srcs.set(ButtonState.Checked, inits.src)
    }
    return super.init(superInits);
  }
  override updateContent(): void {
    const src = this.srcs.get(
      this.checked ? ButtonState.Checked : ButtonState.Normal
    );
    const content = this.content;
    if (content instanceof Image) {
      content.src = src!;
    }
    super.updateContent();
  }
}
