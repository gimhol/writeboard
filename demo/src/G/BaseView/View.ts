import { HoverOb } from "../Observer/HoverOb";
import { FocusOb } from "../Observer/FocusOb";
import { Style } from "./StyleType";
import { Styles } from "./Styles";

export class View<T extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap> {

  addEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLObjectElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): View<T>;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  addEventListener(arg0: any, arg1: any, arg2: any): View<T> {
    this.inner.addEventListener(arg0, arg1, arg2);
    return this;
  }
  removeEventListener<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLObjectElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): View<T>;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): View<T>;
  removeEventListener(arg0: any, arg1: any, arg2: any): View<T> {
    this.inner.removeEventListener(arg0, arg1, arg2)
    return this;
  }
  protected _inner: HTMLElementTagNameMap[T];

  get id() { return this.inner.id; }
  set id(v) { this.inner.id = v; }
  get inner() { return this._inner; }
  get parent() { return <View | undefined>(this._inner.parentElement as any)?.view; }
  get children() { return Array.from(this._inner.children).map(v => View.get(v)) }
  get draggable() { return this._inner.draggable; }
  set draggable(v) { this._inner.draggable = v; }

  static get(ele: Element): View;
  static get<T extends keyof HTMLElementTagNameMap>(ele: HTMLElementTagNameMap[T]): View<T>;
  static get<T extends keyof HTMLElementTagNameMap>(ele: HTMLElementTagNameMap[T]): View<T> {
    return (ele as any).view ?? new View(ele);
  }
  static try<V extends View>(ele: any, view: new (...args: any[]) => V): V | undefined;
  static try<T extends keyof HTMLElementTagNameMap>(ele: HTMLElementTagNameMap[T]): View<T> | undefined;
  static try(ele: any, cls?: any) {
    if (cls) {
      return ele.view instanceof cls ? ele.view : undefined;
    } else {
      return ele.view;
    }
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
    (this._inner as any).view = this;
  }

  protected _hoverOb?: HoverOb;
  get hover() { return this.hoverOb.hover }
  get hoverOb(): HoverOb {
    this._hoverOb = this._hoverOb ?? new HoverOb(this._inner, v => this.onHover(v))
    return this._hoverOb
  }
  onHover(hover: boolean) { }
  protected _focusOb?: FocusOb;
  get focused() { return this.focusOb.focused }
  get focusOb(): FocusOb {
    this._focusOb = this._focusOb ?? new FocusOb(this._inner, v => this.onFocus(v))
    return this._focusOb
  }
  onFocus(focused: boolean) { }
  onBeforeAdded(parent: View): void { }
  onAfterAdded(parent: View): void { }
  onBeforeRemoved(parent: View): void { }
  onAfterRemoved(parent: View): void { }
  addChild(...children: View[]) {
    children.forEach(child => {
      child.onBeforeAdded(this);
      this._inner.append(child.inner);
      child.onAfterAdded(this);
    });
    return this;
  }
  insertChild(anchor: View | number, ...children: View[]): this {
    if (anchor === 0 && !this._inner.children.length) {
      this.addChild(...children.reverse());
    } else if (typeof anchor === 'number') {
      const ele = this._inner.children[anchor];
      if (!ele) {
        console.error('[View] insertChild failed! anchor element not found, idx = ', anchor)
        return this;
      }
      children.forEach(child => {
        child.onBeforeAdded(this);
        this._inner.insertBefore(child.inner, ele);
        child.onAfterAdded(this);
      })
    } else {
      children.forEach(child => {
        child.onBeforeAdded(this);
        this._inner.insertBefore(child.inner, anchor.inner);
        child.onAfterAdded(this);
      })
    }
    return this;
  }
  removeChild(...children: View[]): this {
    children.forEach(child => {
      child.onBeforeRemoved(this);
      this._inner.removeChild(child.inner);
      child.onAfterRemoved(this);
    })
    return this;
  }
  removeSelf(): this {
    this.parent?.removeChild(this);
    return this;
  }
  get styles(): Styles<string> {
    this._styles = this._styles ?? new Styles<string>(this)
    return this._styles;
  }
  private _styles?: Styles<string>;
}