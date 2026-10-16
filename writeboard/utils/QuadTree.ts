import { ITree } from "./ITree"
import { Rect } from "./Rect"
import { IRect } from "./IRect"
/**
 * 四叉树的配置
 *
 * Options of the quad tree.
 */
export type QuadTreeOptions<T = any> = {
  /**
   * 整棵树覆盖的矩形：每个节点都在它上面按中缝一分为四
   *
   * Rectangle covered by the whole tree; every node quarters it at its middle lines.
   */
  rect: IRect
  /**
   * 取元素所占矩形的函数
   *
   * How to get the rectangle an item occupies.
   *
   * @param {T} item 元素 / The item
   * @return {IRect} 该元素覆盖的矩形 / The rectangle the item covers
   */
  getItemRect: (item: T) => IRect,
  /**
   * 单个节点容纳元素的上限，达到即分裂出四个子节点
   *
   * Maximum number of items a single node may hold before it splits into four children.
   *
   * @default 20
   */
  maxItems?: number,
  /**
   * 取元素当前所在节点的函数：给了它，删除就从元素所在节点往上回溯；不给则从根往下找
   *
   * How to get the node an item currently lives in: with it, a removal walks up from
   * that node, without it the tree searches down from the root.
   *
   * @param {T} item 元素 / The item
   * @return {QuadTree<T> | undefined} 元素所在节点 / The node holding the item
   */
  getTree?: (item: T) => QuadTree<T> | undefined,
  /**
   * 元素在节点之间迁移后的回调（下沉、上收都会触发）
   *
   * Called after an item moved between nodes (both when it sinks and when it is pulled
   * back up).
   *
   * @param {T} item 发生迁移的元素 / The item that moved
   * @param {QuadTree<T>} from 原节点 / The node it left
   * @param {QuadTree<T>} to 新节点 / The node it entered
   */
  onTreeChanged?: (item: T, from: QuadTree<T>, to: QuadTree<T>) => void,
}
/**
 * 四叉树：把矩形按中缝不断四分的空间索引，元素落在哪个子矩形就下沉到哪个子节点
 *
 * Quad tree: a spatial index that keeps quartering a rectangle along its middle lines,
 * sinking an item into whichever child rectangle it falls into.
 */
export class QuadTree<T = any> implements ITree<T> {
  private _items: T[] = []
  private _child0: QuadTree<T> | undefined
  private _child1: QuadTree<T> | undefined
  private _child2: QuadTree<T> | undefined
  private _child3: QuadTree<T> | undefined
  private _childRect0: Rect | undefined
  private _childRect1: Rect | undefined
  private _childRect2: Rect | undefined
  private _childRect3: Rect | undefined
  private _itemCount: number = 0
  private _rect = new Rect(0, 0, 0, 0)
  private _opts: QuadTreeOptions<T>
  private _level: number = 0
  private _parent: QuadTree<T> | undefined
  /**
   * 按配置建树：一开始只有根节点，元素都先存在根上
   *
   * Builds the tree from its options: at first there is only the root, holding every
   * item.
   *
   * @param {QuadTreeOptions<T>} opts 树配置 / Tree options
   */
  constructor(opts: QuadTreeOptions<T>) {
    this._opts = { ...opts }
    this._rect.read(opts.rect)
  }
  /**
   * 四个子节点（未分裂出来时为 undefined）：下标 0 左上、1 右上、2 左下、3 右下
   *
   * The four children (undefined before they are created): index 0 top-left, 1 top-right,
   * 2 bottom-left, 3 bottom-right.
   *
   * @return {(QuadTree<T> | undefined)[]} [左上, 右上, 左下, 右下] / [top-left, top-right, bottom-left, bottom-right]
   */
  get children(): (QuadTree<T> | undefined)[] { return [this._child0, this._child1, this._child2, this._child3] }
  /**
   * 本节点容纳元素的上限（配置的 maxItems，缺省 20）
   *
   * How many items this node may hold (the configured maxItems, 20 by default).
   *
   * @return {number} 元素上限 / The item limit
   * @default 20
   */
  get maxItems() { return this._opts.maxItems || 20 }
  /**
   * 父节点（根节点为 undefined）
   *
   * Parent node (undefined on the root).
   *
   * @return {QuadTree<T> | undefined} 父节点 / The parent node
   */
  get parent() { return this._parent }
  /**
   * 节点深度：根为 0，每下沉一层加 1
   *
   * Depth of the node: 0 for the root, one more per level down.
   *
   * @return {number} 节点深度 / Depth of the node
   */
  get level() { return this._level }
  /**
   * 本节点（含全部子孙）承载的元素总数
   *
   * Total number of items held by this node and all of its descendants.
   *
   * @return {number} 元素总数 / Total number of items
   */
  get itemCount() { return this._itemCount }
  /**
   * 本节点覆盖的矩形
   *
   * The rectangle this node covers.
   *
   * @return {Rect} 矩形 / The rectangle
   */
  get rect(): Rect { return this._rect }
  /**
   * 直接挂在本节点上的元素（不含子孙节点里的）
   *
   * Items stored directly on this node (not those of the descendants).
   *
   * @return {T[]} 元素列表 / The item list
   */
  get items() { return this._items }
  /**
   * 左上的子节点（未分裂出来时为 undefined）
   *
   * The top-left child (undefined before it exists).
   *
   * @return {QuadTree<T> | undefined} 子节点 / The child node
   */
  get child0() { return this._child0 }
  /**
   * 右上的子节点（未分裂出来时为 undefined）
   *
   * The top-right child (undefined before it exists).
   *
   * @return {QuadTree<T> | undefined} 子节点 / The child node
   */
  get child1() { return this._child1 }
  /**
   * 左下的子节点（未分裂出来时为 undefined）
   *
   * The bottom-left child (undefined before it exists).
   *
   * @return {QuadTree<T> | undefined} 子节点 / The child node
   */
  get child2() { return this._child2 }
  /**
   * 右下的子节点（未分裂出来时为 undefined）
   *
   * The bottom-right child (undefined before it exists).
   *
   * @return {QuadTree<T> | undefined} 子节点 / The child node
   */
  get child3() { return this._child3 }
  private get genChild0() {
    if (!this._child0) {
      this._child0 = new QuadTree<T>({
        ...this._opts,
        rect: this.childRect0,
      })
      this._child0._parent = this
      this._child0._level = this._level + 1
    }
    return this._child0
  }
  private get genChild1() {
    if (!this._child1) {
      this._child1 = new QuadTree<T>({
        ...this._opts,
        rect: this.childRect1
      })
      this._child1._parent = this
      this._child1._level = this._level + 1
    }
    return this._child1
  }
  private get genChild2() {
    if (!this._child2) {
      this._child2 = new QuadTree<T>({
        ...this._opts,
        rect: this.childRect2
      })
      this._child2._parent = this
      this._child2._level = this._level + 1
    }
    return this._child2
  }
  private get genChild3() {
    if (!this._child3) {
      this._child3 = new QuadTree<T>({
        ...this._opts,
        rect: this.childRect3
      })
      this._child3._parent = this
      this._child3._level = this._level + 1
    }
    return this._child3
  }
  private get childRect0(): Rect {
    if (!this._childRect0) {
      const { x, y } = this.rect
      const w = this.rect.w / 2
      const h = this.rect.h / 2
      this._childRect0 = new Rect(x, y, w, h)
    }
    return this._childRect0
  }
  private get childRect1(): Rect {
    if (!this._childRect1) {
      const { y } = this.rect
      const w = this.rect.w / 2
      const h = this.rect.h / 2
      const { x: midX } = this.rect.mid()
      this._childRect1 = new Rect(midX, y, w, h)
    }
    return this._childRect1
  }
  private get childRect2(): Rect {
    if (!this._childRect2) {
      const { x } = this.rect
      const w = this.rect.w / 2
      const h = this.rect.h / 2
      const { y: midY } = this.rect.mid()
      this._childRect2 = new Rect(x, midY, w, h)
    }
    return this._childRect2
  }
  private get childRect3(): Rect {
    if (!this._childRect3) {
      const w = this.rect.w / 2
      const h = this.rect.h / 2
      const { x: midX, y: midY } = this.rect.mid()
      this._childRect3 = new Rect(midX, midY, w, h)
    }
    return this._childRect3
  }

  /**
   * 分裂：把本节点上的元素按矩形下沉到四个子节点，只有恰能落进其中一个子矩形的才下沉
   *
   * Splits: sinks the items of this node into the four children by rectangle, but only
   * those that fall into exactly one of the child rectangles.
   */
  split() {
    if (this._child0 && this._child1 && this._child2 && this._child3) return
    let item: T,
      itemRect: IRect,
      inChild0: number,
      inChild1: number,
      inChild2: number,
      inChild3: number,
      hitCount: number
    for (let i = 0; i < this._items.length; ++i) {
      item = this._items[i]
      itemRect = this._opts.getItemRect(item)
      inChild0 = this.childRect0.hit(itemRect) ? 1 : 0
      inChild1 = this.childRect1.hit(itemRect) ? 1 : 0
      inChild2 = this.childRect2.hit(itemRect) ? 1 : 0
      inChild3 = this.childRect3.hit(itemRect) ? 1 : 0
      hitCount = inChild0 + inChild1 + inChild2 + inChild3
      if (hitCount !== 1)
        continue
      this._items.splice(i, 1)
      --i
      if (inChild0) {
        this.genChild0.insert(item)
        this._opts.onTreeChanged && this._opts.onTreeChanged(item, this, this.genChild0)
      } else if (inChild1) {
        this.genChild1.insert(item)
        this._opts.onTreeChanged && this._opts.onTreeChanged(item, this, this.genChild1)
      } else if (inChild2) {
        this.genChild2.insert(item)
        this._opts.onTreeChanged && this._opts.onTreeChanged(item, this, this.genChild2)
      } else if (inChild3) {
        this.genChild3.insert(item)
        this._opts.onTreeChanged && this._opts.onTreeChanged(item, this, this.genChild3)
      }
    }
  }
  /**
   * 插入一个元素：超过本节点的上限就分裂，然后交给命中的那个子节点，没命中就留在本节点
   *
   * Inserts an item: once this node is over its limit it splits, the item then goes to
   * the child that matches it and stays here when none does.
   *
   * @param {T} item 待插入的元素 / Item to insert
   * @return {QuadTree<T>} 实际接纳该元素的节点 / The node that actually took the item
   */
  insert(item: T): QuadTree<T> {
    ++this._itemCount
    const itemRect = this._opts.getItemRect(item)
    const needSplit = this._itemCount >= this.maxItems
    needSplit && this.split();

    if (needSplit) {
      const inChild0 = this.childRect0.hit(itemRect) ? 1 : 0
      const inChild1 = this.childRect1.hit(itemRect) ? 1 : 0
      const inChild2 = this.childRect2.hit(itemRect) ? 1 : 0
      const inChild3 = this.childRect3.hit(itemRect) ? 1 : 0
      if (inChild0) return this.genChild0.insert(item)
      else if (inChild1) return this.genChild1.insert(item)
      else if (inChild2) return this.genChild2.insert(item)
      else if (inChild3) return this.genChild3.insert(item)
    }
    this._items.push(item)
    return this
  }
  /**
   * 只在本节点直接持有的元素里删除，不看子节点
   *
   * Removes an item from this node's own items only, ignoring the descendants.
   *
   * @param {T} item 待删除的元素 / Item to remove
   * @return {boolean} 本节点持有并删掉时返回 true，否则返回 false / True when this node held it and removed it
   */
  removeOnlyUnderMe(item: T) {
    const idx = this._items.indexOf(item);
    if (idx >= 0) {
      --this._itemCount;
      this._items.splice(idx, 1);
      return true;
    }
    return false
  }
  /**
   * 删除一个元素：配了 getTree 就从元素所在节点往上回溯（顺带回收空节点、必要时上收），
   * 否则从本节点往子节点逐层找
   *
   * Removes an item: with getTree configured it walks up from the node holding the item
   * (dropping empty nodes and merging back when needed), otherwise it searches down the
   * children level by level.
   *
   * @param {T} item 待删除的元素 / Item to remove
   * @return {boolean} 删除了返回 true，树里没有它则返回 false / True when it was removed, false when the tree does not hold it
   */
  remove(item: T) {
    if (this._opts.getTree) {
      // 从子节点到父节点的移除逻辑
      let tree = this._opts.getTree(item)
      if (!tree) return false
      const result = tree.removeOnlyUnderMe(item)
      tree._itemCount++
      let treeNeedMerge: QuadTree<T> | undefined
      do {
        --tree._itemCount
        if (tree._itemCount <= 0) {
          if (tree.parent?._child0 === tree) delete tree.parent._child0
          if (tree.parent?._child1 === tree) delete tree.parent._child1
          if (tree.parent?._child2 === tree) delete tree.parent._child2
          if (tree.parent?._child3 === tree) delete tree.parent._child3
        } else if (tree._itemCount < this.maxItems) {
          treeNeedMerge = tree
        }
        tree = tree.parent
      } while (tree)

      treeNeedMerge?.merge()
      return result
    }

    // 从父节点的到子节点移除逻辑
    if (this.removeOnlyUnderMe(item))
      return true
    if (this._child0?.remove(item)) {
      !this._child0.itemCount && delete this._child0;
    } else if (this._child1?.remove(item)) {
      !this._child1.itemCount && delete this._child1;
    } else if (this._child2?.remove(item)) {
      !this._child2.itemCount && delete this._child2;
    } else if (this._child3?.remove(item)) {
      !this._child3.itemCount && delete this._child3;
    } else {
      return false;
    }
    --this._itemCount;
    if (this._itemCount < this.maxItems)
      this.merge()
    return true

  }
  /**
   * 上收：把四个子节点（含其子孙）的元素全部收回本节点，然后丢掉子节点
   *
   * Merges back: pulls every item of the four children (and their descendants) up into
   * this node, then drops the children.
   */
  merge() {
    this.children.forEach(child => {
      if (!child) return
      child.merge()
      child._items.forEach(item => {
        this.items.push(item)
        this._opts.onTreeChanged && this._opts.onTreeChanged(item, child, this)
      })
    })
    delete this._child0
    delete this._child1
    delete this._child2
    delete this._child3
  }
}

