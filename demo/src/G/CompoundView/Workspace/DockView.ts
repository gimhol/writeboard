import { Style } from "../../BaseView/StyleType";
import { View } from "../../BaseView/View";
import { ElementDragger } from "../../Helper/ElementDragger";
import { HoverOb } from "../../Observer/HoverOb";
import { Subwin } from "../Subwin";
export enum StyleNames {
  Normal = 'normal',
  Docked = 'docked'
}
export const DockViewStyles: Partial<Record<StyleNames, Style>> = {
  [StyleNames.Normal]: {
    pointerEvents: 'none',
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: 0,
    top: 0,
    alignItems: 'stretch'
  },
  [StyleNames.Docked]: {
    position: 'relative',
    flex: 1
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
      .apply(StyleNames.Normal);
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
    new HoverOb(handle.inner).setCallback((hover) => handle.styles[hover ? 'add' : 'remove']('hover').refresh());
    let prevView: View | undefined;
    let nextView: View | undefined;
    let prevViewRect: DOMRect | undefined;
    let nextViewRect: DOMRect | undefined;
    new ElementDragger({
      handles: [handle.inner],
      responser: ret.inner,
      handleDown: () => {
        const chilren = ret.parent?.children!
        const idx = chilren.indexOf(ret)!;
        prevView = chilren[idx - 1];
        nextView = chilren[idx + 1];
        prevViewRect = prevView?.inner.getBoundingClientRect()
        nextViewRect = nextView?.inner.getBoundingClientRect()
      },
      handleMove: (x, y, oldX, oldY) => {
        if ((prevView instanceof Subwin) || prevView instanceof DockView && prevView._direction !== Direction.None) {
          prevView.resizeDocked(
            this._direction === Direction.H ? (-3 + prevViewRect!.width - oldX + x) : undefined,
            this._direction === Direction.V ? (-3 + prevViewRect!.height - oldY + y) : undefined
          )
        }
        if (nextView instanceof Subwin || nextView instanceof DockView && nextView._direction !== Direction.None) {
          nextView.resizeDocked(
            this._direction === Direction.H ? (3 + nextViewRect!.width + oldX - x) : undefined,
            this._direction === Direction.V ? (3 + nextViewRect!.height + oldY - y) : undefined
          )
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
  override removeChild(...children: View<keyof HTMLElementTagNameMap>[]): this {
    super.removeChild(...children);
    children.forEach(child => {
      if (child instanceof DockView || child instanceof Subwin) {
        child.onUndocked();
      }
    })
    return this;
  }
  private updateChildrenStyles(children: View[]) {
    children.forEach(v => {
      if (v instanceof DockView || v instanceof Subwin) {
        v.onDocked();
      }
    });
  }

  onDocked(): void {
    this.styles.apply(StyleNames.Docked);
  }
  onUndocked(): void {
    this.styles.forgo(StyleNames.Docked);
  }
  resizeDocked(width: number | undefined, height: number | undefined) {
    this.styles.apply(StyleNames.Docked, v => ({ ...v, width, height }))
  }
}
