import { Resizable, Shape, ShapeData, ShapeRect } from "../../shape";
import { Rect, type IDot } from "../../utils";
import { type IShapeGroupMember } from "./IShapeGroupMember";
const { min, max } = Math
export class ShapeGroup extends ShapeRect {
  private _members: IShapeGroupMember[] = [];
  private _geo = new Rect(
    Number.MAX_SAFE_INTEGER,
    Number.MAX_SAFE_INTEGER,
    Number.MIN_SAFE_INTEGER,
    Number.MIN_SAFE_INTEGER,
  );
  constructor() {
    super(new ShapeData);
    this.data.selected = true;
    this.data.visible = false;
    this.data.strokeStyle = '';
    this.data.fillStyle = ''
    this.data.lineWidth = 0;
    this.resizable = Resizable.None;
  }

  hit(dot: IDot): [Resizable, Rect | undefined] | null {
    if (!this.visible) return null;
    const d = this.map2me(dot.x, dot.y).plus(this.data);
    if (!this.getGeo().hit(d)) return null;
    return this.resizableDirection(dot.x, dot.y);
  }

  reset(): void {
    this._members = [];
    this.visible = false;
    this._geo.x = Number.MAX_SAFE_INTEGER;
    this._geo.y = Number.MAX_SAFE_INTEGER;
    this._geo.w = Number.MIN_SAFE_INTEGER;
    this._geo.h = Number.MIN_SAFE_INTEGER;
    this.rotateTo(0);
  }

  setMembers(shapes: Shape[]): void {
    this.reset();

    const rotation = this.data.rotation;
    this._members.length = 0;
    const geo = this._geo;
    for (const s of shapes) {
      if (s.locked) continue;
      this._members.push({ shape: s, rotation: s.rotation - rotation });
      const { x, y, w, h } = s.aabb()
      geo.left = min(geo.left, x);
      geo.right = max(geo.right, x + w);
      geo.top = min(geo.top, y);
      geo.bottom = max(geo.bottom, y + h);
    }
    if (!this._members.length) {
      geo.left
    }
    this.setGeo(geo);
    this.visible = !!this._members.length;
  }

  override rotateTo(r: number, x?: number, y?: number): void {
    super.rotateTo(r, x, y);
    for (const { shape, rotation } of this._members) {
      shape.rotateTo(r + rotation, x ?? this.midX, y ?? this.midY);
    }
  }
}
