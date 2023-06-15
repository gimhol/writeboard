import { View } from "../../BaseView/View";
import { ViewDragger } from "../../Helper/ViewDragger";
import { HoverOb } from "../../Observer/HoverOb";
import { Subwin } from "../Subwin";
import { DockView } from "./DockView";
import { DockableDirection } from "./DockableDirection";

export class DockableResizer extends View<'div'> {
  constructor(direction: DockableDirection) {
    super('div');
    const w = direction === DockableDirection.H ? 1 : undefined;
    const h = direction === DockableDirection.V ? 1 : undefined;
    const hOffset = direction === DockableDirection.H ? -3 : 0;
    const vOffset = direction === DockableDirection.V ? -3 : 0;
    this.styles
      .addCls('g_dockable_resizer')
      .apply('', {
        width: w,
        maxWidth: w,
        minWidth: w,
        height: h,
        maxHeight: h,
        minHeight: h,
      });
    const handle = new View('div');
    handle.styles.addCls('handle').apply('', {
      left: hOffset,
      right: hOffset,
      top: vOffset,
      bottom: vOffset,
      cursor: direction === DockableDirection.H ? 'col-resize' : 'row-resize',
    });
    new HoverOb(handle.inner).setCallback(hover => handle.styles[hover ? 'addCls' : 'delCls']('handle_hover'));
    this.addChild(handle);
    const handleDown = () => {
      prevView = this.prevSibling!;
      nextView = this.nextSibling!;
      prevViewRect = prevView?.inner.getBoundingClientRect();
      nextViewRect = nextView?.inner.getBoundingClientRect();
    };
    const handleMove = (x: number, y: number, oldX: number, oldY: number) => {
      if ((prevView instanceof Subwin) || prevView instanceof DockView && prevView.direction !== DockableDirection.None) {
        prevView.resizeDocked(
          direction === DockableDirection.H ? (-3 + prevViewRect!.width - oldX + x) : undefined,
          direction === DockableDirection.V ? (-3 + prevViewRect!.height - oldY + y) : undefined
        );
      }
      if (nextView instanceof Subwin || nextView instanceof DockView && nextView.direction !== DockableDirection.None) {
        nextView.resizeDocked(
          direction === DockableDirection.H ? (3 + nextViewRect!.width + oldX - x) : undefined,
          direction === DockableDirection.V ? (3 + nextViewRect!.height + oldY - y) : undefined
        );
      }
    };
    let prevView: View | undefined;
    let nextView: View | undefined;
    let prevViewRect: DOMRect | undefined;
    let nextViewRect: DOMRect | undefined;
    new ViewDragger({
      handles: [handle],
      responser: this,
      handleDown,
      handleMove,
    });
  }
}
