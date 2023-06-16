import { View } from "./View";
export enum InputStyleNames {
  Normal = 'normal',
  Focused = 'focused',
  Hover = 'hover',
  Disabled = 'disabled',
};
export class TextInput extends View<'input'>{
  protected _onChange?: (self: TextInput) => void;
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
    this.styles
      .register(InputStyleNames.Focused)
      .register(InputStyleNames.Hover)
      .register(InputStyleNames.Disabled)
      .apply(InputStyleNames.Normal, { transition: 'all 200ms' });
    this.inner.type = 'text';
    this.inner.addEventListener('input', () => this._onChange?.(this));
    this.inner.addEventListener('keydown', e => e.key === 'Enter' && this.blur());
    const ob = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'disabled') {
          this.updateStyle();
        }
      })
    })
    ob.observe(this.inner, { attributes: true })
  }
  updateStyle() {
    const styles = this.styles;
    if (this.disabled) {
      styles.add(InputStyleNames.Disabled);
      styles.del(InputStyleNames.Focused, InputStyleNames.Hover);
    } else {
      if (this.focused) {
        styles.add(InputStyleNames.Focused);
      } else {
        styles.del(InputStyleNames.Focused);
      }
      if (this.hover) {
        styles.add(InputStyleNames.Hover);
      } else {
        styles.del(InputStyleNames.Hover);
      }
    }
    styles.refresh();
  }
  override onHover(hover: boolean): void {
    this.updateStyle();
  }
  override onFocus(focused: boolean): void {
    this.updateStyle();
  }
}