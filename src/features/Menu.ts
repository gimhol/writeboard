export interface IMenuItemInfo<K extends string | number | symbol> {
  key: K;
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
  element(): HTMLElement;
}

export class Menu<K extends string | number | symbol> implements IMenu<K>{
  private _items: IMenuItemInfo<K>[] = [];
  private _element: HTMLDivElement;
  private _subMenus: Partial<Record<K, IMenu<K>>> = {};
  private _itemElements: HTMLElement[] = [];

  constructor(inits?: IMenuInits<K>) {
    this._element = document.createElement('div');
    this._element.style.position = 'absolute';
    this._element.style.display = 'none'

    inits?.items && this.setup(inits.items);
  }

  item(key: K): IMenuItemInfo<K> | undefined {
    return this._items.find(v => v.key === key)
  }

  setup(items: IMenuItemInfo<K>[]): void {
    this._itemElements.forEach(ele => this._element?.removeChild(ele));
    this._items = items;
    for (let i = 0; i < items.length; ++i) {
      const ele = this.itemEle(items[i]);
      this.element().appendChild(ele);
    }
  }

  element(): HTMLElement {
    return this._element
  }

  private itemEle(item: IMenuItemInfo<K>): HTMLElement {
    const ele = document.createElement('div');
    ele.style.display = 'flex';

    const label = document.createElement('span')
    if (item.label) { label.innerText = item.label }
    label.style.flex = '1';

    ele.appendChild(label);

    if (item.items?.length) {
      const more = document.createElement('p')
      more.innerText = '>';
      ele.appendChild(more);
      ele.onmouseenter = (e) => { }
      ele.onmouseleave = (e) => { }
      this._subMenus[item.key] = new Menu(item);
    }
    return ele;
  }

  move(x: number, y: number): void {
    this.element().style.left = '' + x + 'px';
    this.element().style.top = '' + y + 'px';
  }

  show(): void {
    this.element().style.display = 'block'
  }

  hide(): void {
    this.element().style.display = 'none';
  }
}
