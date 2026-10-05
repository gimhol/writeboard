const {
  Gaia, FactoryEnum, ShapeEnum, ToolEnum, EventEnum,
  Recorder, Player, FClipboard, ActionQueue,
} = require('../dist/es5/cjs/writeboard.js')

const assert = require('assert');

const factory = Gaia.factory(FactoryEnum.Default)();

let boards = [];
function createBoard(options = {}) {
  const element = document.createElement('div');
  const board = factory.newBoard({ element, width: 600, height: 600, ...options });
  __flushRaf()
  boards.push(board);
  return board
}
function drag(board, from, to) {
  __firePointer(board.element, 'pointerdown', { x: from.x, y: from.y })
  __firePointer(window, 'pointermove', { x: to.x, y: to.y })
  __firePointer(window, 'pointerup', { x: to.x, y: to.y })
}
function drawRect(board, from, to) {
  board.setToolType(ToolEnum.Rect)
  drag(board, from, to)
  return board.shapes()[board.shapes().length - 1]
}

describe('class Recorder', () => {
  afterEach(() => {
    boards.forEach((b) => b.destroy());
    boards = [];
  });

  it('未设置 actor 时 start() 告警并保持停止状态', () => {
    const recorder = new Recorder()
    const cap = __captureConsole('warn')
    try {
      assert.strictEqual(recorder.start(), recorder)
    } finally {
      cap.restore()
    }
    assert.strictEqual(recorder.running, false)
    assert.strictEqual(recorder.getScreenplay(), null)
    assert.ok(cap.calls.some((c) => c.includes('actor not set')))
  });

  it('setActor / getActor', () => {
    const board = createBoard()
    const recorder = new Recorder()
    assert.strictEqual(recorder.setActor(board), recorder)
    assert.strictEqual(recorder.getActor(), board)
    assert.strictEqual(recorder.setActor(board), recorder, '重复设置同一 actor 直接返回')
  });

  it('start() 生成带初始快照的剧本，记录所有板子事件', () => {
    const board = createBoard()
    const recorder = new Recorder()
    recorder.setActor(board)
    assert.strictEqual(recorder.start(), recorder)
    assert.strictEqual(recorder.running, true)

    const screenplay = recorder.getScreenplay()
    assert.ok(screenplay)
    assert.deepStrictEqual(screenplay.snapshot.s, [])
    assert.strictEqual(screenplay.events.length, 0)

    drawRect(board, { x: 10, y: 10 }, { x: 60, y: 60 })
    assert.ok(screenplay.events.length > 0)
    const types = screenplay.events.map((e) => e.type)
    assert.ok(types.includes(EventEnum.ShapesAdded))
    assert.ok(types.includes(EventEnum.ShapesDone))
    assert.ok(types.includes(EventEnum.ToolDown))
    screenplay.events.forEach((e) => assert.strictEqual(typeof e.timestamp, 'number'))
    // 约定：startTime/endTime 是 performance.now() 的绝对值，
    // 而每个事件的 timestamp 是相对剧本开始的偏移量；Board 另外附带绝对时间的 timeStamp
    assert.ok(screenplay.events[0].timestamp < 1000, '事件时间戳是相对偏移')
    assert.strictEqual(typeof screenplay.events[0].timeStamp, 'number')
    assert.ok(screenplay.endTime >= screenplay.startTime, '录制中 endTime 会持续更新')

    recorder.stop()
    assert.ok(screenplay.endTime >= screenplay.startTime)
  });

  it('getJson() 可以导出只含图形/视图事件的剧本', () => {
    const board = createBoard()
    const recorder = new Recorder()
    recorder.setActor(board).start()
    const shape = factory.newShape(ShapeEnum.Rect)
    shape.data.layer = board.layer().id
    board.add(shape, true)          // 图形事件里只有纯数据，可以序列化
    recorder.stop()

    const json = recorder.getJson()
    assert.ok(json)
    const parsed = JSON.parse(json)
    assert.strictEqual(parsed.events.length, recorder.getScreenplay().events.length)
    assert.ok(parsed.events.some((e) => e.type === EventEnum.ShapesAdded))
    assert.deepStrictEqual(parsed.snapshot.s, [], '快照是开始录制时的状态')
  });

  it('含工具事件的剧本也能导出：tool 会以类型字符串记录，避免循环引用', () => {
    const board = createBoard()
    const recorder = new Recorder()
    recorder.setActor(board).start()
    drawRect(board, { x: 0, y: 0 }, { x: 10, y: 10 })
    assert.ok(recorder.getScreenplay().events.some((e) => e.type === EventEnum.ToolDown))
    recorder.stop()

    const json = recorder.getJson()
    assert.ok(json)
    const parsed = JSON.parse(json)
    assert.strictEqual(parsed.events.length, recorder.getScreenplay().events.length)
    const toolDown = parsed.events.find((e) => e.type === EventEnum.ToolDown)
    assert.strictEqual(toolDown.tool, ToolEnum.Rect, 'tool 被替换成类型字符串')
    const geoChanged = parsed.events.find((e) => e.type === EventEnum.ShapesGeoChanged)
    assert.strictEqual(geoChanged.tool, ToolEnum.Rect)
  });

  it('stop() 之后不再记录新事件', () => {
    const board = createBoard()
    const recorder = new Recorder()
    recorder.setActor(board).start()
    drawRect(board, { x: 0, y: 0 }, { x: 10, y: 10 })
    const count = recorder.getScreenplay().events.length

    assert.strictEqual(recorder.stop(), recorder)
    assert.strictEqual(recorder.running, false)
    drawRect(board, { x: 100, y: 100 }, { x: 150, y: 150 })
    assert.strictEqual(recorder.getScreenplay().events.length, count)
  });

  it('destroy / destory 不会抛错', () => {
    const recorder = new Recorder()
    const cap = __captureConsole('log')
    try {
      assert.doesNotThrow(() => recorder.destroy())
      assert.doesNotThrow(() => recorder.destory())
      assert.doesNotThrow(() => recorder.setActor(createBoard()).destroy())
    } finally {
      cap.restore()
    }
  });
});

describe('class Player', () => {
  afterEach(() => {
    boards.forEach((b) => b.destroy());
    boards = [];
  });

  it('回放剧本可以还原图形与几何', () => {
    const source = createBoard()
    const recorder = new Recorder()
    recorder.setActor(source).start()
    const rect = drawRect(source, { x: 10, y: 20 }, { x: 60, y: 70 })
    const pen = (() => {
      source.setToolType(ToolEnum.Pen)
      __firePointer(source.element, 'pointerdown', { x: 0, y: 0 })
      __firePointer(window, 'pointermove', { x: 5, y: 5 })
      __firePointer(window, 'pointerup', { x: 10, y: 10 })
      return source.shapes().find((s) => s.type === ShapeEnum.Pen)
    })()
    recorder.stop()
    const screenplay = recorder.getScreenplay()

    const target = createBoard()
    const player = new Player()
    player.begin(target, screenplay)
    player.update_once(Infinity)

    assert.strictEqual(target.shapes().length, 2)
    const restoredRect = target.find(rect.data.id)
    assert.ok(restoredRect)
    assert.deepStrictEqual(
      { x: restoredRect.data.x, y: restoredRect.data.y, w: restoredRect.data.w, h: restoredRect.data.h },
      { x: 10, y: 20, w: 50, h: 50 }
    )
    assert.strictEqual(target.find(pen.data.id).type, ShapeEnum.Pen)

    assert.doesNotThrow(() => player.stop())
  });

  it('play() 先应用快照，再按时间轴回放事件', () => {
    const source = createBoard()
    const rect = drawRect(source, { x: 5, y: 5 }, { x: 25, y: 25 })
    const extra = factory.newShape(ShapeEnum.Rect)
    extra.data.layer = source.layer().id
    extra.geo(100, 100, 20, 20)
    const screenplay = {
      startTime: 0,
      endTime: 0,
      snapshot: source.toSnapshot(),
      events: [{ type: EventEnum.ShapesAdded, operator: 'local', timestamp: 0, shapeDatas: [extra.data.copy()] }],
    }

    const target = createBoard()
    const player = new Player()
    const cap = __captureConsole('log')
    try {
      player.play(target, screenplay)
    } finally {
      cap.restore()
    }
    assert.strictEqual(target.shapes().length, 2, '快照 + 事件都被应用')
    assert.ok(target.find(rect.data.id), '快照里的图形被还原')
    assert.ok(target.find(extra.data.id), '事件里的图形被还原')

    assert.doesNotThrow(() => __flushRaf(), '时间轴走完后自动 stop()')
    assert.strictEqual(target.shapes().length, 2)
  });

  it('剧本里的视图变化也会被还原', () => {
    const source = createBoard({ scrollWidth: 2000, scrollHeight: 2000 })
    const recorder = new Recorder()
    recorder.setActor(source).start()
    source.scroll_to(100, 50, true)
    recorder.stop()

    const target = createBoard({ scrollWidth: 2000, scrollHeight: 2000 })
    const player = new Player()
    player.begin(target, recorder.getScreenplay())
    player.update_once(Infinity)
    assert.deepStrictEqual([target.world.x, target.world.y], [-100, -50])
  });

  it('未传入剧本时 update_once / tick 安全退出', () => {
    const player = new Player()
    assert.doesNotThrow(() => player.update_once(0))
    assert.doesNotThrow(() => player.tick(0))
    assert.strictEqual(player.forward(), player)
    assert.strictEqual(player.backward(), player)
  });
});

describe('class FClipboard', () => {
  let clipboard
  before(() => {
    /** jsdom 没有剪贴板：用最小的内存实现替身，覆盖 write / read */
    clipboard = {
      items: [],
      write(items) { this.items = items; return Promise.resolve() },
      read() { return Promise.resolve(this.items) },
    }
    Object.defineProperty(navigator, 'clipboard', { value: clipboard, configurable: true })
    globalThis.ClipboardItem = class ClipboardItem {
      constructor(items) { this._items = items }
      get types() { return Object.keys(this._items) }
      getType(type) { return this._items[type] }
    }
  });

  afterEach(() => {
    boards.forEach((b) => b.destroy());
    boards = [];
    clipboard.items = [];
  });

  /** paste() 内部是 promise 链，等一轮宏任务让它跑完 */
  const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

  it('复制写入剪贴板，粘贴生成偏移且选中的新图形', async () => {
    const board = createBoard()
    const rect = drawRect(board, { x: 100, y: 100 }, { x: 150, y: 150 })
    board.setSelects([rect], true)
    const clipboardApi = new FClipboard(board)

    clipboardApi.copy()
    await flush()
    assert.strictEqual(clipboard.items.length, 1)

    clipboardApi.paste()
    await flush()
    await flush()

    assert.strictEqual(board.shapes().length, 2)
    const pasted = board.shapes().find((s) => s.data.id !== rect.data.id)
    assert.ok(pasted, '粘贴出来的是新图形')
    assert.deepStrictEqual(
      { x: pasted.data.x, y: pasted.data.y, w: pasted.data.w, h: pasted.data.h },
      { x: 110, y: 110, w: 50, h: 50 }
    )
    assert.strictEqual(pasted.selected, true, '粘贴后会选中新图形')
    assert.deepStrictEqual(board.selects, [pasted])
  });

  it('粘贴的内容会解除锁定，并保留样式', async () => {
    const board = createBoard()
    const rect = drawRect(board, { x: 0, y: 0 }, { x: 50, y: 50 })
    rect.data.fillStyle = '#00ff00'
    rect.data.locked = true
    board.setSelects([rect], true)

    const clipboardApi = new FClipboard(board)
    clipboardApi.copy()
    await flush()
    clipboardApi.paste()
    await flush()
    await flush()

    const pasted = board.shapes().find((s) => s.data.id !== rect.data.id)
    assert.strictEqual(pasted.data.locked, false)
    assert.strictEqual(pasted.data.fillStyle, '#00ff00')
  });

  it('粘贴可以通过 ActionQueue 撤销', async () => {
    const board = createBoard()
    const rect = drawRect(board, { x: 0, y: 0 }, { x: 50, y: 50 })
    board.setSelects([rect], true)
    const queue = new ActionQueue().setActor(board)

    const clipboardApi = new FClipboard(board)
    clipboardApi.copy()
    await flush()
    clipboardApi.paste()
    await flush()
    await flush()

    assert.strictEqual(board.shapes().length, 2)
    assert.strictEqual(queue.length, 1)
    queue.undo()
    assert.strictEqual(board.shapes().length, 1)
    assert.strictEqual(board.shapes()[0].data.id, rect.data.id)
    queue.redo()
    assert.strictEqual(board.shapes().length, 2)
  });

  it('剪切会复制并删除选中图形', async () => {
    const board = createBoard()
    const rect = drawRect(board, { x: 0, y: 0 }, { x: 50, y: 50 })
    board.setSelects([rect], true)

    const clipboardApi = new FClipboard(board)
    clipboardApi.cut()
    await flush()

    assert.strictEqual(board.shapes().length, 0)
    assert.strictEqual(clipboard.items.length, 1)
  });

  it('粘贴非本库内容时忽略', async () => {
    const board = createBoard()
    const clipboardApi = new FClipboard(board)
    clipboard.items = [new ClipboardItem({ 'text/plain': Promise.resolve(new Blob(['hello'])) })]
    const cap = __captureConsole('log')
    try {
      clipboardApi.paste()
      await flush()
      await flush()
    } finally {
      cap.restore()
    }
    assert.strictEqual(board.shapes().length, 0)
  });
});
