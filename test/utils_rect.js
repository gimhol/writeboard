const { Rect } = require('../dist/es5/cjs/writeboard.js')

const assert = require('assert');
describe('class Rect', () => {

  describe('constructor(x: number, y: number, w: number, h: number);', () => {
    const x = 5
    const y = 6
    const w = 10
    const h = 10
    const expected = { x, y, w, h }
    const info = `input: ${JSON.stringify([x, y, w, h])}, expected: ${JSON.stringify(expected)}`
    const actual = new Rect(x, y, w, h)
    it(info, () => assert.equal(JSON.stringify(expected), JSON.stringify(actual)));
  });

  describe('getter/setter: top/left/right/bottom', () => {
    it('设置 right 会同步修改 w', () => {
      const r = new Rect(10, 10, 30, 40)
      r.right = 100
      assert.strictEqual(r.x, 10)
      assert.strictEqual(r.w, 90)
    });
    it('设置 top / bottom 会同步修改 y 与 h', () => {
      const r = new Rect(0, 20, 10, 10)
      r.bottom = 100
      assert.strictEqual(r.h, 80)
      r.top = 50
      assert.strictEqual(r.y, 50)
      assert.strictEqual(r.h, 50)
    });
  });

  describe('dots / mid', () => {
    it('四个顶点按 左上/右上/右下/左下 顺序返回', () => {
      const r = new Rect(1, 2, 3, 4)
      assert.deepStrictEqual(r.dots, [
        { x: 1, y: 2 }, { x: 4, y: 2 }, { x: 4, y: 6 }, { x: 1, y: 6 },
      ])
    });
    it('mid() 返回中心点', () => {
      assert.deepStrictEqual(new Rect(0, 0, 10, 20).mid(), { x: 5, y: 10 })
    });
  });

  describe('static pure / pure2 / create / ensure / read', () => {
    it('pure() 只返回数据字段', () => {
      const data = Rect.pure(1, 2, 3, 4)
      assert.deepStrictEqual(data, { x: 1, y: 2, w: 3, h: 4 })
      assert.ok(!(data instanceof Rect))
    });
    it('pure2() 拷贝一个矩形数据', () => {
      assert.deepStrictEqual(Rect.pure2(new Rect(1, 2, 3, 4)), { x: 1, y: 2, w: 3, h: 4 })
    });
    it('ensure() 对已经是 Rect 的实例直接返回自身', () => {
      const r = new Rect(1, 2, 3, 4)
      assert.strictEqual(Rect.ensure(r), r)
      assert.ok(Rect.ensure({ x: 1, y: 2, w: 3, h: 4 }) instanceof Rect)
    });
    it('read() 覆盖全部字段', () => {
      const r = new Rect()
      r.read({ x: 9, y: 8, w: 7, h: 6 })
      assert.deepStrictEqual(r.pure(), { x: 9, y: 8, w: 7, h: 6 })
    });
  });

  describe('static equal(a, b)', () => {
    it('数值相等（含浮点误差）时为 true', () => {
      assert.strictEqual(Rect.equal(new Rect(1, 2, 3, 4), { x: 1, y: 2, w: 3, h: 4 }), true)
      assert.strictEqual(Rect.equal(new Rect(1, 2, 3, 4), { x: 1, y: 2, w: 3, h: 4 + Number.EPSILON }), true)
      assert.strictEqual(Rect.equal(new Rect(1, 2, 3, 4), { x: 1.5, y: 2, w: 3, h: 4 }), false)
    });
  });

  describe('static bounds(r1, r2)', () => {
    it('返回包含两个矩形的最小矩形', () => {
      assert.deepStrictEqual(
        Rect.bounds({ x: 10, y: 10, w: 10, h: 10 }, { x: 0, y: 30, w: 5, h: 5 }),
        { x: 0, y: 10, w: 20, h: 25 }
      )
    });
  });

  describe('static hit(a, b)', () => {
    const a = { x: 0, y: 0, w: 100, h: 100 }
    it('点落在矩形内（含边界）为 true', () => {
      assert.strictEqual(Rect.hit(a, { x: 50, y: 50 }), true)
      assert.strictEqual(Rect.hit(a, { x: 0, y: 0 }), true)
      assert.strictEqual(Rect.hit(a, { x: 100, y: 100 }), true)
    });
    it('点在矩形外为 false', () => {
      assert.strictEqual(Rect.hit(a, { x: 101, y: 50 }), false)
      assert.strictEqual(Rect.hit(a, { x: 50, y: -1 }), false)
    });
    it('两个矩形相交（含仅边界接触）为 true', () => {
      assert.strictEqual(Rect.hit(a, { x: 50, y: 50, w: 100, h: 100 }), true)
      assert.strictEqual(Rect.hit(a, { x: 100, y: 100, w: 10, h: 10 }), true)
      assert.strictEqual(Rect.hit(a, { x: 101, y: 50, w: 10, h: 10 }), false)
    });
  });

  describe('static intersect(a, b)', () => {
    it('返回交集矩形', () => {
      assert.deepStrictEqual(
        Rect.intersect({ x: 0, y: 0, w: 100, h: 100 }, { x: 50, y: 50, w: 100, h: 100 }),
        { x: 50, y: 50, w: 50, h: 50 }
      )
    });
    it('不相交时宽高为负', () => {
      const r = Rect.intersect({ x: 0, y: 0, w: 10, h: 10 }, { x: 100, y: 100, w: 10, h: 10 })
      assert.ok(r.w <= 0 && r.h <= 0)
    });
  });

  describe('static line_segment_intersection(rect, line)', () => {
    const rect = { x: 0, y: 0, w: 100, h: 100 }
    it('线段穿过矩形时返回两个交点，并按距离线段起点排序', () => {
      const dots = Rect.line_segment_intersection(rect, { x0: -50, y0: 50, x1: 150, y1: 50 })
      assert.strictEqual(dots.length, 2)
      assert.deepStrictEqual(dots[0], { x: 0, y: 50 })
      assert.deepStrictEqual(dots[1], { x: 100, y: 50 })
    });
    it('线段完全在矩形内时没有交点', () => {
      assert.deepStrictEqual(Rect.line_segment_intersection(rect, { x0: 10, y0: 10, x1: 20, y1: 20 }), [])
    });
    it('线段完全在矩形外时没有交点', () => {
      assert.deepStrictEqual(Rect.line_segment_intersection(rect, { x0: 200, y0: 200, x1: 300, y1: 300 }), [])
    });
    it('线段一端在矩形内、另一端在外时返回一个交点', () => {
      const dots = Rect.line_segment_intersection(rect, { x0: 50, y0: 50, x1: 200, y1: 50 })
      assert.strictEqual(dots.length, 1)
      assert.deepStrictEqual(dots[0], { x: 100, y: 50 })
    });
  });

  describe('vaild()', () => {
    it('宽或高非负时为 true', () => {
      assert.strictEqual(new Rect(0, 0, 0, 0).vaild(), true)
      assert.strictEqual(new Rect(0, 0, -1, 0).vaild(), true)
      assert.strictEqual(new Rect(0, 0, -1, -1).vaild(), false)
    });
  });
});
