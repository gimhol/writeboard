import { Style } from "./StyleType";
import { View } from "./View";
import { ReValue } from "./utils";

export class TextInput extends View<'input'>{
  protected _onChange?: (self: TextInput) => void;
  private _prevStyleNames?: string;
  onChange(v: (self: TextInput) => void) { this._onChange = v; }

  get disabled() { return this.inner.disabled; }
  set disabled(v) { this.inner.disabled = v; }
  get value() { return this.inner.value; }
  set value(v) { this.inner.value = v; }
  focus() { this.inner.focus() }
  blur() { this.inner.blur() }
  constructor() {
    super('input');
    this.focusOb;
    this.hoverOb;
    this.inner.type = 'text';
    this.inner.addEventListener('input', () => this._onChange?.(this));
  }
  updateStyle() {
    const styleName = `${this.hover}_${this.focused}_${this.disabled}`
    this.styles().remove(this._prevStyleNames!).add(styleName).refresh();
    this._prevStyleNames = styleName;
  }
  editStyle(hover: boolean, focused: boolean, disabled: boolean, style: ReValue<Style>) {
    this.styles().register(`${hover}_${focused}_${disabled}`, style);
    return this;
  }
  override onHover(hover: boolean): void {
    this.updateStyle();
  }
  override onFocus(focused: boolean): void {
    this.updateStyle();
  }
}

export class NumberInput extends TextInput {
  override onChange(v: (self: NumberInput) => void) { this._onChange = v as any; }
  setNum(v: number) { this.num = v; }
  get num() { return Number(this.inner.value); }
  set num(v) { this.value = '' + v }
  get max() { return this.inner.max === '' ? null : Number(this.inner.max) }
  set max(v) { this.inner.max = null === v ? '' : ('' + v) }
  get min() { return this.inner.min === '' ? null : Number(this.inner.min) }
  set min(v) { this.inner.min = null === v ? '' : ('' + v) }
  override get value() { return this.inner.value; }
  override set value(v) { this.inner.value = v; }
  constructor() {
    super();
    this.inner.type = 'number';
  }
}