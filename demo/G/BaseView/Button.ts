import { SizeType } from "./SizeType";
import { Styles } from "./Styles";
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
export enum ButtonState {
  Normal = 0,
  Checked = 1,
}
export class Button extends View<'button'> {
  static State = ButtonState;
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
  get disabled() { return this.inner.disabled }
  set disabled(v) {
    this.inner.disabled = v;
    this.updateStyle();
  }
  constructor() {
    super('button');
    Styles.css('./g_button.css');

    this.hoverOb;
    this.styles.addCls('g_button');

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
    styles[this.checked ? 'addCls' : 'delCls']('g_button_checked')
    styles[this.disabled ? 'addCls' : 'delCls']('g_button_disbaled')
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
  private aaa: Record<SizeType, string> = {
    [SizeType.Small]: 'g_button_small',
    [SizeType.Middle]: 'g_button_middle',
    [SizeType.Large]: 'g_button_large',
  }
  updateSize() {
    this.styles
      .delCls(this.aaa[this._preSize!])
      .addCls(this.aaa[this._size]);
    this._preSize = this._size;
  }
}

