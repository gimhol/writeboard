import { Button } from "../BaseView/Button";
export enum ButtonGroupMode {
  None = 0,
  Single = 1,
  Multipy = 2,
}
export interface ButtonGroupInits<B extends Button> {
  buttons?: B[];
  mode?: ButtonGroupMode;
}
export class ButtonGroup<B extends Button = Button> {
  private _mode = ButtonGroupMode.Single;
  private _buttons: B[] = [];
  private _listeners = new Map<B, (e: MouseEvent) => void>();
  private _onClick?: (target: B) => void;
  set onClick(v: (target: B) => void) { this._onClick = v; }

  private _handleClick = (target: B) => {
    switch (this._mode) {
      case ButtonGroupMode.Single:
        this._buttons.forEach(btn => btn.checked = target === btn);
        break;
    }
    this._onClick?.(target);
  };
  constructor(inits?: ButtonGroupInits<B>) {
    if (inits?.buttons)
      this.addButton(...inits.buttons);
  }
  addButton(...buttons: B[]) {
    this._buttons.forEach(btn => {
      const l = this._listeners.get(btn);
      if (l) {
        btn.inner.removeEventListener('click', l);
      }
    });
    this._buttons = Array.from(new Set(this._buttons.concat(buttons)));
    this._buttons.forEach(btn => {
      const l = () => this._handleClick(btn);
      this._listeners.set(btn, l);
      btn.inner.addEventListener('click', l);
    });
  }
}
