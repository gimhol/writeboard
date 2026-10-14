/**
 * 接口：工具自绘光标（十字刻度 + 中心圆）的配置
 */
export interface ICursorInfo {
  /**
   * 刻度线长度（屏幕像素），0 = 不画刻度
   */
  tickLen: number
  /**
   * 刻度线与中心圆之间的间隙（屏幕像素）
   */
  tickGap: number
  /**
   * 中心圆的最小半径（屏幕像素）：笔很细时圆不至于看不见
   */
  minRadius: number
  /**
   * 指示线的线宽（屏幕像素）
   */
  lineWidth: number
  /**
   * 固定颜色；不设置时跟随当前描边色
   */
  color?: string
}
