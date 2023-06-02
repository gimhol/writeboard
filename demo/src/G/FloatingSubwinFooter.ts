import { View } from "./View";
import { ViewDragger } from "../layers_view";


export class FloatingSubwinFooter extends View<'div'> {
  constructor() {
    super('div');
    this._inner.style.userSelect = 'none';
    this._inner.style.width = '100%';
    this._inner.style.color = '#FFFFFF88';
    this._inner.style.padding = '3px';
    this._inner.style.background = '#333333';
    this._inner.style.borderBottom = '#333333';
    this._inner.style.display = 'flex';
    
  }
}
