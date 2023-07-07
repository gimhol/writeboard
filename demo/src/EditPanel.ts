import { CssAlignSelf } from "./G/BaseView/StyleType";
import { View } from "./G/BaseView/View";
import { State, StateEventType, StateEventTypeEventMap } from "./G/State";

interface A {
  needFill: boolean,
  needStroke: boolean,
  needText: boolean,
  needImg: boolean,
}

export class SectionTitle extends View<'div'>{
  constructor(text: string) {
    super('div');
    this.styles.apply('', {
      padding: 5,
      fontSize: 16,
    })
    this.inner.innerText = text;
  }
}

export class EditPanel extends View<'div'> {
  private _state: State<A>
  private _editTextView: View<"div">;
  private _editImgView: View<"div">;
  get state() { return this._state; }

  constructor() {
    super('div');
    this.styles.apply('', {
      position: 'relative',
      alignSelf: CssAlignSelf.Stretch,
      width: 300,
      background: 'white',
      boxShadow: '0px 0px 10px 1px #00000011',
      zIndex: 1
    });
    this._state = new State<A>({
      needFill: false,
      needStroke: false,
      needText: false,
      needImg: false,
    })
    this._state.setOwner(this.inner);
    this._state.addEventListener(StateEventType.Change, this.onStateChange)

    this._editImgView = new View('div');
    this._editImgView.addChild(new SectionTitle('Image'));

    this._editTextView = new View('div');
    this._editTextView.addChild(new SectionTitle('Text'));
  }


  onStateChange = (e: StateEventTypeEventMap<A>[StateEventType.Change]) => {
    const { needImg, needText } = e.detail.curr;
    if (needImg !== !this._editImgView.parent) {
      this[needImg ? 'addChild' : 'removeChild'](this._editImgView);
    }
    if (needText !== !this._editTextView.parent) {
      this[needImg ? 'addChild' : 'removeChild'](this._editTextView);
    }
  }
}
