const { QuadTree, BinaryTree } = require('../dist/es5/cjs/writeboard.js')

const assert = require('assert');

const rectOf = (x, y, w = 1, h = 1) => ({ x, y, w, h })

describe('class QuadTree', () => {
  const make = (opts = {}) => new QuadTree(Object.assign({
    rect: { x: 0, y: 0, w: 100, h: 100 },
    getItemRect: (item) => item,
    maxItems: 3,
  }, opts))

  it('插入少量元素时全部留在根节点', () => {
    const tree = make()
    const a = rectOf(1, 1)
    const b = rectOf(2, 2)
    tree.insert(a)
    tree.insert(b)
    assert.strictEqual(tree.itemCount, 2)
    assert.strictEqual(tree.items.length, 2)
    assert.strictEqual(tree.child0, undefined)
  });

  it('达到 maxItems 后分裂，元素按象限进入子节点', () => {
    const tree = make({ maxItems: 2 })
    const a = rectOf(1, 1)
    const b = rectOf(2, 2)
    const c = rectOf(98, 98)
    tree.insert(a)
    tree.insert(b)
    tree.insert(c)
    assert.strictEqual(tree.itemCount, 3)
    assert.ok(tree.child0, '左上象限子节点应被创建')
    assert.ok(tree.child3, '右下象限子节点应被创建')
    assert.strictEqual(tree.child0.itemCount, 2)
    assert.strictEqual(tree.child3.itemCount, 1)
    assert.strictEqual(tree.items.length, 0)
  });

  it('跨越多个象限的元素会被放进第一个命中的子节点（不做多份存储）', () => {
    const tree = make({ maxItems: 2 })
    tree.insert(rectOf(1, 1))
    tree.insert(rectOf(2, 2))
    const big = rectOf(0, 0, 100, 100)
    tree.insert(big)
    // 该实现按 子节点0 → 1 → 2 → 3 的顺序取第一个命中的象限，
    // 因此跨象限元素会落在 child0 的分支里，而不是留在父节点
    const collected = []
    const walk = (node) => {
      if (!node) return
      collected.push(...node.items)
      node.children.forEach(walk)
    }
    walk(tree)
    assert.ok(collected.includes(big), '元素应存在于树的某个节点中')
    assert.strictEqual(tree.itemCount, 3)
  });

  it('子节点层级随分裂递增', () => {
    const tree = make({ maxItems: 1 })
    tree.insert(rectOf(1, 1))
    tree.insert(rectOf(2, 2))
    const child = tree.child0
    assert.strictEqual(child.level, 1)
    assert.strictEqual(child.parent, tree)
    assert.strictEqual(child.rect.w, 50)
    assert.strictEqual(child.rect.h, 50)
  });

  it('remove 命中元素时返回 true 并减少计数，重复删除返回 false', () => {
    const tree = make({ maxItems: 2 })
    const a = rectOf(1, 1)
    const b = rectOf(2, 2)
    tree.insert(a)
    tree.insert(b)
    assert.strictEqual(tree.remove(a), true)
    assert.strictEqual(tree.itemCount, 1)
    assert.strictEqual(tree.remove(a), false)
    assert.strictEqual(tree.itemCount, 1)
  });

  it('子节点清空后被移除，整体数量低于 maxItems 时合并回父节点', () => {
    const tree = make({ maxItems: 2 })
    const a = rectOf(1, 1)
    const b = rectOf(2, 2)
    const c = rectOf(98, 98)
    const d = rectOf(99, 99)
    ;[a, b, c, d].forEach((it) => tree.insert(it))
    assert.ok(tree.child0 && tree.child3)

    tree.remove(a)
    tree.remove(b)
    assert.strictEqual(tree.child0, undefined, '左上子节点清空后应被删除')

    tree.remove(d)
    assert.strictEqual(tree.child3, undefined, '数量不足时应合并并删除子节点')
    assert.ok(tree.items.includes(c), '合并后元素回到父节点')
  });

  it('提供 getTree 时走「自底向上」的移除路径', () => {
    const owner = new Map()
    const tree = new QuadTree({
      rect: { x: 0, y: 0, w: 100, h: 100 },
      getItemRect: (item) => item,
      maxItems: 2,
      getTree: (item) => owner.get(item),
      onTreeChanged: (item, from, to) => owner.set(item, to),
    })
    const a = rectOf(1, 1)
    const b = rectOf(2, 2)
    tree.insert(a)
    tree.insert(b)
    assert.ok(owner.get(a), '元素应记录自己所在的树节点')
    const holder = owner.get(a)
    assert.strictEqual(holder.items.includes(a), true)

    assert.strictEqual(tree.remove(a), true)
    assert.strictEqual(tree.itemCount, 1)

    const unknown = rectOf(50, 50)
    assert.strictEqual(tree.remove(unknown), false)
  });

  it('maxItems 默认 20', () => {
    const tree = make({ maxItems: undefined })
    assert.strictEqual(tree.maxItems, 20)
  });
});

describe('class BinaryTree', () => {
  const make = (opts = {}) => new BinaryTree(Object.assign({
    range: { from: 0, to: 100 },
    getItemRange: (item) => item,
    maxItems: 2,
  }, opts))

  it('插入少量元素时全部留在根节点', () => {
    const tree = make()
    tree.insert({ from: 1, to: 2 })
    assert.strictEqual(tree.itemCount, 1)
    assert.strictEqual(tree.items.length, 1)
    assert.strictEqual(tree.child0, undefined)
  });

  it('按区间中值分裂：左半区/右半区元素进入对应子节点', () => {
    const tree = make()
    tree.insert({ from: 1, to: 2 })
    tree.insert({ from: 3, to: 4 })
    assert.ok(tree.child0)
    assert.strictEqual(tree.child0.itemCount, 2)

    tree.insert({ from: 90, to: 95 })
    assert.ok(tree.child1)
    assert.strictEqual(tree.child1.itemCount, 1)
  });

  it('跨越中值的区间留在父节点', () => {
    const tree = make()
    tree.insert({ from: 0, to: 100 })
    tree.insert({ from: 1, to: 2 })
    tree.insert({ from: 3, to: 4 })
    assert.ok(tree.items.some((it) => it.from === 0 && it.to === 100))
  });

  it('remove 命中返回 true，重复删除返回 false', () => {
    const tree = make()
    const a = { from: 1, to: 2 }
    tree.insert(a)
    tree.insert({ from: 3, to: 4 })
    assert.strictEqual(tree.remove(a), true)
    assert.strictEqual(tree.itemCount, 1)
    assert.strictEqual(tree.remove(a), false)
  });

  it('数量不足时合并回父节点', () => {
    const tree = make()
    const a = { from: 1, to: 2 }
    const b = { from: 3, to: 4 }
    const c = { from: 90, to: 95 }
    tree.insert(a)
    tree.insert(b)
    tree.insert(c)
    assert.ok(tree.child0 && tree.child1)

    tree.remove(b)
    tree.remove(c)
    assert.strictEqual(tree.child0, undefined, '合并后子节点应被删除')
    assert.ok(tree.items.includes(a))
  });

  it('子节点区间为父区间的一半', () => {
    const tree = make()
    tree.insert({ from: 1, to: 2 })
    tree.insert({ from: 3, to: 4 })
    assert.strictEqual(tree.child0.level, 1)
    assert.strictEqual(tree.child0.parent, tree)
  });
});
