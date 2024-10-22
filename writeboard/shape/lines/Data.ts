import { ShapeEnum } from "../ShapeEnum"
import { IShapeData, ShapeData } from "../base"

export interface ILinesData extends IShapeData {
  /** coords */
  u: number[]
}
export class LinesData extends ShapeData implements ILinesData {
  u: number[] = []

  get coords(): number[] { return this.u }
  set coords(v: number[]) { this.u = v }

  override get needFill(): boolean {
    return false;
  }
  constructor(other?: Partial<LinesData>) {
    super(other)
    this.type = ShapeEnum.Lines;
    this.strokeStyle = '#ff0000';
    this.lineCap = 'round';
    this.lineJoin = 'round';
    this.lineWidth = 2;
    if (other) this.read(other)
  }
  override read(other: Partial<LinesData>) {
    super.read(other)
    const { coords } = other
    const { u = coords } = other
    if (Array.isArray(u)) this.coords = [...u]
    return this
  }
  override merge(other: Partial<LinesData>) {
    super.read(other)
    const { coords } = other
    const { u = coords } = other
    if (Array.isArray(u)) this.coords = [...u]
    return this
  }
}
