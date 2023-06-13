import { SubwinFooter } from "./SubwinFooter";
import { SubwinHeader } from "./SubwinHeader";
import type { WorkspaceView } from "./Workspace/WorkspaceView";
import { View } from "../BaseView/View";
import { ViewDragger } from "../Helper/ViewDragger";
import { DockView } from "./Workspace/DockView";
export enum StyleNames {
  Root = 'subwin',
  Raised = 'subwin_raised',
  ChildRaised = 'subwin_child_raised',
  ChildLowered = 'subwin_child_lowered',
  Docked = 'subwin_docked'
}
export class Subwin extends View<'div'> {
  static StyleNames = StyleNames;
  private _workspace?: WorkspaceView;
  private _header = new SubwinHeader();
  private _footer = new SubwinFooter();
  private _content?: View | null;
  private _dragger: ViewDragger;
  private _resizeOb: ResizeObserver;
  get dragger() { return this._dragger; }
  get workspace() { return this._workspace; }
  set workspace(v) { this._workspace = v; }
  get header() { return this._header; };
  get footer() { return this._footer; };
  get content() { return this._content; }
  set content(v) {
    if (this._content) {
      this._content.styles
        .remove(StyleNames.ChildRaised)
        .remove(StyleNames.ChildLowered)
        .forgo(StyleNames.ChildRaised, StyleNames.ChildLowered)
      this.removeChild(this._content);
    }
    this._content = v;
    if (v) {
      v.styles
        .register(StyleNames.ChildRaised, { opacity: 1, transition: 'all 200ms' })
        .register(StyleNames.ChildLowered, { opacity: 0.8, transition: 'all 200ms' })
      this.insertChildBefore(this._footer, v);
    }
  }
  raise() {
    this.styles.add(StyleNames.Raised).refresh();
    this.header.styles.remove(StyleNames.ChildLowered).apply(StyleNames.ChildRaised);
    this.content?.styles.remove(StyleNames.ChildLowered).apply(StyleNames.ChildRaised);
    this.footer?.styles.remove(StyleNames.ChildLowered).apply(StyleNames.ChildRaised);
  }
  lower() {
    this.styles.remove(StyleNames.Raised).refresh();
    this.header.styles.remove(StyleNames.ChildRaised).apply(StyleNames.ChildLowered);
    this.content?.styles.remove(StyleNames.ChildRaised).apply(StyleNames.ChildLowered);
    this.footer?.styles.remove(StyleNames.ChildRaised).apply(StyleNames.ChildLowered);
  }
  constructor() {
    super('div');
    this.styles.register(StyleNames.Raised, {
      boxShadow: '5px 5px 10px 10px #00000022',
    }).register(StyleNames.Docked, {
      pointerEvents: 'all',
      position: 'relative',
      resize: 'none',
      width: 'unset',
      height: 'unset',
      left: 'unset',
      top: 'unset',
      boxShadow: 'unset',
      borderRadius: 0,
      zIndex: 'unset',
      border: 'none'
    }).apply(StyleNames.Root, {
      position: 'fixed',
      background: '#555555',
      overflow: 'hidden',
      border: '1px solid black',
      resize: 'both',
      boxShadow: '2px 2px 5px 5px #00000011',
      borderRadius: 5,
      display: 'flex',
      flexDirection: 'column',
      transition: 'box-shadow 200ms'
    })
    this._header.styles
      .register(StyleNames.ChildRaised, { opacity: 1, transition: 'all 200ms' })
      .register(StyleNames.ChildLowered, { opacity: 0.8, transition: 'all 200ms' })
    this._footer.styles
      .register(StyleNames.ChildRaised, { opacity: 1, transition: 'all 200ms' })
      .register(StyleNames.ChildLowered, { opacity: 0.8, transition: 'all 200ms' })
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
  }
  private _dragWhenDocked = (x: number, y: number, prevX: number, prevY: number) => {
    if (Math.abs(x - prevX) + Math.abs(y - prevY) > 20) {
      const w0 = this.inner.offsetWidth;
      this.workspace?.undockSubwin(this);
      const w1 = this.inner.offsetWidth;
      this._dragger.offsetX = (w1 - 60) * this._dragger.offsetX / w0;

    }
  }
  private _dragWhenUndocked = (x: number, y: number) => {
    this.styles.apply('view_dragger_pos', { left: x, top: y })
  }
  onDocked(): void {
    this._resizeOb.unobserve(this.inner);
    this.styles.apply(StyleNames.Docked);
    this.dragger.handleMove = this._dragWhenDocked;
  }
  onUndocked(): void {
    this._resizeOb.observe(this.inner);
    this.styles.forgo(StyleNames.Docked);
    this.dragger.handleMove = this._dragWhenUndocked;
  }
  resizeDocked(width: number | undefined, height: number | undefined) {
    this.styles.apply(StyleNames.Docked, v => ({ ...v, width, height }))
  }
}

