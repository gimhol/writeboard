import { Style } from "../../BaseView/StyleType";
import { View } from "../../BaseView/View";
import { ElementDragger } from "../../Helper/ElementDragger";
import { ViewDragger } from "../../Helper/ViewDragger";
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
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    alignItems: 'stretch'
  },
  [StyleNames.Docked]: {
    position: 'relative',
    alignSelf: 'stretch',
    width: 'unset',
    height: 'unset',
    flex: 1
  }
}
export enum Direction {
  None = '',
  H = 'h',
  V = 'v',
}

export class Resizer extends View<'div'> {
  constructor(direction: Direction) {
    super('div');
    const w = direction === Direction.H ? 1 : undefined;
    const h = direction === Direction.V ? 1 : undefined;
    const hOffset = direction === Direction.H ? -3 : 0;
    const vOffset = direction === Direction.V ? -3 : 0;
    this.styles.apply('', {
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
    const handle = new View('div');
    handle.styles.register('hover', {
      backgroundColor: '#00000088',
    }).apply('', {
      left: hOffset,
      right: hOffset,
      top: vOffset,
      bottom: vOffset,
      cursor: direction === Direction.H ? 'col-resize' : 'row-resize',
      position: 'absolute',
      transition: 'background-color 200ms',
      pointerEvents: 'all'
    });
    new HoverOb(handle.inner).setCallback(hover => handle.styles[hover ? 'add' : 'remove']('hover').refresh());
    this.addChild(handle);
    const handleDown = () => {
      const chilren = this.parent?.children!
      const idx = chilren.indexOf(this)!;
      prevView = chilren[idx - 1];
      nextView = chilren[idx + 1];
      prevViewRect = prevView?.inner.getBoundingClientRect()
      nextViewRect = nextView?.inner.getBoundingClientRect()
    }
    const handleMove = (x: number, y: number, oldX: number, oldY: number) => {
      if ((prevView instanceof Subwin) || prevView instanceof DockView && prevView.direction !== Direction.None) {
        prevView.resizeDocked(
          direction === Direction.H ? (-3 + prevViewRect!.width - oldX + x) : undefined,
          direction === Direction.V ? (-3 + prevViewRect!.height - oldY + y) : undefined
        )
      }
      if (nextView instanceof Subwin || nextView instanceof DockView && nextView.direction !== Direction.None) {
        nextView.resizeDocked(
          direction === Direction.H ? (3 + nextViewRect!.width + oldX - x) : undefined,
          direction === Direction.V ? (3 + nextViewRect!.height + oldY - y) : undefined
        )
      }
    }
    let prevView: View | undefined;
    let nextView: View | undefined;
    let prevViewRect: DOMRect | undefined;
    let nextViewRect: DOMRect | undefined;
    new ViewDragger({
      handles: [handle],
      responser: this,
      handleDown,
      handleMove,
    })
  }
}

export class DockView extends View<'div'> {
  get direction() { return this._direction; }
  private _direction: Direction = Direction.None;
  private prevResizers = new Map<View, Resizer>();
  private nextResizers = new Map<View, Resizer>();
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

  override addChild(...children: View[]): this {
    if (!children.length) { return this; }
    children.forEach(v => v.removeSelf());
    const beginAnchor = this.children[this.children.length - 1];
    for (let i = 1; i < children.length; i += 2) {
      const resizer = new Resizer(this.direction)
      this.nextResizers.set(children[i - 1]!, resizer)
      this.prevResizers.set(children[i]!, resizer)
      children.splice(i, 0, resizer);
    }
    if (beginAnchor) {
      const resizer = new Resizer(this.direction);
      this.nextResizers.set(beginAnchor, resizer)
      this.prevResizers.set(children[0]!, resizer)
      children.splice(0, 0, resizer);
    }
    super.addChild(...children);
    this.updateChildrenStyles(children);
    return this;
  }
  override insertChildBefore(anchor: number | View, ...children: View[]): this {
    if (!children.length) { return this; }
    children.forEach(v => v.removeSelf());
    const idx = typeof anchor === 'number' ? anchor : this.children.indexOf(anchor);
    const beginAnchor = this.children[idx - 1];
    const endAnchor = this.children[idx];
    for (let i = 1; i < children.length; i += 2) {
      const resizer = new Resizer(this.direction)
      this.nextResizers.set(children[i - 1]!, resizer)
      this.prevResizers.set(children[i]!, resizer)
      children.splice(i, 0, resizer);
    }
    if (beginAnchor) {
      const resizer = new Resizer(this.direction);
      this.nextResizers.set(beginAnchor, resizer)
      this.prevResizers.set(children[0]!, resizer)
      children.splice(0, 0, resizer);
    }
    if (endAnchor) {
      const resizer = new Resizer(this.direction);
      this.nextResizers.set(children[children.length - 1]!, resizer)
      this.prevResizers.set(endAnchor, resizer)
      children.push(resizer);
    }

    super.insertChildBefore(anchor, ...children);
    this.updateChildrenStyles(children);
    return this;
  }
  override removeChild(...children: View<keyof HTMLElementTagNameMap>[]): this {
    const allChildren = this.children;
    super.removeChild(...children);
    const resizers = new Set<Resizer>();
    children.forEach(child => {
      if (allChildren[0] === child) {
        const resizer = this.nextResizers.get(child)
        resizer && resizers.add(resizer);
      }
      const resizer = this.prevResizers.get(child);
      resizer && resizers.add(resizer);
      if (child instanceof DockView || child instanceof Subwin) {
        child.onUndocked();
      }
    })
    super.removeChild(...resizers);
    return this;
  }
  override replaceChild(newChild: View, oldChild: View): this {
    if (oldChild instanceof DockView || oldChild instanceof Subwin) {
      oldChild.onUndocked();
    }
    super.replaceChild(newChild, oldChild);
    const pr = this.prevResizers.get(oldChild);
    if (pr) {
      this.prevResizers.delete(oldChild);
      this.prevResizers.set(newChild, pr);
    }
    const nr = this.nextResizers.get(oldChild);
    if (nr) {
      this.nextResizers.delete(oldChild);
      this.nextResizers.set(newChild, nr);
    }
    if (newChild instanceof DockView || newChild instanceof Subwin) {
      newChild.onDocked();
    }
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
