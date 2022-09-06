import { ShapeEnum } from "../ShapeEnum";
import { ShapeData } from "../base";

export class TextData extends ShapeData {
  constructor() {
    super()
    this.type = ShapeEnum.Text
    this.fillStyle = 'white'
    this.strokeStyle = ''
    this.lineWidth = 0
  }
  text: string = ''
  font: string = '24px Simsum'
  t_l: number = 3
  t_r: number = 3
  t_t: number = 3
  t_b: number = 3

  override copyFrom(other: Partial<TextData>) {
    super.copyFrom(other)
    if (typeof other.text === 'string') this.text = other.text
    if (typeof other.font === 'string') this.font = other.font
    if (typeof other.t_l === 'number') this.t_l = other.t_l
    if (typeof other.t_r === 'number') this.t_r = other.t_r
    if (typeof other.t_t === 'number') this.t_t = other.t_t
    if (typeof other.t_b === 'number') this.t_b = other.t_b
    return this
  }
  override copy(): TextData {
    return new TextData().copyFrom(this)
  }
}

