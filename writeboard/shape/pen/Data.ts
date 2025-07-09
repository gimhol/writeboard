import { IVector, Rect, Vector } from "../../utils";
import { ShapeEnum } from "../ShapeEnum";
import { IShapeData, ShapeData } from "../base";
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

  private _src_rect = new Rect(0, 0, 0, 0)

  get src_rect(): Readonly<Rect> { return this._src_rect }
  get dotsType(): ChangeType { return this.v }
  set dotsType(v: ChangeType) { this.v = v }

  get coords(): Readonly<number[]> { return this.u }
  set coords(v: number[]) {
    this.u = v;
    this.reset_src_rect(this.u);
  }

  add_coords(v: number[]): this {
    if (!v.length) return this;
    const empty = !this.u.length
    this.u.push(...v);
    if (empty) this.reset_src_rect(v)
    else this.expand_src_rect(v)
    return this;
  }

  del_coords(start: number, deleteCount: number): number[] {
    const ret = this.u.splice(start, deleteCount)
    this.reset_src_rect(this.u);
    return ret;
  }

  reset_src_rect(u: Readonly<number[]> = this.coords): Readonly<Rect> {
    if (!u.length) {
      this._src_rect.x = 0
      this._src_rect.y = 0
      this._src_rect.w = -1
      this._src_rect.h = -1
      return this._src_rect
    }
    this._src_rect.x = u[0]
    this._src_rect.y = u[1]
    this._src_rect.w = 0
    this._src_rect.h = 0
    return this.expand_src_rect(u)
  }
  expand_src_rect(u: Readonly<number[]>): Readonly<Rect> {
    let src_r = this._src_rect.right;
    let src_b = this._src_rect.bottom;
    for (let i = 0; i < u.length; i += 2) {
      this._src_rect.x = Math.min(u[i + 0], this._src_rect.x)
      this._src_rect.y = Math.min(u[i + 1], this._src_rect.y)
      src_r = Math.max(u[i + 0], src_r)
      src_b = Math.max(u[i + 1], src_b)
    }
    this._src_rect.right = src_r
    this._src_rect.bottom = src_b
    return this._src_rect;
  }

  get coords2world(): number[] {
    const { rotation = 0, u } = this;
    const src_rect = this.reset_src_rect()
    const { x: mx, y: my } = src_rect.mid()
    const dot_on_world = (x: number, y: number): IVector => {
      const ret = Vector.rotated2(x, y, mx, my, rotation)
      ret.x -= src_rect.x - this.x
      ret.y -= src_rect.y - this.y
      return ret;
    }
    const ret: number[] = []
    for (let i = 0; i < u.length; i += 2) {
      const { x, y } = dot_on_world(u[i], u[i + 1])
      ret.push(x, y)
    }
    return ret;
  }

  override get needFill(): boolean {
    return false;
  }
  constructor(other?: Partial<PenData>) {
    super()
    this.type = ShapeEnum.Pen
    this.strokeStyle = '#ff0000'
    this.lineCap = 'round'
    this.lineJoin = 'round'
    this.lineWidth = 5
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
        this.add_coords(u);
        break;
      default:
        this.coords = [...u];
        break;
    }
    return this
  }
}
