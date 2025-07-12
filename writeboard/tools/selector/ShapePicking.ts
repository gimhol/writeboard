import { Resizable, ResizeDirection, Shape, ShapeData, ShapeRect } from "../../shape";
import { Rect, RotatedRect, type IDot } from "../../utils";
import { type IPickTarget } from "./IPickTarget";
const { min, max } = Math
export class ShapePicking extends ShapeRect {
  private _targets: IPickTarget[] = [];
  private _geo = new Rect(
    Number.MAX_VALUE,
    Number.MAX_VALUE,
    -Number.MAX_VALUE,
    -Number.MAX_VALUE
  );
  constructor() {
    super(new ShapeData);
    this.data.selected = true;
    this.data.visible = false;
    this.data.strokeStyle = '';
    this.resizable = Resizable.None;
  }

  hit(dot: IDot): [ResizeDirection, Rect | undefined] | null {
    if (!this.visible) return null;
    const d = this.map2me(dot.x, dot.y).plus(this.data);
    if (!this.getGeo().hit(d)) return null;
    return this.resizeDirection(d.x, d.y);
  }

  reset(): void {
    this._targets = [];
    this.visible = false;
    this._geo.x = Number.MAX_VALUE;
    this._geo.y = Number.MAX_VALUE;
    this._geo.w = -Number.MAX_VALUE;
    this._geo.h = -Number.MAX_VALUE;
    this.rotateTo(0);
  }

  setShapes(shapes: Shape[]): void {
    this.reset();
    const rotation = this.data.rotation;
    const geo = this._geo;
    this._targets = [];
    for (const s of shapes) {
      if (s.locked) continue;
      const [a, b, c, d] = RotatedRect.dots2(s.data)
      this._targets.push({ shape: s, rotation: s.rotation - rotation });
      geo.left = min(geo.left, a.x, b.x, c.x, d.x);
      geo.right = max(geo.right, a.x, b.x, c.x, d.x);
      geo.top = min(geo.top, a.y, b.y, c.y, d.y);
      geo.bottom = max(geo.bottom, a.y, b.y, c.y, d.y);
    }
    this.setGeo(geo);
    this.visible = true;
  }

  override rotateTo(r: number, x?: number, y?: number): void {
    super.rotateTo(r, x, y);

    for (const { shape, rotation } of this._targets) {
      shape.rotateTo(r + rotation, x ?? this.midX, y ?? this.midY);
    }
  }
}
