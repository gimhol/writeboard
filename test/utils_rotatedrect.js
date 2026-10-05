const { RotatedRect, Rect } = require('../dist/es5/cjs/writeboard.js')

const assert = require('assert');
describe('class RotatedRect', () => {

  describe('constructor / set / r', () => {
    it('默认无旋转，axisX/axisY 为单位轴', () => {
      const r = new RotatedRect(1, 2, 3, 4)
      assert.strictEqual(r.r, 0)
      assert.deepStrictEqual(r.axisX, { x: 1, y: 0 })
      assert.deepStrictEqual(r.axisY, { x: -0, y: 1 })
    });
    it('设置 r 会同时更新 axisX/axisY', () => {
      const r = new RotatedRect(0, 0, 10, 10)
      r.r = Math.PI / 2
      assert.ok(Math.abs(r.axisX.x) < 1e-10)
      assert.ok(Math.abs(r.axisX.y - 1) < 1e-10)
    });
    it('set() 从数据对象读取（r 缺省为 0）', () => {
      const r = new RotatedRect()
      r.set({ x: 1, y: 2, w: 3, h: 4 })
      assert.deepStrictEqual({ x: r.x, y: r.y, w: r.w, h: r.h, r: r.r }, { x: 1, y: 2, w: 3, h: 4, r: 0 })
    });
  });

  describe('top/left/right/bottom/middle', () => {
    it('读写边界会同步宽高', () => {
      const r = new RotatedRect(10, 20, 30, 40)
      assert.strictEqual(r.right, 40)
      assert.strictEqual(r.bottom, 60)
      r.right = 100
      assert.strictEqual(r.w, 90)
      r.bottom = 200
      assert.strictEqual(r.h, 180)
    });
    it('middleX/middleY 是中心点', () => {
      const r = new RotatedRect(0, 0, 10, 20)
      assert.strictEqual(r.middleX, 5)
      assert.strictEqual(r.middleY, 10)
      r.middleX = 100
      assert.strictEqual(r.x, 95)
    });
  });

  describe('dots', () => {
    it('无旋转时等于四个角点', () => {
      const r = new RotatedRect(0, 0, 10, 20)
      assert.deepStrictEqual(r.dots, [
        { x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 20 }, { x: 0, y: 20 },
      ])
    });
    it('旋转 90° 后角点绕中心旋转', () => {
      const dots = RotatedRect.dots(0, 0, 10, 10, Math.PI / 2)
      const near = (v, t) => Math.abs(v - t) < 1e-3
      assert.ok(near(dots[0].x, 10) && near(dots[0].y, 0))
      assert.ok(near(dots[2].x, 0) && near(dots[2].y, 10))
    });
  });

  describe('static hit(a, b)', () => {
    it('都无旋转时退化为轴对齐矩形相交判定', () => {
      const a = { x: 0, y: 0, w: 10, h: 10, r: 0 }
      const b = { x: 5, y: 5, w: 10, h: 10, r: 0 }
      const c = { x: 50, y: 50, w: 10, h: 10, r: 0 }
      assert.strictEqual(RotatedRect.hit(a, b), Rect.hit(a, b))
      assert.strictEqual(RotatedRect.hit(a, c), false)
    });
    it('旋转矩形与自身相交为 true', () => {
      const a = { x: 0, y: 0, w: 100, h: 20, r: Math.PI / 4 }
      assert.strictEqual(RotatedRect.hit(a, a), true)
    });
    it('与明显分离的矩形不相交', () => {
      const a = new RotatedRect(0, 0, 10, 10, Math.PI / 4)
      const b = { x: 100, y: 100, w: 10, h: 10, r: 0 }
      assert.strictEqual(a.hit(b), false)
    });
  });

  describe('static create / ensure / pure / dots2', () => {
    it('create 生成实例，ensure 复用实例', () => {
      const data = { x: 1, y: 2, w: 3, h: 4, r: 0 }
      assert.ok(RotatedRect.create(data) instanceof RotatedRect)
      const instance = new RotatedRect(1, 2, 3, 4)
      assert.strictEqual(RotatedRect.ensure(instance), instance)
    });
    it('pure 只返回数据字段', () => {
      assert.deepStrictEqual(RotatedRect.pure(1, 2, 3, 4, 0.5), { x: 1, y: 2, w: 3, h: 4, r: 0.5 })
    });
    it('dots2 等价于 dots', () => {
      const data = { x: 0, y: 0, w: 10, h: 10, r: 0 }
      assert.deepStrictEqual(RotatedRect.dots2(data), RotatedRect.dots(0, 0, 10, 10, 0))
    });
  });

  describe('projection(axis)', () => {
    it('沿自身轴投影等于对应边长', () => {
      const r = new RotatedRect(0, 0, 30, 40)
      assert.ok(Math.abs(r.projection({ x: 1, y: 0 }) - 30) < 1e-10)
      assert.ok(Math.abs(r.projection({ x: 0, y: 1 }) - 40) < 1e-10)
    });
  });
});
