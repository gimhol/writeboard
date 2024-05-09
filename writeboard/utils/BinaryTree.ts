import { BinaryRange, IBinaryRange } from "./BinaryRange";
import { ITree } from "./ITree";

export type BinaryTreeOptions<T = any> = {
  range: IBinaryRange
  getItemRange: (item: T) => IBinaryRange
  getTree?: (item: T) => BinaryTree<T> | undefined,
  onTreeChanged?: (item: T, from: BinaryTree<T>, to: BinaryTree<T>) => void,
  maxItems?: number
}
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
  constructor(opts: BinaryTreeOptions<T>) {
    this._opts = { ...opts }
    this._range.set(opts.range);
  }

  get children(): (BinaryTree<T> | undefined)[] { return [this._child0, this._child1] }
  get maxItems() { return this._opts.maxItems || 20 }
  get parent() { return this._parent }
  get level() { return this._level }
  get itemCount() { return this._itemCount; }
  get range(): BinaryRange { return this._range; }
  get items() { return this._items; }
  get child0() { return this._child0; }
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
  removeOnlyUnderMe(item: T) {
    const idx = this._items.indexOf(item);
    if (idx >= 0) {
      --this._itemCount;
      this._items.splice(idx, 1);
      return true;
    }
    return false
  }
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
