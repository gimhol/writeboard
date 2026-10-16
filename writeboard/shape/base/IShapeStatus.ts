
/**
 * 图形的状态位：字段都是紧凑短键，出现即为生效（不存 = 关闭）
 *
 * Status flags of a shape: the fields are compact short keys that are only stored while
 * the flag is on.
 *
 * @see {ShapeStatus}
 */
export interface IShapeStatus {
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
   * ghost 值为1时表示不可被触摸
   *
   * A ghost value of `1` means it cannot be touched.
   */
  g?: 1;
}

