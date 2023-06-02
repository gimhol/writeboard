import { ILayerInfoInit, LayerInfo } from "../../dist";


export default class LayersView {
  private _ele = document.createElement('div');
  private _header = document.createElement('div');
  private _footer = document.createElement('div');
  private _list = document.createElement('div');
  private _layers: LayerItemView[] = [];

  ele() { return this._ele; }
  constructor() {
    this._ele.style.left = '' + 100 + 'px';
    this._ele.style.top = '' + 100 + 'px';
    this._ele.style.position = 'fixed';
    this._ele.style.background = '#555555';
    this._ele.style.zIndex = '10000';
    this._ele.style.minWidth = '200px';
    this._ele.style.minHeight = '200px';
    this._ele.style.width = '200px';
    this._ele.style.height = '200px';
    this._ele.style.overflow = 'hidden';
    this._ele.style.border = '1px solid black';
    this._ele.style.resize = 'both';
    this._ele.style.boxShadow = '5px 5px 10px 10px #00000022'
    this._ele.style.borderRadius = '5px';
    this._ele.style.display = 'flex';
    this._ele.style.flexDirection = 'column';


    also(this._header, (div) => {
      div.style.userSelect = 'none';
      div.style.width = '100%';
      div.style.color = '#FFFFFF88'
      div.innerText = 'layers'
      div.style.padding = '5px';
      div.style.background = '#222222'
      div.style.borderBottom = '#222222'
      this._ele.append(div);

      let _offsetX = 0;
      let _offsetY = 0;
      let _down = false;
      div.onmousedown = e => {
        _down = true;
        _offsetX = e.offsetX;
        _offsetY = e.offsetY;
      }
      document.addEventListener('mousemove', e => {
        if (!_down) { return }
        this._ele.style.left = '' + (e.pageX - _offsetX) + 'px';
        this._ele.style.top = '' + (e.pageY - _offsetY) + 'px';
      })
      document.addEventListener('mouseup', () => {
        _down = false;
      })
    })

    also(this._list, (div) => {
      div.style.flex = '1';
      div.style.overflowY = 'auto'
      div.style.overflowX = 'hidden'
      this._ele.append(this._list);
    })
    also(this._footer, (div) => {
      div.style.userSelect = 'none';
      div.style.width = '100%';
      div.style.color = '#FFFFFF88'
      div.innerText = 'layers'
      div.style.padding = '5px';
      div.style.background = '#222222'
      div.style.borderBottom = '#222222'
      this._ele.append(div);
      let _offsetX = 0;
      let _offsetY = 0;
      let _down = false;
      div.onmousedown = e => {
        _down = true;
        _offsetX = e.offsetX;
        _offsetY = e.offsetY;
      }
      document.addEventListener('mousemove', e => {
        if (!_down) { return }
        this._ele.style.left = '' + (e.pageX - _offsetX) + 'px';
        this._ele.style.top = '' + (e.pageY - _offsetY) + 'px';
      })
      document.addEventListener('mouseup', () => {
        _down = false;
      })
    })
  }
  layers() { return this._layers }
  setLayers() { }
  addLayer(inits: ILayerInfoInit) {
    const item = new LayerItemView(inits);
    this._layers.push(item);
    this._list.append(item.ele);
  }
}

export class LayerItemView {
  private _ele: HTMLDivElement;
  private _state = {
    visible: true,
    locked: false,
    name: '',
    selected: false,
  };
  get ele() { return this._ele; }
  get state() { return this._state; }
  select() {
    this.state.selected = true;
  }
  constructor(inits: ILayerInfoInit) {
    this._state.name = inits.name;
    this._ele = also(document.createElement('div'), div => {
      div.style.display = 'flex';
      div.style.position = 'relative';
      div.style.padding = '5px';
      div.style.borderBottom = '1px solid #00000022';
      div.onclick = () => {
        this.state.selected = true;
        update();
      }
      const update = () => {
        div.style.background = this.state.selected ? '#00000022' : '';
      }
      update();
    });
    also(document.createElement('div'), div => {
      const hoverOb = new HoverOb(div, () => update());
      style_btnIcon(div);
      const update = () => {
        div.innerText = this._state.locked ? '🔒' : '🔓';
        div.style.background = hoverOb.hover ? '#00000022' : '';
      }
      div.onclick = () => {
        this._state.locked = !this._state.locked;
        update();
      }
      this._ele.append(div);
      update();
    })
    also(document.createElement('div'), div => {
      const hoverOb = new HoverOb(div, () => update());
      style_btnIcon(div);
      const update = () => {
        div.innerText = this._state.visible ? '🐵' : '🙈';
        div.style.background = hoverOb.hover ? '#00000022' : '';
      }
      div.onclick = () => {
        this._state.visible = !this._state.visible;
        update();
      }
      this._ele.append(div);
      update();
    })
    also(document.createElement('div'), div => {
      const hoverOb = new HoverOb(div, () => update());
      style_btnIcon(div);
      div.innerText = '🖊️'
      const update = () => {
        div.style.background = hoverOb.hover ? '#00000022' : '';
      }
      div.onclick = () => {
        inputName.disabled = false;
        inputName.focus();
      }
      this._ele.append(div);
      update();
    })
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
      this._ele.append(input);
      update();
    })
  }
}

function style_btnIcon(ele: HTMLElement) {
  ele.style.userSelect = 'none';
  ele.style.cursor = 'pointer';
  ele.style.width = '24px';
  ele.style.height = '24px';
  ele.style.textAlign = 'center';
  ele.style.transition = 'all 200ms';
  ele.style.borderRadius = '5px';
  ele.style.lineHeight = '24px';
}
class FocusedOb {
  private _focused = false;
  get focused() { return this._focused; }
  constructor(ele: HTMLElement, cb: () => void) {
    ele.addEventListener('focus', e => { this._focused = true; cb() });
    ele.addEventListener('blur', e => { this._focused = false; cb() });
  }
}
class HoverOb {
  private _hover = false;
  get hover() { return this._hover; }
  constructor(ele: HTMLElement, cb: () => void) {
    ele.addEventListener('mouseenter', e => { this._hover = true; cb() });
    ele.addEventListener('mouseleave', e => { this._hover = false; cb() });
  }
}

function also<T>(t: T, func: (t: T) => void) {
  func(t);
  return t;
}