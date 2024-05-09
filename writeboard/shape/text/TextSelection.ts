export interface ITextSelection {
  start: number
  end: number
}
export class TextSelection implements ITextSelection {
  start: number = -1;
  end: number = -1;
  constructor(start: number = -1, end: number = -1) {
    this.start = start;
    this.end = end;
  }
  equal(other: ITextSelection) {
    return this.start === other.start && this.end === other.end;
  }
}
