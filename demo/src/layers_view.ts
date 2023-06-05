import { ILayerInfoInit, ToolEnum, ToolType } from "../../dist";
import { ButtonGroup, SizeType } from "./G/Button";
import { HoverOb } from "./G/HoverOb";
import { IconButton } from "./G/IconButton";
import { Img } from "./G/Img";
import { CssObjectFit } from "./G/Styles";
import { Subwin } from "./G/Subwin";
import { NumberInput } from "./G/TextInput";
import { ToggleIconButton } from "./G/ToggleIconButton";
import { View } from "./G/View";
import { RGBA } from "./colorPalette/Color";
import { ColorPalette } from "./colorPalette/ColorPalette";

export class ColorView extends Subwin {
  constructor() {
    super()
    this.header.title = 'color'

    this.styleHolder().applyStyle('', {
      minWidth: '250px',
      width: '250px',
      minHeight: '200px',
      height: '200px',
    })

    this.content = new View('div');
    this.content.styleHolder().applyStyle('', {
      flex: 1,
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'stretch',
    })
    const canvasWrapper = new View('div');
    canvasWrapper.styleHolder().applyStyle('', {
      flex: 1,
      position: 'relative',
    })
    this.content.addChild(canvasWrapper);

    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.left = '0%';
    canvas.style.right = '0%';
    canvas.style.top = '0%';
    canvas.style.bottom = '0%';
    canvas.style.userSelect = 'none';
    canvas.draggable = false;
    canvas.width = 1;
    canvas.height = 1;
    canvasWrapper.inner.append(canvas);

    const colorPalette = new ColorPalette(canvas);
    colorPalette.value = new RGBA(255, 255, 255, 255);
    
    new ResizeObserver(entries => entries.forEach(entry => {
      canvas.width = entry.contentRect.width;
      canvas.height = entry.contentRect.height;
      colorPalette.update();
    })).observe(canvasWrapper.inner)

    const inputWrapper = new View('div');
    inputWrapper.styleHolder().applyStyle('', {
      display: 'grid',
      padding: '0px 5px',
      gridTemplateColumns: 'repeat(4, 10px auto)',
      fontSize: '12px',
      color: 'white',
      alignItems: 'center',
    })
    this.content.addChild(inputWrapper);

    const inputR = new ColorNumInput();
    inputR.onChange((s) => {
      const color = colorPalette.value.copy();
      color.r = s.num;
      colorPalette.value = color;
    })
    inputWrapper.inner.append('R:')
    inputWrapper.addChild(inputR);
    const inputG = new ColorNumInput();
    inputG.onChange((s) => {
      const color = colorPalette.value.copy();
      color.g = s.num;
      colorPalette.value = color;
    })
    inputWrapper.inner.append('G:')
    inputWrapper.addChild(inputG);
    const inputB = new ColorNumInput();
    inputB.onChange((s) => {
      const color = colorPalette.value.copy();
      color.b = s.num;
      colorPalette.value = color;
    })
    inputWrapper.inner.append('B:')
    inputWrapper.addChild(inputB);
    const inputA = new ColorNumInput();
    inputA.onChange((s) => {
      const color = colorPalette.value.copy();
      color.a = s.num;
      colorPalette.value = color;
    })
    inputWrapper.inner.append('A:')
    inputWrapper.addChild(inputA);

    colorPalette.onChanged = v => {
      inputR.num = v.r;
      inputG.num = v.g;
      inputB.num = v.b;
      inputA.num = v.a;
    }
    colorPalette.onChanged(colorPalette.value)
    this.removeChild(this.footer);
  }
}
export class ColorNumInput extends NumberInput {
  constructor() {
    super();
    this.max = 255;
    this.min = 0;
    this.styleHolder().applyStyle('', {
      minWidth: '0px',
      flex: 1,
      background: 'transparent',
      color: 'white',
      border: 'none',
      outline: 'none',
      borderRadius: '5px',
      margin: '5px 5px 3px 5px',
      fontSize: '12px'
    });
  }
}
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
    this.editStyle(false, true, false, {
      background: '#444444'
    }).editStyle(true, true, false, {
      background: '#333333'
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
    this.content.inner.style.flex = '1';
    this.content.inner.style.overflowY = 'auto'
    this.content.inner.style.overflowX = 'hidden'
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
    this.content.inner.style.flex = '1';
    this.content.inner.style.overflowY = 'auto'
    this.content.inner.style.overflowX = 'hidden'
    this.styleHolder().applyStyle('', {
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
    this._inner.style.background = this.state.selected ? '#00000044' : '';
  }

  constructor(inits: ILayerInfoInit) {
    super('div')
    this._state.name = inits.name;
    this._inner.style.display = 'flex';
    this._inner.style.position = 'relative';
    this._inner.style.padding = '5px';
    this._inner.style.borderBottom = '1px solid #00000022';
    this._inner.style.transition = 'all 200ms';

    new HoverOb(this._inner, hover => {
      this._inner.style.background = hover ?
        '#00000022' :
        this.state.selected ?
          '#00000044' : '';
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