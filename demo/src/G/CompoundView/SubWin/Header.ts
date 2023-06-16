import { Button } from "../../BaseView/Button";
import { View } from "../../BaseView/View";
import { IconButton } from "../IconButton";
export class SubwinHeader extends View<'div'> {
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
    this.styles.addCls('g_subwin_header');

    this._iconView = new IconButton().init().styles.addCls('g_subwin_icon').view;
    this.addChild(this._iconView);

    this._titleView = new View('div').styles.addCls('g_subwin_title').view
    this.addChild(this._titleView);

    this._btnClose = new IconButton().init({ src: './ic_btn_close.svg' }).styles.addCls('g_subwin_btn_close').view
    this.addChild(this._btnClose);
  }
}


