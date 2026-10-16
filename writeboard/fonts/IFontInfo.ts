/**
 * 字体信息：登记到 Gaia 里的字体都带这几项，用来在下拉框里展示与画到画布上
 *
 * Font info: every font registered in Gaia carries these fields, which are used both for
 * the drop-down list and for drawing on the canvas.
 */
export interface IFontInfo {
  /**
   * 字体家族名（CSS font-family）
   *
   * Font family name (CSS font-family).
   */
  family: string;
  /**
   * 显示名
   *
   * Display name.
   */
  name: string;
  /**
   * 说明（在下拉框的标题里展示）
   *
   * Description (shown as the title of the drop-down item).
   */
  desc: string;
}