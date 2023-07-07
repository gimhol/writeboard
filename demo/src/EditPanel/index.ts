import { NumberInput } from "../G/BaseView/NumberInput";
import { CssAlignSelf } from "../G/BaseView/StyleType";
import { Styles } from "../G/BaseView/Styles";
import { View } from "../G/BaseView/View";
import { IconButton } from "../G/CompoundView/IconButton";
import { State, StateEventType, StateEventTypeEventMap } from "../G/State";

interface A {
  needFill: boolean,
  needStroke: boolean,
  needText: boolean,
  needImg: boolean,
  lineWidth?: number,
  fontSize?: number
}

export class SectionTitle extends View<'div'>{
  constructor(text: string) {
    super('div');
    this.styles.addCls('section_title')
    this.inner.innerText = text;
  }
}

export class EditPanel extends View<'div'> {
  private _state: State<A>
  private _editTextView: View<"div">;
  private _editImgView: View<"div">;
  private _editStrokeView: View<"div">;
  private _editFillView: View<"div">;
  private _lineWidthInput: NumberInput;
  private _fontSizeInput: NumberInput;
  get lineWidthInput() { return this._lineWidthInput; }
  get fontSizeInput() { return this._fontSizeInput; }
  get state() { return this._state; }

  constructor() {
    super('div');
    this.styles.addCls('g_cp_edit_panel');

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
    this._fontSizeInput = new NumberInput();
    this._fontSizeInput.min = 0;
    this._editTextView.addChild(this._fontSizeInput)

    this._editStrokeView = new View('div');
    this._editStrokeView.addChild(new SectionTitle('Stroke'));
    this._editStrokeView.styles.apply('', { borderBottom: '1px solid #eaeaea' })
    this._lineWidthInput = new NumberInput();
    this._lineWidthInput.min = 0;
    this._editStrokeView.addChild(this._lineWidthInput)

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
    const { needImg, needText, needFill, needStroke, lineWidth, fontSize } = e.detail.curr;
    this[needStroke ? 'addChild' : 'removeChild'](this._editStrokeView);
    this[needFill ? 'addChild' : 'removeChild'](this._editFillView);
    this[needImg ? 'addChild' : 'removeChild'](this._editImgView);
    this[needText ? 'addChild' : 'removeChild'](this._editTextView);

    if (typeof lineWidth === 'number') {
      this._lineWidthInput.num = lineWidth;
    } else {
      this._lineWidthInput.value = '';
    }

    if (typeof fontSize === 'number') {
      this._fontSizeInput.num = fontSize;
    } else {
      this._fontSizeInput.value = '';
    }

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
