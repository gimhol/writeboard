import { CssPosition } from "../BaseView/StyleType";
import { Styles } from "../BaseView/Styles";
import { View } from "../BaseView/View";
import { ViewEventMap } from "../Events/EventType";
import { HoverOb } from "../Observer/HoverOb";
import { findParent } from "../utils";

export interface IMenuItemInfo<K extends string | number | symbol> {
  key?: K;
  divider?: boolean;
  danger?: boolean;
  icon?: string;
  label?: string;
  items?: IMenuItemInfo<K>[];
  zIndex?: number;
}

export interface IMenuInits<K extends string | number | symbol> {
  items?: IMenuItemInfo<K>[];
  zIndex?: number;
}
export interface IMenu<K extends string | number | symbol> {
  setup(items: IMenuItemInfo<K>[]): void;
  item(key: K): IMenuItemInfo<K> | undefined;
  move(x: number, y: number): void;
  show(): void;
  hide(): void;
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
      this.styles.setCls('g_menu_item_divider')
    } else if (info.danger) {
      this.styles.setCls('g_menu_item_normal', 'g_menu_item_danger')
    } else {
      this.styles.setCls('g_menu_item_normal')
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
      this.styles.addCls('g_menu_item_hover');
    } else {
      this.styles.delCls('g_menu_item_hover');
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
    this.setup();
  }
}

export enum MenuEventType {
  ItemClick = 'onItemClick',
}
export interface MenuEventMap<K extends string | number | symbol> {
  [MenuEventType.ItemClick]: CustomEvent<IMenuItemInfo<K>>;
}

class GlobalPointerDown extends View<'div'>{
  constructor() {
    super('div');
    window.addEventListener('pointerdown', e => {
      
      if (findParent(e.target, ele => !!View.try(ele, Menu))) {
        return;
      }
      this.inner.dispatchEvent(new PointerEvent('fired'))
    }, true)
  }
}
const globalDown = new GlobalPointerDown();

export class Menu<K extends string | number | symbol> extends View<'div'> implements IMenu<K>{
  static EventType = MenuEventType;
  private _items: MenuItemView<K>[] = [];
  private _container: View;
  private _onitemclick?: () => void;
  private _onsubmenuitemclick?: (e: CustomEvent<IMenuItemInfo<K>>) => void;
  private _zIndex = 9999;
  get container() { return this._container; }
  constructor(container: View, inits?: IMenuInits<K>) {
    super('div');
    Styles.css('./g_menu.css');
    
    this._container = container;
    this._zIndex = inits?.zIndex ?? this._zIndex;
    this.styles.setCls('g_menu');
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

      const view = new MenuItemView(this, { ...info, zIndex: this._zIndex + 1 });
      this.addChild(view);

      view.addEventListener('click', this._onitemclick);
      view.submenu?.addEventListener(MenuEventType.ItemClick, this._onsubmenuitemclick);

      new HoverOb(view.inner).setCallback((hover) => {
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
    this.styles.apply('', v => ({ ...v, left: x, top: y }));
    return this;
  }

  show(): Menu<K> {
    this.styles.apply('', v => ({ ...v, display: 'flex', zIndex: this._zIndex }));
    this.container.addChild(this);
    return this;
  }

  hide(): Menu<K> {
    this._items.forEach(item => item.submenu?.hide())
    this.styles.forgo('')
    this.removeSelf()
    return this;
  }
}
