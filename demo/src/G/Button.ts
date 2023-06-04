import { View } from "./View";

export enum SizeType {
  Small = 's',
  Middle = 'm',
}
export interface ButtonInits {
  texts?: [string, string];
  text?: string;
  titles?: [string, string];
  title?: string;
  size?: SizeType;
  checkable?: boolean;
  checked?: boolean;
}
export class Button extends View<'button'> {
  private _size: SizeType = SizeType.Middle;
  private _texts: [string, string] = ['', ''];
  private _titles: [string, string] = ['', ''];
  private _checked = false;
  private _checkable = false;

  get checked() { return this._checked; }
  set checked(v) {
    this._checked = v;
    this.updateStyle();
  }
  constructor(inits?: ButtonInits) {
    super('button');
    this.hoverOb();
    this._texts = inits?.texts ?
      inits.texts :
      inits?.text ?
        [inits?.text, inits?.text] :
        this._texts;
    this._titles = inits?.titles ?
      inits.titles :
      inits?.title ?
        [inits?.title, inits?.title] :
        this._titles;
    this._size = inits?.size ?? this._size;
    this._checkable = inits?.checkable ?? this._checkable;

    this.styleHolder()
      .applyStyle('normal', {
        userSelect: 'none',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'all 200ms',
        padding: '0px',
        background: 'transparent'
      }).setStyle('hover', {
        background: '#00000022'
      }).setStyle('small', {
        height: '18px',
        lineHeight: '18px',
        borderRadius: '5px',
        fontSize: '12px',
      }).setStyle('middle', {
        height: '24px',
        lineHeight: '24px',
        borderRadius: '5px',
        fontSize: '14px',
      })


    this.handleClick = () => {
      if (this._checkable) { this._checked = !this._checked; }
      this.cb?.(this as any);
      this.updateStyle()
      this.updateText();
      this.updateTitle();
    };
    this.updateText();
    this.updateTitle();
    this.updateSize();
  }
  override onHover(hover: boolean): void {
    this.updateStyle();
  }
  onClick(cb: (self: Button) => void): Button {
    this.cb = cb as any;
    return this;
  }
  updateStyle() {
    const { hover } = this.hoverOb()
    const style0 = hover ? 'hover' : 'normal';

    this.styleHolder().applyStyle(style0);
    if (this._checkable) {
      if (this._checked) {
        this.styleHolder().applyStyle(hover ? 'hover_checked' : 'normal_checked');
      } else {
        this.styleHolder().applyStyle(hover ? 'hover_unchecked' : 'normal_unchecked');
      }
    }
  }
  updateText() {
    this._inner.innerText = this._checked ? this._texts[1] : this._texts[0];
  }
  updateTitle() {
    this._inner.title = this._checked ? this._titles[1] : this._titles[0];
  }
  updateSize() {
    switch (this._size) {
      case SizeType.Small:
        this.styleHolder().applyStyle('small');
        break;
      default:
        this.styleHolder().applyStyle('middle');
        break;
    }
  }
}

export enum ButtonGroupMode {
  None = 0,
  Single = 1,
  Multipy = 2,
}
export interface ButtonGroupInits {
  buttons?: Button[];
  mode?: ButtonGroupMode;
}
export class ButtonGroup {
  private _mode = ButtonGroupMode.Single;
  private _buttons: Button[] = [];
  private _listeners = new Map<Button, (e: MouseEvent) => void>();
  private _handleClick = (target: Button) => {
    switch (this._mode) {
      case ButtonGroupMode.Single:
        this._buttons.forEach(btn => btn.checked = target === btn)
        break;
    }
  }
  constructor(inits?: ButtonGroupInits) {
    if (inits?.buttons)
      this.addButton(...inits.buttons)
  }
  addButton(...buttons: Button[]) {
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
      btn.inner.addEventListener('click', l)
    });
  }
}