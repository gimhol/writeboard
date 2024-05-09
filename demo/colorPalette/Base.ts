import { IRect, Rect, Vector } from "../../writeboard";
import { clampI } from "./Color";

export class Base {
  protected _rect: Rect;
  protected _pos = new Vector(0, 0);
  protected _pointerId: number | undefined;
  protected _onscreen: HTMLCanvasElement;
  protected _offscreen: HTMLCanvasElement;
  protected _requested = false;
  get rect() { return this._rect; }
  set rect(v: IRect) {
    this._rect.set(v);
    this.update();
  }
  constructor(onscreen: HTMLCanvasElement, offscreen: HTMLCanvasElement, rect?: IRect) {
    if (rect)
      this._rect = Rect.create(rect);

    else
      this._rect = new Rect(0, 0, onscreen.width, onscreen.height);
    this._offscreen = offscreen;
    this._onscreen = onscreen;
    onscreen.addEventListener('pointerdown', e => this.onPointerStart(e));
    document.addEventListener('pointermove', e => this.onPointerMove(e));
    document.addEventListener('pointerup', e => this.onPointerEnd(e));
    document.addEventListener('pointercancel', e => this.onPointerEnd(e));
    setTimeout(() => this.update(), 1);
  }
  protected onPointerStart(e: PointerEvent) {
    if (!this.pressOnMe(e) || this._pointerId)
      return;
    this._pointerId = e.pointerId;
    this.handlePoinerMove(e);
    this.update();
  }
  protected onPointerMove(e: PointerEvent) {
    if (e.pointerId !== this._pointerId)
      return;
    this.handlePoinerMove(e);
    this.update();
  }
  protected onPointerEnd(e: PointerEvent) {
    if (e.pointerId !== this._pointerId)
      return;
    delete this._pointerId;
    this.handlePoinerMove(e);
    this.update();
  }
  pressOnMe(e: PointerEvent) {
    if (e.pointerType === 'mouse' && e.button !== 0)
      return false;
    const { x, y } = this.pos(e);
    return x < this._rect.w && y < this._rect.h && x >= 0 && y >= 0;
  }
  pos(e: PointerEvent) {
    const { left, top, width, height } = this._onscreen.getBoundingClientRect();
    const { x, y, w, h } = this._rect;
    return new Vector(
      (e.clientX - left) * this._onscreen.width / width - x,
      (e.clientY - top) * this._onscreen.height / height - y
    );
  }
  clampPos(e: PointerEvent) {
    const pos = this.pos(e);
    pos.x = clampI(0, this._rect.w, pos.x);
    pos.y = clampI(0, this._rect.h, pos.y);
    return pos;
  }
  handlePoinerMove(e: PointerEvent) {
    this._pos = this.clampPos(e);
  }
  update() {
    if (this._requested) return;
    this._requested = true;
    requestAnimationFrame(() => {
      this.drawOffscreen();
      const onscreen = this._onscreen.getContext('2d')!;
      onscreen.clearRect(this._rect.x, this._rect.y, this._rect.w, this._rect.h);
      onscreen.drawImage(this._offscreen,
        this._rect.x, this._rect.y, this._rect.w, this._rect.h,
        this._rect.x, this._rect.y, this._rect.w, this._rect.h);

      this._requested = false;
    });
  }
  drawOffscreen() { }
}
