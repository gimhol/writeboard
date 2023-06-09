import { ReValue } from "../utils";
import { SizeType } from "./SizeType";
import { Style } from "./StyleType";
import { View } from "./View";

export type ButtonContent = string | View;
export interface ButtonInits {
  contents?: [ButtonContent, ButtonContent];
  content?: ButtonContent;
  titles?: [string, string];
  title?: string;
  size?: SizeType;
  checkable?: boolean;
  checked?: boolean;
}
export enum ButtonStyleNames {
  Normal = 'normal',
  Hover = 'hover',
  Small = 'small',
  Middle = 'middle',
  Large = 'large',
};
export enum ButtonState {
  Normal = 0,
  Checked = 1,
}
export class Button extends View<'button'> {
  static State = ButtonState;
  static StyleNames = ButtonStyleNames;
  protected _size: SizeType = SizeType.Middle;
  protected _preSize?: SizeType;
  protected _contents = new Map<ButtonState, ButtonContent>()
  protected _titles = new Map<ButtonState, string>();
  protected _checked = false;
  protected _checkable = false;
  protected _handleClick: (this: HTMLObjectElement, ev: MouseEvent) => any;
  protected _cb?: (self: Button) => void;

  get title() { return this._titles.get(ButtonState.Normal); }
  set title(v) {
    if (v === undefined) { return; }
    this._titles.set(ButtonState.Normal, v);
    this._titles.set(ButtonState.Checked, v);
    this.updateTitle();
  }
  get titles() { return this._titles; }
  set titles(v) {
    this._titles = v;
    this.updateTitle();
  }

  get content() { return this._contents.get(ButtonState.Normal); }
  set content(v) {
    if (v === undefined) { return; }
    this._contents.set(ButtonState.Normal, v);
    this._contents.set(ButtonState.Checked, v);
    this.updateContent();
  }
  get contents() { return this._contents; }
  set contents(v) {
    this._contents = v;
    this.updateContent();
  }

  get checked() { return this._checked; }
  set checked(v) {
    this._checked = v;
    this.updateStyle();
    this.updateTitle();
    this.updateContent();
  }
  get disabled() { return this._inner.disabled }
  set disabled(v) {
    this._inner.disabled = v;
    this.updateStyle();
  }
  constructor(inits?: ButtonInits) {
    super('button');
    this.hoverOb;

    if (inits?.contents) {
      this._contents.set(ButtonState.Normal, inits.contents[0])
      this._contents.set(ButtonState.Checked, inits.contents[1])
    } else if (inits?.content) {
      this._contents.set(ButtonState.Normal, inits.content)
      this._contents.set(ButtonState.Checked, inits.content)
    }

    if (inits?.titles) {
      this._titles.set(ButtonState.Normal, inits.titles[0])
      this._titles.set(ButtonState.Checked, inits.titles[1])
    } else if (inits?.title) {
      this._titles.set(ButtonState.Normal, inits.title)
      this._titles.set(ButtonState.Checked, inits.title)
    }

    this._size = inits?.size ?? this._size;
    this._checkable = inits?.checkable === true;
    this._checked = inits?.checked === true;

    this.styles.register(ButtonStyleNames.Hover, {
      background: '#00000022'
    }).register(ButtonStyleNames.Small, {
      height: 18,
      lineHeight: 18,
      borderRadius: 5,
      fontSize: 12,
    }).register(ButtonStyleNames.Middle, {
      height: 24,
      lineHeight: 24,
      borderRadius: 5,
      fontSize: 14,
    }).register(ButtonStyleNames.Large, {
      height: 32,
      lineHeight: 32,
      borderRadius: 5,
      fontSize: 24,
    }).register(ButtonStyleNames.Normal, {
      userSelect: 'none',
      cursor: 'pointer',
      textAlign: 'center',
      transition: 'all 200ms',
      padding: 0,
      background: 'transparent',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }).add(ButtonStyleNames.Normal).refresh();

    this.editStyle(true, true, true, { background: '#333333' })
    this.editStyle(true, true, false, { background: '#333333' })
    this.editStyle(true, false, true, {})
    this.editStyle(true, false, false, {})
    this.editStyle(false, true, true, { background: '#444444' })
    this.editStyle(false, true, false, { background: '#444444' })
    this.editStyle(false, false, true, {})
    this.editStyle(false, false, false, {})
    this._handleClick = () => {
      if (this._checkable) { this._checked = !this._checked; }
      this.updateStyle()
      this.updateContent();
      this.updateTitle();
    };
    this.addEventListener('click', this._handleClick)
    this.updateContent();
    this.updateTitle();
    this.updateSize();
  }
  override onHover(hover: boolean): void {
    this.updateStyle();
  }
  private _prevStyleNames = ''
  updateStyle() {
    const styles = this.styles;
    this.hover ? styles.add(ButtonStyleNames.Hover) : styles.remove(ButtonStyleNames.Hover)
    const styleName = `${this.hover}_${this.checked}_${this.disabled}`
    styles.remove(this._prevStyleNames).add(styleName).refresh();
    this._prevStyleNames = styleName;
  }
  editStyle(hover: boolean, checked: boolean, disabled: boolean, style: ReValue<Style>) {
    this.styles.register(`${hover}_${checked}_${disabled}`, style);
    return this;
  }
  updateContent() {
    const content = this._contents.get(
      this._checked ? ButtonState.Checked : ButtonState.Normal
    );
    if (content === undefined) {
      this._inner.innerText = '';
    } else if (typeof content === 'string') {
      this._inner.innerText = content;
    } else {
      this._inner.innerHTML = ''
      this.addChild(content);
    }
  }
  updateTitle() {
    const title = this._titles.get(
      this._checked ? ButtonState.Checked : ButtonState.Normal
    );
    if (title === undefined) {
      this._inner.removeAttribute('title');
    } else {
      this._inner.setAttribute('title', title);
    }
  }
  private aaa: Record<SizeType, ButtonStyleNames> = {
    [SizeType.Small]: ButtonStyleNames.Small,
    [SizeType.Middle]: ButtonStyleNames.Middle,
    [SizeType.Large]: ButtonStyleNames.Large
  }
  updateSize() {
    this.styles
      .remove(this.aaa[this._preSize!])
      .add(this.aaa[this._size])
      .refresh();
    this._preSize = this._size;
  }
}

