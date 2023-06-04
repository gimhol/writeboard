import { View } from "./View";
import { ViewDragger } from "./ViewDragger";

export class SubwinHeader extends View<'div'> {
  protected _dragger: ViewDragger;
  private _titleView: View<"div">;
  private _iconView: View<"div">;
  get title() { return this._titleView.inner.innerHTML; }
  set title(v) { this._titleView.inner.innerHTML = v; }
  constructor() {
    super('div');
    this.styleHolder()
      .applyStyle('normal', {
        userSelect: 'none',
        width: '100%',
        color: '#FFFFFF88',
        padding: '5px',
        background: '#222222',
        borderBottom: '#222222',
        fontSize: '12px',
      });

    this._iconView = new View('div')
    this.addChild(this._iconView);

    this._titleView = new View('div')
    this.addChild(this._titleView);

    this._dragger = new ViewDragger();
    this._dragger.handle = this.inner;
  }
  override onAfterAdded(parent: View<keyof HTMLElementTagNameMap>): void {
    this._dragger.view = parent.inner;
  }
}


