import { ILayerInfoInit, ToolEnum, ToolType } from "../../dist";
import { ButtonGroup, SizeType } from "./G/Button";
import { HoverOb } from "./G/HoverOb";
import { IconButton } from "./G/IconButton";
import { Img } from "./G/Img";
import { CssObjectFit } from "./G/StyleType";
import { Subwin } from "./G/Subwin";
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
          width: '24px',
          height: '24px',
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
    this.content.styles().apply('_', {
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
    this.content.styles().apply('_', {
      flex: '1',
      overflowY: 'auto',
      overflowX: 'hidden'

    })
    this.styles().apply('_', {
      minWidth: '225px',
      width: '225px',
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
  get state() { return this._state; }
  get selected() { return this._state.selected; }
  set selected(v) {
    this._state.selected = v;
    this.styles().apply("_", v => ({
      ...v,
      background: this.state.selected ? '#00000044' : ''
    }))
  }

  constructor(inits: ILayerInfoInit) {
    super('div')
    this._state.name = inits.name;
    this.styles().apply("_", {
      display: 'flex',
      position: 'relative',
      padding: '5px',
      borderBottom: '1px solid #00000022',
      transition: 'all 200ms',
    })

    new HoverOb(this._inner, hover => {
      this.styles().apply("_", v => ({
        ...v,
        background: hover ? '#00000022' : '#00000044'
      }))
    })

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

    const inputName = also(document.createElement('input'), input => {
      const focusedOb = new FocusedOb(input, () => update());
      const hoverOb = new HoverOb(input, () => update());
      input.style.minWidth = '100px';
      input.style.flex = '1';
      input.style.height = '24px';
      input.style.borderRadius = '5px';
      input.style.padding = '0px 5px';
      input.value = inits.name;
      input.disabled = true;
      const update = () => {
        if (focusedOb.focused) {
          input.style.outline = 'none';
          input.style.border = 'none';
          input.style.color = 'white'
        } else {
          input.style.background = 'none';
          input.style.outline = 'none';
          input.style.border = 'none';
          input.style.borderBottom = 'none';
          input.style.color = '#FFFFFF88';
        }
        if (hoverOb.hover) {
          input.style.background = '#00000022'
        } else {
          input.style.background = 'none';
        }
      }
      input.onblur = e => {
        update();
        this._state.name = (e.target as HTMLInputElement).value;
        input.disabled = true;
      }
      this.inner.append(input);
      update();
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

class FocusedOb {
  private _focused = false;
  get focused() { return this._focused; }
  constructor(ele: HTMLElement, cb: () => void) {
    ele.addEventListener('focus', e => { this._focused = true; cb() });
    ele.addEventListener('blur', e => { this._focused = false; cb() });
  }
}

function also<T>(t: T, func: (t: T) => void) {
  func(t);
  return t;
}