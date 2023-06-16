import { SubwinFooter } from "./Footer";
import { SubwinHeader } from "./Header";
import type { WorkspaceView } from "../Workspace/WorkspaceView";
import { View } from "../../BaseView/View";
import { ViewDragger } from "../../Helper/ViewDragger";
import { IDockable } from "../Workspace/Dockable";
import { DockableEventMap } from "../../Events/EventType";
export enum StyleNames {
  Root = 'subwin',
  Docked = 'subwin_docked'
}
export class Subwin extends View<'div'> implements IDockable {
  static StyleNames = StyleNames;
  private _workspace?: WorkspaceView;
  private _header = new SubwinHeader();
  private _footer = new SubwinFooter();
  private _content?: View | null;
  private _dragger: ViewDragger;
  private _resizeOb: ResizeObserver;
  get dragger() { return this._dragger; }
  workspace() { return this._workspace; }
  setWorkspace(v: WorkspaceView) { this._workspace = v; return this; }
  get header() { return this._header; };
  get footer() { return this._footer; };
  get content() { return this._content; }
  set content(v) {
    if (this._content) {
      this.removeChild(this._content);
    }
    this._content = v;
    if (v) {
      this.insertBefore(this._footer, v);
    }
  }
  raise() {
    this.styles.delCls('g_subwin_lower').addCls('g_subwin_raised');
  }
  lower() {
    this.styles.delCls('g_subwin_raised').addCls('g_subwin_lower');
  }
  constructor() {
    super('div');
    this.styles.register(StyleNames.Docked, {
      left: 'unset',
      top: 'unset',
      width: 'unset',
      height: 'unset',
      zIndex: 'unset',
    }).addCls('g_subwin');
    this.addChild(this._header, this._footer);
    this._dragger = new ViewDragger({
      responser: this,
      handles: [
        this.header.titleView,
        this.header.iconView
      ],
      handleMove: this._dragWhenUndocked,
    });
    this._resizeOb = new ResizeObserver(() => {
      const { width, height } = getComputedStyle(this.inner);
      this.styles.edit(StyleNames.Root, v => ({ ...v, width, height }))
    })
    this._resizeOb.observe(this.inner);
    this.header.btnClose.addEventListener('click', e => this.styles.apply('hidden', { display: 'none' }))
  }
  dockableView(): View<keyof HTMLElementTagNameMap> {
    return this;
  }
  private _dragWhenDocked = (x: number, y: number, prevX: number, prevY: number) => {
    if (Math.abs(x - prevX) + Math.abs(y - prevY) > 20) {
      const w0 = this.inner.offsetWidth;
      this.workspace()?.undock(this);
      const w1 = this.inner.offsetWidth;
      this._dragger.offsetX = (w1 - 60) * this._dragger.offsetX / w0;
    }
  }
  private _dragWhenUndocked = (x: number, y: number) => {
    this.styles.apply('view_dragger_pos', { left: x, top: y })
  }
  onDocked(): void {
    this._resizeOb.unobserve(this.inner);
    this.styles.addCls('g_subwin_docked').delCls('g_subwin_raised', 'g_subwin_lower').apply(StyleNames.Docked);
    this.dragger.handleMove = this._dragWhenDocked;
    this.header.btnClose.styles.apply('hidden', { display: 'none' });
  }
  onUndocked(): void {
    this._resizeOb.observe(this.inner);
    this.styles.delCls('g_subwin_docked').forgo(StyleNames.Docked);
    this.dragger.handleMove = this._dragWhenUndocked;
    this.header.btnClose.styles.forgo('hidden');
  }
  resizeDocked(width: number | undefined, height: number | undefined) {
    this.styles.apply(StyleNames.Docked, v => ({ ...v, width, height }))
  }
  public override addEventListener<K extends keyof DockableEventMap>(type: K, listener: (this: HTMLObjectElement, ev: DockableEventMap[K]) => any, options?: boolean | AddEventListenerOptions | undefined): this;
  public override addEventListener(arg0: any, arg1: any, arg2: any): this {
    return super.addEventListener(arg0, arg1, arg2);
  }
  public override removeEventListener<K extends keyof DockableEventMap>(type: K, listener: (this: HTMLObjectElement, ev: DockableEventMap[K]) => any, options?: boolean | EventListenerOptions | undefined): this;
  public override removeEventListener(arg0: any, arg1: any, arg2: any): this {
    return super.removeEventListener(arg0, arg1, arg2);
  }
}

