export interface IBinaryRange {
  from: number;
  to: number;
}
export class BinaryRange implements IBinaryRange {
  from: number;
  to: number;
  constructor(f: number, t: number) {
    this.from = f;
    this.to = t;
  }
  set(range: IBinaryRange) {
    this.from = range.from
    this.to = range.to
  }
  get mid() {
    return (this.from + this.to) / 2
  }
  hit(other: IBinaryRange) {
    return !(this.from > other.to) && !(this.to < other.from)
  }
}
