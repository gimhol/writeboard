import { View } from "../../BaseView/View";
import { IndicatorImage } from "./IndicatorImage";

class IndicatorView extends View<'div'> {
  private _left = new IndicatorImage({ src: './ic_dock_to_left.svg' });
  private _top = new IndicatorImage({ src: './ic_dock_to_top.svg' });
  private _right = new IndicatorImage({ src: './ic_dock_to_right.svg' });
  private _bottom = new IndicatorImage({ src: './ic_dock_to_bottom.svg' });
  private _center = new IndicatorImage({ src: '' });
  constructor() {
    super('div');
    this.styles.apply('normal', {
      display: 'grid',
      gridTemplateColumns: '33% 33% 33%',
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: '10000'
    });
    this.addChild(
      new View('div'), this._top, new View('div'),
      this._left, this._center, this._right,
      new View('div'), this._bottom, new View('div')
    );
  }
}
