import { isNum, isStr } from "../../utils/helper";
import { ShapeEnum } from "../ShapeEnum";
import { IShapeData, ShapeData } from "../base";

/**
 * 文本字体样式元组：依次是风格 / 变体 / 字重 / 字号 / 字体家族
 *
 * Tuple of the text font style: style / variant / weight / size / family, in that order.
 */
export type TFontStyle = [
  'normal' | 'italic' | 'oblique',
  'normal' | 'small-caps',
  'normal' | 'bold' | 'bolder' | 'lighter' | number,
  number,
  string
]
/**
 * 文本数据：除公共字段外多出文本内容、字体与四边内边距
 *
 * Text data: beyond the common fields it adds the text, the font and the four paddings.
 */
export interface ITextData extends IShapeData {
  /**
   * 文本内容（短键 s）
   *
   * text (short key `s`)
   */
  s: string;

  /**
   * 字体样式元组（短键 u）
   *
   * TFontStyle (short key `u`)
   */
  u: TFontStyle;

  /**
   * 左边距（短键 m）
   *
   * padding left (short key `m`)
   */
  m: number;

  /**
   * 右边距（短键 n）
   *
   * padding right (short key `n`)
   */
  n: number;

  /**
   * 上边距（短键 p）
   *
   * padding top (short key `p`)
   */
  p: number;

  /**
   * 下边距（短键 q）
   *
   * padding bottom (short key `q`)
   */
  q: number;
}

/**
 * 文本数据的默认实现：默认红色文字、无描边，字号 24
 *
 * Default implementation of the text data: red text without a stroke and a font size of 24
 * by default.
 */
export class TextData extends ShapeData implements ITextData {
  /**
   * 建一份文本数据
   *
   * Builds text data.
   *
   * @param {Partial<TextData>} [other] 初始数据 / The initial data
   */
  constructor(other?: Partial<TextData>) {
    super(other);
    this.type = ShapeEnum.Text;
    this.fillStyle = '#ff0000';
    this.strokeStyle = '';
    this.lineWidth = 0;
    other && this.read(other)
  }
  /**
   * 文本内容（短键 s）
   *
   * text (short key `s`)
   */
  s: string = '';
  /**
   * 文本内容，s 的别名
   *
   * The text, an alias of s.
   */
  get text() { return this.s }
  set text(v) { this.s = v }

  /**
   * 字体样式元组（短键 u）：[风格, 变体, 字重, 字号, 字体家族]
   *
   * TFontStyle (short key `u`): [style, variant, weight, size, family]
   */
  u: TFontStyle = ['normal', 'normal', 'normal', 24, 'Simsum']
  /**
   * 字体样式元组，u 的别名
   *
   * The font style tuple, an alias of u.
   */
  get f_d() { return this.u }
  set f_d(v) { this.u = v }

  /**
   * 左边距（短键 m），默认 3
   *
   * padding left (short key `m`), 3 by default.
   *
   * @default 3
   */
  m: number = 3;
  /**
   * 左边距，m 的别名
   *
   * The left padding, an alias of m.
   */
  get t_l() { return this.m }
  set t_l(v) { this.m = v }

  /**
   * 右边距（短键 n），默认 3
   *
   * padding right (short key `n`), 3 by default.
   *
   * @default 3
   */
  n: number = 3;
  /**
   * 右边距，n 的别名
   *
   * The right padding, an alias of n.
   */
  get t_r() { return this.n }
  set t_r(v) { this.n = v }

  /**
   * 上边距（短键 p），默认 3
   *
   * padding top (short key `p`), 3 by default.
   *
   * @default 3
   */
  p: number = 3;
  /**
   * 上边距，p 的别名
   *
   * The top padding, an alias of p.
   */
  get t_t() { return this.p }
  set t_t(v) { this.p = v }

  /**
   * 下边距（短键 q），默认 3
   *
   * padding bottom (short key `q`), 3 by default.
   *
   * @default 3
   */
  q: number = 3;
  /**
   * 下边距，q 的别名
   *
   * The bottom padding, an alias of q.
   */
  get t_b() { return this.q }
  set t_b(v) { this.q = v }


  /**
   * 拼好的 CSS font 串（字号带上 px）
   *
   * The assembled CSS font string (the size gets a px unit).
   */
  get font() {
    const arr = [...this.f_d];
    arr[3] = `${arr[3]}px`;
    return arr.join(' ')
  };
  /**
   * 字体风格（normal / italic / oblique）
   *
   * Font style (normal / italic / oblique).
   */
  get font_style() { return this.f_d[0] }
  /**
   * 字体变体（normal / small-caps）
   *
   * Font variant (normal / small-caps).
   */
  get font_variant() { return this.f_d[1] }
  /**
   * 字重（normal / bold / bolder / lighter 或数字）
   *
   * Font weight (normal / bold / bolder / lighter or a number).
   */
  get font_weight() { return this.f_d[2] }
  /**
   * 字号（设计单位 px），默认 24
   *
   * Font size (in design px), 24 by default.
   *
   * @default 24
   */
  get font_size() { return this.f_d[3] }
  /**
   * 字体家族，默认 'Simsum'
   *
   * Font family, 'Simsum' by default.
   *
   * @default 'Simsum'
   */
  get font_family() { return this.f_d[4] }
  set font_style(v) { this.f_d[0] = v }
  set font_variant(v) { this.f_d[1] = v }
  set font_weight(v) { this.f_d[2] = v }
  set font_size(v) { this.f_d[3] = v }
  set font_family(v) { this.f_d[4] = v }
  /**
   * 读入一份文本数据：短键与友好名（text / f_d / t_l / t_r / t_t / t_b）都认
   *
   * Reads a piece of text data: both the short keys and the friendly names (text / f_d /
   * t_l / t_r / t_t / t_b) are accepted.
   *
   * @param {Partial<TextData>} o 要读入的数据 / The data to read
   * @return {this} 本对象（便于链式调用）/ This instance (chainable)
   */
  override read(o: Partial<TextData>) {
    super.read(o)
    const {
      s = o.text,
      u = o.f_d,
      m = o.t_l,
      n = o.t_r,
      p = o.t_t,
      q = o.t_b,
    } = o

    if (isStr(s)) this.s = s;
    if (Array.isArray(u)) this.u = [...u];
    if (isNum(m)) this.m = m;
    if (isNum(n)) this.n = n;
    if (isNum(p)) this.p = p;
    if (isNum(q)) this.q = q;
    return this
  }
}

