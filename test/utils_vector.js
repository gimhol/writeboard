const { Vector } = require('../dist/utils/Vector')

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

});