const {
  Gaia, FactoryEnum, ShapeEnum, ToolEnum, EventEnum, Rect,
  ShapeData, Shape, ShapeNeedPath, SimpleTool, ActionQueue,
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
/** 按库的监听方式派发事件：pointerdown 在宿主元素上，move/up 在 window 上 */
function drag(board, from, to, steps = []) {
  __firePointer(board.element, 'pointerdown', { x: from.x, y: from.y })
  steps.forEach((p) => __firePointer(window, 'pointermove', { x: p.x, y: p.y }))
  __firePointer(window, 'pointermove', { x: to.x, y: to.y })
  __firePointer(window, 'pointerup', { x: to.x, y: to.y })
}
function geoOf(shape) {
  const { x, y, w, h } = shape.data
  return { x, y, w, h }
}

describe('工具（经 Board 派发指针事件）', () => {
  afterEach(() => {
    boards.forEach((b) => b.destroy());
    boards = [];
  });

  describe('SimpleTool 派生工具', () => {
    it('拖拽创建图形，坐标使用世界坐标', () => {
      const board = createBoard()
      board.setToolType(ToolEnum.Rect)
      drag(board, { x: 100, y: 50 }, { x: 160, y: 130 })
      assert.strictEqual(board.shapes().length, 1)
      const shape = board.shapes()[0]
      assert.strictEqual(shape.type, ShapeEnum.Rect)
      assert.deepStrictEqual(geoOf(shape), { x: 100, y: 50, w: 60, h: 80 })
    });

    it('反向拖拽会被归一化成正的宽高', () => {
      const board = createBoard()
      board.setToolType(ToolEnum.Rect)
      drag(board, { x: 200, y: 200 }, { x: 100, y: 100 })
      assert.deepStrictEqual(geoOf(board.shapes()[0]), { x: 100, y: 100, w: 100, h: 100 })
    });

    it('视口滚动后，屏幕坐标被换算成世界坐标', () => {
      const board = createBoard({ scrollWidth: 2000, scrollHeight: 2000 })
      board.scroll_to(50, 50)
      board.setToolType(ToolEnum.Rect)
      drag(board, { x: 100, y: 100 }, { x: 200, y: 200 })
      assert.deepStrictEqual(geoOf(board.shapes()[0]), { x: 150, y: 150, w: 100, h: 100 })
    });

    it('每次拖拽都是独立的新图形，并归属当前编辑图层', () => {
      const board = createBoard()
      board.setToolType(ToolEnum.Rect)
      drag(board, { x: 0, y: 0 }, { x: 10, y: 10 })
      drag(board, { x: 20, y: 20 }, { x: 30, y: 30 })
      const shapes = board.shapes()
      assert.strictEqual(shapes.length, 2)
      assert.notStrictEqual(shapes[0].data.id, shapes[1].data.id)
      assert.deepStrictEqual(shapes.map((s) => s.data.layer), [board.layer().id, board.layer().id])
    });

    it('未按下就移动不会创建图形', () => {
      const board = createBoard()
      board.setToolType(ToolEnum.Rect)
      __firePointer(window, 'pointermove', { x: 100, y: 100 })
      assert.strictEqual(board.shapes().length, 0)
    });

    it('派发完整的工具与图形事件', () => {
      const board = createBoard()
      board.setToolType(ToolEnum.Rect)
      const events = {}
      for (const type of [EventEnum.ToolDown, EventEnum.ToolDraw, EventEnum.ToolUp,
        EventEnum.ShapesAdded, EventEnum.ShapesGeoChanging, EventEnum.ShapesGeoChanged, EventEnum.ShapesDone]) {
        events[type] = []
        board.on(type, (d) => events[type].push(d))
      }

      drag(board, { x: 10, y: 20 }, { x: 60, y: 80 })
      assert.strictEqual(events[EventEnum.ToolDown].length, 1)
      assert.strictEqual(events[EventEnum.ToolDraw].length, 1)
      assert.strictEqual(events[EventEnum.ToolUp].length, 1)
      assert.strictEqual(events[EventEnum.ShapesAdded].length, 1, '按下时就把图形加入板子')
      assert.strictEqual(events[EventEnum.ShapesGeoChanging].length, 2, '移动与抬起各广播一次')
      assert.strictEqual(events[EventEnum.ShapesGeoChanged].length, 1)
      assert.strictEqual(events[EventEnum.ShapesDone].length, 1)

      const done = events[EventEnum.ShapesDone][0]
      assert.strictEqual(done.operator, 'local')
      assert.strictEqual(done.shapeDatas.length, 1)
      assert.deepStrictEqual(
        { x: done.shapeDatas[0].x, y: done.shapeDatas[0].y, w: done.shapeDatas[0].w, h: done.shapeDatas[0].h },
        { x: 10, y: 20, w: 50, h: 60 }
      )
      assert.strictEqual(events[EventEnum.ToolDown][0].tool, board.tool, '工具事件带上工具实例')
      assert.strictEqual(events[EventEnum.ToolDraw][0].operator, 'local')
    });

    it('切换工具会替换实例，board.tools 保留每种类型的最近实例', () => {
      const board = createBoard()
      board.setToolType(ToolEnum.Rect)
      const first = board.tool
      assert.strictEqual(board.tools.get(ToolEnum.Rect), first)

      board.setToolType(ToolEnum.Oval)
      assert.strictEqual(board.tools.get(ToolEnum.Rect), first, '切走后旧实例仍留在表里')
      assert.notStrictEqual(board.tool, first)

      board.setToolType(ToolEnum.Rect)
      assert.notStrictEqual(board.tool, first, '再次切换创建新实例（board.tools 只写不读）')
      assert.strictEqual(board.tools.get(ToolEnum.Rect), board.tool)
      assert.strictEqual(board.tools.size, 2)
    });

    it('Oval 工具产出椭圆图形', () => {
      const board = createBoard()
      board.setToolType(ToolEnum.Oval)
      drag(board, { x: 300, y: 300 }, { x: 400, y: 350 })
      const shape = board.shapes()[0]
      assert.strictEqual(shape.type, ShapeEnum.Oval)
      assert.deepStrictEqual(geoOf(shape), { x: 300, y: 300, w: 100, h: 50 })
    });
  });

  describe('画笔工具', () => {
    it('逐点累积坐标，抬起后结束编辑并广播 ShapesDone', () => {
      const board = createBoard()
      const done = []
      board.on(EventEnum.ShapesDone, (d) => done.push(d))
      board.setToolType(ToolEnum.Pen)

      __firePointer(board.element, 'pointerdown', { x: 10, y: 10 })
      const shape = board.shapes()[0]
      assert.strictEqual(shape.type, ShapeEnum.Pen)
      assert.strictEqual(shape.data.editing, true, '书写过程中处于编辑状态')
      assert.strictEqual(shape.data.layer, board.layer().id)

      __firePointer(window, 'pointermove', { x: 20, y: 20 })
      __firePointer(window, 'pointermove', { x: 30, y: 30 })
      __firePointer(window, 'pointermove', { x: 40, y: 40 })
      __firePointer(window, 'pointerup', { x: 50, y: 50 })

      assert.deepStrictEqual(shape.data.coords, [10, 10, 20, 20, 30, 30, 40, 40, 50, 50])
      assert.deepStrictEqual(geoOf(shape), { x: 10, y: 10, w: 40, h: 40 })
      assert.strictEqual(shape.data.editing, false)
      assert.strictEqual(done.length, 1)
      assert.strictEqual(done[0].shapeDatas[0].coords.length, 10)
    });

    it('书写中切换工具会收尾当前笔画', () => {
      const board = createBoard()
      const done = []
      board.on(EventEnum.ShapesDone, (d) => done.push(d))
      board.setToolType(ToolEnum.Pen)

      __firePointer(board.element, 'pointerdown', { x: 0, y: 0 })
      __firePointer(window, 'pointermove', { x: 10, y: 10 })
      const pen = board.shapes()[0]
      assert.strictEqual(pen.data.editing, true)

      board.setToolType(ToolEnum.Rect)
      assert.strictEqual(pen.data.editing, false)
      assert.strictEqual(done.length, 1, '切换工具时补发 ShapesDone')
    });
  });

  describe('橡皮擦工具', () => {
    /** 画一条从 (10, 100) 到 (400, 100) 的长笔画 */
    function drawLongPen(board) {
      board.setToolType(ToolEnum.Pen)
      __firePointer(board.element, 'pointerdown', { x: 10, y: 100 })
      for (let x = 20; x <= 400; x += 20) __firePointer(window, 'pointermove', { x, y: 100 })
      __firePointer(window, 'pointerup', { x: 400, y: 100 })
      return board.shapes().find((s) => s.type === ShapeEnum.Pen)
    }

    it('擦除笔画中段会把笔画拆成两段', () => {
      const board = createBoard()
      const pen = drawLongPen(board)
      const removed = []
      board.on(EventEnum.ShapesRemoved, (d) => removed.push(d))

      board.setToolType(ToolEnum.Eraser)
      __firePointer(board.element, 'pointerdown', { x: 200, y: 100 })
      __firePointer(window, 'pointerup', { x: 200, y: 100 })

      const pens = board.shapes().filter((s) => s.type === ShapeEnum.Pen)
      assert.strictEqual(pens.length, 2)
      assert.ok(!board.shapes().includes(pen), '原笔画被移除')
      assert.strictEqual(removed.length, 1)

      const [left, right] = pens.map((p) => p.data.coords)
      assert.ok(left.length >= 4 && right.length >= 4, '两段各至少有 2 个点')
      assert.strictEqual(left[0], 10)
      assert.strictEqual(left[left.length - 2], 150, '左段止于擦除区左边界')
      assert.strictEqual(right[0], 250, '右段始于擦除区右边界')
      assert.strictEqual(right[right.length - 2], 400)
      for (let i = 0; i < left.length; i += 2) assert.ok(left[i] <= 150, `左段不应越界: ${left[i]}`)
      for (let i = 0; i < right.length; i += 2) assert.ok(right[i] >= 250, `右段不应越界: ${right[i]}`)
      assert.ok(!board.shapes().includes(pen))
    });

    it('完全覆盖笔画时整条笔画被删除且不产生碎片', () => {
      const board = createBoard()
      board.setToolType(ToolEnum.Pen)
      __firePointer(board.element, 'pointerdown', { x: 100, y: 100 })
      __firePointer(window, 'pointermove', { x: 110, y: 105 })
      __firePointer(window, 'pointerup', { x: 110, y: 105 })
      assert.strictEqual(board.shapes().length, 1)

      board.setToolType(ToolEnum.Eraser)
      __firePointer(board.element, 'pointerdown', { x: 105, y: 100 })
      __firePointer(window, 'pointerup', { x: 105, y: 100 })
      assert.strictEqual(board.shapes().length, 0)
    });
  });

  describe('选择器工具', () => {
    function withRect(board) {
      const shape = factory.newShape(ShapeEnum.Rect)
      shape.data.layer = board.layer().id
      board.add(shape)
      shape.geo(100, 100, 100, 100)
      return shape
    }

    it('点击图形选中，点击空白取消选择', () => {
      const board = createBoard()
      const shape = withRect(board)
      board.setToolType(ToolEnum.Selector)

      __firePointer(board.element, 'pointerdown', { x: 150, y: 150 })
      assert.deepStrictEqual(board.selects, [shape])
      assert.strictEqual(shape.selected, true)
      __firePointer(window, 'pointerup', { x: 150, y: 150 })

      __firePointer(board.element, 'pointerdown', { x: 500, y: 500 })
      __firePointer(window, 'pointerup', { x: 500, y: 500 })
      assert.deepStrictEqual(board.selects, [])
      assert.strictEqual(shape.selected, false)
    });

    it('拖动图形内部会移动图形', () => {
      const board = createBoard()
      const shape = withRect(board)
      board.setToolType(ToolEnum.Selector)

      drag(board, { x: 150, y: 150 }, { x: 220, y: 190 })
      assert.deepStrictEqual(geoOf(shape), { x: 170, y: 140, w: 100, h: 100 })
    });
  });

  describe('自定义图形与自定义工具', () => {
    const SHAPE_TEST_TRIANGLE = 'SHAPE_TEST_TRIANGLE'
    const TOOL_TEST_TRIANGLE = 'TOOL_TEST_TRIANGLE'

    class TriangleData extends ShapeData {
      constructor(other) {
        super()
        this.type = SHAPE_TEST_TRIANGLE
        this.strokeStyle = '#ff5722'
        this.lineWidth = 4
        other && this.read(other)
      }
    }
    class ShapeTriangle extends ShapeNeedPath {
      constructor(data) { super(data, TriangleData) }
      path(ctx) {
        const { x, y, w, h } = this.drawingRect()
        ctx.beginPath()
        ctx.moveTo(x + w / 2, y)
        ctx.lineTo(x + w, y + h)
        ctx.lineTo(x, y + h)
        ctx.closePath()
      }
    }
    Gaia.registerShape(SHAPE_TEST_TRIANGLE, () => new TriangleData(), (d) => new ShapeTriangle(d), {
      name: 'TestTriangle', desc: 'triangle for tests',
    })
    Gaia.registerTool(TOOL_TEST_TRIANGLE, () => new SimpleTool(TOOL_TEST_TRIANGLE, SHAPE_TEST_TRIANGLE), {
      name: 'TestTriangleTool', desc: 'drag to create a triangle', shape: SHAPE_TEST_TRIANGLE,
    })

    it('注册后即可用 newShape / 拖拽创建，并可序列化往返', () => {
      const board = createBoard()
      board.setToolType(TOOL_TEST_TRIANGLE)
      drag(board, { x: 100, y: 100 }, { x: 220, y: 200 })

      const shape = board.shapes()[0]
      assert.ok(shape instanceof ShapeTriangle)
      assert.strictEqual(shape.type, SHAPE_TEST_TRIANGLE)
      assert.deepStrictEqual(geoOf(shape), { x: 100, y: 100, w: 120, h: 100 })
      assert.strictEqual(shape.data.strokeStyle, '#ff5722')
      assert.strictEqual(shape.data.lineWidth, 4)
      assert.strictEqual(Gaia.toolInfo(TOOL_TEST_TRIANGLE).shape, SHAPE_TEST_TRIANGLE)

      const restored = createBoard()
      restored.fromJson(board.toJson())
      const restoredShape = restored.shapes()[0]
      assert.strictEqual(restoredShape.type, SHAPE_TEST_TRIANGLE)
      assert.deepStrictEqual(geoOf(restoredShape), { x: 100, y: 100, w: 120, h: 100 })
    });

    it('自定义图形会参与命中测试与渲染', () => {
      const board = createBoard()
      board.setToolType(TOOL_TEST_TRIANGLE)
      drag(board, { x: 100, y: 100 }, { x: 200, y: 200 })
      const shape = board.shapes()[0]
      assert.strictEqual(board.hit({ x: 150, y: 190, w: 1, h: 1 }), shape)

      const ctx = board.layer().octx
      let strokes = 0
      const stroke = ctx.stroke
      ctx.stroke = (...args) => { strokes++; stroke(...args) }
      board.markDirty(shape.aabb())
      __flushRaf()
      assert.ok(strokes > 0, '图形被绘制到画布上（离屏画布）')
    });
  });

  describe('文档示例：StampTool 的预览与盖章', () => {
    const SHAPE_TEST_TRIANGLE = 'SHAPE_TEST_TRIANGLE'
    const TOOL_TEST_STAMP = 'TOOL_TEST_STAMP'

    /** 与 docs/custom-tool.md 中的 StampTool 保持一致 */
    class StampTool {
      get type() { return TOOL_TEST_STAMP }
      _board = undefined
      _size = 80
      _hover = new Rect(0, 0, 0, 0)
      get board() { return this._board }
      set board(v) { this._board = v }
      end() {
        const board = this._board
        if (!board) return
        if (this._hover.w) board.markDirty(this._dirtyRect())
        this._hover.set(0, 0, 0, 0)
      }
      pointerMove(dot) { this.moveHoverTo(dot) }
      pointerDown(dot) {
        const board = this._board
        if (!board) return
        this.moveHoverTo(dot)
        const shape = board.factory.newShape(SHAPE_TEST_TRIANGLE)
        shape.data.layer = board.layer().id
        board.add(shape, true)
        shape.geo(this._hover.x, this._hover.y, this._size, this._size)
        board.emit(EventEnum.ShapesDone, { operator: board.whoami, shapeDatas: [shape.data.copy()] })
      }
      pointerUp() { }
      render(ctx) {
        if (!this._hover.w) return
        const { x, y, w, h } = this._hover
        ctx.save()
        ctx.setLineDash([4, 4])
        ctx.lineWidth = 1
        ctx.strokeRect(x + 0.5, y + 0.5, w, h)
        ctx.restore()
      }
      moveHoverTo(dot) {
        const board = this._board
        if (!board) return
        const hadHover = this._hover.w > 0
        const prev = this._dirtyRect()
        this._hover.set(dot.x - this._size / 2, dot.y - this._size / 2, this._size, this._size)
        if (hadHover) board.markDirty(prev)
        board.markDirty(this._dirtyRect())
      }
      _dirtyRect() {
        const { x, y, w, h } = this._hover
        const pad = Math.ceil(1 / 2)
        return { x: x - pad, y: y - pad, w: w + pad * 2, h: h + pad * 2 }
      }
    }
    Gaia.registerTool(TOOL_TEST_STAMP, () => new StampTool(), {
      name: 'TestStamp', desc: 'click to stamp', shape: SHAPE_TEST_TRIANGLE,
    })

    it('悬停预览的脏矩形包含 1px 描边外扩（避免残影）', () => {
      const board = createBoard()
      board.setToolType(TOOL_TEST_STAMP)
      const ctx = board.layer().octx
      const cleared = []
      const clearRect = ctx.clearRect
      ctx.clearRect = (...args) => { cleared.push(args); clearRect(...args) }

      __firePointer(window, 'pointermove', { x: 200, y: 200 })
      __flushRaf()
      assert.deepStrictEqual(board.tool._hover.pure(), { x: 160, y: 160, w: 80, h: 80 })
      assert.deepStrictEqual(
        cleared,
        [[159, 159, 82, 82]],
        '脏矩形要比预览框每边大 1px，覆盖 strokeRect(x+0.5, y+0.5, w, h) 的描边溢出'
      )

      __firePointer(window, 'pointermove', { x: 300, y: 200 })
      __flushRaf()
      // 移动时会同时标记「旧预览」与「新预览」的脏矩形，Board 会把它们合并成一次重绘
      const [x, y, w, h] = cleared[cleared.length - 1]
      assert.ok(x <= 159 && y <= 159, '合并后的脏矩形要覆盖旧预览（含外扩）')
      assert.ok(x + w >= 341 && y + h >= 241, '合并后的脏矩形要覆盖新预览（含外扩）')
    });

    it('按下时在预览位置生成图形并广播 ShapesDone', () => {
      const board = createBoard()
      board.setToolType(TOOL_TEST_STAMP)
      const done = []
      const added = []
      board.on(EventEnum.ShapesDone, (d) => done.push(d))
      board.on(EventEnum.ShapesAdded, (d) => added.push(d))

      __firePointer(board.element, 'pointerdown', { x: 200, y: 200 })
      assert.strictEqual(added.length, 1)
      assert.strictEqual(done.length, 1)
      assert.strictEqual(board.shapes().length, 1)
      assert.strictEqual(board.shapes()[0].type, SHAPE_TEST_TRIANGLE)
      assert.deepStrictEqual(geoOf(board.shapes()[0]), { x: 160, y: 160, w: 80, h: 80 })
      assert.deepStrictEqual(done[0].shapeDatas[0].x, 160)
    });

    it('切换工具时清除预览并标脏', () => {
      const board = createBoard()
      board.setToolType(TOOL_TEST_STAMP)
      __firePointer(window, 'pointermove', { x: 200, y: 200 })
      __flushRaf()
      const stamp = board.tool
      const ctx = board.layer().octx
      const cleared = []
      const clearRect = ctx.clearRect
      ctx.clearRect = (...args) => { cleared.push(args); clearRect(...args) }

      board.setToolType(ToolEnum.Rect)
      __flushRaf()
      assert.deepStrictEqual(cleared, [[159, 159, 82, 82]], '切走时要擦掉预览')
      assert.strictEqual(stamp._hover.w, 0)
    });
  });
});

describe('class ActionQueue', () => {
  afterEach(() => {
    boards.forEach((b) => b.destroy());
    boards = [];
  });

  function setup() {
    const board = createBoard()
    const queue = new ActionQueue().setActor(board)
    return { board, queue }
  }

  it('拖拽创建图形后可撤销/重做', () => {
    const { board, queue } = setup()
    board.setToolType(ToolEnum.Rect)
    drag(board, { x: 10, y: 10 }, { x: 60, y: 60 })

    assert.strictEqual(queue.length, 1)
    assert.strictEqual(queue.index, 0)
    assert.strictEqual(queue.canUndo, true)
    assert.strictEqual(queue.canRedo, false)

    const id = board.shapes()[0].data.id
    queue.undo()
    assert.strictEqual(board.shapes().length, 0)
    assert.strictEqual(board.find(id), null)
    assert.strictEqual(queue.canRedo, true)

    queue.redo()
    assert.strictEqual(board.shapes().length, 1)
    assert.strictEqual(board.find(id).data.id, id, '重做会按原 id 还原图形')
    assert.strictEqual(queue.canRedo, false)
  });

  it('删除图形后可撤销恢复', () => {
    const { board, queue } = setup()
    const shape = factory.newShape(ShapeEnum.Rect)
    shape.data.layer = board.layer().id
    board.add(shape)
    board.setSelects([shape], true)
    board.removeSelected(true)

    assert.strictEqual(board.shapes().length, 0)
    assert.strictEqual(queue.length, 1)
    queue.undo()
    assert.strictEqual(board.shapes().length, 1)
    assert.strictEqual(board.shapes()[0].data.id, shape.data.id)
    queue.redo()
    assert.strictEqual(board.shapes().length, 0)
  });

  it('只记录 board.whoami 的操作', () => {
    const { board, queue } = setup()
    const shape = factory.newShape(ShapeEnum.Rect)
    board.add(shape)
    board.remove(shape, { operator: 'remote' })
    assert.strictEqual(queue.length, 0, '别的操作者的事件不入队')

    board.add(shape, { operator: 'remote' })
    assert.strictEqual(queue.length, 0)
  });

  it('撤销后产生新操作会丢弃重做分支，但保留仍然生效的历史', () => {
    const { board, queue } = setup()
    board.setToolType(ToolEnum.Rect)
    drag(board, { x: 0, y: 0 }, { x: 10, y: 10 })
    drag(board, { x: 50, y: 50 }, { x: 60, y: 60 })
    assert.strictEqual(queue.length, 2)

    queue.undo()
    assert.strictEqual(queue.canRedo, true)
    assert.strictEqual(board.shapes().length, 1)

    drag(board, { x: 100, y: 100 }, { x: 110, y: 110 })
    assert.strictEqual(queue.canRedo, false, '新操作丢弃了重做分支')
    assert.strictEqual(queue.length, 2, '仍然生效的第一条历史被保留')
    assert.strictEqual(board.shapes().length, 2)

    queue.undo()
    assert.strictEqual(board.shapes().length, 1, '撤销新操作')
    queue.undo()
    assert.strictEqual(board.shapes().length, 0, '第一次拖拽的历史依然可以撤销')
    assert.strictEqual(queue.canUndo, false)
  });

  it('选择器移动图形可撤销', () => {
    const { board, queue } = setup()
    const shape = factory.newShape(ShapeEnum.Rect)
    shape.data.layer = board.layer().id
    board.add(shape)
    shape.geo(100, 100, 100, 100)
    board.setToolType(ToolEnum.Selector)

    drag(board, { x: 150, y: 150 }, { x: 210, y: 150 })
    assert.deepStrictEqual(geoOf(shape), { x: 160, y: 100, w: 100, h: 100 })
    assert.strictEqual(queue.length, 1)

    queue.undo()
    assert.deepStrictEqual(geoOf(shape), { x: 100, y: 100, w: 100, h: 100 })
    queue.redo()
    assert.deepStrictEqual(geoOf(shape), { x: 160, y: 100, w: 100, h: 100 })
  });

  it('setActor(undefined) 之后不再记录', () => {
    const { board, queue } = setup()
    assert.strictEqual(queue.setActor(undefined), queue)
    board.setToolType(ToolEnum.Rect)
    drag(board, { x: 0, y: 0 }, { x: 10, y: 10 })
    assert.strictEqual(queue.length, 0)
  });

  it('队列为空时撤销/重做是空操作并打印日志', () => {
    const { queue } = setup()
    const cap = __captureConsole('log')
    try {
      assert.strictEqual(queue.undo(), queue)
      assert.strictEqual(queue.redo(), queue)
    } finally {
      cap.restore()
    }
    assert.strictEqual(cap.calls.length, 2)
    assert.ok(cap.calls[0].includes('no more undo'))
    assert.ok(cap.calls[1].includes('no more redo'))
    assert.strictEqual(queue.canUndo, false)
    assert.strictEqual(queue.canRedo, false)
  });

  it('非撤销类事件（新增/选择变化）不会入队', () => {
    const { board, queue } = setup()
    const shape = factory.newShape(ShapeEnum.Rect)
    board.add(shape, true)
    board.setSelects([shape], true)
    board.deselect(true)
    assert.strictEqual(queue.length, 0)
    assert.strictEqual(queue.canUndo, false)
    assert.strictEqual(queue.canRedo, false)
  });
});

describe('用 Gaia 覆盖内置工具', () => {
  afterEach(() => {
    boards.forEach((b) => b.destroy());
    boards = [];
  });

  it('overrideTool 之后板子使用新实现', () => {
    const created = []
    Gaia.overrideTool(ToolEnum.Rect, () => {
      const tool = new SimpleTool(ToolEnum.Rect, ShapeEnum.Oval)
      created.push(tool)
      return tool
    })
    try {
      const board = createBoard()
      board.setToolType(ToolEnum.Rect)
      assert.strictEqual(created.length, 1)
      drag(board, { x: 0, y: 0 }, { x: 50, y: 50 })
      assert.strictEqual(board.shapes()[0].type, ShapeEnum.Oval, '被覆盖的工具产出椭圆')
    } finally {
      Gaia.overrideTool(ToolEnum.Rect, () => new SimpleTool(ToolEnum.Rect, ShapeEnum.Rect))
    }
  });
});

describe('class Shape 的基础绘制契约', () => {
  it('用 ShapeData 即可实例化，render 不会抛错', () => {
    const shape = new Shape({ x: 0, y: 0, w: 10, h: 10 }, ShapeData)
    assert.strictEqual(shape.type, ShapeEnum.Invalid)
    assert.deepStrictEqual(geoOf(shape), { x: 0, y: 0, w: 10, h: 10 })
    const ctx = document.createElement('canvas').getContext('2d')
    assert.doesNotThrow(() => shape.render(ctx))
    shape.visible = false
    assert.doesNotThrow(() => shape.render(ctx), '不可见的图形渲染时直接返回')
  });
});
