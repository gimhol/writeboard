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
  Disabled = 'disabled',
  Checked = 'checked',
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
  protected _contents?: Map<ButtonState, ButtonContent>;
  protected _titles?: Map<ButtonState, string>;
  protected _checked = false;
  protected _checkable = false;

  get title() { return this.titles.get(ButtonState.Normal); }
  set title(v) {
    if (v === undefined) { return; }
    this.titles.set(ButtonState.Normal, v);
    this.titles.set(ButtonState.Checked, v);
    this.updateTitle();
  }
  get titles(): Map<ButtonState, string> {
    this._titles = this._titles ?? new Map<ButtonState, string>();
    return this._titles;
  }
  set titles(v: Map<ButtonState, string>) {
    this._titles = v;
    this.updateTitle();
  }

  get content() { return this.contents.get(ButtonState.Normal); }
  set content(v) {
    if (v === undefined) { return; }
    this.contents.set(ButtonState.Normal, v);
    this.contents.set(ButtonState.Checked, v);
    this.updateContent();
  }
  get contents(): Map<ButtonState, ButtonContent> {
    this._contents = this._contents ?? new Map<ButtonState, ButtonContent>();
    return this._contents;
  }
  set contents(v: Map<ButtonState, ButtonContent>) {
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
  constructor() {
    super('button');
    this.hoverOb;
    this.styles.register(ButtonStyleNames.Small, {
      minWidth: 18,
      minHeight: 18,
      lineHeight: 18,
      borderRadius: 5,
      fontSize: 12,
    }).register(ButtonStyleNames.Middle, {
      minWidth: 24,
      minHeight: 24,
      lineHeight: 24,
      borderRadius: 5,
      fontSize: 14,
    }).register(ButtonStyleNames.Large, {
      minWidth: 32,
      minHeight: 32,
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
    }).register(ButtonStyleNames.Checked, {
      background: '#00000022'
    }).register(ButtonStyleNames.Hover, {
      background: '#00000044'
    }).add(ButtonStyleNames.Normal).refresh();
    
    this.inner.addEventListener('click', () => {
      if (this._checkable) {
        this._checked = !this._checked;
      }
      this.updateStyle()
      this.updateContent();
      this.updateTitle();
    })
  }
  init(inits?: ButtonInits): this {
    this._size = inits?.size ?? this._size;
    this._checkable = inits?.checkable === true;
    this._checked = inits?.checked === true;
    if (inits?.contents) {
      this.contents.set(ButtonState.Normal, inits.contents[0])
      this.contents.set(ButtonState.Checked, inits.contents[1])
    } else if (inits?.content) {
      this.contents.set(ButtonState.Normal, inits.content)
      this.contents.set(ButtonState.Checked, inits.content)
    }
    if (inits?.titles) {
      this.titles.set(ButtonState.Normal, inits.titles[0])
      this.titles.set(ButtonState.Checked, inits.titles[1])
    } else if (inits?.title) {
      this.titles.set(ButtonState.Normal, inits.title)
      this.titles.set(ButtonState.Checked, inits.title)
    }
    this.updateContent();
    this.updateTitle();
    this.updateSize();
    return this;
  }
  override onHover(hover: boolean): void {
    this.updateStyle();
  }
  updateStyle() {
    const styles = this.styles;
    styles[this.checked ? 'add' : 'remove'](ButtonStyleNames.Checked)
    styles[this.hover ? 'add' : 'remove'](ButtonStyleNames.Hover)
    styles[this.disabled ? 'add' : 'remove'](ButtonStyleNames.Disabled)

    styles.refresh();
  }
  updateContent() {
    const content = this.contents.get(
      this._checked ? ButtonState.Checked : ButtonState.Normal
    );
    if (content === undefined) {
      this.inner.innerText = '';
    } else if (typeof content === 'string') {
      this.inner.innerText = content;
    } else {
      this.inner.innerHTML = ''
      this.addChild(content);
    }
  }
  updateTitle() {
    const title = this.titles.get(
      this._checked ? ButtonState.Checked : ButtonState.Normal
    );
    if (title === undefined) {
      this.inner.removeAttribute('title');
    } else {
      this.inner.setAttribute('title', title);
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

