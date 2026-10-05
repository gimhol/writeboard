const { Numbers, Degrees } = require('../dist/es5/cjs/writeboard.js')

const assert = require('assert');
describe('namespace Numbers', () => {
  describe('isVaild(n)', () => {
    it('只有非 NaN 的数字有效', () => {
      assert.strictEqual(Numbers.isVaild(0), true)
      assert.strictEqual(Numbers.isVaild(-1.5), true)
      assert.strictEqual(Numbers.isVaild(NaN), false)
      assert.strictEqual(Numbers.isVaild('1'), false)
      assert.strictEqual(Numbers.isVaild(undefined), false)
      assert.strictEqual(Numbers.isVaild(null), false)
    });
  });
  describe('equals(a, b)', () => {
    it('差值在 Number.EPSILON 内视为相等', () => {
      assert.strictEqual(Numbers.equals(1, 1), true)
      assert.strictEqual(Numbers.equals(1, 1 + Number.EPSILON), true)
      assert.strictEqual(Numbers.equals(1, 1.000001), false)
    });
  });
});

describe('namespace Degrees', () => {
  describe('normalized(v)', () => {
    it('负弧度归一化到 [0, 2π)', () => {
      assert.ok(Math.abs(Degrees.normalized(-Math.PI / 2) - Math.PI * 1.5) < 1e-10)
    });
    it('超过 2π 的弧度取模', () => {
      assert.ok(Math.abs(Degrees.normalized(Math.PI * 3) - Math.PI) < 1e-10)
    });
    it('0 / undefined / null 原样返回', () => {
      assert.strictEqual(Degrees.normalized(0), 0)
      assert.strictEqual(Degrees.normalized(undefined), undefined)
      assert.strictEqual(Degrees.normalized(null), null)
    });
  });
  describe('angle(v)', () => {
    it('弧度转角度', () => {
      assert.strictEqual(Degrees.angle(Math.PI), 180)
      assert.strictEqual(Degrees.angle(Math.PI / 2), 90)
    });
    it('0 / undefined / null 原样返回', () => {
      assert.strictEqual(Degrees.angle(0), 0)
      assert.strictEqual(Degrees.angle(undefined), undefined)
      assert.strictEqual(Degrees.angle(null), null)
    });
  });
});
