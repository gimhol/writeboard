import { ITree } from "./ITree"
import { IRect, Rect } from "./Rect"
export type QuadTreeOptions<T = any> = {
  rect: IRect
  getItemRect: (item: T) => IRect,
  maxItems?: number,
  getTree?: (item: T) => QuadTree<T> | undefined,
  onTreeChanged?: (item: T, from: QuadTree<T>, to: QuadTree<T>) => void,
}
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
  constructor(opts: QuadTreeOptions<T>) {
    this._opts = { ...opts }
    this._rect.set(opts.rect)
  }
  get children(): (QuadTree<T> | undefined)[] { return [this._child0, this._child1, this._child2, this._child3] }
  get maxItems() { return this._opts.maxItems || 20 }
  get parent() { return this._parent }
  get level() { return this._level }
  get itemCount() { return this._itemCount }
  get rect(): Rect { return this._rect }
  get items() { return this._items }
  get child0() { return this._child0 }
  get child1() { return this._child1 }
  get child2() { return this._child2 }
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

