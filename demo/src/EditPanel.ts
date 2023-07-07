import { CssAlignSelf } from "./G/BaseView/StyleType";
import { View } from "./G/BaseView/View";
import { IconButton } from "./G/CompoundView/IconButton";
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
  private _editStrokeView: View<"div">;
  private _editFillView: View<"div">;
  get state() { return this._state; }

  constructor() {
    super('div');
    this.styles.apply('', {
      position: 'absolute',
      alignSelf: CssAlignSelf.Stretch,
      right: 0,
      top: 0,
      bottom: 0,
      width: 0,
      background: 'white',
      opacity: 0,
      boxShadow: '0px 0px 10px 1px #00000011',
      zIndex: 1,
      transition: 'width 300ms, opacity 255ms',
      overflow: 'hidden',
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
    this._editImgView.styles.apply('', { borderBottom: '1px solid #eaeaea' })

    this._editTextView = new View('div');
    this._editTextView.addChild(new SectionTitle('Text'));
    this._editTextView.styles.apply('', { borderBottom: '1px solid #eaeaea' })

    this._editStrokeView = new View('div');
    this._editStrokeView.addChild(new SectionTitle('Stroke'));
    this._editStrokeView.styles.apply('', { borderBottom: '1px solid #eaeaea' })

    this._editFillView = new View('div');
    this._editFillView.addChild(new SectionTitle('Fill'));
    this._editFillView.styles.apply('', { borderBottom: '1px solid #eaeaea' })

    const btnClose = new IconButton().init({ src: './ic_btn_close.svg' })
    btnClose.styles.apply('', {
      position: 'absolute',
      right: 0,
      top: 0
    })
    btnClose.icon.styles.apply('', { fill: 'currentColor', color: 'black' })
    btnClose.addEventListener('click', () => {
      this.styles.apply('', v => ({ ...v, width: 0 }))
    })

    this.addChild(btnClose)
  }


  onStateChange = (e: StateEventTypeEventMap<A>[StateEventType.Change]) => {
    const { needImg, needText, needFill, needStroke } = e.detail.curr;
    this[needStroke ? 'addChild' : 'removeChild'](this._editStrokeView);
    this[needFill ? 'addChild' : 'removeChild'](this._editFillView);
    this[needImg ? 'addChild' : 'removeChild'](this._editImgView);
    this[needText ? 'addChild' : 'removeChild'](this._editTextView);

    if (needImg || needText || needFill || needStroke) {
      this.styles.apply('', v => ({
        ...v, width: 300,
        opacity: 1
      }))
    } else {
      this.styles.apply('', v => ({
        ...v, width: 0,
        opacity: 0
      }))
    }
  }
}
