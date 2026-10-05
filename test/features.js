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

describe('class Player（倍速 / 进度 / 暂停 / 跳转 / 结束回调）', () => {
  const players = []
  /** 记录创建的回放器，用例结束后统一停掉，避免时间轴跨用例泄漏 */
  function makePlayer() {
    const player = new Player()
    players.push(player)
    return player
  }
  afterEach(() => {
    players.forEach((p) => p.stop())
    players.length = 0
    __rafQueue.length = 0
    boards.forEach((b) => b.destroy());
    boards = [];
    __resetRafTime()
  });

  /**
   * 手工剧本：0ms 加一个矩形 A，500ms 时把 A 移到 (100,0)，1000ms 时加矩形 B
   */
  function makeScript() {
    const board = createBoard()
    const a = factory.newShape(ShapeEnum.Rect)
    a.data.layer = board.layer().id
    a.geo(0, 0, 50, 50)
    const b = factory.newShape(ShapeEnum.Rect)
    b.data.layer = board.layer().id
    b.geo(200, 0, 50, 50)
    return {
      a, b,
      screenplay: {
        startTime: 0,
        endTime: 1000,
        snapshot: board.toSnapshot(),
        events: [
          { type: EventEnum.ShapesAdded, operator: 'local', timestamp: 0, shapeDatas: [a.data] },
          { type: EventEnum.ShapesGeoChanging, operator: 'local', timestamp: 500, shapeDatas: [[{ i: a.data.id, x: 100, y: 0, w: 50, h: 50 }, { i: a.data.id, x: 0, y: 0, w: 50, h: 50 }]] },
          { type: EventEnum.ShapesAdded, operator: 'local', timestamp: 1000, shapeDatas: [b.data] },
        ],
      },
    }
  }
  /** 推进一帧：第一帧只用于对表，之后每帧按 delta 推进 rate * delta 剧本时间 */
  function frame(clock, delta) {
    __setRafTime(clock + delta)
    __flushRaf()
    return clock + delta
  }
  const xOf = (board, id) => {
    const shape = board.find(id)
    return shape ? shape.data.x : null
  }

  it('play() 立刻呈现第 0 帧，并按时间轴逐个应用事件', () => {
    const { a, b, screenplay } = makeScript()
    const target = createBoard()
    const player = makePlayer()
    player.play(target, screenplay)

    assert.strictEqual(target.shapes().length, 1, '快照 + 0ms 的事件已生效')
    assert.strictEqual(player.state, 'playing')
    assert.strictEqual(player.duration, 1000)
    assert.strictEqual(player.time, 0)
    assert.strictEqual(player.progress, 0)

    let clock = frame(1000, 0)          // 对表
    clock = frame(clock, 300);
    assert.strictEqual(player.time, 300)
    assert.strictEqual(xOf(target, a.data.id), 0, '还没到 500ms 的移动事件')
    assert.strictEqual(target.shapes().length, 1)

    clock = frame(clock, 300);
    assert.strictEqual(player.time, 600)
    assert.strictEqual(xOf(target, a.data.id), 100)
    assert.strictEqual(target.shapes().length, 1)

    clock = frame(clock, 500);
    assert.strictEqual(player.time, 1000)
    assert.strictEqual(target.shapes().length, 2)
    assert.ok(target.find(b.data.id))
  });

  it('倍速：rate = 4 时同样的真实时间走 4 倍剧本时间', () => {
    const { a, screenplay } = makeScript()
    const target = createBoard()
    const player = makePlayer()
    player.play(target, screenplay, { rate: 4 })

    let clock = frame(1000, 0)
    clock = frame(clock, 100)           // 真实 100ms → 剧本 400ms
    assert.strictEqual(player.time, 400)
    assert.strictEqual(player.rate, 4)
    assert.strictEqual(xOf(target, a.data.id), 0)

    clock = frame(clock, 25)            // 真实 25ms → 剧本 100ms，累计 500ms
    assert.strictEqual(player.time, 500)
    assert.strictEqual(xOf(target, a.data.id), 100, '按倍速换算后刚好触发 500ms 的事件')

    player.rate = 0.5
    clock = frame(clock, 100)           // 真实 100ms → 剧本 50ms
    assert.strictEqual(player.time, 550)
    assert.strictEqual(player.progress, 0.55)
  });

  it('onProgress 每帧回调，onEnd 播完回调一次且状态为 ended', () => {
    const { screenplay } = makeScript()
    const target = createBoard()
    const progress = []
    const ends = []
    const player = makePlayer()
    player.play(target, screenplay, {
      onProgress: (p) => progress.push(p),
      onEnd: (p) => ends.push(p),
    })

    let clock = frame(1000, 0)
    clock = frame(clock, 400)
    clock = frame(clock, 400)
    clock = frame(clock, 400)           // 到达 1000ms（结束）

    assert.strictEqual(ends.length, 1)
    assert.strictEqual(ends[0].state, 'ended')
    assert.strictEqual(ends[0].progress, 1)
    assert.strictEqual(ends[0].time, 1000)
    assert.strictEqual(player.state, 'ended')
    assert.strictEqual(player.playing, false)

    const times = progress.map((p) => p.time)
    assert.deepStrictEqual(times, [0, 0, 400, 800, 1000], 'play 时一次 + 每帧一次 + 结束时一次')
    assert.deepStrictEqual(progress.map((p) => p.eventCount), [3, 3, 3, 3, 3])
    assert.ok(progress[progress.length - 1].eventIndex === 3)

    const emitted = progress.length
    clock = frame(clock, 500)           // 结束后再推进时间：不应有任何回调
    assert.strictEqual(progress.length, emitted, '结束后不再回调进度')
    assert.strictEqual(ends.length, 1, 'onEnd 只回调一次')
    assert.strictEqual(player.time, 1000, '结束后时间停在结尾')
  });

  it('暂停后时间与画面都停住，继续后接着走', () => {
    const { a, screenplay } = makeScript()
    const target = createBoard()
    const player = makePlayer()
    player.play(target, screenplay)

    let clock = frame(1000, 0)
    clock = frame(clock, 400)
    assert.strictEqual(player.time, 400)

    assert.strictEqual(player.pause(), player)
    assert.strictEqual(player.state, 'paused')
    assert.strictEqual(player.paused, true)
    assert.strictEqual(__rafQueue.length, 0, '暂停时取消掉待执行的帧')
    assert.strictEqual(__flushRaf(), 0)

    clock = frame(clock, 500)           // 暂停期间推进真实时间 → 不应影响回放
    assert.strictEqual(player.time, 400)
    assert.strictEqual(xOf(target, a.data.id), 0)

    assert.strictEqual(player.resume(), player)
    assert.strictEqual(player.state, 'playing')
    clock = frame(clock, 200)           // 继续后第一帧只对表
    clock = frame(clock, 200)
    assert.strictEqual(player.time, 600, '继续后从 400ms 接着走')
    assert.strictEqual(xOf(target, a.data.id), 100)
  });

  it('seek 可以跳到任意时间，往回跳会重建状态', () => {
    const { a, b, screenplay } = makeScript()
    const target = createBoard()
    const player = makePlayer()
    player.play(target, screenplay)
    player.seek(1000)                   // 直接跳到结尾
    assert.strictEqual(player.time, 1000)
    assert.strictEqual(target.shapes().length, 2)
    assert.strictEqual(player.progress, 1)

    player.seek(600)                    // 往回跳
    assert.strictEqual(player.time, 600)
    assert.strictEqual(target.shapes().length, 1, '重建后 B 还没出现')
    assert.strictEqual(xOf(target, a.data.id), 100)

    player.seek(0)                      // 跳回开头
    assert.deepStrictEqual(target.shapes().map((s) => s.data.id), [a.data.id])
    assert.strictEqual(xOf(target, a.data.id), 0)
    assert.strictEqual(player.progress, 0)

    player.seek(-100)
    assert.strictEqual(player.time, 0, '越界会被夹到 0')
    player.seek(999999)
    assert.strictEqual(player.time, 1000, '越界会被夹到 duration')
    assert.strictEqual(player.eventIndex, 3)
  });

  it('seek 之后可以继续播放', () => {
    const { a, screenplay } = makeScript()
    const target = createBoard()
    const player = makePlayer()
    player.play(target, screenplay)
    player.pause()
    player.seek(400)
    assert.strictEqual(player.state, 'paused', 'seek 不改变播放状态')
    player.resume()

    let clock = performance.now()
    clock = frame(clock, 100)           // 对表
    clock = frame(clock, 200)           // 400 → 600
    assert.strictEqual(player.time, 600)
    assert.strictEqual(xOf(target, a.data.id), 100)
  });

  it('backward() 真正倒放：时间倒流且画面回退', () => {
    const { a, b, screenplay } = makeScript()
    const target = createBoard()
    const player = makePlayer()
    const ends = []
    player.play(target, screenplay, { onEnd: (p) => ends.push(p) })
    player.seek(1000)
    assert.strictEqual(player.state, 'playing', 'seek 到结尾后仍在播放状态')

    assert.strictEqual(player.backward(), player)
    assert.strictEqual(player.rate, -1)

    let clock = frame(2000, 0)
    clock = frame(clock, 300)           // 1000 → 700
    assert.strictEqual(player.time, 700)
    assert.strictEqual(target.shapes().length, 1, 'B 被回退掉了')
    assert.strictEqual(xOf(target, a.data.id), 100)

    clock = frame(clock, 300)           // 700 → 400
    assert.strictEqual(player.time, 400)
    assert.strictEqual(xOf(target, a.data.id), 0, 'A 的移动也被回退')

    clock = frame(clock, 500)           // 倒放到头
    assert.strictEqual(player.time, 0)
    assert.strictEqual(player.state, 'ended')
    assert.strictEqual(ends.length, 1, '倒放到头也会回调 onEnd')
    assert.strictEqual(ends[0].time, 0)

    assert.strictEqual(player.forward(), player)
    assert.strictEqual(player.rate, 1)
    assert.strictEqual(player.paused, false)
  });

  it('stop() 取消时间轴但不触发 onEnd', () => {
    const { screenplay } = makeScript()
    const target = createBoard()
    const ends = []
    const player = makePlayer()
    player.play(target, screenplay, { onEnd: (p) => ends.push(p) })
    let clock = frame(1000, 0)
    clock = frame(clock, 300)

    assert.strictEqual(player.stop(), player)
    assert.strictEqual(player.state, 'stopped')
    assert.strictEqual(player.time, 300, '停止时保留当前位置')
    assert.strictEqual(__rafQueue.length, 0)
    assert.strictEqual(ends.length, 0)
    assert.strictEqual(player.playing, false)
    assert.strictEqual(player.resume(), player, 'stop 之后 resume() 不生效')
    assert.strictEqual(player.state, 'stopped')
  });

  it('重复 play() 不会叠加时间轴', () => {
    const { screenplay } = makeScript()
    const target = createBoard()
    const player = makePlayer()
    player.play(target, screenplay)
    player.play(target, screenplay)
    assert.strictEqual(player.state, 'playing')
    assert.strictEqual(player.time, 0, '重新开始')

    // 若两条时间轴叠加，同样的真实时间会让回放时间走两倍
    let clock = frame(1000, 0)
    clock = frame(clock, 100)
    assert.strictEqual(player.time, 100, '只有一个时间轴在推进')
  });

  it('没有 endTime 的旧格式剧本：duration 按最后一个事件推断，能正常播完', () => {
    const board = createBoard()
    const shape = factory.newShape(ShapeEnum.Rect)
    shape.data.layer = board.layer().id
    shape.geo(10, 10, 10, 10)
    const legacy = {
      startTime: 100,
      snapshot: board.toSnapshot(),
      events: [
        { timeStamp: 0, type: EventEnum.ShapesAdded, shapeDatas: [shape.data] },
      ],
    }
    const target = createBoard()
    const ends = []
    const player = makePlayer()
    player.play(target, legacy, { onEnd: (p) => ends.push(p) })
    __flushRaf()

    assert.strictEqual(player.duration, 0, '事件没有 timestamp，时长退化为 0')
    assert.strictEqual(ends.length, 1, '不会因为 NaN 卡死，会立刻走完并回调')
    assert.strictEqual(target.shapes().length, 1)
  });

  it('只含 *Changed 变体事件的剧本也能回放', () => {
    const board = createBoard()
    const shape = factory.newShape(ShapeEnum.Rect)
    shape.data.layer = board.layer().id
    shape.geo(0, 0, 40, 40)
    const screenplay = {
      startTime: 0,
      endTime: 100,
      snapshot: board.toSnapshot(),
      events: [
        { type: EventEnum.ShapesAdded, operator: 'local', timestamp: 0, shapeDatas: [shape.data] },
        // 缩放过程中被记录成 ShapesGeoChanged（而不是 ShapesGeoChanging）
        { type: EventEnum.ShapesGeoChanged, operator: 'local', timestamp: 100, shapeDatas: [[{ i: shape.data.id, x: 10, y: 10, w: 80, h: 60 }, { i: shape.data.id, x: 0, y: 0, w: 40, h: 40 }]] },
      ],
    }
    const target = createBoard()
    const player = makePlayer()
    player.begin(target, screenplay)
    player.update_once(Infinity)
    assert.strictEqual(target.shapes().length, 1)
    assert.deepStrictEqual(
      { x: target.shapes()[0].data.x, y: target.shapes()[0].data.y, w: target.shapes()[0].data.w, h: target.shapes()[0].data.h },
      { x: 10, y: 10, w: 80, h: 60 }
    )

    // 画笔数据以 ShapesChanged 记录时同样能合并（等价于 ShapesChanging）
    const penBoard = createBoard()
    const pen = factory.newShape(ShapeEnum.Pen)
    pen.data.layer = penBoard.layer().id
    const screenplay2 = {
      startTime: 0,
      endTime: 100,
      snapshot: penBoard.toSnapshot(),
      events: [
        { type: EventEnum.ShapesAdded, operator: 'local', timestamp: 0, shapeDatas: [pen.data] },
        { type: EventEnum.ShapesChanged, operator: 'local', timestamp: 50, shapeDatas: [[{ i: pen.data.id, u: [0, 0, 10, 10, 20, 0], v: 1 }, { i: pen.data.id, u: [], v: 1 }]] },
      ],
    }
    const penTarget = createBoard()
    const player2 = makePlayer()
    player2.begin(penTarget, screenplay2)
    player2.update_once(Infinity)
    const penShape = penTarget.shapes()[0]
    assert.strictEqual(penTarget.shapes().length, 1)
    assert.deepStrictEqual(penShape.data.coords, [0, 0, 10, 10, 20, 0])
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
