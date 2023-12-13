import { isNum } from "../../utils/helper";

export interface IShapeStatus {
  /**
   * visible
   */
  v?: 0;
  /**
   * selected
   */
  s?: 1;
  /**
   * editing
   */
  e?: 1;
  /**
   * locked
   */
  f?: 1;
  /**
   * ghost
   */
  g?: 1;
}

export class ShapeStatus implements IShapeStatus {
  /** visible */
  v?: 0;
  /** selected */
  s?: 1;
  /** editing */
  e?: 1;
  /** locked */
  f?: 1;
  /** ghost */
  g?: 1;

  get visible(): boolean { return this.v != 0; }
  set visible(v: boolean) { if (v) delete this.v; else this.v = 0; }
  get selected(): boolean { return !!this.s; }
  set selected(v: boolean) { if (v) this.s = 1; else delete this.s; }
  get editing(): boolean { return !!this.e; }
  set editing(v: boolean) { if (v) this.e = 1; else delete this.e; }
  get locked(): boolean { return !!this.f; }
  set locked(v: boolean) { if (v) this.f = 1; else delete this.f; }
  get ghost(): boolean { return !!this.g; }
  set ghost(v: boolean) { if (v) this.g = 1; else delete this.g; }

  merge(o: Partial<IShapeStatus>): this {
    this.read(o)
    return this
  }
  read(o: Partial<IShapeStatus>): this {
    if (isNum(o.v)) this.v = o.v
    if (isNum(o.s)) this.s = o.s
    if (isNum(o.e)) this.e = o.e
    if (isNum(o.f)) this.f = o.f
    if (isNum(o.g)) this.g = o.g
    return this
  }
  copy(): typeof this {
    const ret: (typeof this) = new (Object.getPrototypeOf(this).constructor)
    return ret.read(this)
  }
}