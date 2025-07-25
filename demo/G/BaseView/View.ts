import { ViewEventType, ViewEventMap } from "../Events/EventType";
import { FocusOb } from "../Observer/FocusOb";
import { HoverOb } from "../Observer/HoverOb";
import { Styles } from "./Styles";

export class Ref<T extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap>{
  current: View<T> | null = null;
  constructor() { }
}
export class View<T extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap> {
  public static RAW_KEY_IN_ELEMENT = 'g_view' as const;

  public static ref<T extends keyof HTMLElementTagNameMap = keyof HTMLElementTagNameMap>(): Ref<T> {
    return new Ref<T>()
  }

  public static get(ele: null | undefined): null;
  public static get(ele: Element): View;
  public static get(ele: Element | null | undefined): View | null;
  public static get<T extends keyof HTMLElementTagNameMap>(ele: HTMLElementTagNameMap[T]): View<T>;
  public static get<T extends keyof HTMLElementTagNameMap>(ele: T): View<T>;
  public static get(ele: any): any {
    if (!ele) { return null; }
    return View.try(ele, View) ?? new View(ele);
  }
  public static try(ele: null | undefined): null;
  public static try<V extends View>(ele: any, view: new (...args: any[]) => V): V | null;
  public static try<T extends keyof HTMLElementTagNameMap>(ele: HTMLElementTagNameMap[T]): View<T>;
  public static try<T extends keyof HTMLElementTagNameMap>(ele: HTMLElementTagNameMap[T] | null): View<T> | null;
  public static try(ele: Element | null): View | null;
  public static try(ele: any, cls?: any): View | null {
    if (!ele) { return null; }
    const view = ele[View.RAW_KEY_IN_ELEMENT] ?? null;
    cls = cls ?? View;
    return (view instanceof cls) ? view : null;
  }

  protected _inner?: HTMLElementTagNameMap[T] & { [View.RAW_KEY_IN_ELEMENT]?: View };
  protected _styles?: Styles<string, this>;
  protected _hoverOb?: HoverOb;
  protected _focusOb?: FocusOb;

  public get hover() { return this.hoverOb.hover }
  public get hoverOb(): HoverOb {
    this._hoverOb = this._hoverOb ?? new HoverOb(this.inner).setCallback(v => this.onHover(v))
    return this._hoverOb
  }
  public get focused() { return this.focusOb.focused }
  public get focusOb(): FocusOb {
    this._focusOb = this._focusOb ?? new FocusOb(this.inner!, v => this.onFocus(v))
    return this._focusOb
  }
  public get styles(): Styles<string, this> {
    this._styles = this._styles ?? new Styles<string, this>(this)
    return this._styles;
  }
  public get inner() { return this._inner!; }
  public get id() { return this.inner!.id; }
  public set id(v) { this.inner!.id = v; }
  public get parent() { return View.get(this.inner!.parentElement) }

  public get children() { return Array.from(this.inner!.children).map(v => View.get(v)) }
  public get lastChild() { return View.get(this.inner.children[this.inner.children.length - 1]) }
  public get firstChild() { return View.get(this.inner.children[0]) }
  public get draggable() { return this.inner!.draggable; }
  public set draggable(v) { this.inner!.draggable = v; }

  public get nextSibling() { return View.get(this.inner.nextElementSibling) }
  public get prevSibling() { return View.get(this.inner.previousElementSibling) }


  public constructor(element: HTMLElementTagNameMap[T], innerText?: string);
  public constructor(tagName: T, innerText?: string);
  public constructor(arg0: any, innerText?: string) {
    if (arg0 === 'body') {
      this._inner = <any>document.body ?? document.createElement('body');
    } else if (arg0 === 'head') {
      this._inner = <any>document.head ?? document.createElement('head');
    } else if (typeof arg0 === 'string') {
      this._inner = <any>document.createElement(arg0 as T);
    } else {
      this._inner = arg0;
    }
    (this.inner as any)[View.RAW_KEY_IN_ELEMENT] = this;

    if (innerText !== undefined) {
      this.inner.innerText = innerText;
    }
  }

  public onHover(hover: boolean) { }
  public onFocus(focused: boolean): void { }
  public onAdded(): void { }
  public onRemoved(): void { }

  public addChild(...children: View[]): this {
    if (!children.length) { return this; }
    children = this._prehandleAddedChild(children);
    this.inner.append(...children.map(v => v.inner));
    this._handleAddedChildren(children);
    return this;
  }
  public insertBefore(anchorOrIdx: View | number, ...children: View[]): this {
    if (!children.length) { return this; }
    let anchor: Node | null = null;
    if (typeof anchorOrIdx === 'number') {
      anchor = this.inner.children[anchorOrIdx] ?? null;
    } else if (anchorOrIdx instanceof View) {
      anchor = anchorOrIdx.inner;
    }
    children = this._prehandleAddedChild(children);
    if (anchor) {
      children.forEach(child => this.inner.insertBefore(child.inner, anchor))
    } else {
      this.inner.append(...children.map(v => v.inner));
    }
    this._handleAddedChildren(children);
    return this;
  }
  public insertAfter(anchorOrIdx: View | number, ...children: View[]): this {
    if (!children.length) { return this; }
    let anchor: Node | null = null;
    if (typeof anchorOrIdx === 'number') {
      anchor = this.inner.children[anchorOrIdx + 1] ?? null;
    } else if (anchorOrIdx instanceof View) {
      anchor = anchorOrIdx.inner.nextSibling;
    }
    children = this._prehandleAddedChild(children);
    if (anchor) {
      children.forEach(child => this.inner.insertBefore(child.inner, anchor))
    } else {
      this.inner.append(...children.map(v => v.inner));
    }
    this._handleAddedChildren(children);
    return this;
  }
  public removeChild(...children: View[]): this {
    if (!children.length) { return this; }
    children = this._prehandleRemovedChildren(children);
    children.forEach(child => this.inner.removeChild(child.inner))
    return this;
  }
  public replaceChild(newChild: View, oldChild: View): this {
    this._prehandleRemovedChildren([newChild]);
    this._prehandleAddedChild([newChild]);
    this.inner.replaceChild(newChild.inner, oldChild.inner);
    this._handleAddedChildren([newChild])
    return this;
  }
  public removeSelf(): this {
    this.parent?.removeChild(this);
    return this;
  }
  public dispatchEvent<K extends keyof ViewEventMap>(event: ViewEventMap[K]): boolean;
  public dispatchEvent(arg0: any): boolean {
    return this.inner.dispatchEvent(arg0);
  }
  public addEventListener<K extends keyof ViewEventMap>(type: K, listener: (this: HTMLObjectElement, ev: ViewEventMap[K]) => any, options?: boolean | AddEventListenerOptions): this;
  public addEventListener(arg0: any, arg1: any, arg2: any): this {
    this.inner.addEventListener(arg0, arg1, arg2);
    return this;
  }
  public removeEventListener<K extends keyof ViewEventMap>(type: K, listener: (this: HTMLObjectElement, ev: ViewEventMap[K]) => any, options?: boolean | EventListenerOptions): this;
  public removeEventListener(arg0: any, arg1: any, arg2: any): this {
    this.inner.removeEventListener(arg0, arg1, arg2)
    return this;
  }
  public destory() {
    this._focusOb?.destory();
    this._hoverOb?.destory();
    this._styles?.destory();
    delete this._inner?.[View.RAW_KEY_IN_ELEMENT];
    delete this._inner;
  }
  protected _prehandleAddedChild(children: View[]): View[] {
    // console.log('[View]_prehandleAddedChild', children)
    children.forEach(child => child.removeSelf());
    return children;
  }
  protected _prehandleRemovedChildren(children: View[]): View[] {
    // console.log('[View]_prehandleRemovedChildren', children)
    children = children.filter(child => child.inner.parentElement === this.inner);
    children.forEach(child => {
      child.inner.dispatchEvent(new Event(ViewEventType.Removed));
      child.onRemoved();
    });
    return children;
  }
  protected _handleAddedChildren(children: View[]) {
    // console.log('[View]_handleAddedChildren', children)
    children.forEach(child => {
      child.inner.dispatchEvent(new Event(ViewEventType.Added));
      child.onAdded();
    });
  }

  setAttribute(qualifiedName: string, value: string) {
    this.inner.setAttribute(qualifiedName, value);
    return this;
  }

  apply(handle: (v: this) => void): this {
    handle(this)
    return this
  }

  ref(ref: Ref<T>): this {
    ref.current = this
    return this
  }
}