export class Shiftable<D> {
  private _list: D[];
  private _i: number = -1;
  constructor(list: D[]) {
    this._list = list;
  }
  set(list: D[]): this {
    this._list = list;
    return this;
  }
  next(): D | undefined {
    this._i = (this._i + 1) % this._list.length;
    return this._list[this._i];
  }
}
