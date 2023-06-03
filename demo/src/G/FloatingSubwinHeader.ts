import { View } from "./View";
import { ViewDragger } from "../layers_view";

export class FloatingSubwinHeader extends View<'div'> {
  protected _dragger: ViewDragger;
  constructor() {
    super('div');
    this.saveStyle('normal', {
      userSelect: 'none',
      width: '100%',
      color: '#FFFFFF88',
      padding: '5px',
      background: '#222222',
      borderBottom: '#222222',
      fontSize: '12px',
    });
    this.applyStyle('normal')
    this._dragger = new ViewDragger();
    this._dragger.handle = this.inner;
  }
  override onAfterAdded(parent: View<keyof HTMLElementTagNameMap>): void {
    this._dragger.view = parent.inner;
  }
}


