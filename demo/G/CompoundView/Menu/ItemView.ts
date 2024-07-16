
import { View } from "../../BaseView/View";
import type { IMenuItemInfo } from "./Info";
import type { Menu } from "./Menu";

export class MenuItemView<K extends string | number | symbol> extends View<'div'> {
  private _info: IMenuItemInfo<K>;
  private _submenu?: Menu<K>;
  private _menu: Menu<K>;
  get menu() { return this._menu; }
  get submenu() { return this._submenu; }
  get info() { return this._info; }

  setup(info: IMenuItemInfo<K> = this._info) {
    this._info = info;
    if (info.divider) {
      this.styles.setCls('g_menu_item_divider');
    } else if (info.danger) {
      this.styles.setCls('g_menu_item_normal', 'g_menu_item_danger');
    } else {
      this.styles.setCls('g_menu_item_normal');
    }
    const label = new View('div');
    label.styles.apply('', { flex: 1 });
    label.inner.innerText = info.label ?? '';
    this.addChild(label);
    if (info.items?.length) {
      const more = document.createElement('div');
      more.style.marginLeft = '5px';
      more.innerText = '>';
      this.inner.appendChild(more);
    }
    this.hoverOb;
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

  constructor(menu: Menu<K>, info: IMenuItemInfo<K>, submenu: Menu<K> | undefined) {
    super('div');
    this._menu = menu;
    this._info = info;
    this._submenu = submenu;
    this.setup();
  }
}
