import { ResizeDirection, Shape, ShapeData, ShapeRect } from "../../shape";
import { Numbers } from "../../utils";
import { IDot } from "../../utils/Dot";
import { Rect } from "../../utils/Rect";

export class ShapeSelector extends ShapeRect {
  constructor() {
    super(new ShapeData);
    this.data.lineWidth = 2
    this.data.strokeStyle = '#003388FF'
    this.data.fillStyle = '#00338855'
    this.data.ghost = true;
  }
}

export class ShapePicking extends ShapeRect {
  private _targets: Shape<ShapeData>[] = [];
  private _rotations: { mx: number, my: number, r: number }[] = [];

  constructor() {
    super(new ShapeData);
    this.data.selected = true;
  }
  hit(dot: IDot): [ResizeDirection, Rect | undefined] | null {
    if (!this.visible) return null;
    const d = this.map2me(dot.x, dot.y).plus(this.data)
    if (!this.getGeo().hit(d)) return null
    return this.resizeDirection(d.x, d.y);
  }
  follow(shapes: Shape[]): boolean {
    let count = 0;
    const geo = new Rect(
      Number.MAX_VALUE,
      Number.MAX_VALUE,
      -Number.MAX_VALUE,
      -Number.MAX_VALUE,
    );
    this._targets = []
    this._rotations = []
    for (let i = 0, len = shapes.length; i < len; ++i) {
      const v = shapes[i]
      const {
        rotatedTopLeft: a, rotatedTopRight: b,
        rotatedBottomLeft: c, rotatedBottomRight: d,
        locked,
      } = v
      if (locked) continue;
      this._targets.push(v);
      this._rotations.push({ mx: v.midX, my: v.midY, r: v.rotation });
      geo.left = Math.min(geo.left, a.x, b.x, c.x, d.x)
      geo.right = Math.max(geo.right, a.x, b.x, c.x, d.x)
      geo.top = Math.min(geo.top, a.y, b.y, c.y, d.y)
      geo.bottom = Math.max(geo.bottom, a.y, b.y, c.y, d.y)
      ++count;
    }
    this.setGeo(geo);
    this.visible = count > 1;
    return count > 1
  }
  override rotateTo(r: number): void {
    super.rotateTo(r)
    const { midX, midY } = this;
    for (let i = 0, len = this._targets.length; i < len; ++i) {
      const d = this._rotations[i];
      const t = this._targets[i];

      t.rotateTo(d.r + r);
      const dx = midX - d.mx;
      const dy = midY - d.my;
      if (Numbers.equals(dx, 0) && Numbers.equals(dy, 0)) continue;
      const rr = r - Math.atan2(dy, dx);
      const cr = Math.cos(rr);
      const sr = Math.sin(rr);
      t.move(
        dx * cr - dy * sr + midX - t.w / 2,
        dx * sr + dy * cr + midY - t.h / 2
      )
    }

    // console.log(Numbers.equals(x, this.midX), Numbers.equals(y, this.midY))
    // this._targets.forEach(v => !v.locked && v.rotateTo(r, x, y))
  }
}
