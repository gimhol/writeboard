import { ToolEnum, ToolType } from "../../dist";
import { ButtonGroup } from "./G/Helper/ButtonGroup";
import { View } from "./G/BaseView/View";
import { Image } from "./G/BaseView/Image";
import { Subwin } from "./G/CompoundView/Subwin";
import { IconButton } from "./G/BaseView/IconButton";
import { CssObjectFit } from "./G/BaseView/StyleType";
import { SizeType } from "./G/BaseView/SizeType";
export interface ToolButtonInits {
  src: string;
  toolType: ToolType
}
export class ToolButton extends IconButton {
  private _toolType: string;
  get toolType() { return this._toolType; }
  constructor(inits: ToolButtonInits) {
    super({
      content: new Image({
        src: inits.src,
        styles: {
          width: 24,
          height: 24,
          objectFit: CssObjectFit.Contain,
        }
      }),
      checkable: true,
      size: SizeType.Large
    })

    this._toolType = inits.toolType;
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
      new ToolButton({ src: './ic_selector.svg', toolType: ToolEnum.Selector }),
      new ToolButton({ src: './ic_pen.svg', toolType: ToolEnum.Pen }),
      new ToolButton({ src: './ic_rect.svg', toolType: ToolEnum.Rect }),
      new ToolButton({ src: './ic_oval.svg', toolType: ToolEnum.Oval }),
      new ToolButton({ src: './ic_text.svg', toolType: ToolEnum.Text })
    ];
    toolsBtns.forEach(btn => this.content?.addChild(btn));
    this._toolButtonGroup = new ButtonGroup({ buttons: toolsBtns });
    this.removeChild(this.footer);
  }
}
