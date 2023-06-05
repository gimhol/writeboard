import { SizeType } from "./Button";
import { IconButton } from "./IconButton";
import { View } from "./View";
import { ViewDragger } from "./ViewDragger";

export class SubwinHeader extends View<'div'> {
  protected _dragger: ViewDragger;
  private _titleView: View<"div">;
  private _iconView: View<"div">;
  private _btnClose: IconButton;
  get title() { return this._titleView.inner.innerHTML; }
  set title(v) { this._titleView.inner.innerHTML = v; }
  constructor() {
    super('div');
    this.styleHolder()
      .applyStyle('normal', {
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
    this._iconView.inner.innerHTML = '❎';
    this._iconView.styleHolder().applyStyle('', {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '5px',
    })

    this.addChild(this._iconView);

    this._titleView = new View('div')
    this._titleView.styleHolder().applyStyle('', {
      display: 'flex',
      alignItems: 'center',
      flex: '1',
    });
    this.addChild(this._titleView);

    this._btnClose = new IconButton({ text: '❎', size: SizeType.Small })
    this._btnClose.styleHolder().applyStyle('', {
      alignSelf: 'center',
      margin: '5px',
    })
    this._btnClose.onClick(() => alert('!'))
    this.addChild(this._btnClose);

    this._dragger = new ViewDragger({
      handles: [
        this._titleView.inner,
        this._iconView.inner
      ]
    });
  }
  override onAfterAdded(parent: View<keyof HTMLElementTagNameMap>): void {
    this._dragger.view = parent.inner;
  }
}


