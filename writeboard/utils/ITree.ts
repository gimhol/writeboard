/**
 * 空间索引树的公共接口：二叉树与四叉树都按这套接口对外
 *
 * Common interface of the spatial index trees; the binary tree and the quad tree both
 * expose it.
 */
export interface ITree<T = any> {
  /**
   * 本节点（含全部子孙）承载的元素总数
   *
   * Total number of items held by this node and all of its descendants.
   *
   * @return {number} 元素总数 / Total number of items
   */
  get itemCount(): number
  /**
   * 节点深度：根为 0，每下沉一层加 1
   *
   * Depth of the node: 0 for the root, one more per level down.
   *
   * @return {number} 节点深度 / Depth of the node
   */
  get level(): number
  /**
   * 直接挂在本节点上的元素（不含子孙节点里的）
   *
   * Items stored directly on this node (not those of the descendants).
   *
   * @return {T[]} 元素列表 / The item list
   */
  get items(): T[]
  /**
   * 父节点（根节点为 undefined）
   *
   * Parent node (undefined on the root).
   *
   * @return {ITree<T> | undefined} 父节点 / The parent node
   */
  get parent(): ITree<T> | undefined
  /**
   * 把本节点上的元素按位置下沉到子节点（已分裂过则什么都不做）
   *
   * Sinks the items of this node into its children by position (does nothing when it
   * has already been split).
   */
  split(): void;
  /**
   * 插入一个元素：命中哪个子节点就交给哪个子节点，否则留在本节点
   *
   * Inserts an item: the child whose region matches takes it, otherwise it stays here.
   *
   * @param {T} item 待插入的元素 / Item to insert
   * @return {ITree<T>} 实际接纳该元素的节点 / The node that actually took the item
   */
  insert(item: T): ITree<T>;
  /**
   * 删除一个元素
   *
   * Removes an item.
   *
   * @param {T} item 待删除的元素 / Item to remove
   * @return {boolean} 删掉了返回 true，树里没有它则返回 false / True when it was removed, false when the tree does not hold it
   */
  remove(item: T): boolean;
}
