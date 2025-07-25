
import { Styles } from "../../BaseView/Styles";
import { View } from "../../BaseView/View";
import { HoverOb } from "../../Observer/HoverOb";
import { findParent } from "../../utils";
import { MenuEventMap, MenuEventType } from "./Events";
import { IMenuItemInfo } from "./Info";
import { MenuItemView } from "./ItemView";
import "./g_menu.scss";

export interface IMenuInits<K extends string | number | symbol> {
  items?: IMenuItemInfo<K>[];
  zIndex?: number;
}
export class Menu<K extends string | number | symbol> extends View<'div'> {
  static EventType = MenuEventType;
  private _items: MenuItemView<K>[] = [];
  private _container: View;
  private _onitemclick?: () => void;
  private _onsubmenuitemclick?: (e: CustomEvent<IMenuItemInfo<K>>) => void;
  private _zIndex = 9999;
  get container() { return this._container; }
  constructor(container: View, inits?: IMenuInits<K>) {
    super('div');

    this._container = container;
    this._zIndex = inits?.zIndex ?? this._zIndex;
    this.styles.addCls('g_menu');
    this.setup(inits?.items ?? []);
    window.addEventListener('pointerdown', e => {
      if (findParent(e.target, ele => !!View.try(ele, Menu))) {
        e.stopPropagation();
        e.stopImmediatePropagation();
        e.preventDefault()
        return;
      }
      this.hide();

    }, { capture: true });
    window.addEventListener('blur', () => this.hide());
  }

  override addEventListener<T extends keyof MenuEventMap<K>>(
    type: T,
    listener: (this: HTMLObjectElement, ev: MenuEventMap<K>[T]) => any,
    options?: boolean | AddEventListenerOptions
  ): this;
  override addEventListener(
    arg0: any, arg1: any, arg2?: any
  ): this {
    return super.addEventListener(arg0, arg1, arg2) as any;
  }

  override removeEventListener<T extends keyof MenuEventMap<K>>(
    type: T,
    listener: (this: HTMLObjectElement, ev: MenuEventMap<K>[T]) => any,
    options?: boolean | AddEventListenerOptions
  ): this;
  override removeEventListener(
    arg0: any, arg1: any, arg2?: any
  ): this {
    return super.removeEventListener(arg0, arg1, arg2) as any;
  }

  public override dispatchEvent<T extends keyof MenuEventMap<K>>(event: MenuEventMap<K>[T]): boolean;
  public override dispatchEvent(arg0: any): boolean {
    return super.dispatchEvent(arg0);
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
        this.dispatchEvent<MenuEventType.ItemClick>(new CustomEvent(MenuEventType.ItemClick, { detail: info }));
        this.hide();
      };
      this._onsubmenuitemclick = (e: CustomEvent<IMenuItemInfo<K>>) => {
        this.dispatchEvent<MenuEventType.ItemClick>(new CustomEvent(MenuEventType.ItemClick, { detail: e.detail }));
        this.hide();
      };

      const submenu = new Menu(this.container, info);
      const view = new MenuItemView(this, { ...info, zIndex: this._zIndex + 1 }, submenu);
      this.addChild(view);

      view.addEventListener('click', this._onitemclick);
      view.submenu?.addEventListener(MenuEventType.ItemClick, this._onsubmenuitemclick);

      new HoverOb(view.inner).setCallback((hover) => {
        if (!hover) { return; }
        this._items.forEach(other => {
          if (other === view) { return; }
          other.submenu?.hide();
        });
      });
      return view;
    });
    return this;
  }

  move(x: number, y: number): Menu<K> {
    this._items.forEach(item => item.submenu?.hide());
    this.styles.apply('', v => ({ ...v, left: x, top: y }));
    return this;
  }

  show(): Menu<K> {
    this.styles.apply('', v => ({ ...v, display: 'flex', zIndex: this._zIndex }));
    this.container.addChild(this);
    return this;
  }

  hide(): Menu<K> {
    this._items.forEach(item => item.submenu?.hide());
    this.styles.forgo('');
    this.removeSelf();
    return this;
  }
}
