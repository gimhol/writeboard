import { isNum, isStr } from "../../utils/helper";
import { ShapeEnum } from "../ShapeEnum";
import { ShapeData } from "../base";

export class TextData extends ShapeData {
  constructor() {
    super();
    this.type = ShapeEnum.Text;
    this.fillStyle = '#ff0000';
    this.strokeStyle = '';
    this.lineWidth = 0;
  }
  text: string = '';
  f_d: [
    'normal' | 'italic' | 'oblique',
    'normal' | 'small-caps',
    'normal' | 'bold' | 'bolder' | 'lighter' | number,
    number,
    string
  ] = ['normal', 'normal', 'normal', 24, 'Simsum'];
  t_l: number = 3;
  t_r: number = 3;
  t_t: number = 3;
  t_b: number = 3;
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
    if (isStr(o.text)) this.text = o.text;
    if (Array.isArray(o.f_d)) this.f_d = [...o.f_d];
    if (isNum(o.t_l)) this.t_l = o.t_l;
    if (isNum(o.t_r)) this.t_r = o.t_r;
    if (isNum(o.t_t)) this.t_t = o.t_t;
    if (isNum(o.t_b)) this.t_b = o.t_b;
    return this
  }
}

