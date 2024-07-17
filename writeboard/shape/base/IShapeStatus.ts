
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

