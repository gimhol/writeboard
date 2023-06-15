import { Style } from "../../BaseView/StyleType";
import { View } from "../../BaseView/View";
import { DockableEventMap, DockableEventType, ViewEventMap } from "../../Events/EventType";
import { IDockable } from "./Dockable";
import { DockableDirection } from "./DockableDirection";
import { DockableResizer } from "./DockableResizer";
import { WorkspaceView } from "./WorkspaceView";
export enum StyleName {
  AsRoot = "asroot",
  Normal = 'normal',
  MaxDocked = 'MaxDocked',
  Docked = 'MinDocked ',
}
export const DockViewStyles: Partial<Record<StyleName, Style>> = {
  [StyleName.AsRoot]: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
  [StyleName.Normal]: {
    pointerEvents: 'none',
    alignItems: 'stretch',
  },
  [StyleName.Docked]: {
    position: 'relative',
    width: 'unset',
    height: 'unset',
    alignSelf: 'stretch',
  },
  [StyleName.MaxDocked]: {
    flex: 1
  }
}
const Tag = '[DockView]'
export class DockView extends View<'div'> implements IDockable {
  static StyleName = StyleName;
  get direction() { return this._direction; }
  private _direction: DockableDirection = DockableDirection.None;
  constructor(direction: DockableDirection = DockableDirection.None) {
    super('div');
    this._direction = direction;
    if (direction === DockableDirection.H) {
      this.styles.apply('', { display: "flex", flexDirection: 'row' });
    } else if (direction === DockableDirection.V) {
      this.styles.apply('', { display: "flex", flexDirection: 'column' });
    }
    this.styles.applyCls('DockView');
    this.styles
      .registers(DockViewStyles)
      .apply(StyleName.Normal);
  }
  private _workspace?: WorkspaceView;
  public workspace() { return this._workspace; }
  public setWorkspace(v: WorkspaceView) { this._workspace = v; return this }
  public setContent(view: View) { super.addChild(view); }

  public push(dockables: IDockable[]): this {
    if (!dockables.length) { return this; }
    const children = dockables.map(child => child.dockableView());
    const beginAnchor = this.lastChild;
    for (let i = 1; i < children.length; i += 2) {
      children.splice(i, 0, new DockableResizer(this._direction))
    }
    if (beginAnchor) {
      children.unshift(new DockableResizer(this._direction))
    }
    super.addChild(...children);
    dockables.forEach(v => this._dockableDocked(v));
    return this;
  }
  public unshift(dockables: IDockable[]): this {
    if (!dockables.length) { return this; }
    const children = dockables.map(child => child.dockableView());
    const endAnchor = this.firstChild;
    for (let i = 1; i < children.length; i += 2) {
      children.splice(i, 0, new DockableResizer(this._direction))
    }
    if (endAnchor) {
      children.push(new DockableResizer(this._direction))
    }
    super.insertBefore(0, ...children);
    dockables.forEach(v => this._dockableDocked(v));
    return this;
  }
  public dockBefore(anchor: IDockable, dockables: IDockable[]): this {
    if (!dockables.length) { return this; }
    const children = dockables.map(child => child.dockableView());
    const endAnchor = anchor.dockableView();
    for (let i = 1; i < children.length; i += 2) {
      children.splice(i, 0, new DockableResizer(this._direction))
    }
    if (endAnchor) {
      children.push(new DockableResizer(this._direction))
    }
    super.insertBefore(endAnchor, ...children);
    dockables.forEach(v => this._dockableDocked(v));
    return this;
  }
  public dockAfter(anchor: IDockable, dockables: IDockable[]): this {
    if (!dockables.length) { return this; }
    const children = dockables.map(child => child.dockableView());
    const beginAnchor = anchor.dockableView();
    for (let i = 1; i < children.length; i += 2) {
      const resizer = new DockableResizer(this._direction)
      children.splice(i, 0, resizer)
    }
    if (beginAnchor) {
      children.unshift(new DockableResizer(this._direction))
    }
    super.insertAfter(beginAnchor, ...children)
    dockables.forEach(v => this._dockableDocked(v));
    return this;
  }
  public replace(anchor: IDockable, dockable: IDockable,): this {
    const newChild = dockable.dockableView();
    const oldChild = anchor.dockableView();
    super.replaceChild(newChild, oldChild);
    this._dockableDocked(dockable);
    this._dockableUndocked(anchor);
    return this;
  }
  public remove(dockable: IDockable): this {
    const view = dockable.dockableView();
    const nextResizer = view.nextSibling;
    const prevResizer = view.prevSibling;
    const children = [dockable.dockableView()]
    if (prevResizer) {
      children.unshift(prevResizer)
    } else if (nextResizer) {
      children.push(nextResizer);
    }
    this._dockableUndocked(dockable);
    return super.removeChild(...children);
  }
  public dockableView(): DockView { return this; }
  public onDocked(): void {
    this.styles.apply(StyleName.Docked);
  }
  public onUndocked(): void {
    this.styles.forgo(StyleName.MaxDocked, StyleName.Docked);
  }
  public asRoot(v: boolean): this {
    this.styles[v ? 'apply' : 'forgo'](StyleName.AsRoot)
    return this;
  }
  public resizeDocked(width: number | undefined, height: number | undefined) {
    this.styles.apply(StyleName.Docked, v => ({ ...v, width, height }))
  }

  public override addEventListener<K extends keyof DockableEventMap>(type: K, listener: (this: HTMLObjectElement, ev: DockableEventMap[K]) => any, options?: boolean | AddEventListenerOptions | undefined): this;
  public override addEventListener(arg0: any, arg1: any, arg2: any): this {
    return super.addEventListener(arg0, arg1, arg2);
  }

  public override removeEventListener<K extends keyof DockableEventMap>(type: K, listener: (this: HTMLObjectElement, ev: DockableEventMap[K]) => any, options?: boolean | EventListenerOptions | undefined): this;
  public override removeEventListener(arg0: any, arg1: any, arg2: any): this {
    return super.removeEventListener(arg0, arg1, arg2);
  }

  private _dockableDocked(v: IDockable) {
    v.onDocked();
    v.dispatchEvent<DockableEventType.Docked>(new Event(DockableEventType.Docked))
  }

  private _dockableUndocked(v: IDockable) {
    v.onUndocked();
    v.dispatchEvent<DockableEventType.Undocked>(new Event(DockableEventType.Undocked))
  }
}
