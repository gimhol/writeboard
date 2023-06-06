import { ILayerInfoInit, ToolEnum, ToolType } from "../../dist";
import { ButtonGroup, SizeType } from "./G/Button";
import { FocusOb, HoverOb } from "./G/HoverOb";
import { IconButton } from "./G/IconButton";
import { Img } from "./G/Img";
import { CssObjectFit } from "./G/StyleType";
import { Subwin } from "./G/Subwin";
import { TextInput } from "./G/TextInput";
import { ToggleIconButton } from "./G/ToggleIconButton";
import { View } from "./G/View";
export interface ToolButtonInits {
  src: string;
  toolType: ToolType
}
export class ToolButton extends IconButton {
  private _toolType: string;
  get toolType() { return this._toolType; }
  constructor(inits: ToolButtonInits) {
    super({
      content: new Img({
        src: inits.src,
        styles: {
          width: 24,
          height: 24,
          objectFit: CssObjectFit.Contain,
        }
      }),
      checkable: true,
      size: SizeType.Large
    })

    this._toolType = inits.toolType;
  }
}
export class ToolsView extends Subwin {
  private _toolButtonGroup: ButtonGroup<ToolButton>;
  set onToolClick(v: (target: ToolButton) => void) {
    this._toolButtonGroup.onClick = v;
  }
  constructor() {
    super()
    this.header.title = 'tools'
    this.content = new View('div');
    this.content.styles().apply("", {
      flex: '1',
      overflowY: 'auto',
      overflowX: 'hidden'
    })

    const toolsBtns = [
      new ToolButton({ src: './ic_selector.svg', toolType: ToolEnum.Selector }),
      new ToolButton({ src: './ic_pen.svg', toolType: ToolEnum.Pen }),
      new ToolButton({ src: './ic_rect.svg', toolType: ToolEnum.Rect }),
      new ToolButton({ src: './ic_oval.svg', toolType: ToolEnum.Oval }),
      new ToolButton({ src: './ic_text.svg', toolType: ToolEnum.Text })
    ]
    toolsBtns.forEach(btn => this.content?.addChild(btn));
    this._toolButtonGroup = new ButtonGroup({ buttons: toolsBtns })
    this.removeChild(this.footer);
  }
}
export class LayersView extends Subwin {
  private _layers: LayerItemView[] = [];
  constructor() {
    super()
    this.header.title = 'layers'
    this.content = new View('div');
    this.content.styles().apply("", {
      flex: '1',
      overflowY: 'auto',
      overflowX: 'hidden'

    })
    this.styles().apply("", {
      minWidth: '225px',
      width: 225,
    })

    const btnAddLayer = new IconButton({ content: '📃', title: '新建图层', size: SizeType.Small })
    this.footer.addChild(btnAddLayer);

    const btnAddFolder = new IconButton({ content: '📂', title: '新建图层组', size: SizeType.Small })
    this.footer.addChild(btnAddFolder);
  }
  layers() { return this._layers }
  setLayers() { }
  addLayer(inits: ILayerInfoInit) {
    const item = new LayerItemView(inits);
    this._layers.push(item);
    this.content?.addChild(item);
    item.onClick(() => {
      this.content?.children?.forEach(v => v.selected = false)
      item.selected = true;
    })
  }
}
export class LayerItemView extends View<'div'> {
  private _state = {
    visible: true,
    locked: false,
    name: '',
    selected: false,
  };
  private _prevStyleName?: string;
  get state() { return this._state; }
  get selected() { return this._state.selected; }
  set selected(v) {
    this._state.selected = v;
    this.styles().apply("", v => ({
      ...v,
      background: this.state.selected ? '#00000044' : ''
    }))
  }

  updateStyle() {
    const styleName = `${this.hover}_${this.selected}`;
    this.styles().remove(this._prevStyleName!).add(styleName).refresh()
    this._prevStyleName = styleName;
  }
  override onHover(hover: boolean): void { this.updateStyle() }

  constructor(inits: ILayerInfoInit) {
    super('div')
    this._state.name = inits.name;
    this.styles().apply("", {
      display: 'flex',
      position: 'relative',
      padding: 5,
      borderBottom: '1px solid #00000022',
      transition: 'all 200ms',
    })
    this.styles()
      .register('false_false', {})
      .register('true_false', { background: '#00000022' })
      .register('false_true', { background: '#00000033' })
      .register('true_true', { background: '#00000044' })


    const btn0 = new ToggleIconButton({
      checked: this._state.locked,
      contents: ['🔓', '🔒']
    }).onClick(btn => {
      this._state.locked = btn.checked;
    })
    this.addChild(btn0);

    const btn1 = new ToggleIconButton({
      checked: this._state.visible,
      contents: ['🙈', '🐵']
    }).onClick(btn => {
      this._state.visible = btn.checked;
    })
    this.addChild(btn1);

    const btn2 = new ToggleIconButton({
      checked: this._state.visible,
      contents: ['➕', '➖']
    }).onClick(btn => {
      this._state.visible = btn.checked;
    })
    this.addChild(btn2);

    const inputName = new TextInput();
    inputName
      .editStyle(true, true, true, {})
      .editStyle(false, true, true, {})
      .editStyle(true, false, true, {})
      .editStyle(false, false, true, {})
      .editStyle(false, false, false, {})
      .editStyle(true, false, false, {
        background: '#00000022'
      })
      .editStyle(true, true, false, {
        outline: 'none',
        border: 'none',
        color: 'white',
      })
      .editStyle(false, true, false, {
        outline: 'none',
        border: 'none',
        color: 'white',
      })
      .styles().apply("", {
        minWidth: 100,
        flex: 1,
        height: 24,
        borderRadius: 5,
        padding: '0px 5px',
        background: 'none',
        color: '#FFFFFF88'
      });
    inputName.value = inits.name;
    inputName.disabled = true;
    this.addChild(inputName);

    new FocusOb(inputName.inner, (v) => {
      if (!v) inputName.disabled = true;
    })

    const btn3 = new IconButton({
      content: '🖊️'
    }).onClick(() => {
      inputName.disabled = false;
      inputName.focus();
    })
    this.addChild(btn3);
  }
}

function also<T>(t: T, func: (t: T) => void) {
  func(t);
  return t;
}