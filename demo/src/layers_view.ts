import { ILayerInfoInit } from "../../dist";
import { Subwin } from "./G/Subwin";
import { View } from "./G/View";
import { IconButton } from "./G/IconButton";
import { ToggleIconButton } from "./G/ToggleIconButton";
import { HoverOb } from "./G/HoverOb";
import { Button, ButtonGroup, SizeType } from "./G/Button";
import { ColorPalette } from "./colorPalette/ColorPalette";

export class ColorView extends Subwin {
  constructor() {
    super()
    this.header.title = 'color'
    this.content = new View('div');
    this.content.inner.style.flex = '1';
    this.content.inner.style.position = 'relative';

    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.left = '0%';
    canvas.style.right = '0%';
    canvas.style.top = '0%';
    canvas.style.bottom = '0%';
    canvas.width = 1;
    canvas.height = 1;
    this.content.inner.append(canvas);

    const colorPalette = new ColorPalette(canvas);
    new ResizeObserver(entries => entries.forEach(entry => {
      canvas.width = entry.contentRect.width;
      canvas.height = entry.contentRect.height;
      colorPalette.update();
    })).observe(this.content.inner)
  }
}
export class ToolsView extends Subwin {
  constructor() {
    super()
    this.header.title = 'tools'
    this.content = new View('div');
    this.content.inner.style.flex = '1';
    this.content.inner.style.overflowY = 'auto'
    this.content.inner.style.overflowX = 'hidden'

    const btn0 = new Button({ text: 'mouse', checkable: true })
    btn0.styleHolder().setStyle('normal_checked', {
      background: '#444444'
    }).setStyle('hover_checked', {
      background: '#333333'
    })
    this.content.addChild(btn0);

    const btn1 = new Button({ text: 'pen', checkable: true })
    btn1.styleHolder().setStyle('normal_checked', {
      background: '#444444'
    }).setStyle('hover_checked', {
      background: '#333333'
    })
    this.content.addChild(btn1);

    const btn2 = new Button({ text: 'rect', checkable: true })
    btn2.styleHolder().setStyle('normal_checked', {
      background: '#444444'
    }).setStyle('hover_checked', {
      background: '#333333'
    })
    this.content.addChild(btn2);

    const btn3 = new Button({ text: 'oval', checkable: true })
    btn3.styleHolder().setStyle('normal_checked', {
      background: '#444444'
    }).setStyle('hover_checked', {
      background: '#333333'
    })
    this.content.addChild(btn3);

    const btn4 = new Button({ text: 'text', checkable: true })
    btn4.styleHolder().setStyle('normal_checked', {
      background: '#444444'
    }).setStyle('hover_checked', {
      background: '#333333'
    })
    this.content.addChild(btn4);

    new ButtonGroup({ buttons: [btn0, btn1, btn2, btn3] })
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

    const btnAddLayer = new IconButton({ text: '📃', title: '新建图层', size: SizeType.Small })
    this.footer.addChild(btnAddLayer);

    const btnAddFolder = new IconButton({ text: '📂', title: '新建图层组', size: SizeType.Small })
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
      texts: ['🔓', '🔒']
    }).onClick(btn => {
      this._state.locked = btn.checked;
    })
    this.addChild(btn0);

    const btn1 = new ToggleIconButton({
      checked: this._state.visible,
      texts: ['🙈', '🐵']
    }).onClick(btn => {
      this._state.visible = btn.checked;
    })
    this.addChild(btn1);

    const btn2 = new ToggleIconButton({
      checked: this._state.visible,
      texts: ['➕', '➖']
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
      text: '🖊️'
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