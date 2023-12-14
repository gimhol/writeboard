import { ToolEnum, ToolType } from "../../dist/cjs";
import { SizeType } from "./G/BaseView/SizeType";
import { View } from "./G/BaseView/View";
import { IconButton, IconButtonInits } from "./G/CompoundView/IconButton";
import { Subwin } from "./G/CompoundView/SubWin";
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
  private _toolsBtns: ToolButton[];
  set onToolClick(v: (target: ToolButton) => void) {
    this._toolButtonGroup.onClick = v;
  }
  setToolType(toolEnum: ToolEnum) {
    this._toolsBtns.forEach(v => {
      v.checked = toolEnum === v.toolType;
    })
  }
  constructor() {
    super();
    this.header.title = 'tools';
    this.content = new View('div');
    this.content.styles.apply("", {
      flex: '1',
      overflowY: 'auto',
      overflowX: 'hidden',
      width: 64,
    });
    this._toolsBtns = [
      new ToolButton().init({ src: './ic_tool_selector.svg', toolType: ToolEnum.Selector }),
      new ToolButton().init({ src: './ic_tool_pen.svg', toolType: ToolEnum.Pen }),
      new ToolButton().init({ src: './ic_tool_rect.svg', toolType: ToolEnum.Rect }),
      new ToolButton().init({ src: './ic_tool_oval.svg', toolType: ToolEnum.Oval }),
      new ToolButton().init({ src: './ic_tool_text.svg', toolType: ToolEnum.Text }),
      new ToolButton().init({ src: './ic_tool_tick.svg', toolType: ToolEnum.Tick }),
      new ToolButton().init({ src: './ic_tool_halftick.svg', toolType: ToolEnum.HalfTick }),
      new ToolButton().init({ src: './ic_tool_cross.svg', toolType: ToolEnum.Cross }),
      new ToolButton().init({ src: './ic_tool_lines.svg', toolType: ToolEnum.Lines })
    ];
    this._toolsBtns.forEach(btn => this.content?.addChild(btn));
    this._toolButtonGroup = new ButtonGroup({ buttons: this._toolsBtns });
    this.removeChild(this.footer);
  }
}
