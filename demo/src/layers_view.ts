import { ILayerInfoInit } from "../../dist";
import { FloatingSubwin } from "./G/FloatingSubwin";
import { View } from "./G/View";
import { IconButton } from "./G/IconButton";
import { ToggleIconButton } from "./G/ToggleIconButton";
import { HoverOb } from "./G/HoverOb";

export default class LayersView extends FloatingSubwin {
  private _layers: LayerItemView[] = [];

  constructor() {
    super()
    this.content = new View('div');
    this.content.inner.style.flex = '1';
    this.content.inner.style.overflowY = 'auto'
    this.content.inner.style.overflowX = 'hidden'

    const btnAddLayer = new IconButton({ text: '📃', title: '新建图层', size: 's' })
    this.footer.addChild(btnAddLayer);

    const btnAddFolder = new IconButton({ text: '📂', title: '新建图层组', size: 's' })
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
interface IViewDraggerInits {
  handle?: HTMLElement;
  view?: HTMLElement;
}
export class ViewDragger {
  private _handle?: HTMLElement | null;
  private _view?: HTMLElement | null;
  private _offsetX = 0;
  private _offsetY = 0;
  private _down = false;

  private _onpointerdown = (e: PointerEvent) => {
    if (e.button !== 0) { return; }
    this._down = true;
    this._offsetX = e.offsetX;
    this._offsetY = e.offsetY;
  }
  private _pointermove = (e: PointerEvent) => {
    if (!this._view) { return }
    if (!this._down) { return }
    this._view.style.left = '' + (e.pageX - this._offsetX) + 'px';
    this._view.style.top = '' + (e.pageY - this._offsetY) + 'px';
  }
  private _pointerup = (e: PointerEvent) => {
    if (e.button !== 0) { return; }
    this._down = false;
  }

  get handle() { return this._handle; }
  set handle(v) {
    this._handle?.removeEventListener('pointerdown', this._onpointerdown)
    this._handle = v;
    this._handle?.addEventListener('pointerdown', this._onpointerdown)
  }

  get view() { return this._view; }
  set view(v) { this._view = v; }

  constructor(inits?: IViewDraggerInits) {
    this.view = inits?.view;
    this.handle = inits?.handle
    document.addEventListener('pointermove', this._pointermove)
    document.addEventListener('pointerup', this._pointerup)
  }
  destory() {
    document.removeEventListener('pointermove', this._pointermove)
    document.removeEventListener('pointerup', this._pointerup)
    this._handle?.removeEventListener('pointerdown', this._onpointerdown)
  }
}

function also<T>(t: T, func: (t: T) => void) {
  func(t);
  return t;
}