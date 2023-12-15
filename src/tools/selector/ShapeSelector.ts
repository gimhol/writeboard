import { ResizeDirection, Shape, ShapeData, ShapeRect } from "../../shape";
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

interface Target {
  shape: Shape;
  midX: number;
  midY: number;
  rotation: number;
  distance: number;
  degree: number;
}
export class ShapePicking extends ShapeRect {
  private _targets: Target[] = [];
  private _geo = new Rect(
    Number.MAX_VALUE,
    Number.MAX_VALUE,
    -Number.MAX_VALUE,
    -Number.MAX_VALUE,
  )
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

  reset(): void {
    this._targets = [];
    this.visible = false;
    this.rotateTo(0)
    this._geo.set({
      x: Number.MAX_VALUE,
      y: Number.MAX_VALUE,
      w: -Number.MAX_VALUE,
      h: -Number.MAX_VALUE,
    })
  }

  setTargets(shapes: Shape[]): void {
    this.reset();
    const geo = this._geo;
    this._targets = []
    for (let i = 0, len = shapes.length; i < len; ++i) {
      const shape = shapes[i]
      const {
        rotatedTopLeft: a, rotatedTopRight: b,
        rotatedBottomLeft: c, rotatedBottomRight: d,
        locked,
      } = shape;
      if (locked) continue;
      this._targets.push({
        shape,
        midX: shape.midX,
        midY: shape.midY,
        rotation: shape.rotation,
        degree: 0,
        distance: 0,
      });
      geo.left = Math.min(geo.left, a.x, b.x, c.x, d.x)
      geo.right = Math.max(geo.right, a.x, b.x, c.x, d.x)
      geo.top = Math.min(geo.top, a.y, b.y, c.y, d.y)
      geo.bottom = Math.max(geo.bottom, a.y, b.y, c.y, d.y)
    }
    const { x: mx, y: my } = geo.mid()
    for (let i = 0, len = this._targets.length; i < len; ++i) {
      const { midX: x, midY: y } = this._targets[i];
      const dx = x - mx;
      const dy = y - my;
      this._targets[i].distance = Math.sqrt(dx * dx + dy * dy);
      this._targets[i].degree = Math.atan2(dy, dx);
    }
    this.setGeo(geo);
    this.visible = true
  }

  override rotateTo(r: number): void {
    super.rotateTo(r)
    const { midX, midY } = this;
    for (let i = 0, len = this._targets.length; i < len; ++i) {
      const { shape, rotation, distance, degree } = this._targets[i];
      shape.rotateTo(rotation + r);
      const cr = Math.cos(r + degree);
      const sr = Math.sin(r + degree);

      shape.move(
        cr * distance + midX - shape.w / 2,
        sr * distance + midY - shape.h / 2
      )
    }
  }
}
