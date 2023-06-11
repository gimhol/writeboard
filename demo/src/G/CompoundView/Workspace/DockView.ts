import { Style } from "../../BaseView/StyleType";
import { View } from "../../BaseView/View";
import { ElementDragger } from "../../Helper/ElementDragger";
import { HoverOb } from "../../Observer/HoverOb";
import { Subwin } from "../Subwin";
export enum DockViewStyleName {
  Normal = 'normal'
}
export const DockViewStyles: Record<DockViewStyleName, Style> = {
  [DockViewStyleName.Normal]: {
    pointerEvents: 'none',
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: 0,
    top: 0,
    alignItems: 'stretch'
  }
}
export enum Direction {
  None = '',
  H = 'h',
  V = 'v',
}

export class DockView extends View<'div'> {
  private _direction: Direction = Direction.None;
  get direction() { return this._direction; }
  constructor(direction: Direction = Direction.None) {
    super('div');
    this._direction = direction;
    if (direction === Direction.H) {
      this.styles.apply('', { display: "flex", flexDirection: 'row' });
    } else if (direction === Direction.V) {
      this.styles.apply('', { display: "flex", flexDirection: 'column' });
    }
    this.styles.applyCls('DockView');
    this.styles
      .registers(DockViewStyles)
      .apply(DockViewStyleName.Normal);
  }
  setContent(view: View) { super.addChild(view); }
  createResizer() {
    const ret = new View('div');
    const w = this.direction === Direction.H ? 1 : undefined;
    const h = this.direction === Direction.V ? 1 : undefined;
    ret.styles.apply('', {
      width: w,
      maxWidth: w,
      minWidth: w,
      height: h,
      maxHeight: h,
      minHeight: h,
      overflow: 'visible',
      zIndex: 1,
      position: 'relative',
      backgroundColor: 'black',
    });
    const hOffset = this.direction === Direction.H ? -3 : 0
    const vOffset = this.direction === Direction.V ? -3 : 0
    const handle = new View('div');
    handle.styles.register('hover', {
      backgroundColor: '#00000088',
    }).apply('', {
      left: hOffset,
      right: hOffset,
      top: vOffset,
      bottom: vOffset,
      cursor: this.direction === Direction.H ? 'col-resize' : 'row-resize',
      position: 'absolute',
      transition: 'background-color 200ms',
      pointerEvents: 'all'
    });
    new HoverOb(handle.inner, (hover) => handle.styles[hover ? 'add' : 'remove']('hover').refresh());
    let left: View | undefined;
    let right: View | undefined;
    let lw: number | undefined;
    let rw: number | undefined;
    let lh: number | undefined;
    let rh: number | undefined;
    new ElementDragger({
      handles: [handle.inner],
      responser: ret.inner,
      handleDown: () => {
        const chilren = ret.parent?.children!
        const idx = chilren.indexOf(ret)!;
        left = chilren[idx - 1];
        right = chilren[idx + 1];
        const lrect = left?.inner.getBoundingClientRect()
        lw = lrect?.width;
        lh = lrect?.height;
        const rrect = right?.inner.getBoundingClientRect()
        rw = rrect?.width;
        rh = rrect?.height;
      },
      handleMove: (x, y, oldX, oldY) => {
        if (!(left instanceof DockView) || left._direction !== Direction.None) {
          left?.styles.apply('docked', v => ({
            ...v,
            width: this._direction === Direction.H ? (-3 + lw! - oldX + x) : undefined,
            height: this._direction === Direction.V ? (-3 + lh! - oldY + y) : undefined
          }))
        }
        if (!(right instanceof DockView) || right._direction !== Direction.None) {
          right?.styles.apply('docked', v => ({
            ...v,
            width: this._direction === Direction.H ? (3 + rw! + oldX - x) : undefined,
            height: this._direction === Direction.V ? (3 + rh! + oldY - y) : undefined
          }))
        }
      },
    })

    ret.addChild(handle);
    return ret;
  }
  override addChild(...children: View[]): this {
    children.forEach(v => v.removeSelf());
    const beginAnchor = this.children[this.children.length - 1];
    for (let i = 1; i < children.length; i += 2) {
      children.splice(i, 0, this.createResizer());
    }
    if (beginAnchor) {
      children.splice(0, 0, this.createResizer());
    }
    super.addChild(...children);
    this.updateChildrenStyles(children);
    return this;
  }
  override insertChild(anchor: number | View, ...children: View[]): this {
    children.forEach(v => v.removeSelf());
    const idx = typeof anchor === 'number' ? anchor : this.children.indexOf(anchor);
    const beginAnchor = this.children[idx - 1];
    const endAnchor = this.children[idx];
    for (let i = 1; i < children.length; i += 2) {
      children.splice(i, 0, this.createResizer());
    }
    if (beginAnchor) {
      children.splice(0, 0, this.createResizer());
    }
    if (endAnchor) {
      children.push(this.createResizer());
    }

    super.insertChild(anchor, ...children);
    this.updateChildrenStyles(children);
    return this;
  }
  private updateChildrenStyles(children: View[]) {
    children.forEach(v => {
      if (v instanceof DockView) {
        v.styles.apply('docked', {
          position: 'relative',
          flex: 1
        });
      } else if (v instanceof Subwin) {
        v.dragger.disabled = true;
        v.styles.apply('docked', {
          pointerEvents: 'all',
          position: 'relative',
          resize: 'none',
          width: 'unset',
          height: 'unset',
          left: 'unset',
          top: 'unset',
          boxShadow: 'unset',
          borderRadius: 0,
          zIndex: 'unset',
          border: 'none'
        });
      }
    });
  }
}
