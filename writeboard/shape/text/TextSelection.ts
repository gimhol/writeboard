/**
 * 文本选区：用两个字符下标描述（末位不含）
 *
 * A text selection: described by two character indexes (the end is exclusive).
 */
export interface ITextSelection {
  /**
   * 选区起点下标，-1 表示没有选区
   *
   * Start index of the selection, -1 while there is no selection.
   */
  start: number
  /**
   * 选区终点下标（不含），-1 表示没有选区
   *
   * End index of the selection (exclusive), -1 while there is no selection.
   */
  end: number
}
/**
 * 文本选区的默认实现
 *
 * Default implementation of the text selection.
 */
export class TextSelection implements ITextSelection {
  /**
   * 选区起点下标，-1 表示没有选区
   *
   * Start index of the selection, -1 while there is no selection.
   *
   * @default -1
   */
  start: number = -1;
  /**
   * 选区终点下标（不含），-1 表示没有选区
   *
   * End index of the selection (exclusive), -1 while there is no selection.
   *
   * @default -1
   */
  end: number = -1;
  /**
   * 建一个文本选区
   *
   * Builds a text selection.
   *
   * @param {number} [start=-1] 起点下标 / The start index
   * @param {number} [end=-1] 终点下标（不含）/ The end index (exclusive)
   */
  constructor(start: number = -1, end: number = -1) {
    this.start = start;
    this.end = end;
  }
  /**
   * 两个选区是否完全相同
   *
   * Whether two selections are exactly the same.
   *
   * @param {ITextSelection} other 待比较的选区 / The selection to compare with
   * @return {boolean} 两个下标都相同时为 true / True while both indexes are equal
   */
  equal(other: ITextSelection) {
    return this.start === other.start && this.end === other.end;
  }
}
