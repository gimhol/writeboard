import { isNum, isStr } from "../../utils/helper";
import { ShapeEnum } from "../ShapeEnum";
import { IShapeData, ShapeData } from "../base";

export type TFontStyle = [
  'normal' | 'italic' | 'oblique',
  'normal' | 'small-caps',
  'normal' | 'bold' | 'bolder' | 'lighter' | number,
  number,
  string
]
export interface ITextData extends IShapeData {
  /** text */
  s: string;

  /** TFontStyle */
  u: TFontStyle;

  /** padding left */
  m: number;

  /** padding right */
  n: number;

  /** padding top */
  p: number;

  /** padding bottom */
  q: number;
}

export class TextData extends ShapeData implements ITextData {
  constructor() {
    super();
    this.type = ShapeEnum.Text;
    this.fillStyle = '#ff0000';
    this.strokeStyle = '';
    this.lineWidth = 0;
  }
  /** text */
  s: string = '';
  get text() { return this.s }
  set text(v) { this.s = v }

  /** TFontStyle */
  u: TFontStyle = ['normal', 'normal', 'normal', 24, 'Simsum']
  get f_d() { return this.u }
  set f_d(v) { this.u = v }

  /** padding left */
  m: number = 3;
  get t_l() { return this.m }
  set t_l(v) { this.m = v }

  /** padding right */
  n: number = 3;
  get t_r() { return this.n }
  set t_r(v) { this.n = v }

  /** padding top */
  p: number = 3;
  get t_t() { return this.p }
  set t_t(v) { this.p = v }

  /** padding bottom */
  q: number = 3;
  get t_b() { return this.q }
  set t_b(v) { this.q = v }


  get font() {
    const arr = [...this.f_d];
    arr[3] = `${arr[3]}px`;
    return arr.join(' ')
  };
  get font_style() { return this.f_d[0] }
  get font_variant() { return this.f_d[1] }
  get font_weight() { return this.f_d[2] }
  get font_size() { return this.f_d[3] }
  get font_family() { return this.f_d[4] }
  set font_style(v) { this.f_d[0] = v }
  set font_variant(v) { this.f_d[1] = v }
  set font_weight(v) { this.f_d[2] = v }
  set font_size(v) { this.f_d[3] = v }
  set font_family(v) { this.f_d[4] = v }
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

