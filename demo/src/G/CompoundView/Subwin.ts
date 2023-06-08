import { SubwinFooter } from "./SubwinFooter";
import { SubwinHeader } from "./SubwinHeader";
import type { SubwinWorkspace } from "../Helper/SubwinWorkspace";
import { View } from "../BaseView/View";
import { ViewDragger } from "../Helper/ViewDragger";
export enum StyleNames {
  Root = 'subwin',
  Raised = 'subwin_raised',
  ChildRaised = 'subwin_child_raised',
  ChildLowered = 'subwin_child_lowered',
}
export class Subwin extends View<'div'> {
  static StyleNames = StyleNames;
  private _workspace?: SubwinWorkspace;
  private _header = new SubwinHeader();
  private _footer = new SubwinFooter();
  private _content?: View | null;
  protected _dragger: ViewDragger;
  get dragger() { return this._dragger; }
  get workspace() { return this._workspace; }
  set workspace(v) { this._workspace = v; }
  get header() { return this._header; };
  get footer() { return this._footer; };
  get content() { return this._content; }
  set content(v) {
    if (this._content) { this.removeChild(this._content); }
    this._content = v;
    if (v) { this.insertChild(this._footer, v); }
  }
  raise() {
    this.styles.add(StyleNames.Raised).refresh();
    this.header.styles.remove(StyleNames.ChildLowered).apply(StyleNames.ChildRaised, { opacity: 1, transition: 'all 200ms' });
    this.content?.styles.remove(StyleNames.ChildLowered).apply(StyleNames.ChildRaised, { opacity: 1, transition: 'all 200ms' });
    this.footer?.styles.remove(StyleNames.ChildLowered).apply(StyleNames.ChildRaised, { opacity: 1, transition: 'all 200ms' });
  }
  lower() {
    this.styles.remove(StyleNames.Raised).refresh();
    this.header.styles.remove(StyleNames.ChildRaised).apply(StyleNames.ChildLowered, { opacity: 0.8, transition: 'all 200ms' });
    this.content?.styles.remove(StyleNames.ChildRaised).apply(StyleNames.ChildLowered, { opacity: 0.8, transition: 'all 200ms' });
    this.footer?.styles.remove(StyleNames.ChildRaised).apply(StyleNames.ChildLowered, { opacity: 0.8, transition: 'all 200ms' });
  }
  constructor() {
    super('div');
    this.styles.register(StyleNames.Raised, {
      boxShadow: '5px 5px 10px 10px #00000022',
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
    this.addChild(this._header, this._footer);
    this.addChild();


    this._dragger = new ViewDragger({
      view: this,
      handles: [
        this.header.titleView,
        this.header.iconView
      ]
    }); 

    new ResizeObserver(() => {
      const { width, height } = getComputedStyle(this.inner);
      this.styles.edit(StyleNames.Root, v => ({ ...v, width, height }))
    }).observe(this.inner);
  }
}

