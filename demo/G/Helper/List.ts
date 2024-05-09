
export class List<T> extends Array<T> {
  get size() { return this.length; }
  remove(element: T): this {
    return this.delete(element);
  }
  delete(element: T): this {
    const index = this.indexOf(element);
    index >= 0 && this.splice(index, 1);
    return this;
  }
  add(element: T): this {
    this.push(element);
    return this;
  }
  insert(index: number, element: T): this {
    this.splice(index, 0, element);
    return this;
  }
  findR<S extends T>(predicate: (value: T, index: number, obj: List<T>) => value is S, thisArg?: any): S | undefined;
  findR(predicate: (value: T, index: number, obj: List<T>) => unknown, thisArg?: any): T | undefined;
  findR(predicate: any, thisArg?: unknown): any | undefined {
    for (let i = this.length - 1; i >= 0; --i) {
      if (predicate(this[i], i, this)) {
        return this[i]
      }
    }
    return undefined;
  }
  override forEach(callbackfn: (value: T, index: number, array: List<T>) => void, thisArg?: any): this {
    super.forEach(callbackfn as any);
    return this;
  }
}
