import { View } from "./View";

export class SubwinFooter extends View<'div'> {
  constructor() {
    super('div');
    this.styleHolder().applyStyle('normal', {
      userSelect: 'none',
      width: '100%',
      color: '#FFFFFF88',
      padding: '3px',
      background: '#333333',
      borderBottom: '#333333',
      display: 'flex',
      boxSizing: 'border-box',
      alignItems: 'center',
    })
  }
}
