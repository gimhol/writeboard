import { View } from "./View";
import { ViewDragger } from "../layers_view";

export class FloatingSubwinHeader extends View<'div'> {
  protected _dragger: ViewDragger;
  constructor() {
    super('div');
    this._inner.style.userSelect = 'none';
    this._inner.style.width = '100%';
    this._inner.style.color = '#FFFFFF88';
    this._inner.style.padding = '5px';
    this._inner.style.background = '#222222';
    this._inner.style.borderBottom = '#222222';
    this._inner.innerText = 'layers';
    this._dragger = new ViewDragger();
    this._dragger.handle = this.inner;
  }
  override onAfterAdded(parent: View<keyof HTMLElementTagNameMap>): void {
    this._dragger.view = parent.inner;
  }
}


