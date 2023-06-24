import { Button, ButtonInits } from "../../BaseView/Button";
import { SizeType } from "../../BaseView/SizeType";
import { CssPosition } from "../../BaseView/StyleType";
import { View } from "../../BaseView/View";

class HeaderButton extends Button {
  constructor() {
    super();
  }
  override init(inits?: ButtonInits | undefined): this {
    super.init({ ...inits, size: SizeType.Small });
    this.styles.addCls('g_workspace_header_btn');
    return this;
  }
}
export default class HeaderView extends View<'div'>{
  constructor() {
    super('div');
    this.styles.apply('', {
      background: 'black',
      display: 'flex',
      position: CssPosition.Absolute,
      left: 0,
      right: 0,
      top: 0,
      height: 30,
      alignItems: 'center'
    })
    this.addChild(new HeaderButton().init({ content: 'File' }))
    this.addChild(new HeaderButton().init({ content: 'Edit' }))
    this.addChild(new HeaderButton().init({ content: 'View' }))
  }
}