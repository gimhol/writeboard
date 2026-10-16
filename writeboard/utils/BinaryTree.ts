import { BinaryRange, IBinaryRange } from "./BinaryRange";
import { ITree } from "./ITree";

/**
 * 二叉树（一维空间索引）的配置
 *
 * Options of the binary tree (a one-dimensional spatial index).
 */
export type BinaryTreeOptions<T = any> = {
  /**
   * 整棵树覆盖的区间：每个节点都在它上面按中点一分为二
   *
   * Range covered by the whole tree; every node halves it at the middle point.
   */
  range: IBinaryRange
  /**
   * 取元素所占区间的函数
   *
   * How to get the range an item occupies.
   *
   * @param {T} item 元素 / The item
   * @return {IBinaryRange} 该元素覆盖的区间 / The range the item covers
   */
  getItemRange: (item: T) => IBinaryRange
  /**
   * 取元素当前所在节点的函数：给了它，删除就从元素所在节点往上回溯；不给则从根往下找
   *
   * How to get the node an item currently lives in: with it, a removal walks up from
   * that node, without it the tree searches down from the root.
   *
   * @param {T} item 元素 / The item
   * @return {BinaryTree<T> | undefined} 元素所在节点 / The node holding the item
   */
  getTree?: (item: T) => BinaryTree<T> | undefined,
  /**
   * 元素在节点之间迁移后的回调（下沉、上收都会触发）
   *
   * Called after an item moved between nodes (both when it sinks and when it is pulled
   * back up).
   *
   * @param {T} item 发生迁移的元素 / The item that moved
   * @param {BinaryTree<T>} from 原节点 / The node it left
   * @param {BinaryTree<T>} to 新节点 / The node it entered
   */
  onTreeChanged?: (item: T, from: BinaryTree<T>, to: BinaryTree<T>) => void,
  /**
   * 单个节点容纳元素的上限，达到即分裂出两个子节点
   *
   * Maximum number of items a single node may hold before it splits into two children.
   *
   * @default 20
   */
  maxItems?: number
}
/**
 * 二叉树：把一维区间按中点不断二分的空间索引，元素落在哪个子区间就下沉到哪个子节点
 *
 * Binary tree: a spatial index that keeps halving a one-dimensional range at its middle
 * point, sinking an item into whichever child range it falls into.
 */
export class BinaryTree<T = any> implements ITree<T> {
  private _range = new BinaryRange(0, 0);
  private _items: T[] = [];
  private _child0: BinaryTree<T> | undefined;
  private _child1: BinaryTree<T> | undefined;
  private _childRange0: BinaryRange | undefined;
  private _childRange1: BinaryRange | undefined;
  private _itemCount: number = 0;
  private _level: number = 0;
  private _parent: BinaryTree<T> | undefined
  private _opts: BinaryTreeOptions<T>
  /**
   * 按配置建树：一开始只有根节点，元素都先存在根上
   *
   * Builds the tree from its options: at first there is only the root, holding every
   * item.
   *
   * @param {BinaryTreeOptions<T>} opts 树配置 / Tree options
   */
  constructor(opts: BinaryTreeOptions<T>) {
    this._opts = { ...opts }
    this._range.set(opts.range);
  }

  /**
   * 两个子节点（未分裂出来时为 undefined）：下标 0 是前半区间，1 是后半区间
   *
   * The two children (undefined before they are created): index 0 covers the first
   * half of the range, index 1 the second half.
   *
   * @return {(BinaryTree<T> | undefined)[]} [前半区间节点, 后半区间节点] / [first half node, second half node]
   */
  get children(): (BinaryTree<T> | undefined)[] { return [this._child0, this._child1] }
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
   * @return {BinaryTree<T> | undefined} 父节点 / The parent node
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
  get itemCount() { return this._itemCount; }
  /**
   * 本节点覆盖的区间
   *
   * The range this node covers.
   *
   * @return {BinaryRange} 区间 / The range
   */
  get range(): BinaryRange { return this._range; }
  /**
   * 直接挂在本节点上的元素（不含子孙节点里的）
   *
   * Items stored directly on this node (not those of the descendants).
   *
   * @return {T[]} 元素列表 / The item list
   */
  get items() { return this._items; }
  /**
   * 前半区间的子节点（未分裂出来时为 undefined）
   *
   * The child covering the first half of the range (undefined before it exists).
   *
   * @return {BinaryTree<T> | undefined} 子节点 / The child node
   */
  get child0() { return this._child0; }
  /**
   * 后半区间的子节点（未分裂出来时为 undefined）
   *
   * The child covering the second half of the range (undefined before it exists).
   *
   * @return {BinaryTree<T> | undefined} 子节点 / The child node
   */
  get child1() { return this._child1; }

  private get genChild0() {
    if (!this._child0) {
      this._child0 = new BinaryTree<T>({
        ...this._opts,
        range: this.childRange0,
      });
      this._child0._parent = this
      this._child0._level = this._level + 1;
    }
    return this._child0;
  }
  private get genChild1() {
    if (!this._child1) {
      this._child1 = new BinaryTree<T>({
        ...this._opts,
        range: this.childRange1
      });
      this._child1._parent = this
      this._child1._level = this._level + 1;
    }
    return this._child1;
  }
  private get childRange0(): BinaryRange {
    if (!this._childRange0)
      this._childRange0 = new BinaryRange(this._range.from, this._range.mid);
    return this._childRange0;
  }
  private get childRange1(): BinaryRange {
    if (!this._childRange1)
      this._childRange1 = new BinaryRange(this._range.mid, this._range.to);
    return this._childRange1;
  }
  /**
   * 分裂：把本节点上的元素按区间下沉到两个子节点，只有恰能落进其中一个子区间的才下沉
   *
   * Splits: sinks the items of this node into the two children by range, but only those
   * that fall into exactly one of the child ranges.
   */
  split() {
    if (this._child0 && this._child1)
      return;
    let item: T, itemRange: IBinaryRange, inChild0: number, inChild1: number, in_lb: number, in_rb: number, hitCount: number;
    for (let i = 0; i < this._items.length; ++i) {
      item = this._items[i];
      itemRange = this._opts.getItemRange(item);
      inChild0 = this.childRange0.hit(itemRange) ? 1 : 0;
      inChild1 = this.childRange1.hit(itemRange) ? 1 : 0;
      hitCount = inChild0 + inChild1;
      if (hitCount !== 1)
        continue;
      this._items.splice(i, 1);
      --i;
      if (inChild0) {
        this.genChild0.insert(item)
        this._opts.onTreeChanged && this._opts.onTreeChanged(item, this, this.genChild0)
      } else if (inChild1) {
        this.genChild1.insert(item)
        this._opts.onTreeChanged && this._opts.onTreeChanged(item, this, this.genChild1)
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
   * @return {BinaryTree<T>} 实际接纳该元素的节点 / The node that actually took the item
   */
  insert(item: T): BinaryTree<T> {
    ++this._itemCount;
    const itemRange = this._opts.getItemRange(item);
    const needSplit = this._itemCount >= this.maxItems
    needSplit && this.split();

    if (needSplit) {
      const inChild0 = this.childRange0.hit(itemRange) ? 1 : 0;
      const inChild1 = this.childRange1.hit(itemRange) ? 1 : 0;
      if (inChild0)
        return this.genChild0.insert(item);
      else if (inChild1)
        return this.genChild1.insert(item);
    }
    this._items.push(item);
    return this;
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
      let treeNeedMerge: BinaryTree<T> | undefined
      do {
        --tree._itemCount
        if (tree._itemCount <= 0) {
          if (tree.parent?._child0 === tree) delete tree.parent._child0
          if (tree.parent?._child1 === tree) delete tree.parent._child1
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
    } else {
      return false;
    }
    --this._itemCount;
    if (this._itemCount < this.maxItems)
      this.merge()
    return true
  }
  /**
   * 上收：把两个子节点（含其子孙）的元素全部收回本节点，然后丢掉子节点
   *
   * Merges back: pulls every item of the two children (and their descendants) up into
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
  }
}
