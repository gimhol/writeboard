import { ShapeEnum } from "../ShapeEnum";
import { ShapeData } from "../base";

export enum ObjectFit {
  Fill = 0,
  Contain = 1,
  Cover = 2,
}
export class ImgData extends ShapeData {
  // src: string = 'http://download.niushibang.com/tvzwLPPzgRqnab818f2c19e1b1aefa67e9682fec5a77.jpg';
  s: string = 'http://download.niushibang.com/niubo/wx/message/93482af6-597e-4d96-b91d-498222adcfaa/1686551265158.png';
  f?: ObjectFit;

  get src() {
    return this.s;
  }

  set src(v) {
    this.s = v;
  }

  get objectFit() {
    return this.f ?? ObjectFit.Fill;
  }

  set objectFit(v) {
    this.f = v;
  }

  override get needFill(): boolean {
    return false;
  }

  override get needStroke(): boolean {
    return false;
  }
  
  constructor() {
    super()
    this.type = ShapeEnum.Img;
  }

  override copyFrom(other: Partial<ImgData>): this {
    super.copyFrom(other);
    if (typeof other.s === 'string') this.s = other.s;
    if (typeof other.f === 'number') this.f = other.f;

    return this;
  }
}

