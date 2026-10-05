const { Vector } = require('../dist/es5/cjs/writeboard.js')

const assert = require('assert');
describe('class Vector', () => {

  describe('static mid(v0: IVector, v1: IVector, factor?: number): IVector;', () => {
    const v0 = { x: 0, y: 1 }
    const v1 = { x: 1, y: 0 }
    const factor = 0.5
    const expected = { x: 0.5, y: 0.5 }
    const info = `input: ${JSON.stringify([v0, v1, factor])}, expected: ${JSON.stringify(expected)}`
    const actual = Vector.mid(v0, v1, factor)
    it(info, () => assert.equal(JSON.stringify(expected), JSON.stringify(actual)));
  });

  describe('static pure(x: number, y: number): IVector;', () => {
    const x = 3
    const y = 4
    const expected = { x: 3, y: 4 }
    const info = `input: ${JSON.stringify([x, y])}, expected: ${JSON.stringify(expected)}`
    const actual = Vector.pure(x, y)
    it(info, () => assert.equal(JSON.stringify(expected), JSON.stringify(actual)));
  });

  describe('static distance(v0: IVector, v1: IVector): number;', () => {
    const v0 = { x: 0, y: 1 }
    const v1 = { x: 1, y: 0 }
    const expected = Math.sqrt(
      Math.pow(v0.x - v1.x, 2) +
      Math.pow(v0.y - v1.y, 2)
    )
    const info = `input: ${JSON.stringify([v0, v1])}, expected: ${expected}`
    it(info, () => assert.equal(Vector.distance(v0, v1), expected));
  });

  describe('constructor(x: number, y: number);', () => {
    const x = 5
    const y = 6
    const expected = { x: 5, y: 6 }
    const info = `input: ${JSON.stringify([x, y])}, expected: ${JSON.stringify(expected)}`
    const actual = new Vector(x, y)
    it(info, () => assert.equal(JSON.stringify(expected), JSON.stringify(actual)));
  });

  describe('实例方法', () => {
    it('add / plus / minus 修改自身并返回 this', () => {
      const v = new Vector(1, 2)
      assert.strictEqual(v.add(3, 4), v)
      assert.deepStrictEqual({ x: v.x, y: v.y }, { x: 4, y: 6 })
      v.plus({ x: 1, y: 1 })
      assert.deepStrictEqual({ x: v.x, y: v.y }, { x: 5, y: 7 })
      v.minus({ x: 5, y: 7 })
      assert.deepStrictEqual({ x: v.x, y: v.y }, { x: 0, y: 0 })
    });
    it('read / set 覆盖坐标', () => {
      const v = new Vector(0, 0)
      v.read({ x: 8, y: 9 })
      assert.deepStrictEqual({ x: v.x, y: v.y }, { x: 8, y: 9 })
      assert.strictEqual(v.set(1, 2), v)
      assert.deepStrictEqual({ x: v.x, y: v.y }, { x: 1, y: 2 })
    });
    it('rotate 绕给定圆心旋转，rotated 返回新实例', () => {
      const v = new Vector(1, 0)
      v.rotate(Math.PI / 2, { x: 0, y: 0 })
      assert.ok(Math.abs(v.x - 0) < 1e-10)
      assert.ok(Math.abs(v.y - 1) < 1e-10)

      const origin = new Vector(0, 1)
      const rotated = origin.rotated(Math.PI, { x: 0, y: 0 })
      assert.notStrictEqual(rotated, origin)
      assert.ok(Math.abs(rotated.y + 1) < 1e-10)
    });
  });

  describe('静态工具方法', () => {
    it('plus / minus 返回新对象', () => {
      assert.deepStrictEqual(Vector.plus({ x: 1, y: 2 }, { x: 3, y: 4 }), { x: 4, y: 6 })
      assert.deepStrictEqual(Vector.minus({ x: 3, y: 4 }, { x: 1, y: 2 }), { x: 2, y: 2 })
    });
    it('mid 默认取中点，factor 可调', () => {
      assert.deepStrictEqual(Vector.mid({ x: 0, y: 0 }, { x: 10, y: 0 }), { x: 5, y: 0 })
      assert.deepStrictEqual(Vector.mid({ x: 0, y: 0 }, { x: 10, y: 0 }, 0.25), { x: 2.5, y: 0 })
    });
    it('manhattan 返回曼哈顿距离', () => {
      assert.strictEqual(Vector.manhattan({ x: 0, y: 0 }, { x: 3, y: 4 }), 7)
    });
    it('dot 返回点积的绝对值', () => {
      assert.strictEqual(Vector.dot({ x: 1, y: 2 }, { x: 3, y: 4 }), 11)
      assert.strictEqual(Vector.dot({ x: -1, y: -2 }, { x: 3, y: 4 }), 11)
    });
    it('multiply 缩放向量', () => {
      assert.deepStrictEqual(Vector.multiply({ x: 2, y: 3 }, 2), { x: 4, y: 6 })
    });
    it('rotated2 在弧度为 0 时原样返回', () => {
      assert.deepStrictEqual(Vector.rotated2(3, 4, 0, 0, 0), { x: 3, y: 4 })
    });
    it('equal2 比较坐标', () => {
      assert.strictEqual(Vector.equal2(1, 2, 1, 2), true)
      assert.strictEqual(Vector.equal2(1, 2, 1.5, 2), false)
    });
    it('create / ensure', () => {
      const v = new Vector(1, 2)
      assert.strictEqual(Vector.ensure(v), v)
      assert.ok(Vector.ensure({ x: 1, y: 2 }) instanceof Vector)
    });
  });
});
