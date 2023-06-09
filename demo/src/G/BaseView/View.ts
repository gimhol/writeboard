import { FocusOb } from "../Observer/FocusOb";
import { HoverOb } from "../Observer/HoverOb";
import { Styles } from "./Styles";

export enum ViewEventType {
  OnAdded = 'OnAdded',
  OnRemoved = 'OnRemoved',
}
export interface ViewEventMap {
  [ViewEventType.OnAdded]: Event;
  [ViewEventType.OnRemoved]: Event;
}
export class View<T extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap> {
  static RAW_KEY_IN_ELEMENT = 'g_view'
  protected _inner: HTMLElementTagNameMap[T];
  protected _styles?: Styles<string>;
  protected _hoverOb?: HoverOb;
  protected _focusOb?: FocusOb;
  get hover() { return this.hoverOb.hover }
  get hoverOb(): HoverOb {
    this._hoverOb = this._hoverOb ?? new HoverOb(this._inner, v => this.onHover(v))
    return this._hoverOb
  }
  get focused() { return this.focusOb.focused }
  get focusOb(): FocusOb {
    this._focusOb = this._focusOb ?? new FocusOb(this._inner, v => this.onFocus(v))
    return this._focusOb
  }
  get styles(): Styles<string> {
    this._styles = this._styles ?? new Styles<string>(this)
    return this._styles;
  }
  get id() { return this.inner.id; }
  set id(v) { this.inner.id = v; }
  get inner() { return this._inner; }
  get parent() { return View.get(this._inner.parentElement) }
  get children() { return Array.from(this._inner.children).map(v => View.get(v)) }
  get draggable() { return this._inner.draggable; }
  set draggable(v) { this._inner.draggable = v; }
  static get(ele: null): null;
  static get(ele: Element): View;
  static get(ele: Element | null): View | null;
  static get<T extends keyof HTMLElementTagNameMap>(ele: HTMLElementTagNameMap[T]): View<T>;
  static get(ele: any): any {
    if (!ele) { return null; }
    return View.try(ele, View) ?? new View(ele);
  }
  static try(ele: null | undefined): null;
  static try<V extends View>(ele: any, view: new (...args: any[]) => V): V | null;
  static try<T extends keyof HTMLElementTagNameMap>(ele: HTMLElementTagNameMap[T]): View<T>;
  static try<T extends keyof HTMLElementTagNameMap>(ele: HTMLElementTagNameMap[T] | null): View<T> | null;
  static try(ele: Element | null): View | null;
  static try(ele: any, cls?: any): View | null {
    if (!ele) { return null; }
    const view = ele[View.RAW_KEY_IN_ELEMENT] ?? null;
    cls = cls ?? View;
    return (view instanceof cls) ? view : null;
  }
  constructor(element: HTMLElementTagNameMap[T]);
  constructor(tagName: T);
  constructor(arg0: any) {
    if (arg0 === 'body') {
      this._inner = <any>document.body ?? document.createElement('body');
    } else if (arg0 === 'head') {
      this._inner = <any>document.head ?? document.createElement('head');
    } else if (typeof arg0 === 'string') {
      this._inner = document.createElement(arg0 as T);
    } else {
      this._inner = arg0;
    }
    (this._inner as any)[View.RAW_KEY_IN_ELEMENT] = this;
  }

  onHover(hover: boolean) { }
  onFocus(focused: boolean): void { }
  onAdded(): void { }
  onRemoved(): void { }

  addChild(...children: View[]) {
    children.forEach(child => {
      this._inner.append(child.inner);
      child.inner.dispatchEvent(new Event(ViewEventType.OnAdded));
      child.onAdded();
    });
    return this;
  }

  insertChild(anchorOrIdx: View | number, ...children: View[]): this {
    if (anchorOrIdx === 0 && !this._inner.children.length) {
      this.addChild(...children.reverse());
      return this;
    }
    const ele = (typeof anchorOrIdx === 'number') ?
      this._inner.children[anchorOrIdx] :
      anchorOrIdx.inner
    if (!ele) {
      console.error('[View] insertChild failed! anchor element not found, idx = ', anchorOrIdx)
      return this;
    }
    children.forEach(child => {
      this._inner.insertBefore(child.inner, ele);
      child.inner.dispatchEvent(new Event(ViewEventType.OnAdded));
      child.onAdded();
    })
    return this;
  }

  removeChild(...children: View[]): this {
    children.forEach(child => {
      this._inner.removeChild(child.inner);
      child.inner.dispatchEvent(new Event(ViewEventType.OnRemoved));
      child.onRemoved();
    })
    return this;
  }

  removeSelf(): this {
    this.parent?.removeChild(this);
    return this;
  }

  addEventListener<K extends keyof ViewEventMap>(type: K, listener: (this: HTMLObjectElement, ev: ViewEventMap[K]) => any, options?: boolean | AddEventListenerOptions): this;
  addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLObjectElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): this;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): this;
  addEventListener(arg0: any, arg1: any, arg2: any): this {
    this.inner.addEventListener(arg0, arg1, arg2);
    return this;
  }

  removeEventListener<K extends keyof ViewEventMap>(type: K, listener: (this: HTMLObjectElement, ev: ViewEventMap[K]) => any, options?: boolean | EventListenerOptions): this;
  removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLObjectElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): this;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): this;
  removeEventListener(arg0: any, arg1: any, arg2: any): this {
    this.inner.removeEventListener(arg0, arg1, arg2)
    return this;
  }
}