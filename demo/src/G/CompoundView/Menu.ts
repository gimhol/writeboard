import { CssPosition } from "../BaseView/StyleType";
import { View, ViewEventMap } from "../BaseView/View";
import { HoverOb } from "../Observer/HoverOb";
import { findParent } from "../utils";

export interface IMenuItemInfo<K extends string | number | symbol> {
  key: K;
  divider?: boolean;
  icon?: string;
  label?: string;
  items?: IMenuItemInfo<K>[];
}

export interface IMenuInits<K extends string | number | symbol> {
  items?: IMenuItemInfo<K>[];
}
export interface IMenu<K extends string | number | symbol> {
  setup(items: IMenuItemInfo<K>[]): void;
  item(key: K): IMenuItemInfo<K> | undefined;
  move(x: number, y: number): void;
  show(): void;
  hide(): void;
}
export enum StyleNames {
  Normal = 'Normal',
  ItemDivider = 'ItemDivider',
  ItemNormal = 'ItemNormal',
  ItemHover = 'ItemHover',
}
export class MenuItemView<K extends string | number | symbol> extends View<'div'>{
  private _info: IMenuItemInfo<K>;
  private _submenu?: Menu<K>;
  private _menu: Menu<K>;
  get menu() { return this._menu; }
  get submenu() { return this._submenu; }
  get info() { return this._info; }

  setup(info: IMenuItemInfo<K> = this._info) {
    this._info = info;
    if (info.divider) {
      this.styles.clear().add(StyleNames.ItemDivider).refresh()
    } else {
      this.styles.clear().add(StyleNames.ItemNormal).refresh()
    }
    const label = new View('div');
    label.styles.apply('', { flex: 1 })
    label.inner.innerText = info.label ?? ''
    this.addChild(label);
    if (info.items?.length) {
      const more = document.createElement('div')
      more.style.marginLeft = '5px'
      more.innerText = '>';
      this.inner.appendChild(more);
      this._submenu = new Menu(this._menu.container, info);
    }
    this.hoverOb
  }

  override onHover(hover: boolean): void {
    if (hover) {
      this.styles.add(StyleNames.ItemHover).refresh()
    } else {
      this.styles.remove(StyleNames.ItemHover).refresh()
    }
    if (hover) {
      const { left, top, width, height } = this.inner.getBoundingClientRect();
      this._submenu?.move(left + width, top).show();
    }
  }

  constructor(menu: Menu<K>, info: IMenuItemInfo<K>) {
    super('div');
    this._menu = menu;
    this._info = info;
    this.styles.register(StyleNames.ItemDivider, {
      height: 1,
      background: '#00000011'
    }).register(StyleNames.ItemHover, {
      background: '#00000011'
    }).register(StyleNames.ItemNormal, {
      display: 'flex',
      borderRadius: 5,
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 10,
      paddingRight: 10,
      fontSize: 12,
    })
    this.setup();
  }
}

export enum MenuEventType {
  ItemClick = 'onItemClick',
}

export interface MenuEventMap<K extends string | number | symbol> {
  [MenuEventType.ItemClick]: CustomEvent<IMenuItemInfo<K>>;
}

class GlobalDown extends View<'div'>{
  constructor() {
    super('div');
    document.addEventListener('pointerdown', e => {
      if (findParent(e.target as HTMLElement, ele => (ele as any).view instanceof Menu)) {
        return;
      }
      this.inner.dispatchEvent(new PointerEvent('fired'))
    })
  }
}
const globalDown = new GlobalDown();

export class Menu<K extends string | number | symbol> extends View<'div'> implements IMenu<K>{
  static StyleNames = StyleNames;
  static EventType = MenuEventType;
  private _items: MenuItemView<K>[] = [];
  private _container: View;
  private _onitemclick?: () => void;
  private _onsubmenuitemclick?: (e: CustomEvent<IMenuItemInfo<K>>) => void;
  get container() { return this._container; }
  constructor(container: View, inits?: IMenuInits<K>) {
    super('div');
    this._container = container;
    this.styles.apply(StyleNames.Normal, {
      position: CssPosition.Fixed,
      display: 'none',
      gridTemplateColumns: 'auto',
      background: 'white',
      borderRadius: 5,
      userSelect: 'none',
      transition: 'opacity 200ms',
    })
    this.setup(inits?.items ?? []);
    globalDown.addEventListener('fired', () => this.hide());
    window.addEventListener('blur', () => this.hide());
  }

  override addEventListener<T extends keyof MenuEventMap<K>>(
    type: T,
    listener: (this: HTMLObjectElement, ev: MenuEventMap<K>[T]) => any,
    options?: boolean | AddEventListenerOptions
  ): this;
  override addEventListener<T extends keyof ViewEventMap>(
    type: T,
    listener: (this: HTMLObjectElement, ev: ViewEventMap[T]) => any,
    options?: boolean | AddEventListenerOptions
  ): this;
  override addEventListener<T extends keyof HTMLElementEventMap>(
    type: T,
    listener: (this: HTMLObjectElement, ev: HTMLElementEventMap[T]) => any,
    options?: boolean | AddEventListenerOptions
  ): this;

  override addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): this;

  override addEventListener(
    arg0: any, arg1: any, arg2?: any
  ): this {
    return super.addEventListener(arg0, arg1, arg2) as any
  }

  override removeEventListener<T extends keyof MenuEventMap<K>>(
    type: T,
    listener: (this: HTMLObjectElement, ev: MenuEventMap<K>[T]) => any,
    options?: boolean | AddEventListenerOptions
  ): this;
  override removeEventListener<T extends keyof ViewEventMap>(
    type: T,
    listener: (this: HTMLObjectElement, ev: ViewEventMap[T]) => any,
    options?: boolean | AddEventListenerOptions
  ): this;
  override removeEventListener<T extends keyof HTMLElementEventMap>(
    type: T,
    listener: (this: HTMLObjectElement, ev: HTMLElementEventMap[T]) => any,
    options?: boolean | AddEventListenerOptions
  ): this;
  override removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): this;
  override removeEventListener(
    arg0: any, arg1: any, arg2?: any
  ): this {
    return super.removeEventListener(arg0, arg1, arg2) as any
  }

  item(key: K): IMenuItemInfo<K> | undefined {
    return this._items.find(v => v.info.key === key)?.info;
  }

  setup(items: IMenuItemInfo<K>[]): Menu<K> {
    this._items.forEach(item => {
      item.removeEventListener('click', this._onitemclick!);
      item.submenu?.removeEventListener(MenuEventType.ItemClick, this._onsubmenuitemclick!);

      item.submenu?.removeSelf();
      this.removeChild(item);
    });


    this._items = items.map(info => {
      this._onitemclick = () => {
        this.inner.dispatchEvent(new CustomEvent(MenuEventType.ItemClick, { detail: info }))
        this.hide();
      }
      this._onsubmenuitemclick = (e: CustomEvent<IMenuItemInfo<K>>) => {
        this.inner.dispatchEvent(new CustomEvent(MenuEventType.ItemClick, { detail: e.detail }))
        this.hide();
      }

      const view = new MenuItemView(this, info);
      this.addChild(view);


      view.addEventListener('click', this._onitemclick);
      view.submenu?.addEventListener(MenuEventType.ItemClick, this._onsubmenuitemclick);

      new HoverOb(view.inner, (hover) => {
        if (!hover) { return; }
        this._items.forEach(other => {
          if (other === view) { return; }
          other.submenu?.hide();
        })
      })
      return view;
    });
    return this;
  }

  move(x: number, y: number): Menu<K> {
    this._items.forEach(item => item.submenu?.hide())
    this.styles.merge(StyleNames.Normal, { left: x, top: y }).refresh();
    return this;
  }

  show(): Menu<K> {
    this.styles.merge(StyleNames.Normal, { display: 'grid' }).refresh();
    this.container.addChild(this);
    return this;
  }

  hide(): Menu<K> {
    this._items.forEach(item => item.submenu?.hide())
    this.styles.merge(StyleNames.Normal, { display: 'none' }).refresh();
    this.removeSelf()
    return this;
  }
}
