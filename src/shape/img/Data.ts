import { ShapeEnum } from "../ShapeEnum";
import { ShapeData } from "../base";

export enum ObjectFit {
  Fill = 0,
  Contain = 1,
  Cover = 2,
}
export class ImgData extends ShapeData {
  src: string = 'http://download.niushibang.com/tvzwLPPzgRqnab818f2c19e1b1aefa67e9682fec5a77.jpg';
  f?: ObjectFit;

  get objectFit() {
    return this.f ?? ObjectFit.Fill;
  }

  set objectFit(v) {
    this.f = v;
  }

  constructor() {
    super()
    this.type = ShapeEnum.Img;
  }
  override copy(): ImgData {
    return new ImgData().copyFrom(this)
  }
  override copyFrom(other: Partial<ImgData>): this {
    super.copyFrom(other);
    if (typeof other.src === 'string') this.src = other.src;
    if (typeof other.f === 'number') this.f = other.f;

    return this;
  }
}

