/**
 * 测试环境引导：给 Node 提供 DOM（jsdom）与 canvas 2d 上下文（轻量 mock）
 *
 * Test bootstrap: provides a DOM (jsdom) and a lightweight canvas 2d context mock.
 * jsdom does not implement canvas rendering, and the native `canvas` package is not
 * installed on purpose, so every `getContext('2d')` call returns a stub.
 */
const { JSDOM } = require('jsdom')

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost/',
  pretendToBeVisual: true,
})

const { window } = dom

for (const key of [
  'window', 'document', 'navigator', 'HTMLElement', 'HTMLCanvasElement', 'Element',
  'Event', 'CustomEvent', 'MouseEvent', 'KeyboardEvent',
]) {
  globalThis[key] = window[key]
}

/** canvas 2d mock：库代码用到的全部方法与属性都返回安全值 */
function createContext2D(canvas) {
  const noop = () => { }
  return {
    canvas,
    /* 属性 */
    fillStyle: '', strokeStyle: '', lineWidth: 1, lineCap: 'butt', lineJoin: 'miter',
    lineDashOffset: 0, miterLimit: 10, font: '10px sans-serif',
    textAlign: 'start', textBaseline: 'alphabetic', globalCompositeOperation: 'source-over',
    /* 方法 */
    save: noop, restore: noop, translate: noop, rotate: noop, scale: noop,
    clearRect: noop, fillRect: noop, strokeRect: noop, fill: noop, stroke: noop,
    beginPath: noop, closePath: noop, moveTo: noop, lineTo: noop, rect: noop, arc: noop,
    bezierCurveTo: noop, quadraticCurveTo: noop, setLineDash: noop, drawImage: noop,
    fillText: noop, strokeText: noop,
    measureText: (text) => ({
      width: String(text).length * 8,
      actualBoundingBoxAscent: 8, actualBoundingBoxDescent: 2,
      fontBoundingBoxAscent: 10, fontBoundingBoxDescent: 2,
    }),
    getImageData: (x, y, w, h) => ({
      data: new Uint8ClampedArray(Math.max(0, w * h * 4)),
      width: w, height: h,
    }),
  }
}

const contexts = new WeakMap()
window.HTMLCanvasElement.prototype.getContext = function (type) {
  if (type !== '2d') return null
  let ctx = contexts.get(this)
  if (!ctx) { ctx = createContext2D(this); contexts.set(this, ctx) }
  return ctx
}

/**
 * Path2D mock：jsdom 没有实现 Path2D，而库里的画笔/连线/装饰会直接 new 一个。
 * 这里只提供调用安全的方法，不记录路径。
 */
class Path2DStub {
  addPath() { }
  moveTo() { }
  lineTo() { }
  rect() { }
  arc() { }
  closePath() { }
  bezierCurveTo() { }
  quadraticCurveTo() { }
  roundRect() { }
}
globalThis.Path2D = Path2DStub
window.Path2D = Path2DStub

/** 让世界坐标换算可预测：canvas 一律位于 (0,0)，尺寸取自身 width/height */
window.HTMLCanvasElement.prototype.getBoundingClientRect = function () {
  return {
    x: 0, y: 0, left: 0, top: 0,
    width: this.width, height: this.height,
    right: this.width, bottom: this.height,
  }
}

/** requestAnimationFrame：不自动执行，测试里用 __flushRaf() 手动触发，保证可预测 */
const rafQueue = []
globalThis.requestAnimationFrame = (cb) => rafQueue.push(cb)
globalThis.cancelAnimationFrame = () => { }
globalThis.__rafQueue = rafQueue
globalThis.__flushRaf = () => {
  const queue = rafQueue.splice(0, rafQueue.length)
  // 与浏览器一致：回调参数使用 performance.now() 时钟（Player 依赖它推进时间轴）
  queue.forEach((cb) => cb(performance.now()))
  return queue.length
}

/**
 * 派发指针事件：库代码只读 button/x/y/pressure/stopPropagation 等字段，
 * jsdom 没有 PointerEvent，这里用 Event 补上这些字段。
 */
globalThis.__firePointer = (target, type, opts = {}) => {
  const event = new window.Event(type, { bubbles: true, cancelable: true })
  Object.assign(event, {
    button: opts.button === undefined ? 0 : opts.button,
    buttons: opts.buttons === undefined ? (type === 'pointerup' ? 0 : 1) : opts.buttons,
    x: opts.x || 0,
    y: opts.y || 0,
    clientX: opts.x || 0,
    clientY: opts.y || 0,
    pressure: opts.pressure === undefined ? 0.5 : opts.pressure,
  })
  target.dispatchEvent(event)
  return event
}

/** 临时接管 console 输出，返回恢复函数（用于断言告警） */
globalThis.__captureConsole = (method) => {
  const original = console[method]
  const calls = []
  console[method] = (...args) => calls.push(args.join(' '))
  return { calls, restore: () => { console[method] = original } }
}
