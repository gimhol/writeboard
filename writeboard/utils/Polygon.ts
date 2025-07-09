import { IPolygon } from "./IPolygon";
import { IRotatedRect } from "./IRotatedRect";
import { Rect } from "./Rect";
import { RotatedRect } from "./RotatedRect";
import { Vector } from "./Vector";
import { IVector } from "./IVector";
import { LineSegment } from "./LineSegment";

export class Polygon implements IPolygon {
  dots: Vector[];
  constructor(dots: IVector[] = []) {
    this.dots = dots.map(dot => Vector.create(dot))
  }
  read(o: IPolygon): this {
    this.dots = o.dots.map(dot => Vector.create(dot));
    return this;
  }
  toString(): string {
    return `Polygon(dots.length=${this.dots.length})`
  }
  static from_rect(rect: IRotatedRect): Polygon {
    const R = rect.r ? RotatedRect : Rect
    return new Polygon(R.ensure(rect).dots)
  }
  static intersect_linesegment(polygon: IVector[], ax: number, ay: number, bx: number, by: number): IVector | null {
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const a = polygon[j];
      const b = polygon[i];
      const dot = LineSegment.intersection(a.x, a.y, b.x, b.y, ax, ay, bx, by);
      if (dot) return dot;
    }
    return null
  }
  static contain_dot(polygon: IVector[], d: IVector) {
    return this.contain_dot2(polygon, d.x, d.y);
  }
  static contain_dot2(polygon: IVector[], x: number, y: number) {
    let inside = false;

    // 遍历多边形的每条边
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const a = polygon[j];
      const b = polygon[i];

      // 检查点是否在边的端点上
      if (Vector.equal2(a.x, a.y, x, y) || Vector.equal2(b.x, b.y, x, y)) {
        return true; // 点在顶点上
      }

      // 判断射线与边是否相交
      const intersect = ((b.y > y) !== (a.y > y)) && (x < (a.x - b.x) * (y - b.y) / (a.y - b.y) + b.x);

      if (intersect) inside = !inside;
    }

    return inside;
  }
}
