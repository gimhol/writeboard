import { ToolEnum, ToolType } from "../../dist";
import { SizeType } from "./G/BaseView/SizeType";
import { View } from "./G/BaseView/View";
import { IconButton, IconButtonInits } from "./G/CompoundView/IconButton";
import { Subwin } from "./G/CompoundView/Subwin";
import { ButtonGroup } from "./G/Helper/ButtonGroup";
export interface ToolButtonInits extends IconButtonInits {
  src: string;
  toolType: ToolType
}
export class ToolButton extends IconButton {
  private _toolType?: string;
  get toolType() { return this._toolType; }
  constructor() {
    super()
  }
  override init(inits?: ToolButtonInits | undefined): this {
    this._toolType = inits?.toolType;
    return super.init({
      ...inits,
      checkable: true,
      size: SizeType.Large
    })
  }
}
export class ToolsView extends Subwin {
  private _toolButtonGroup: ButtonGroup<ToolButton>;
  set onToolClick(v: (target: ToolButton) => void) {
    this._toolButtonGroup.onClick = v;
  }
  constructor() {
    super();
    this.header.title = 'tools';
    this.content = new View('div');
    this.content.styles.apply("", {
      flex: '1',
      overflowY: 'auto',
      overflowX: 'hidden'
    });
    const toolsBtns = [
      new ToolButton().init({ src: './ic_selector.svg', toolType: ToolEnum.Selector }),
      new ToolButton().init({ src: './ic_pen.svg', toolType: ToolEnum.Pen }),
      new ToolButton().init({ src: './ic_rect.svg', toolType: ToolEnum.Rect }),
      new ToolButton().init({ src: './ic_oval.svg', toolType: ToolEnum.Oval }),
      new ToolButton().init({ src: './ic_text.svg', toolType: ToolEnum.Text })
    ];
    toolsBtns.forEach(btn => this.content?.addChild(btn));
    this._toolButtonGroup = new ButtonGroup({ buttons: toolsBtns });
    this.removeChild(this.footer);
  }
}
