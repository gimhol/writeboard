import { SizeType } from "./Button";
import { IconButton } from "./IconButton";
import { View } from "./View";
import { ViewDragger } from "./ViewDragger";

export class SubwinHeader extends View<'div'> {
  protected _dragger: ViewDragger;
  private _titleView: View<"div">;
  private _iconView: View<"div">;
  private _btnClose: IconButton;
  get iconView() { return this._iconView; }
  set iconView(v) { this._iconView = v; }
  get titleView() { return this._titleView; }
  set titleView(v) { this._titleView = v; }
  get title() { return this._titleView.inner.innerHTML; }
  set title(v) { this._titleView.inner.innerHTML = v; }
  get dragger() { return this._dragger; }
  constructor() {
    super('div');
    this.styles()
      .applyCls('subwin_header')
      .apply('normal', {
        userSelect: 'none',
        width: '100%',
        color: '#FFFFFF88',
        background: '#222222',
        borderBottom: '#222222',
        fontSize: '12px',
        display: 'flex',
        boxSizing: 'border-box',
        alignItems: 'stretch',
      });

    this._iconView = new View('div')
    this._iconView.inner.innerHTML = '';
    this._iconView.styles().applyCls('subwinheader_iconview').apply('_', {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '5px',
    })

    this.addChild(this._iconView);

    this._titleView = new View('div')
    this._titleView.styles().applyCls('subwinheader_titleview').apply('wtf', {
      display: 'flex',
      alignItems: 'center',
      flex: '1',
    });
    this.addChild(this._titleView);

    this._btnClose = new IconButton({ content: '❎', size: SizeType.Small })
    this._btnClose.styles().apply('_', {
      alignSelf: 'center',
      margin: '5px',
    })
    this.addChild(this._btnClose);

    this._dragger = new ViewDragger({
      handles: [
        this._titleView.inner,
        this._iconView.inner
      ]
    });
  }
  override onAfterAdded(parent: View<keyof HTMLElementTagNameMap>): void {
    this._dragger.view = parent;
  }
}


