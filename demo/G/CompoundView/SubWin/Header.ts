import { Button } from "../../BaseView/Button";
import { SizeType } from "../../BaseView/SizeType";
import { View } from "../../BaseView/View";
import { IconButton } from "../IconButton";
export class SubwinHeader extends View<'div'> {
  private _titleView: View<"div">;
  private _iconView: IconButton;
  private _btnClose: IconButton;

  get btnClose() { return this._btnClose; }
  get iconView() { return this._iconView; }
  get titleView() { return this._titleView; }

  get title() { return this._titleView.inner.innerHTML; }
  set title(v) { this._titleView.inner.innerHTML = v; }

  constructor() {
    super('div');
    this.styles.addCls('g_subwin_header');

    this._iconView = new IconButton().init({ size: SizeType.Small }).styles.addCls('g_subwin_icon').view;
    this._iconView.icon.addEventListener('load', e => this._iconView.styles.apply('', { display: undefined }))
    this._iconView.icon.addEventListener('error', e => this._iconView.styles.apply('', { display: 'none' }))
    this.addChild(this._iconView);

    this._titleView = new View('div').styles.addCls('g_subwin_title').view
    this.addChild(this._titleView);

    this._btnClose = new IconButton().init({ src: './ic_btn_close.svg', size: SizeType.Small }).styles.addCls('g_subwin_btn_close').view
    this.addChild(this._btnClose);
  }
}


