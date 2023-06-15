import { SizeType } from "../BaseView/SizeType";
import { IconButton } from "./IconButton";
import { View } from "../BaseView/View";
import { ViewDragger } from "../Helper/ViewDragger";
import { FocusOb } from "../Observer/FocusOb";
import { Image } from "../BaseView/Image";
import { CssObjectFit } from "../BaseView/StyleType";
import { Button } from "../BaseView/Button";
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
  private _iconView: Button;
  private _btnClose: IconButton;
  
  get btnClose() { return this._btnClose; }
  get iconView() { return this._iconView; }
  get titleView() { return this._titleView; }
  get title() { return this._titleView.inner.innerHTML; }
  set title(v) { this._titleView.inner.innerHTML = v; }
  constructor() {
    super('div');
    new FocusOb(this.inner, v => alert(v))
    this.styles
      .addCls(Classnames.Root)
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

    this._iconView = new Button()
    this._iconView
      .styles
      .addCls(Classnames.IconView)
      .apply(StyleNames.IconView, {
        alignSelf: 'center',
        marginLeft: 2,
      })

    this.addChild(this._iconView);

    this._titleView = new View('div')
    this._titleView.styles
      .addCls(Classnames.TitleView)
      .apply(StyleNames.TitleView, {
        display: 'flex',
        alignItems: 'center',
        flex: 1,
      });
    this.addChild(this._titleView);

    this._btnClose = new IconButton().init({ src: './ic_btn_close.svg' })
    this._btnClose.styles
      .addCls(Classnames.BtnClose)
      .apply(StyleNames.BtnClose, {
        alignSelf: 'center',
        marginRight: 2,
      })
    this.addChild(this._btnClose);
  }
}


