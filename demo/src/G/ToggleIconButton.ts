import { IconButton, IIconButtonInits } from "./IconButton";

export interface IToggleIconButtonInits extends IIconButtonInits {
  checked?: boolean;
  texts?: [string, string];
}

export class ToggleIconButton extends IconButton {
  protected _texts: [string, string] = ['', ''];
  protected _checked = false;
  get checked() { return this._checked; }
  set checked(v) {
    this._checked = v;
    this.onHover(this.hoverOb().hover);
    this.updateText();
  }
  constructor(inits?: IToggleIconButtonInits) {
    super(inits);
    this._texts = inits?.texts ?
      [...inits.texts] :
      inits?.text ?
        [inits?.text, inits?.text] :
        ['', ''];
    this.checked = inits?.checked ?? false;
    this.hoverOb()
  }
  updateText() {
    this._inner.innerText = this._checked ? this._texts[1] : this._texts[0];
  }
  onClick(cb: (self: ToggleIconButton) => void): ToggleIconButton {
    this.cb = cb as any;
    this.handleClick = () => {
      this.checked = !this._checked;
      this.cb?.(this);
    };
    return this;
  }
  override onHover(hover: boolean): void {
    if (hover) {
      this.applyStyle('hover')
      if (this.checked) {
        this.applyStyle('hover_checked')
      }
    } else {
      this.applyStyle('normal')
      if (this.checked) {
        this.applyStyle('normal_checked')
      }
    }
  }
}
