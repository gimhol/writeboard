import { Resizable, Shape, ShapeData, ShapeRect } from "../../shape";
import { Rect, type IDot } from "../../utils";
import { type IShapeGroupMember } from "./IShapeGroupMember";
const { min, max } = Math
/**
 * 多选时的组合框：框住所有被选中的图形，负责整组的拖动 / 缩放 / 旋转，
 * 自己也当作图形挂在图形层上渲染
 *
 * The group box used for multi-selection: it wraps every selected shape and handles
 * dragging / resizing / rotating the whole group, rendering itself on the shape layer like
 * any other shape.
 */
export class ShapeGroup extends ShapeRect {
  private _members: IShapeGroupMember[] = [];
  private _geo = new Rect(
    Number.MAX_SAFE_INTEGER,
    Number.MAX_SAFE_INTEGER,
    Number.MIN_SAFE_INTEGER,
    Number.MIN_SAFE_INTEGER,
  );
  /**
   * 新建组合框：默认不可见（等 setMembers 有了成员再显示）
   *
   * Creates a group box: invisible by default (setMembers shows it once it has members).
   */
  constructor() {
    super(new ShapeData);
    this.data.selected = true;
    this.data.visible = false;
    this.data.strokeStyle = '';
    this.data.fillStyle = ''
    this.data.lineWidth = 0;
    this.resizable = Resizable.None;
  }

  /**
   * 命中判定：指针落在组合框（含边框的拖拽带）上时，返回拖拽方向与被命中的矩形
   *
   * Hit test: when the pointer lands on the group box (including its drag bands), returns
   * the drag direction and the rect that was hit.
   *
   * @param {IDot} dot 指针位置（画布坐标）/ Pointer position (canvas coordinates)
   * @return {[Resizable, Rect | undefined] | null} 方向与矩形；未命中为 null / Direction and rect, or null when it was missed
   */
  hit(dot: IDot): [Resizable, Rect | undefined] | null {
    if (!this.visible) return null;
    const d = this.map2me(dot.x, dot.y).plus(this.data);
    if (!this.getGeo().hit(d)) return null;
    return this.resizableDirection(dot.x, dot.y);
  }

  /**
   * 清空成员并隐藏（旧选框先标脏，避免留下残影）
   *
   * Empties the members and hides the box (the old box is marked dirty first so that no
   * ghost is left behind).
   */
  reset(): void {
    /* 旧选框先清脏：选框线可能在图形包围盒之外，不标脏会留下残影 */
    if (this.visible) this.markDirty()
    this._members = [];
    this.visible = false;
    this._geo.x = Number.MAX_SAFE_INTEGER;
    this._geo.y = Number.MAX_SAFE_INTEGER;
    this._geo.w = Number.MIN_SAFE_INTEGER;
    this._geo.h = Number.MIN_SAFE_INTEGER;
    this.rotateTo(0);
  }

  /**
   * 用一批图形重建组合框：锁定的图形跳过，包围盒取剩下成员的外接矩形
   *
   * Rebuilds the box from a batch of shapes: locked ones are skipped and the box becomes
   * the bounding rect of the remaining members.
   *
   * @param {Shape[]} shapes 要框住的图形 / The shapes to wrap
   */
  setMembers(shapes: Shape[]): void {
    this.reset();

    const rotation = this.data.rotation;
    this._members.length = 0;
    const geo = this._geo;
    for (const s of shapes) {
      if (s.locked) continue;
      this._members.push({ shape: s, rotation: s.rotation - rotation });
      const { x, y, w, h } = s.aabb()
      geo.left = min(geo.left, x);
      geo.right = max(geo.right, x + w);
      geo.top = min(geo.top, y);
      geo.bottom = max(geo.bottom, y + h);
    }
    if (!this._members.length) {
      geo.left
    }
    this.setGeo(geo);
    this.visible = !!this._members.length;
  }

  /**
   * 把整组转到 r 弧度：组合框自己的角度随之改变，各成员按各自的角度差跟着转
   *
   * Rotates the whole group to r radians: the box rotates too and every member follows
   * with its own angle difference.
   *
   * @param {number} r 目标角度（弧度）/ Target angle in radians
   * @param {number} [x] 旋转中心 x（缺省用组合框中心）/ Rotation center x (defaults to the box center)
   * @param {number} [y] 旋转中心 y（缺省用组合框中心）/ Rotation center y (defaults to the box center)
   */
  override rotateTo(r: number, x?: number, y?: number): void {
    super.rotateTo(r, x, y);
    for (const { shape, rotation } of this._members) {
      shape.rotateTo(r + rotation, x ?? this.midX, y ?? this.midY);
    }
  }
}
