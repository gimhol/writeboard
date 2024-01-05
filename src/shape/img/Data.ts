import { isNum, isStr } from "../../utils/helper";
import { ShapeEnum } from "../ShapeEnum";
import { IShapeData, ShapeData } from "../base";

export enum ObjectFit {
  Fill = 0,
  Contain = 1,
  Cover = 2,
}
export interface IImgData extends IShapeData {
  /** src */
  s?: string;

  /** objectFit */
  f?: ObjectFit;
}

export class ImgData extends ShapeData {
  s?: string;
  f?: ObjectFit;

  get src() { return this.s ?? ''; }

  set src(v) { if (!v) { delete this.s } else this.s = v; }

  get objectFit() { return this.f ?? ObjectFit.Fill; }

  set objectFit(v) { this.f = v; }

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

  override read(other: Partial<ImgData>): this {
    super.read(other);
    if (isStr(other.s)) this.s = other.s;
    if (isNum(other.f)) this.f = other.f;
    return this;
  }
}

