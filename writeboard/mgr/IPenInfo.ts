
/**
 * 接口：画笔（Pen 工具）的配置
 *
 * Interface: config of the pen (the Pen tool).
 */
export interface IPenInfo {
  /**
   * 平滑 / 防抖强度 0~1：
   * 0 = 使用原始输入点；数值越大笔画越平滑（笔尖跟随越滞后）。
   * 内部实现为对输入点做低通跟随 + 拖尾封顶，起笔的前几个点会少滤一些（起笔 / 钩子不缩水）。
   *
   * Smoothing / debounce strength, 0~1: 0 uses the raw input points and larger values give
   * smoother strokes (the nib follows with more lag). Internally it is a low-pass follow of
   * the input points plus a cap on the tail, and the first few points of a stroke are
   * filtered less so its entry / hook does not shrink.
   */
  stabilizer: number;
}
