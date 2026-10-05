const { Gaia, FactoryEnum, ShapeEnum, ToolEnum, EventEnum, Shape, ShapeData, Rect } = require('../dist/es5/cjs/writeboard.js')

const assert = require('assert');

const factory = Gaia.factory(FactoryEnum.Default)();

/** 每个用例结束后销毁板子，避免 window 上的监听器互相干扰 */
let boards = [];
function createBoard(options = {}) {
  const element = document.createElement('div');
  const board = factory.newBoard({ element, width: 500, height: 500, ...options });
  // 创建过程本身会标记脏矩形并排队 rAF，这里先执行掉，
  // 之后用例中观察到的 rAF 队列就只包含自己触发的重绘
  __flushRaf()
  boards.push(board);
  return board
}
function addRect(board, geo = { x: 10, y: 20, w: 100, h: 50 }) {
  const shape = factory.newShape(ShapeEnum.Rect);
  shape.data.layer = board.layer().id;
  shape.geo(geo.x, geo.y, geo.w, geo.h);
  board.add(shape);
  return shape
}

describe('class Board', () => {
  afterEach(() => {
    boards.forEach((b) => b.destroy());
    boards = [];
  });

  describe('创建与尺寸', () => {
    it('使用传入的宿主元素，并默认创建一个图层作为编辑层', () => {
      const element = document.createElement('div');
      const board = factory.newBoard({ element, width: 400, height: 300 });
      boards.push(board)
      assert.strictEqual(board.element, element)
      assert.strictEqual(board.layers.length, 1)
      assert.strictEqual(board.layer(), board.layers[0])
      assert.strictEqual(board.layers[0].onscreen.parentElement, element)
      assert.strictEqual(board.whoami, 'local')
    });

    it('宽高来自 options，滚动区域默认与视口等大', () => {
      const board = createBoard({ width: 400, height: 300 })
      assert.strictEqual(board.width, 400)
      assert.strictEqual(board.height, 300)
      assert.deepStrictEqual(board.viewport.pure(), { x: 0, y: 0, w: 400, h: 300 })
      assert.deepStrictEqual(board.world.pure(), { x: 0, y: 0, w: 400, h: 300 })
      assert.strictEqual(board.layer().onscreen.width, 400)
      assert.strictEqual(board.layer().onscreen.height, 300)
    });

    it('scrollWidth / scrollHeight 可单独指定', () => {
      const board = createBoard({ width: 400, height: 300, scrollWidth: 1000, scrollHeight: 800 })
      assert.deepStrictEqual(board.world.pure(), { x: 0, y: 0, w: 1000, h: 800 })
    });

    it('修改 width / height 会同步图层画布尺寸', () => {
      const board = createBoard({ width: 400, height: 300 })
      board.width = 200
      board.height = 100
      assert.strictEqual(board.viewport.w, 200)
      assert.strictEqual(board.layer().onscreen.width, 200)
      assert.strictEqual(board.layer().onscreen.height, 100)
    });
  });

  describe('图层', () => {
    it('addLayer 支持数据对象，重复 id 会被拒绝', () => {
      const board = createBoard()
      assert.strictEqual(board.addLayer({ id: 'L2', name: '第二层' }), true)
      assert.strictEqual(board.layers.length, 2)
      assert.strictEqual(board.layer('L2').name, '第二层')

      const cap = __captureConsole('error')
      try {
        assert.strictEqual(board.addLayer({ id: 'L2', name: '重复' }), false)
      } finally {
        cap.restore()
      }
      assert.strictEqual(cap.calls.length, 1)
      assert.strictEqual(board.layers.length, 2)
    });

    it('不传参数时自动创建图层', () => {
      const board = createBoard()
      const before = board.layers.length
      assert.strictEqual(board.addLayer(), true)
      assert.strictEqual(board.layers.length, before + 1)
    });

    it('editLayer 切换当前编辑层，未找到时报错并返回 false', () => {
      const board = createBoard()
      board.addLayer({ id: 'L2', name: '第二层' })
      assert.strictEqual(board.editLayer('L2'), true)
      assert.strictEqual(board.layer().id, 'L2')
      const cap = __captureConsole('error')
      try {
        assert.strictEqual(board.editLayer('NOT_FOUND'), false)
      } finally {
        cap.restore()
      }
      assert.strictEqual(cap.calls.length, 1)
      assert.strictEqual(board.layer().id, 'L2')
    });

    it('removeLayer 从文档与图层表中移除', () => {
      const board = createBoard()
      const second = board.addLayer({ id: 'L2', name: '第二层' })
      const layer = board.layer('L2')
      assert.strictEqual(board.removeLayer('L2'), true)
      assert.strictEqual(board.layers.length, 1)
      assert.strictEqual(board.layer('L2'), undefined)
      assert.strictEqual(layer.onscreen.parentElement, null)
      assert.strictEqual(second, true)
    });
  });

  describe('图形的增删查', () => {
    it('add / shapes / find / exists / remove', () => {
      const board = createBoard()
      const shape = addRect(board)
      assert.strictEqual(board.shapes().length, 1)
      assert.strictEqual(board.find(shape.data.id), shape)
      assert.strictEqual(board.find('NOT_FOUND'), null)
      assert.strictEqual(board.exists([shape]), 1)
      assert.strictEqual(board.remove(shape), 1)
      assert.strictEqual(board.shapes().length, 0)
      assert.strictEqual(board.exists([shape]), 0)
    });

    it('add 接受数组与空数组，removeAll 清空', () => {
      const board = createBoard()
      const a = addRect(board, { x: 0, y: 0, w: 10, h: 10 })
      const b = addRect(board, { x: 20, y: 20, w: 10, h: 10 })
      assert.strictEqual(board.add([]), 0)
      assert.strictEqual(board.shapes().length, 2)
      assert.strictEqual(board.remove([a, b]), 2)
      board.add([a, b]);
      assert.strictEqual(board.removeAll(), 2)
      assert.strictEqual(board.shapes().length, 0)
    });

    it('shape.board 在加入/移除时被设置与清空', () => {
      const board = createBoard()
      const shape = factory.newShape(ShapeEnum.Rect)
      assert.strictEqual(shape.board, undefined)
      board.add(shape)
      assert.strictEqual(shape.board, board)
      board.remove(shape)
      assert.strictEqual(shape.board, undefined)
    });

    it('hit / hits 按区域命中图形，叠加 predicate 过滤', () => {
      const board = createBoard()
      const a = addRect(board, { x: 10, y: 10, w: 100, h: 100 })
      const b = addRect(board, { x: 300, y: 300, w: 50, h: 50 })

      assert.strictEqual(board.hit({ x: 0, y: 0, w: 20, h: 20 }), a)
      assert.strictEqual(board.hit({ x: 0, y: 0, w: 5, h: 5 }), null)
      assert.deepStrictEqual(board.hits({ x: 0, y: 0, w: 500, h: 500 }).length, 2)
      assert.deepStrictEqual(board.hits({ x: 0, y: 0, w: 500, h: 500 }, (s) => s === b), [b])
    });

    it('toJson / fromJson 往返保持图形几何与数量', () => {
      const board = createBoard()
      const a = addRect(board, { x: 10, y: 20, w: 100, h: 50 })
      a.data.fillStyle = '#ff0000'
      const b = addRect(board, { x: 200, y: 100, w: 30, h: 40 })

      const json = board.toJson()
      const snapshot = board.toSnapshot()
      assert.strictEqual(snapshot.s.length, 2)
      assert.strictEqual(snapshot.l.length, board.layers.length)

      const restored = createBoard()
      restored.fromJson(json)
      assert.strictEqual(restored.shapes().length, 2)
      assert.deepStrictEqual(restored.layers.map((l) => l.info.pure()), board.layers.map((l) => l.info.pure()))
      const restoredA = restored.find(a.data.id)
      assert.deepStrictEqual(
        { x: restoredA.data.x, y: restoredA.data.y, w: restoredA.data.w, h: restoredA.data.h, fill: restoredA.data.fillStyle, layer: restoredA.data.layer },
        { x: 10, y: 20, w: 100, h: 50, fill: '#ff0000', layer: a.data.layer }
      )
      assert.strictEqual(restored.find(b.data.id).data.layer, b.data.layer)
    });
  });

  describe('选择状态', () => {
    it('selectAt 选中区域内图形并取消区域外图形', () => {
      const board = createBoard()
      const a = addRect(board, { x: 10, y: 10, w: 40, h: 40 })
      const b = addRect(board, { x: 300, y: 300, w: 40, h: 40 })

      const [selected, deselected] = board.selectAt({ x: 0, y: 0, w: 100, h: 100 })
      assert.deepStrictEqual(selected, [a])
      assert.deepStrictEqual(deselected, [])
      assert.deepStrictEqual(board.selects, [a])
      assert.strictEqual(a.selected, true)

      const [selected2, deselected2] = board.selectAt({ x: 290, y: 290, w: 60, h: 60 })
      assert.deepStrictEqual(selected2, [b])
      assert.deepStrictEqual(deselected2, [a])
      assert.strictEqual(a.selected, false)
      assert.deepStrictEqual(board.selects, [b])
    });

    it('selectAll / deselect', () => {
      const board = createBoard()
      const a = addRect(board)
      const b = addRect(board, { x: 200, y: 200, w: 10, h: 10 })
      assert.deepStrictEqual(board.selectAll(), [a, b])
      assert.strictEqual(board.selects.length, 2)
      assert.deepStrictEqual(board.deselect(), [a, b])
      assert.strictEqual(board.selects.length, 0)
    });

    it('removeSelected 只删除未被锁定的选中图形', () => {
      const board = createBoard()
      const a = addRect(board, { x: 0, y: 0, w: 10, h: 10 })
      const b = addRect(board, { x: 20, y: 20, w: 10, h: 10 })
      board.selectAll()
      b.data.locked = true
      board.removeSelected()
      assert.strictEqual(board.shapes().length, 1)
      assert.strictEqual(board.shapes()[0], b)
      assert.strictEqual(a.board, undefined)
    });
  });

  describe('事件', () => {
    it('add / remove 按 opts 决定是否发射事件', () => {
      const board = createBoard()
      const added = []
      const removed = []
      board.on(EventEnum.ShapesAdded, (d) => added.push(d))
      board.on(EventEnum.ShapesRemoved, (d) => removed.push(d))

      const shape = addRect(board)
      assert.strictEqual(added.length, 0)

      const shape2 = factory.newShape(ShapeEnum.Rect)
      board.add(shape2, true)
      assert.strictEqual(added.length, 1)
      assert.strictEqual(added[0].operator, 'local')
      assert.strictEqual(added[0].shapeDatas.length, 1)
      assert.strictEqual(added[0].shapeDatas[0].i, shape2.data.id)
      assert.notStrictEqual(added[0].shapeDatas[0], shape2.data)

      board.remove(shape, { operator: 'remote' })
      assert.strictEqual(removed.length, 1)
      assert.strictEqual(removed[0].operator, 'remote')
    });

    it('on 返回取消订阅函数，once 只触发一次', () => {
      const board = createBoard()
      let normal = 0
      let once = 0
      const off = board.on(EventEnum.ShapesAdded, () => normal++)
      board.once(EventEnum.ShapesAdded, () => once++)

      board.add(factory.newShape(ShapeEnum.Rect), true)
      board.add(factory.newShape(ShapeEnum.Rect), true)
      assert.strictEqual(normal, 2)
      assert.strictEqual(once, 1)

      off()
      board.add(factory.newShape(ShapeEnum.Rect), true)
      assert.strictEqual(normal, 2)
    });

    it('off 可以移除监听，emit 会把 detail 传给监听者', () => {
      const board = createBoard()
      const got = []
      const listener = (d) => got.push(d)
      board.on(EventEnum.ToolChanged, listener)
      board.emit(EventEnum.ToolChanged, { operator: 'x', from: undefined, to: ToolEnum.Pen })
      assert.strictEqual(got.length, 1)
      assert.strictEqual(got[0].to, ToolEnum.Pen)
      board.off(EventEnum.ToolChanged, listener)
      board.emit(EventEnum.ToolChanged, { operator: 'x', from: ToolEnum.Pen, to: undefined })
      assert.strictEqual(got.length, 1)
    });

    it('setToolType 切换工具并派发 ToolChanged', () => {
      const board = createBoard()
      const changes = []
      board.on(EventEnum.ToolChanged, (d) => changes.push(d))

      board.setToolType(ToolEnum.Rect)
      assert.strictEqual(board.toolType, ToolEnum.Rect)
      assert.strictEqual(board.tool.type, ToolEnum.Rect)
      assert.strictEqual(changes.length, 1)
      assert.strictEqual(changes[0].to, ToolEnum.Rect)

      board.setToolType(ToolEnum.Rect)
      assert.strictEqual(changes.length, 1, '切换到同一工具不派发事件')

      board.toolType = ToolEnum.Pen
      assert.strictEqual(board.toolType, ToolEnum.Pen)
      assert.strictEqual(changes.length, 2)

      board.setToolType(undefined)
      assert.strictEqual(board.toolType, undefined)
      assert.strictEqual(changes.length, 3)
      assert.strictEqual(board.tool.type, ToolEnum.Pen, '未设置工具时保留上一个工具实例')
    });

    it('未注册的工具类型会得到 InvalidTool 并告警', () => {
      const board = createBoard()
      const cap = __captureConsole('warn')
      try {
        board.setToolType('NOT_A_TOOL')
      } finally {
        cap.restore()
      }
      assert.ok(cap.calls.some((c) => c.includes('is not registered')))
      assert.strictEqual(board.tool.type, '', 'InvalidTool 的 type 为空串')

      const cap2 = __captureConsole('warn')
      try {
        board.tool.pointerDown({ x: 0, y: 0, p: 1 })
        board.tool.pointerMove({ x: 0, y: 0, p: 1 })
        board.tool.pointerDraw({ x: 0, y: 0, p: 1 })
        board.tool.pointerUp({ x: 0, y: 0, p: 1 })
        board.tool.render()
      } finally {
        cap2.restore()
      }
      assert.ok(cap2.calls.every((c) => c.startsWith('[InvalidTool]')), 'InvalidTool 的每个成员都会告警')
      assert.strictEqual(cap2.calls.length, 5)
    });
  });

  describe('视口与坐标', () => {
    it('scroll_to 限制在滚动区域内，scroll_by 相对滚动', () => {
      const board = createBoard({ width: 400, height: 300, scrollWidth: 1000, scrollHeight: 800 })
      board.scroll_to(100, 200)
      assert.deepStrictEqual(board.world.pure(), { x: -100, y: -200, w: 1000, h: 800 })
      board.scroll_to(9999, 9999)
      assert.strictEqual(board.world.x, -(1000 - 400))
      assert.strictEqual(board.world.y, -(800 - 300))
      board.scroll_to(-9999, -9999)
      assert.ok(board.world.x === 0 && board.world.y === 0, '负向越界会被夹到 0（可能是 -0）')
      board.scroll_by(50, 60)
      assert.strictEqual(board.world.x, -50)
      assert.strictEqual(board.world.y, -60)
    });

    it('scroll_to 不变时不派发 WorldRectChanged', () => {
      const board = createBoard({ width: 400, height: 300, scrollWidth: 1000, scrollHeight: 800 })
      let count = 0
      board.on(EventEnum.WorldRectChanged, () => count++)
      board.scroll_to(0, 0)
      assert.strictEqual(count, 0)
      board.scroll_to(10, 0)
      assert.strictEqual(count, 0, '未提供 opts 时不派发事件')
      board.scroll_to(20, 0, true)
      assert.strictEqual(count, 1)
      board.scroll_to(20, 0, true)
      assert.strictEqual(count, 1, '位置未变化时不派发事件')
    });

    it('map2world 按画布缩放与偏移换算世界坐标', () => {
      const board = createBoard({ width: 500, height: 500, scrollWidth: 1000, scrollHeight: 1000 })
      assert.deepStrictEqual(board.map2world(100, 50), [100, 50])
      // 向右下滚动 30/40 后，屏幕点 (100, 50) 对应世界坐标 (130, 90)
      board.scroll_to(30, 40)
      assert.deepStrictEqual(board.map2world(100, 50), [130, 90])
    });

    it('getDot 带上压力值', () => {
      const board = createBoard()
      assert.deepStrictEqual(board.getDot({ x: 10, y: 20, pressure: 0.25 }), { x: 10, y: 20, p: 0.25 })
      assert.strictEqual(board.getDot({ x: 0, y: 0 }).p, 0.5)
    });
  });

  describe('脏矩形与渲染', () => {
    function spyRender(board) {
      const ctx = board.layer().ctx
      const calls = { clearRect: [], drawImage: 0 }
      const clearRect = ctx.clearRect
      const drawImage = ctx.drawImage
      ctx.clearRect = (...args) => { calls.clearRect.push(args); clearRect(...args) }
      ctx.drawImage = (...args) => { calls.drawImage++; drawImage(...args) }
      return calls
    }

    it('markDirty 合并矩形并只触发一次重绘', () => {
      const board = createBoard()
      const calls = spyRender(board)
      board.markDirty({ x: 0, y: 0, w: 10, h: 10 })
      board.markDirty({ x: 20, y: 20, w: 10, h: 10 })
      assert.strictEqual(calls.clearRect.length, 0, '重绘发生在 requestAnimationFrame 中')

      assert.strictEqual(__flushRaf(), 1, '只排队了一次 rAF')
      assert.deepStrictEqual(calls.clearRect, [[0, 0, 30, 30]])
      assert.strictEqual(calls.drawImage, 1)
    });

    it('浮点脏矩形会被取整，且重绘后不再重复渲染', () => {
      const board = createBoard()
      const calls = spyRender(board)
      board.markDirty({ x: 10.2, y: 10.8, w: 5.5, h: 5.5 })
      __flushRaf()
      assert.deepStrictEqual(calls.clearRect, [[10, 10, 6, 6]])
      board.render()
      assert.strictEqual(calls.clearRect.length, 1, '没有新的脏矩形时 render 直接返回')
    });

    it('add 会自动标记脏矩形（含描边外扩），rAF 后真正绘制', () => {
      const board = createBoard()
      const calls = spyRender(board)
      const shape = addRect(board, { x: 10, y: 10, w: 100, h: 100 })
      assert.strictEqual(calls.clearRect.length, 0)
      const aabb = shape.aabb()
      __flushRaf()
      assert.strictEqual(calls.clearRect.length, 1)
      assert.deepStrictEqual(calls.clearRect[0], [aabb.x, aabb.y, aabb.w, aabb.h])
      assert.strictEqual(calls.drawImage, 1)
    });

    it('没有任何脏矩形时 render 不做任何事', () => {
      const board = createBoard()
      const calls = spyRender(board)
      board.render()
      assert.strictEqual(calls.clearRect.length, 0)
      assert.strictEqual(calls.drawImage, 0)
    });
  });

  describe('销毁', () => {
    it('destroy 移除事件监听与图层画布', () => {
      const board = createBoard()
      const layer = board.layer()
      board.setToolType(ToolEnum.Rect)
      let down = 0
      board.on(EventEnum.ToolDown, () => down++)
      board.destroy()

      assert.strictEqual(layer.onscreen.parentElement, null)
      __firePointer(board.element, 'pointerdown', { x: 10, y: 10 })
      assert.strictEqual(down, 0)
      assert.strictEqual(board.layers.length, 1, '图层仍留在表里，只是画布被移除')
    });

    it('destory 是 destroy 的拼写兼容别名', () => {
      const board = createBoard()
      const layer = board.layer()
      board.destory()
      assert.strictEqual(layer.onscreen.parentElement, null)
    });
  });
});

describe('class Layer', () => {
  afterEach(() => {
    boards.forEach((b) => b.destroy());
    boards = [];
  });

  it('opacity 默认 1，设置后写入画布样式', () => {
    const board = createBoard()
    const layer = board.layer()
    assert.strictEqual(layer.opacity, 1)
    layer.opacity = 0.5
    assert.strictEqual(layer.opacity, 0.5)
    assert.strictEqual(layer.onscreen.style.opacity, '0.5')
    layer.opacity = 1
    assert.strictEqual(layer.opacity, 1)
  });

  it('info 提供 id / name 副本', () => {
    const board = createBoard()
    const layer = board.layer()
    const info = layer.info.pure()
    assert.deepStrictEqual(Object.keys(info).sort(), ['id', 'name'])
    assert.strictEqual(info.id, layer.id)
  });

  it('图层画布带有 layer_id / layer_name 属性', () => {
    const board = createBoard()
    const layer = board.layer()
    assert.strictEqual(layer.onscreen.getAttribute('layer_id'), layer.id)
    assert.strictEqual(layer.onscreen.getAttribute('layer_name'), layer.name)
  });
});

describe('图形基类（经由工厂创建）', () => {
  afterEach(() => {
    boards.forEach((b) => b.destroy());
    boards = [];
  });

  it('newShape 生成唯一 id 与所属图层', () => {
    const a = factory.newShape(ShapeEnum.Rect)
    const b = factory.newShape(ShapeEnum.Rect)
    assert.ok(a.data.id.length > 0)
    assert.notStrictEqual(a.data.id, b.data.id)
    assert.ok(a instanceof Shape)
    assert.strictEqual(a.type, ShapeEnum.Rect)
    assert.ok(a.data instanceof ShapeData)
  });

  it('newShape 接受已有数据，保留 id 与自定义字段', () => {
    const data = new ShapeData({ t: ShapeEnum.Rect, x: 1, y: 2, w: 3, h: 4, i: 'keep-me' })
    const shape = factory.newShape(data)
    assert.strictEqual(shape.data.id, 'keep-me')
    assert.deepStrictEqual({ x: shape.data.x, y: shape.data.y, w: shape.data.w, h: shape.data.h }, { x: 1, y: 2, w: 3, h: 4 })
  });

  it('aabb 是包含描边在内的外扩矩形', () => {
    const shape = factory.newShape(ShapeEnum.Rect)
    shape.geo(10, 20, 100, 50)
    const aabb = shape.aabb()
    assert.ok(aabb.x <= 10 && aabb.y <= 20, '包围盒要覆盖几何左/上边')
    assert.ok(aabb.x + aabb.w >= 110 && aabb.y + aabb.h >= 70, '包围盒要覆盖几何右/下边')
    const lineWidth = shape.data.lineWidth
    const offset = lineWidth % 2 ? 1 : 0
    assert.strictEqual(aabb.w, 100 + lineWidth + offset + 2, '宽度 = 几何宽 + 线宽 + 奇数线宽补偿 + 两侧外扩')
    assert.strictEqual(aabb.h, 50 + lineWidth + offset + 2)
  });

  it('旋转后包围盒变大且中心不变', () => {
    const shape = factory.newShape(ShapeEnum.Rect)
    shape.geo(0, 0, 100, 100)
    shape.rotateBy(Math.PI / 4)
    const aabb = shape.aabb()
    assert.ok(aabb.w > 140 && aabb.h > 140, '旋转 45° 后包围盒约为对角长度')
    assert.ok(Math.abs(aabb.x + aabb.w / 2 - 50) < 1, '中心仍在 (50, 50)')
    assert.ok(Math.abs(aabb.y + aabb.h / 2 - 50) < 1)
  });

  it('geo / move / moveBy 修改几何并记录到数据', () => {
    const shape = factory.newShape(ShapeEnum.Rect)
    shape.geo(1, 2, 3, 4)
    assert.deepStrictEqual([shape.data.x, shape.data.y, shape.data.w, shape.data.h], [1, 2, 3, 4])
    shape.move(7, 8)
    assert.deepStrictEqual([shape.data.x, shape.data.y], [7, 8])
    shape.moveBy(1, 1)
    assert.deepStrictEqual([shape.data.x, shape.data.y], [8, 9])
    shape.resize(11, 12)
    assert.deepStrictEqual([shape.data.w, shape.data.h], [11, 12])
    assert.deepStrictEqual(shape.getGeo().pure(), { x: 8, y: 9, w: 11, h: 12 })
  });

  it('visible / selected / locked 写入紧凑状态字段', () => {
    const shape = factory.newShape(ShapeEnum.Rect)
    shape.visible = false
    assert.strictEqual(shape.data.b.v, 0)
    shape.selected = true
    assert.strictEqual(shape.data.b.s, 1)
    shape.locked = true
    assert.strictEqual(shape.data.b.f, 1)
    shape.visible = true
    assert.strictEqual(shape.visible, true)
    assert.ok(!('v' in shape.data.b))
  });

  it('未注册的类型回落到基础 Shape', () => {
    const cap = __captureConsole('warn')
    try {
      const shape = factory.newShape('NOT_A_SHAPE')
      assert.ok(shape instanceof Shape)
      assert.strictEqual(shape.type, ShapeEnum.Invalid)
    } finally {
      cap.restore()
    }
    assert.ok(cap.calls.some((c) => c.includes('is not registered')))
  });
});

describe('class Rect（工具链上常用的几何工具）', () => {
  it('bounds 取两个矩形的并集', () => {
    assert.deepStrictEqual(Rect.bounds({ x: 0, y: 0, w: 10, h: 10 }, { x: 5, y: 20, w: 10, h: 10 }), { x: 0, y: 0, w: 15, h: 30 })
  });

  it('hit 支持点与矩形', () => {
    const r = { x: 10, y: 10, w: 100, h: 100 }
    assert.strictEqual(Rect.hit(r, { x: 50, y: 50 }), true)
    assert.strictEqual(Rect.hit(r, { x: 5, y: 50 }), false)
    assert.strictEqual(Rect.hit(r, { x: 0, y: 0, w: 10, h: 10 }), true)
    assert.strictEqual(Rect.hit(r, { x: 0, y: 0, w: 9, h: 9 }), false)
  });
});
