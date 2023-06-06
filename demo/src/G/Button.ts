import { Style } from "./StyleType";
import { View } from "./View";
import { ReValue } from "./utils";

export enum SizeType {
  Small = 's',
  Middle = 'm',
  Large = 'l',
}
export type Content = string | View;
export interface ButtonInits {
  contents?: [Content, Content];
  content?: Content;
  titles?: [string, string];
  title?: string;
  size?: SizeType;
  checkable?: boolean;
  checked?: boolean;
}

export enum ButtonStyles {
  Normal = 'normal',
  Hover = 'hover',
  Small = 'small',
  Middle = 'middle',
  Large = 'large',
}
export class Button extends View<'button'> {
  protected _size: SizeType = SizeType.Middle;
  protected _preSize?: SizeType;
  protected _contents: [Content, Content] = ['', ''];
  protected _titles: [string, string] = ['', ''];
  protected _checked = false;
  protected _checkable = false;
  get checked() { return this._checked; }
  set checked(v) {
    this._checked = v;
    this.updateStyle();
  }
  get disabled() { return this._inner.disabled }
  set disabled(v) {
    this._inner.disabled = v;
    this.updateStyle();
  }
  constructor(inits?: ButtonInits) {
    super('button');
    this.hoverOb();

    this._contents = inits?.contents ?
      inits.contents :
      inits?.content ?
        [inits?.content, inits?.content] :
        this._contents;
    this._titles = inits?.titles ?
      inits.titles :
      inits?.title ?
        [inits?.title, inits?.title] :
        this._titles;
    this._size = inits?.size ?? this._size;
    this._checkable = inits?.checkable ?? this._checkable;
    this.styles().register(ButtonStyles.Hover, {
      background: '#00000022'
    }).register(ButtonStyles.Small, {
      height: 18,
      lineHeight: 18,
      borderRadius: 5,
      fontSize: 12,
    }).register(ButtonStyles.Middle, {
      height: 24,
      lineHeight: 24,
      borderRadius: 5,
      fontSize: 14,
    }).register(ButtonStyles.Large, {
      height: 32,
      lineHeight: 32,
      borderRadius: 5,
      fontSize: 24,
    }).register(ButtonStyles.Normal, {
      userSelect: 'none',
      cursor: 'pointer',
      textAlign: 'center',
      transition: 'all 200ms',
      padding: 0,
      background: 'transparent',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }).add(ButtonStyles.Normal).refresh();

    this.editStyle(true, true, true, { background: '#333333' })
    this.editStyle(true, true, false, { background: '#333333' })
    this.editStyle(true, false, true, {})
    this.editStyle(true, false, false, {})
    this.editStyle(false, true, true, { background: '#444444' })
    this.editStyle(false, true, false, { background: '#444444' })
    this.editStyle(false, false, true, {})
    this.editStyle(false, false, false, {})
    this.handleClick = () => {
      if (this._checkable) { this._checked = !this._checked; }
      this.cb?.(this as any);
      this.updateStyle()
      this.updateContent();
      this.updateTitle();
    };
    this.updateContent();
    this.updateTitle();
    this.updateSize();
  }
  override onHover(hover: boolean): void {
    this.updateStyle();
  }
  override onClick(cb: (self: Button) => void): Button {
    this.cb = cb as any;
    return this;
  }
  private _prevStyleNames = ''
  updateStyle() {
    const { hover } = this.hoverOb();
    const styles = this.styles();
    hover ? styles.add(ButtonStyles.Hover) : styles.remove(ButtonStyles.Hover)
    const styleName = `${this.hover}_${this.checked}_${this.disabled}`
    styles.remove(this._prevStyleNames).add(styleName)
    styles.refresh();
    this._prevStyleNames = styleName;
  }
  editStyle(hover: boolean, checked: boolean, disabled: boolean, style: ReValue<Style>) {
    this.styles().register(`${hover}_${checked}_${disabled}`, style);
    return this;
  }
  updateContent() {
    const content = this._contents[this._checked ? 1 : 0];
    if (typeof content === 'string') {
      this._inner.innerText = content;
    } else {
      this._inner.innerHTML = ''
      this.addChild(content);
    }
  }
  updateTitle() {
    this._inner.title = this._checked ? this._titles[1] : this._titles[0];
  }
  private aaa: Record<SizeType, ButtonStyles> = {
    [SizeType.Small]: ButtonStyles.Small,
    [SizeType.Middle]: ButtonStyles.Middle,
    [SizeType.Large]: ButtonStyles.Large
  }
  updateSize() {
    this.styles()
      .remove(this.aaa[this._preSize!])
      .add(this.aaa[this._size])
      .refresh();
    this._preSize = this._size;
  }
}

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
        this._buttons.forEach(btn => btn.checked = target === btn)
        break;
    }
    this._onClick?.(target);
  }
  constructor(inits?: ButtonGroupInits<B>) {
    if (inits?.buttons)
      this.addButton(...inits.buttons)
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
      btn.inner.addEventListener('click', l)
    });
  }
}