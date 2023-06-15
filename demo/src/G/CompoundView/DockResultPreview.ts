import { View } from "../BaseView/View";
import { HoverOb } from "../Observer/HoverOb";
import { DockPosition } from "./DockPosition";

export default class DockResultPreview extends View<'div'>{
  private _indicatorPositionMap = new Map<View | null, DockPosition>();
  private _hovering: View | null = null;
  constructor() {
    super('div');
    this.styles.addCls('g_dock_result_preview').apply('hidden', { opacity: 0 })
  }
  private _onHover = (hover: boolean, e: MouseEvent) => {
    const view = View.try(e.target, View);
    if (hover) {
      this._hovering = view;
    } else if (view === this._hovering) {
      this._hovering = null;
    } else {
      return;
    }
    const position: DockPosition = this._indicatorPositionMap.get(this._hovering) ?? DockPosition.Hide;
    this[position]();
  };
  addIndicator(position: DockPosition, view: View): this {
    this._indicatorPositionMap.set(view, position);
    new HoverOb(view.inner).setCallback(this._onHover);
    return this;
  }
  hide() {
    this.styles.apply('hidden', { opacity: 0 })
  }
  toLeft() {
    this.styles.remove('hidden').apply('show', { opacity: 1, right: '75%' });
  }
  toRight() {
    this.styles.remove('hidden').apply('show', { opacity: 1, left: '75%' });
  }
  toTop() {
    this.styles.remove('hidden').apply('show', { opacity: 1, bottom: '75%' });
  }
  toBottom() {
    this.styles.remove('hidden').apply('show', { opacity: 1, top: '75%' });
  }
  toCenter() {
    this.styles.remove('hidden').apply('show', { opacity: 1 });
  }
}