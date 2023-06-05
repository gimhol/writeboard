import { GetStyle, View } from "./View";

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
  Hover_Checked = 'hover_checked',
  Normal_Checked = 'normal_checked',
  Hover_Unchecked = 'hover_unchecked',
  Normal_Unchecked = 'normal_unchecked',
  Disabled = 'disabled',
  Disabled_Checked = 'disabled_checked',
  Disabled_Unchecked = 'disabled_unchecked',
}
export class Button extends View<'button'> {
  private _size: SizeType = SizeType.Middle;
  private _contents: [Content, Content] = ['', ''];
  private _titles: [string, string] = ['', ''];
  private _checked = false;
  private _checkable = false;

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

    this.styleHolder()
      .applyStyle(ButtonStyles.Normal, {
        userSelect: 'none',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'all 200ms',
        padding: '0px',
        background: 'transparent',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center'
      }).setStyle(ButtonStyles.Hover, {
        background: '#00000022'
      }).setStyle(ButtonStyles.Small, {
        height: '18px',
        lineHeight: '18px',
        borderRadius: '5px',
        fontSize: '12px',
      }).setStyle(ButtonStyles.Middle, {
        height: '24px',
        lineHeight: '24px',
        borderRadius: '5px',
        fontSize: '14px',
      }).setStyle(ButtonStyles.Large, {
        height: '32px',
        lineHeight: '32px',
        borderRadius: '5px',
        fontSize: '24px',
      })
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
  onClick(cb: (self: Button) => void): Button {
    this.cb = cb as any;
    return this;
  }
  updateStyle() {
    const { hover } = this.hoverOb()
    this.styleHolder().applyStyle(hover ?
      ButtonStyles.Hover :
      ButtonStyles.Normal
    );
    const styleName = `${this.hover}_${this.checked}_${this.disabled}`
    this.styleHolder().applyStyle(styleName);
  }
  editStyle(hover: boolean, checked: boolean, disabled: boolean, style: GetStyle) {
    this.styleHolder().setStyle(`${hover}_${checked}_${disabled}`, style);
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
  updateSize() {
    switch (this._size) {
      case SizeType.Large:
        this.styleHolder().applyStyle(ButtonStyles.Large);
        break;
      case SizeType.Small:
        this.styleHolder().applyStyle(ButtonStyles.Small);
        break;
      default:
        this.styleHolder().applyStyle(ButtonStyles.Middle);
        break;
    }
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