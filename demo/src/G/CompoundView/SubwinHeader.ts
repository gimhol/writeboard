import { SizeType } from "../BaseView/SizeType";
import { IconButton } from "./IconButton";
import { View } from "../BaseView/View";
import { ViewDragger } from "../Helper/ViewDragger";
import { FocusOb } from "../Observer/FocusOb";
import { Image } from "../BaseView/Image";
import { CssObjectFit } from "../BaseView/StyleType";
export enum Classnames {
  Root = 'subwin_header',
  IconView = 'subwinheader_iconview',
  TitleView = 'subwinheader_titleview',
  BtnClose = 'subwinheader_btnclose',
}
export enum StyleNames {
  Root = 'subwin_header',
  IconView = 'subwinheader_iconview',
  TitleView = 'subwinheader_titleview',
  BtnClose = 'subwinheader_btnclose',
}
export class SubwinHeader extends View<'div'> {
  static ClassNames = Classnames;
  static StyleNames = StyleNames;
  private _titleView: View<"div">;
  private _iconView: IconButton;
  private _btnClose: IconButton;
  get iconView() { return this._iconView; }
  set iconView(v) { this._iconView = v; }
  get titleView() { return this._titleView; }
  set titleView(v) { this._titleView = v; }
  get title() { return this._titleView.inner.innerHTML; }
  set title(v) { this._titleView.inner.innerHTML = v; }
  constructor() {
    super('div');
    new FocusOb(this.inner, v => alert(v))
    this.styles
      .applyCls(Classnames.Root)
      .apply(StyleNames.Root, {
        userSelect: 'none',
        width: '100%',
        color: '#FFFFFF88',
        background: '#222222',
        borderBottom: '#222222',
        fontSize: 12,
        display: 'flex',
        boxSizing: 'border-box',
        alignItems: 'stretch',
        height: 28,
      });

    this._iconView = new IconButton()
    this._iconView
      .styles
      .applyCls(Classnames.IconView)
      .apply(StyleNames.IconView, {
        alignSelf: 'center',
        marginLeft: 2,
      })

    this.addChild(this._iconView);

    this._titleView = new View('div')
    this._titleView.styles
      .applyCls(Classnames.TitleView)
      .apply(StyleNames.TitleView, {
        display: 'flex',
        alignItems: 'center',
        flex: 1,
      });
    this.addChild(this._titleView);

    this._btnClose = new IconButton({ src: './ic_btn_close.svg' })
    this._btnClose.styles
      .applyCls(Classnames.BtnClose)
      .apply(StyleNames.BtnClose, {
        alignSelf: 'center',
        marginRight: 2,
      })
    this.addChild(this._btnClose);
  }
}


