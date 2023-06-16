import { ILayerInfoInit } from "../../dist";
import { Button } from "./G/BaseView/Button";
import { SizeType } from "./G/BaseView/SizeType";
import { InputStyleNames, TextInput } from "./G/BaseView/TextInput";
import { View } from "./G/BaseView/View";
import { Subwin } from "./G/CompoundView/SubWin";
import { ViewEventMap } from "./G/Events/EventType";
import { FocusOb } from "./G/Observer/FocusOb";

export enum LayersViewEventType {
  LayerAdded = 'LayerAdded',
  LayerRemoved = 'LayerRemoved',
  LayerNameChanged = 'LayerNameChanged',
  LayerVisibleChanged = 'LayerVisibleChanged',
  LayerActived = 'LayerActived',
}
export interface LayersViewEventMap {
  [LayersViewEventType.LayerAdded]: CustomEvent<string>;
  [LayersViewEventType.LayerRemoved]: CustomEvent<string>;
  [LayersViewEventType.LayerNameChanged]: CustomEvent<{ id: string, visible: boolean }>;
  [LayersViewEventType.LayerVisibleChanged]: CustomEvent<{ id: string, visible: boolean }>;
  [LayersViewEventType.LayerActived]: CustomEvent<{ id: string }>;
}
export class LayersView extends Subwin {
  static EventType = LayersViewEventType;
  private _layers: LayerItemView[] = [];

  override addEventListener<K extends keyof LayersViewEventMap>
    (type: K, listener: (this: HTMLObjectElement, ev: LayersViewEventMap[K]) => any, options?: boolean | AddEventListenerOptions | undefined): this;
  override addEventListener<K extends keyof ViewEventMap>
    (type: K, listener: (this: HTMLObjectElement, ev: ViewEventMap[K]) => any, options?: boolean | AddEventListenerOptions): this;
  override addEventListener<K extends keyof HTMLElementEventMap>
    (type: K, listener: (this: HTMLObjectElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions | undefined): this;
  override addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined): this;
  override addEventListener(arg0: any, arg1: any, arg2?: any): LayersView {
    return super.addEventListener(arg0, arg1, arg2) as any
  }
  constructor() {
    super()
    this.header.title = 'layers'
    this.content = new View('div');
    this.content.styles.apply("", {
      flex: 1,
      overflowY: 'auto',
      overflowX: 'hidden'
    })
    this.styles.apply("", { minWidth: '225px' })

    const btnAddLayer = new Button().init({ content: '📃', title: '新建图层', size: SizeType.Small }).addEventListener('click', (e) => {
      const event = new CustomEvent<string>(LayersViewEventType.LayerAdded, { detail: '' + Date.now() });
      this.inner.dispatchEvent(event);
    })
    this.footer.addChild(btnAddLayer);

    const btnAddFolder = new Button().init({ content: '📂', title: '新建图层组', size: SizeType.Small })
    this.footer.addChild(btnAddFolder);
  }
  layers() { return this._layers }
  setLayers() { }
  addLayer(inits: ILayerInfoInit) {
    const item = new LayerItemView(inits);
    this._layers.push(item);
    this.content?.addChild(item);
    item.addEventListener('click', () => {
      this.content?.children?.forEach(v => (v as any).selected = false)
      item.selected = true;

      type Detail = LayersViewEventMap[LayersViewEventType.LayerActived]['detail'];
      const detail: Detail = { id: item.state.id }
      this.inner.dispatchEvent(new CustomEvent<Detail>(LayersViewEventType.LayerActived, { detail }))
    })
    return item;
  }
}

export class LayerItemView extends View<'div'> {
  private _state = {
    id: '',
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
    this.styles.apply("", v => ({
      ...v,
      background: this.state.selected ? '#00000044' : ''
    }))
  }

  updateStyle() {
    const styleName = `${this.hover}_${this.selected}`;
    this.styles.remove(this._prevStyleName!).add(styleName).refresh()
    this._prevStyleName = styleName;
  }
  override onHover(hover: boolean): void { this.updateStyle() }

  constructor(inits: ILayerInfoInit) {
    super('div')
    this._state.id = inits.id;
    this._state.name = inits.name;
    this.styles
      .register('false_false', {})
      .register('true_false', { background: '#00000022' })
      .register('false_true', { background: '#00000033' })
      .register('true_true', { background: '#00000044' })
      .apply("", {
        display: 'flex',
        position: 'relative',
        padding: 5,
        borderBottom: '1px solid #00000022',
        transition: 'all 200ms',
      })


    const btn0 = new Button().init({
      checkable: true,
      checked: this._state.locked,
      contents: ['🔓', '🔒']
    })
    btn0.addEventListener('click', () => {
      this._state.locked = btn0.checked;
    })
    this.addChild(btn0);

    const btn1 = new Button().init({
      checkable: true,
      checked: this._state.visible,
      contents: ['🙈', '🐵']
    })
    btn1.addEventListener('click', () => {
      this._state.visible = btn1.checked;
      type Detail = LayersViewEventMap[LayersViewEventType.LayerVisibleChanged]['detail'];
      const detail: Detail = {
        id: this.state.id,
        visible: btn1.checked
      }
      this.parent?.parent?.inner.dispatchEvent(new CustomEvent<Detail>(LayersViewEventType.LayerVisibleChanged, { detail }))
    })
    this.addChild(btn1);

    const btn2 = new Button().init({
      checkable: true,
      checked: this._state.visible,
      contents: ['➕', '➖']
    })
    btn2.addEventListener('click', () => {
      this._state.visible = btn2.checked;
    })
    this.addChild(btn2);

    const inputName = new TextInput();
    inputName.styles.register(InputStyleNames.Hover, v => ({
      ...v,
      background: '#00000022',
    })).register(InputStyleNames.Focused, v => ({
      ...v,
      color: 'white',
    })).register(InputStyleNames.Normal, v => ({
      ...v,
      outline: 'none',
      border: 'none',
      minWidth: 100,
      flex: 1,
      height: 24,
      borderRadius: 5,
      padding: '0px 5px',
      background: 'none',
      color: '#FFFFFF88'
    })).refresh();

    inputName.value = inits.name;
    inputName.disabled = true;
    this.addChild(inputName);

    new FocusOb(inputName.inner, (v) => inputName.disabled = !v)

    const btn3 = new Button().init({ content: '🖊️' })
    btn3.addEventListener('click', () => {
      inputName.disabled = false;
      inputName.focus();
    })
    this.addChild(btn3);
  }
}