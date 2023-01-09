const { Rect } = require('../dist/utils/Rect')

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
});