import { View } from "../../BaseView/View";

export class SubwinFooter extends View<'div'> {
  constructor() {
    super('div');
    this.styles.addCls('g_subwin_footer')
  }
}
