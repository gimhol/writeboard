import { View } from "../BaseView/View";
import { ElementDragger, OnDownCallback, OnMoveCallback, OnUpCallback } from "./ElementDragger";
export interface IViewDraggerInits {
  handles?: View[];
  responser?: View;
  ignores?: View[];
  handleDown?: OnDownCallback;
  handleMove?: OnMoveCallback;
  handleUp?: OnUpCallback;
}
export class ViewDragger {
  private _dragger: ElementDragger;

  get offsetX() { return this._dragger.offsetX; }
  get offsetY() { return this._dragger.offsetY; }
  set offsetX(v) { this._dragger.offsetX = v; }
  set offsetY(v) { this._dragger.offsetY = v; }
  get handles() { return this._dragger.handles.map(v => View.get(v)); }
  set handles(v) { this._dragger.handles = v.map(v => v.inner) }
  get view() { return View.get(this._dragger.responser); }
  set view(v) { this._dragger.responser = v?.inner ?? null }
  get ignores() { return this._dragger.ignores.map(v => View.get(v)); }
  get disabled() { return this._dragger.disabled; }
  set disabled(v) { this._dragger.disabled = v }
  set handleMove(v: OnMoveCallback | undefined) { this._dragger.handleMove = v }
  set handleDown(v: OnDownCallback | undefined) { this._dragger.handleDown = v }
  set handleUp(v: OnUpCallback | undefined) { this._dragger.handleUp = v }
  constructor(inits?: IViewDraggerInits) {
    this._dragger = new ElementDragger({
      responser: inits?.responser?.inner,
      handles: inits?.handles?.map(v => v.inner),
      ignores: inits?.ignores?.map(v => v.inner),
      handleDown: inits?.handleDown,
      handleMove: inits?.handleMove ?? ((x: number, y: number) => this.view?.styles.apply('view_dragger_pos', { left: x, top: y })),
      handleUp: inits?.handleUp,
    })
  }
  destory() {
    this._dragger.destory();
  }
}
