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
    this._element.style.gridTemplateColumns = 'auto'
    this._element.style.background = 'white';
    this._element.style.borderRadius = '5px';
    this._element.style.userSelect = 'none';
    inits?.items && this.setup(inits.items);
    document.body.addEventListener('click', () => this.hide());
    window.addEventListener('blur', () => this.hide())
  }

  private itemEle(item: IMenuItemInfo<K>): HTMLElement {
    const ele = document.createElement('div');
    if (item.divider) {
      ele.style.height = '1px';
      ele.style.background = '#00000011'
    } else {
      ele.style.display = 'flex';
      ele.style.borderRadius = '5px';
      ele.style.padding = '5px';
      ele.style.fontSize = '12px';
      ele.addEventListener('click', (e) => { })
      ele.addEventListener('mouseenter', () => {
        ele.style.background = '#00000011'
      })
      ele.addEventListener('mouseleave', () => {
        ele.style.background = ''
      })
      const label = document.createElement('div')
      if (item.label) { label.innerText = item.label }
      label.style.flex = '1';
      ele.appendChild(label);
      if (item.items?.length) {
        const more = document.createElement('p')
        more.innerText = '>';
        ele.appendChild(more);
        this._subMenus[item.key] = new Menu(item);
      }
    }
    return ele;
  }

  item(key: K): IMenuItemInfo<K> | undefined {
    return this._items.find(v => v.key === key)
  }

  setup(items: IMenuItemInfo<K>[]): void {
    this._itemElements.forEach(ele => this._element?.removeChild(ele));
    this._items = items;
    this._itemElements = items.map(v => {
      const ele = this.itemEle(v);
      this.element().appendChild(ele);
      return ele;
    });
  }

  element(): HTMLElement {
    return this._element
  }

  move(x: number, y: number): void {
    this.element().style.left = '' + x + 'px';
    this.element().style.top = '' + y + 'px';
  }

  show(): void {
    this.element().style.display = 'grid'
  }

  hide(): void {
    this.element().style.display = 'none';
  }
}
