export class HoverOb {
  private _hover = false;
  get hover() { return this._hover; }
  constructor(ele: HTMLElement, cb: (hover: boolean) => void) {
    ele.addEventListener('mouseenter', e => { this._hover = true; cb(this._hover); });
    ele.addEventListener('mouseleave', e => { this._hover = false; cb(this._hover); });
  }
}

export class FocusOb {
  private _focused = false;
  get focused() { return this._focused; }
  constructor(ele: HTMLElement, cb: (focused: boolean) => void) {
    ele.addEventListener('focus', e => { this._focused = true; cb(this._focused); });
    ele.addEventListener('blur', e => { this._focused = true; cb(this._focused); });
  }
}

export class DragInOutOB {
  private _disabled = true;
  private _ele: HTMLElement;
  private _draggables: HTMLElement[] = [];

  private _node?: HTMLElement;
  private _onDragOut?: (e: DragEvent, dragging: HTMLElement) => void;
  private _dragging?: HTMLElement;

  get draggables() { return this._draggables; }
  set draggables(v) {
    this._draggables.forEach(v => {
      v.removeEventListener('dragstart', this._dragstart);
      v.removeEventListener('dragend', this._dragend);
    })
    this._draggables = v;
    this._draggables.forEach(v => {
      v.addEventListener('dragstart', this._dragstart);
      v.addEventListener('dragend', this._dragend);
    })
    if (this._draggables.indexOf(this._dragging!) < 0) {
      delete this._dragging;
    }
  }
  private _dragstart = (e: DragEvent) => {
    this._dragging = (e.target as HTMLElement)
  }
  private _dragend = (e: DragEvent) => {
    delete this._dragging;
  }
  private draggableListening(v: HTMLElement, listen: boolean) {
    if (listen) {
      v.addEventListener('dragstart', this._dragstart)
      v.addEventListener('dragend', this._dragend)
    } else {
      v.removeEventListener('dragstart', this._dragstart)
      v.removeEventListener('dragend', this._dragend)
    }
  }
  private eleListening(listen: boolean) {
    if (listen) {
      this._ele.addEventListener('dragenter', this._dragenter);
      this._ele.addEventListener('dragleave', this._dragleave);
    } else {

      this._ele.removeEventListener('dragenter', this._dragenter);
      this._ele.removeEventListener('dragleave', this._dragleave);
    }
  }
  addDraggble(v: HTMLElement) {
    const idx = this._draggables.indexOf(v);
    if (idx >= 0) { return false; }
    this._draggables.push(v);
    this.draggableListening(v, true);
    return true;
  }
  removeDraggble(v: HTMLElement) {
    const idx = this._draggables.indexOf(v);
    if (idx < 0) { return false; }
    this._draggables.splice(idx, 1);
    this.draggableListening(v, false);
    this._dragging === v && delete this._dragging
    return true;
  }

  get disabled() { return this._disabled; }
  set disabled(v) {
    if (this._disabled === v) { return; }
    if (v) {
      this.eleListening(false);
      this._draggables.forEach(v => this.draggableListening(v, false))
    } else {
      this.eleListening(true);
      this._draggables.forEach(v => this.draggableListening(v, true))
    }
  }
  private _dragenter = (e: DragEvent) => {
    this._node = (e.target as HTMLElement);

  }
  private _dragleave = (e: DragEvent) => {
    if (this._node === e.target && this._dragging) {
      this._onDragOut?.(e, this._dragging);
    }
  }
  constructor(inits: DragInOutOBInit) {
    this._ele = inits.ele;
    this._onDragOut = inits.onDragOut;
    this.disabled = false;
  }
}

export interface DragInOutOBInit {
  ele: HTMLElement;
  onDragOut: (e: DragEvent, dragging: HTMLElement) => void;
  onDragIn: (e: DragEvent, dragging: HTMLElement) => void;
}
