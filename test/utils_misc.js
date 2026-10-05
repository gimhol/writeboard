const { Arrays, BinaryRange, Polygon, Vector, Rect, RotatedRect } = require('../dist/es5/cjs/writeboard.js')

const assert = require('assert');

describe('namespace Arrays', () => {
  describe('firstOf(arr, transform)', () => {
    it('返回第一个非 null/undefined 的转换结果', () => {
      assert.strictEqual(Arrays.firstOf([1, 2, 3], (n) => (n > 1 ? n * 10 : null)), 20)
    });
    it('全部无效时返回 null', () => {
      assert.strictEqual(Arrays.firstOf([1, 2], () => undefined), null)
      assert.strictEqual(Arrays.firstOf([], (n) => n), null)
    });
  });
});

describe('class BinaryRange', () => {
  it('mid 取区间中点', () => {
    assert.strictEqual(new BinaryRange(0, 100).mid, 50)
    assert.strictEqual(new BinaryRange(10, 20).mid, 15)
  });
  it('set() 覆盖区间', () => {
    const r = new BinaryRange(0, 1)
    r.set({ from: 5, to: 9 })
    assert.deepStrictEqual({ from: r.from, to: r.to }, { from: 5, to: 9 })
  });
  it('hit() 判断区间是否重叠（含端点接触）', () => {
    const r = new BinaryRange(10, 20)
    assert.strictEqual(r.hit({ from: 0, to: 10 }), true)
    assert.strictEqual(r.hit({ from: 20, to: 30 }), true)
    assert.strictEqual(r.hit({ from: 15, to: 18 }), true)
    assert.strictEqual(r.hit({ from: 21, to: 30 }), false)
    assert.strictEqual(r.hit({ from: 0, to: 9 }), false)
  });
});

describe('class Polygon', () => {
  const square = [{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }]

  it('构造函数把数据点转成 Vector', () => {
    const p = new Polygon(square)
    assert.strictEqual(p.dots.length, 4)
    assert.ok(p.dots[0] instanceof Vector)
  });

  it('read() 覆盖顶点', () => {
    const p = new Polygon()
    p.read({ dots: square })
    assert.strictEqual(p.dots.length, 4)
  });

  it('static from_rect() 用矩形（含旋转）的角点构造多边形', () => {
    const plain = Polygon.from_rect(Rect.pure(0, 0, 10, 20))
    assert.deepStrictEqual(plain.dots.map((d) => ({ x: d.x, y: d.y })), [
      { x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 20 }, { x: 0, y: 20 },
    ])

    const rotated = Polygon.from_rect(RotatedRect.pure(0, 0, 10, 10, Math.PI / 2))
    assert.strictEqual(rotated.dots.length, 4)
    rotated.dots.forEach((d) => assert.ok(d instanceof Vector))
  });

  it('static contain_dot() 判断点是否在多边形内', () => {
    assert.strictEqual(Polygon.contain_dot(square, { x: 5, y: 5 }), true)
    assert.strictEqual(Polygon.contain_dot(square, { x: 5, y: 15 }), false)
  });

  it('static contain_dot2() 顶点上视为包含', () => {
    assert.strictEqual(Polygon.contain_dot2(square, 0, 0), true)
    assert.strictEqual(Polygon.contain_dot2(square, 10, 10), true)
    assert.strictEqual(Polygon.contain_dot2(square, -1, 5), false)
  });

  it('static intersect_linesegment() 返回与多边形边的交点', () => {
    // 按 polygon 顶点顺序（末点到首点）依次求交，返回第一个命中的交点：此处为左边
    const hit = Polygon.intersect_linesegment(square, -5, 5, 15, 5)
    assert.deepStrictEqual(hit, { x: 0, y: 5 })
    const miss = Polygon.intersect_linesegment(square, -5, -5, 15, -5)
    assert.strictEqual(miss, null)
  });
});
