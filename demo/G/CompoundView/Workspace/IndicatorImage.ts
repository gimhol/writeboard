import { Image } from "../../BaseView/Image";
import { Style } from "../../BaseView/StyleType";
import { DockPosition } from "../DockPosition";
import ic_dock_to_left from "../../../assets/svg/ic_dock_to_left.svg"
import ic_dock_to_right from "../../../assets/svg/ic_dock_to_right.svg"
import ic_dock_to_top from "../../../assets/svg/ic_dock_to_top.svg"
import ic_dock_to_bottom from "../../../assets/svg/ic_dock_to_bottom.svg"
import ic_dock_to_center from "../../../assets/svg/ic_dock_to_center.svg"
export const srcs: Record<DockPosition, string> = {
  [DockPosition.Hide]: "",
  [DockPosition.ToLeft]: ic_dock_to_left,
  [DockPosition.ToRight]: ic_dock_to_right,
  [DockPosition.ToTop]: ic_dock_to_top,
  [DockPosition.ToBottom]: ic_dock_to_bottom,
  [DockPosition.ToCenter]: ic_dock_to_center,
}
export class IndicatorImage extends Image {
  constructor(inits: { type: DockPosition; style?: Style; }) {
    super({ src: srcs[inits.type] });
    this.styles
      .addCls('g_indicator_image')
      .apply('', { ...inits.style });
    this.draggable = false;
  }
  override onHover(hover: boolean): void {
    this.styles[hover ? 'addCls' : 'delCls']('g_indicator_image_hover');
  }
  override onRemoved(): void {
    this.styles.delCls('g_indicator_image_hover');
  }
  fakeIn() {
    this.styles.addCls('g_indicator_image_appear');
    this.hoverOb.disabled = false;
  }
  fakeOut() {
    this.styles.delCls('g_indicator_image_appear');
    this.hoverOb.disabled = true;
    this.onHover(false);
  }
}
