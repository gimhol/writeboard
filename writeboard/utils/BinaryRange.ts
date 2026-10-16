/**
 * 一维数值区间：闭区间 [from, to]
 *
 * A one-dimensional numeric range: the closed interval [from, to].
 */
export interface IBinaryRange {
  /**
   * 区间起点（数值较小的一端）
   *
   * Start of the range (the smaller end).
   */
  from: number;
  /**
   * 区间终点（数值较大的一端）
   *
   * End of the range (the larger end).
   */
  to: number;
}
/**
 * 可复用的数值区间对象：空间索引树用它表示每个节点覆盖的范围（按中点二分）
 *
 * A reusable numeric range object: the spatial index trees use it to describe the
 * extent a node covers (splitting it in half at the middle point).
 */
export class BinaryRange implements IBinaryRange {
  /**
   * 区间起点
   *
   * Start of the range.
   */
  from: number;
  /**
   * 区间终点
   *
   * End of the range.
   */
  to: number;
  /**
   * 按起终点建一个区间
   *
   * Builds a range from its start and its end.
   *
   * @param {number} f 区间起点 / Start of the range
   * @param {number} t 区间终点 / End of the range
   */
  constructor(f: number, t: number) {
    this.from = f;
    this.to = t;
  }
  /**
   * 读入另一个区间的 from / to，覆盖自身的
   *
   * Reads the from / to of another range and overwrites this one's.
   *
   * @param {IBinaryRange} range 源区间 / Source range
   */
  set(range: IBinaryRange) {
    this.from = range.from
    this.to = range.to
  }
  /**
   * 区间中点
   *
   * Middle point of the range.
   *
   * @return {number} 起终点的平均值 / Average of the start and the end
   */
  get mid() {
    return (this.from + this.to) / 2
  }
  /**
   * 判断两个区间是否相交（端点相触也算相交）
   *
   * Whether two ranges overlap (touching endpoints count as overlapping).
   *
   * @param {IBinaryRange} other 另一个区间 / The other range
   * @return {boolean} 相交时返回 true / True when they overlap
   */
  hit(other: IBinaryRange) {
    return !(this.from > other.to) && !(this.to < other.from)
  }
}
