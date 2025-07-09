import { Line, type ILine } from "./Line";
import type { IVector } from "./IVector";

export class LineSegment extends Line {
  toString() {
    return `LineSegment(x0=${this.x0}, y0=${this.x0}, x1=${this.x1}, y1=${this.y1})`;
  }
  static create(line: ILine) {
    return new LineSegment(line.x0, line.y0, line.x1, line.y1);
  }

  static intersection(a_x0: number, a_y0: number, a_x1: number, a_y1: number, b_x0: number, b_y0: number, b_x1: number, b_y1: number): IVector | null {
    const denominator = (a_x0 - a_x1) * (b_y0 - b_y1) - (a_y0 - a_y1) * (b_x0 - b_x1);

    // 如果分母为0，表示线段平行或共线
    if (denominator === 0) {
      return null;
    }
    const t = ((a_x0 - b_x0) * (b_y0 - b_y1) - (a_y0 - b_y0) * (b_x0 - b_x1)) / denominator;
    const s = ((a_x0 - b_x0) * (a_y0 - a_y1) - (a_y0 - b_y0) * (a_x0 - a_x1)) / denominator;

    if (t < 0 || t > 1 || s < 0 || s > 1)
      return null;

    const x = a_x0 + t * (a_x1 - a_x0);
    const y = a_y0 + t * (a_y1 - a_y0);
    return { x, y };
  }
  static intersection2(a: ILine, b: ILine): IVector | null {
    return LineSegment.intersection(a.x0, a.y0, a.x1, a.y1, b.x0, b.y0, b.x1, b.y1);
  }
}
