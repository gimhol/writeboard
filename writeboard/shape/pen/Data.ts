import { ShapeEnum } from "../ShapeEnum"
import { IShapeData, ShapeData } from "../base"
export enum ChangeType {
  Invalid = 0,
  All = 1,
  Append = 2,
  Subtract = 3,
}
export interface IPenData extends IShapeData {
  /** ChangeType */
  v: ChangeType;

  /** coords */
  u: number[];
}
export class PenData extends ShapeData implements IPenData {
  v: ChangeType = ChangeType.All
  u: number[] = []

  get dotsType(): ChangeType { return this.v }
  set dotsType(v: ChangeType) { this.v = v }

  get coords(): number[] { return this.u }
  set coords(v: number[]) { this.u = v }
  override get needFill(): boolean {
    return false;
  }
  constructor(other?: Partial<PenData>) {
    super(other)
    this.type = ShapeEnum.Pen
    this.strokeStyle = '#ff0000'
    this.lineCap = 'round'
    this.lineJoin = 'round'
    this.lineWidth = 3
    other && this.read(other)
  }
  override read(other: Partial<PenData>) {
    super.read(other)

    const { u = other.coords, v = other.dotsType } = other
    if (v) this.dotsType = v
    if (Array.isArray(u)) this.coords = [...u]
    return this
  }

  override merge(other: Partial<PenData>) {
    super.read(other)

    const { u = other.coords } = other
    if (!Array.isArray(u)) {
      return this
    }
    switch (other.dotsType) {
      case ChangeType.Subtract:
        this.coords = this.coords.slice(0, -u.length);
        break;
      case ChangeType.Append:
        this.coords.push(...u);
        break;
      default:
        this.coords = [...u];
        break;
    }
    return this
  }
}
