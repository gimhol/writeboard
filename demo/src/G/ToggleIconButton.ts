import { IconButton } from "./IconButton";

export class ToggleIconButton extends IconButton {
  protected _texts: [string, string] = ['', ''];
  protected _checked = false;
  get checked() { return this._checked; }
  set checked(v) {
    this._checked = !this._checked;
    this.updateText();
  }
  constructor(inits?: { checked: boolean; texts: [string, string]; size?: 's' | 'm' }) {
    super(inits);
    this._texts = inits?.texts ? [...inits.texts] : ['', ''];
    this.checked = inits?.checked ?? false;
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
}
