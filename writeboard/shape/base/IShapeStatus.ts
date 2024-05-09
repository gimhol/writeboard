import { isNum } from "../../utils/helper";

export interface IShapeStatus {
  /**
   * visible 值为0时表示不可见
   */
  v?: 0;
  
  /**
   * selected 值为1时表示被选择
   */
  s?: 1;

  /**
   * editing 值为1时表示编辑中
   */
  e?: 1;

  /**
   * locked 值为1时表示被锁定
   */
  f?: 1;

  /**
   * ghost 值为1时表示不可被触摸
   */
  g?: 1;
}

export class ShapeStatus implements IShapeStatus {
  /**
   * visible 值为0时表示不可见
   */
  v?: 0;
  
  /**
   * selected 值为1时表示被选择
   */
  s?: 1;

  /**
   * editing 值为1时表示编辑中
   */
  e?: 1;

  /**
   * locked 值为1时表示被锁定
   */
  f?: 1;

  /**
   * ghost 值为1时表示不允许selector操作
   */
  g?: 1;

  /** 是否可见 */
  get visible(): boolean { return this.v != 0; }

  /** 设置是否可见 */
  set visible(v: boolean) { if (v) delete this.v; else this.v = 0; }

  /** 是否被选中 */
  get selected(): boolean { return !!this.s; }

  /** 设置是否被选中 */
  set selected(v: boolean) { if (v) this.s = 1; else delete this.s; }

  /** 设置是否被选中 */
  get editing(): boolean { return !!this.e; }

  /** 设置是否被选中 */
  set editing(v: boolean) { if (v) this.e = 1; else delete this.e; }

  /** 是否被锁定 */
  get locked(): boolean { return !!this.f; }

  /** 设置是否被锁定 */
  set locked(v: boolean) { if (v) this.f = 1; else delete this.f; }

  /** 是否不允许selector操作 */
  get ghost(): boolean { return !!this.g; }

  /** 设置是否不允许selector操作 */
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