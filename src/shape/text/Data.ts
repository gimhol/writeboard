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
  override copyFrom(other: Partial<TextData>) {
    super.copyFrom(other)
    if (typeof other.text === 'string') this.text = other.text;
    if (Array.isArray(other.f_d)) this.f_d = [...other.f_d];
    if (typeof other.t_l === 'number') this.t_l = other.t_l;
    if (typeof other.t_r === 'number') this.t_r = other.t_r;
    if (typeof other.t_t === 'number') this.t_t = other.t_t;
    if (typeof other.t_b === 'number') this.t_b = other.t_b;
    return this
  }
  override copy(): TextData {
    return new TextData().copyFrom(this)
  }
}

