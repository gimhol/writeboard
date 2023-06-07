import { ReValue } from "../utils";
import { SizeType } from "./SizeType";
import { Style } from "./StyleType";
import { View } from "./View";

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
export enum StyleNames {
  Normal = 'normal',
  Hover = 'hover',
  Small = 'small',
  Middle = 'middle',
  Large = 'large',
}
export class Button extends View<'button'> {
  static StyleNames = StyleNames;
  protected _size: SizeType = SizeType.Middle;
  protected _preSize?: SizeType;
  protected _contents: [Content, Content] = ['', ''];
  protected _titles: [string, string] = ['', ''];
  protected _checked = false;
  protected _checkable = false;
  protected _handleClick: (this: HTMLObjectElement, ev: MouseEvent) => any;
  protected _cb?: (self: Button) => void;
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
    this._checkable = inits?.checkable === true;
    this._checked = inits?.checked === true;

    this.styles().register(StyleNames.Hover, {
      background: '#00000022'
    }).register(StyleNames.Small, {
      height: 18,
      lineHeight: 18,
      borderRadius: 5,
      fontSize: 12,
    }).register(StyleNames.Middle, {
      height: 24,
      lineHeight: 24,
      borderRadius: 5,
      fontSize: 14,
    }).register(StyleNames.Large, {
      height: 32,
      lineHeight: 32,
      borderRadius: 5,
      fontSize: 24,
    }).register(StyleNames.Normal, {
      userSelect: 'none',
      cursor: 'pointer',
      textAlign: 'center',
      transition: 'all 200ms',
      padding: 0,
      background: 'transparent',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }).add(StyleNames.Normal).refresh();

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
    const styles = this.styles();
    this.hover ? styles.add(StyleNames.Hover) : styles.remove(StyleNames.Hover)
    const styleName = `${this.hover}_${this.checked}_${this.disabled}`
    styles.remove(this._prevStyleNames).add(styleName).refresh();
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
  private aaa: Record<SizeType, StyleNames> = {
    [SizeType.Small]: StyleNames.Small,
    [SizeType.Middle]: StyleNames.Middle,
    [SizeType.Large]: StyleNames.Large
  }
  updateSize() {
    this.styles()
      .remove(this.aaa[this._preSize!])
      .add(this.aaa[this._size])
      .refresh();
    this._preSize = this._size;
  }
}

