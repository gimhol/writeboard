import { isNum, isStr } from "../../utils/helper";
import { ShapeEnum } from "../ShapeEnum";
import { IShapeData, ShapeData } from "../base";

/**
 * 图片的适配方式（对应 CSS 的 object-fit）
 *
 * How the image fits into the shape (the same idea as the CSS object-fit).
 */
export enum ObjectFit {
  /**
   * 拉伸铺满：不保持宽高比
   *
   * Stretched to fill: the aspect ratio is not kept.
   */
  Fill = 0,
  /**
   * 完整显示：保持宽高比，多余的边留空
   *
   * Fully shown: the aspect ratio is kept and the extra space stays empty.
   */
  Contain = 1,
  /**
   * 裁剪铺满：保持宽高比，多出来的部分被裁掉
   *
   * Cropped to fill: the aspect ratio is kept and the extra part is cut off.
   */
  Cover = 2,
}
/**
 * 图片数据：除公共字段外只有一个图片地址与适配方式
 *
 * Image data: beyond the common fields it only holds the image source and the fit mode.
 */
export interface IImgData extends IShapeData {
  /**
   * 图片地址（短键 s）
   *
   * src (short key `s`)
   */
  s?: string;

  /**
   * 图片适配方式（短键 f）
   *
   * objectFit (short key `f`)
   */
  f?: ObjectFit;
}

/**
 * 图片数据的默认实现
 *
 * Default implementation of the image data.
 */
export class ImgData extends ShapeData {
  /**
   * 图片地址（短键 s）
   *
   * Image source (short key `s`).
   */
  s?: string;
  /**
   * 图片适配方式（短键 f）
   *
   * How the image fits into the shape (short key `f`).
   */
  f?: ObjectFit;

  /**
   * 图片地址，未设置时为空串
   *
   * The image source, an empty string while it is not set.
   *
   * @default ''
   */
  get src() { return this.s ?? ''; }

  /**
   * 设置图片地址，传空值则清掉
   *
   * Sets the image source; an empty value clears it.
   */
  set src(v) { if (!v) { delete this.s } else this.s = v; }

  /**
   * 图片适配方式，未设置时为 ObjectFit.Fill
   *
   * How the image fits into the shape, ObjectFit.Fill while it is not set.
   *
   * @default ObjectFit.Fill
   */
  get objectFit() { return this.f ?? ObjectFit.Fill; }

  /**
   * 设置图片适配方式
   *
   * Sets how the image fits into the shape.
   */
  set objectFit(v) { this.f = v; }

  /**
   * 图片不需要填充
   *
   * An image is never filled.
   *
   * @default false
   */
  override get needFill(): boolean {
    return false;
  }

  /**
   * 图片不需要描边
   *
   * An image is never stroked.
   *
   * @default false
   */
  override get needStroke(): boolean {
    return false;
  }

  /**
   * 建一份图片数据，类型固定为 ShapeEnum.Img
   *
   * Builds image data; the type is always ShapeEnum.Img.
   *
   * @param {Partial<ImgData>} [other] 初始数据 / The initial data
   */
  constructor(other?: Partial<ImgData>) {
    super()
    this.type = ShapeEnum.Img;
    other && this.read(other);
  }

  /**
   * 读入一份图片数据：只取传进来的字段
   *
   * Reads a piece of image data: only the given fields are taken.
   *
   * @param {Partial<ImgData>} other 要读入的数据 / The data to read
   * @return {this} 本对象（便于链式调用）/ This instance (chainable)
   */
  override read(other: Partial<ImgData>): this {
    super.read(other);
    if (isStr(other.s)) this.s = other.s;
    if (isNum(other.f)) this.f = other.f;
    return this;
  }
}

