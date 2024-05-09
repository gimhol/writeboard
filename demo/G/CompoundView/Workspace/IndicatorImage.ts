import { Image } from "../../BaseView/Image";
import { Style } from "../../BaseView/StyleType";
import { DockPosition } from "../DockPosition";

export const srcs: Record<DockPosition, string> = {
  [DockPosition.Hide]: "",
  [DockPosition.ToLeft]: "./ic_dock_to_left.svg",
  [DockPosition.ToRight]: "./ic_dock_to_right.svg",
  [DockPosition.ToTop]: "./ic_dock_to_top.svg",
  [DockPosition.ToBottom]: "./ic_dock_to_bottom.svg",
  [DockPosition.ToCenter]: "./ic_dock_to_center.svg"
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
