import { View } from "./View";

export class TextInput extends View<'input'>{
  protected _onChange?: (self: TextInput) => void;
  onChange(v: (self: TextInput) => void) { this._onChange = v; }

  get value() { return this.inner.value; }
  set value(v) { this.inner.value = v; }
  constructor() {
    super('input');
    this.inner.type = 'text';
    this.inner.addEventListener('input', () => this._onChange?.(this));
  }
}
export class NumberInput extends TextInput {

  onChange(v: (self: NumberInput) => void) { this._onChange = v as any; }
  setNum(v: number) { this.num = v; }
  get num() { return Number(this.inner.value); }
  set num(v) { this.value = '' + v }
  get max() { return this.inner.max === '' ? null : Number(this.inner.max) }
  set max(v) { this.inner.max = null === v ? '' : ('' + v) }
  get min() { return this.inner.min === '' ? null : Number(this.inner.min) }
  set min(v) { this.inner.min = null === v ? '' : ('' + v) }
  get value() { return this.inner.value; }
  set value(v) { this.inner.value = v; }
  constructor() {
    super();
    this.inner.type = 'number';
  }
}