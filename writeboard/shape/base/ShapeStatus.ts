import { isNum } from "../../utils/helper";
import { IShapeStatus } from "./IShapeStatus";


/**
 * 状态对象的默认实现：短键存状态位，不在字段（undefined）即关闭
 *
 * Default implementation of the status: the short keys hold the flags, and a missing field
 * (undefined) means the flag is off.
 */
export class ShapeStatus implements IShapeStatus {
  /**
   * visible 值为0时表示不可见
   *
   * A visible value of `0` means invisible.
   */
  v?: 0;

  /**
   * selected 值为1时表示被选择
   *
   * A selected value of `1` means selected.
   */
  s?: 1;

  /**
   * editing 值为1时表示编辑中
   *
   * A editing value of `1` means being edited.
   */
  e?: 1;

  /**
   * locked 值为1时表示被锁定
   *
   * A locked value of `1` means locked.
   */
  f?: 1;

  /**
   * ghost 值为1时表示不允许selector操作
   *
   * A ghost value of `1` means the selector is not allowed to operate on it.
   */
  g?: 1;

  /**
   * 是否可见
   *
   * Whether the shape is visible.
   */
  get visible(): boolean { return this.v != 0; }

  /**
   * 设置是否可见
   *
   * Sets the visibility.
   */
  set visible(v: boolean) { if (v) delete this.v; else this.v = 0; }

  /**
   * 是否被选中
   *
   * Whether the shape is selected.
   */
  get selected(): boolean { return !!this.s; }

  /**
   * 设置是否被选中
   *
   * Sets the selected flag.
   */
  set selected(v: boolean) { if (v) this.s = 1; else delete this.s; }

  /**
   * 是否编辑中
   *
   * Whether the shape is being edited.
   */
  get editing(): boolean { return !!this.e; }

  /**
   * 设置是否编辑中
   *
   * Sets the editing flag.
   */
  set editing(v: boolean) { if (v) this.e = 1; else delete this.e; }

  /**
   * 是否被锁定
   *
   * Whether the shape is locked.
   */
  get locked(): boolean { return !!this.f; }

  /**
   * 设置是否被锁定
   *
   * Sets the locked flag.
   */
  set locked(v: boolean) { if (v) this.f = 1; else delete this.f; }

  /**
   * 是否不允许 selector 操作
   *
   * Whether the selector is not allowed to operate on it.
   */
  get ghost(): boolean { return !!this.g; }

  /**
   * 设置是否不允许 selector 操作
   *
   * Sets the ghost flag.
   */
  set ghost(v: boolean) { if (v) this.g = 1; else delete this.g; }

  /**
   * 合并另一份状态：只读取传进来的字段
   *
   * Merges another status: only the given fields are read.
   *
   * @param {Partial<IShapeStatus>} o 要合并的状态 / The status to merge
   * @return {this} 本对象（便于链式调用）/ This instance (chainable)
   */
  merge(o: Partial<IShapeStatus>): this {
    this.read(o);
    return this;
  }

  /**
   * 读入另一份状态：只读取传进来的字段，其余保持不变
   *
   * Reads another status: only the given fields are read, the rest is kept.
   *
   * @param {Partial<IShapeStatus>} o 要读入的状态 / The status to read
   * @return {this} 本对象（便于链式调用）/ This instance (chainable)
   */
  read(o: Partial<IShapeStatus>): this {
    if (isNum(o.v)) this.v = o.v;
    if (isNum(o.s)) this.s = o.s;
    if (isNum(o.e)) this.e = o.e;
    if (isNum(o.f)) this.f = o.f;
    if (isNum(o.g)) this.g = o.g;
    return this;
  }

  /**
   * 拷一份同类型的副本（子类会拷成子类）
   *
   * Copies into a new instance of the same subclass.
   *
   * @return {typeof this} 副本 / The copy
   */
  copy(): typeof this {
    const ret: (typeof this) = new (Object.getPrototypeOf(this).constructor);
    return ret.read(this);
  }
}
