/**
 * 接口：工具自绘光标（十字刻度 + 中心圆）的配置
 *
 * Interface: config of the tool's self-drawn cursor (crosshair ticks plus a center dot).
 */
export interface ICursorInfo {
  /**
   * 刻度线长度（屏幕像素），0 = 不画刻度
   *
   * Length of the ticks (screen pixels); 0 draws no ticks.
   *
   * @default 6
   */
  tickLen: number
  /**
   * 刻度线与中心圆之间的间隙（屏幕像素）
   *
   * Gap between the ticks and the center circle (screen pixels).
   *
   * @default 3
   */
  tickGap: number
  /**
   * 中心圆的最小半径（屏幕像素）：笔很细时圆不至于看不见
   *
   * Minimum radius of the center circle (screen pixels), so a very thin pen still leaves a
   * visible dot.
   *
   * @default 1
   */
  minRadius: number
  /**
   * 指示线的线宽（屏幕像素）
   *
   * Line width of the indicator (screen pixels).
   *
   * @default 1
   */
  lineWidth: number
  /**
   * 固定颜色；不设置时跟随当前描边色
   *
   * A fixed color; when it is not set the current stroke color is used.
   *
   * @default 不设置（跟随描边色）/ Not set (the stroke color is used)
   */
  color?: string
}
