const { ShapeData, ShapeStyle, ShapeStatus, ShapeEnum } = require('../dist/es5/cjs/writeboard.js')

const assert = require('assert');

describe('class ShapeData', () => {
  it('默认值：类型为 Invalid，几何字段为 0，style/status 延迟创建', () => {
    const d = new ShapeData()
    assert.strictEqual(d.type, ShapeEnum.Invalid)
    assert.strictEqual(d.id, '')
    assert.deepStrictEqual([d.x, d.y, d.w, d.h, d.z], [0, 0, 0, 0, 0])
    assert.strictEqual(d.scaleX, 1)
    assert.strictEqual(d.scaleY, 1)
    assert.strictEqual(d.rotation, 0)
    assert.strictEqual(d.groupId, '')
    assert.strictEqual(d.layer, undefined)
    assert.strictEqual(d.needFill, true)
    assert.strictEqual(d.needStroke, true)
  });

  it('构造函数接受部分数据，未提供的字段保持默认', () => {
    const d = new ShapeData({ x: 1, y: 2, w: 3, h: 4, t: ShapeEnum.Rect, i: 'id-1' })
    assert.deepStrictEqual([d.x, d.y, d.w, d.h], [1, 2, 3, 4])
    assert.strictEqual(d.type, ShapeEnum.Rect)
    assert.strictEqual(d.id, 'id-1')
  });

  it('scaleX / scaleY 为 1 时不落盘（删除字段）', () => {
    const d = new ShapeData()
    d.scaleX = 0.5
    assert.strictEqual(d.scaleX, 0.5)
    assert.strictEqual(d.c, 0.5)
    d.scaleX = 1
    assert.strictEqual(d.scaleX, 1)
    assert.ok(!('c' in d))
  });

  it('rotation 归一化到 [0, 2π)，0 会删除字段', () => {
    const d = new ShapeData()
    d.rotation = Math.PI * 2 + 1
    assert.ok(Math.abs(d.rotation - 1) < 1e-9)
    d.rotation = -1
    assert.ok(Math.abs(d.rotation - (Math.PI * 2 - 1)) < 1e-9)
    d.rotation = 0
    assert.ok(!('r' in d))
  });

  it('halfW / halfH / midX / midY 与几何字段联动', () => {
    const d = new ShapeData({ x: 10, y: 20, w: 100, h: 50 })
    assert.strictEqual(d.halfW, 50)
    assert.strictEqual(d.halfH, 25)
    assert.strictEqual(d.midX, 60)
    assert.strictEqual(d.midY, 45)
    d.midX = 110
    d.midY = 120
    assert.strictEqual(d.x, 60)
    assert.strictEqual(d.y, 95)
  });

  it('groupId 为空字符串时删除字段', () => {
    const d = new ShapeData()
    d.groupId = 'g1'
    assert.strictEqual(d.groupId, 'g1')
    d.groupId = ''
    assert.strictEqual(d.groupId, '')
    assert.ok(!('g' in d))
  });

  it('style / status 访问器代理到嵌套对象', () => {
    const d = new ShapeData()
    d.fillStyle = '#ff0000'
    d.lineWidth = 3
    d.visible = false
    d.selected = true
    assert.strictEqual(d.style.fillStyle, '#ff0000')
    assert.strictEqual(d.strokeStyle, '')
    assert.strictEqual(d.lineCap, 'round')
    assert.strictEqual(d.lineJoin, 'round')
    assert.strictEqual(d.lineDash.length, 0)
    assert.strictEqual(d.lineDashOffset, 0)
    assert.strictEqual(d.miterLimit, 0)
    assert.strictEqual(d.style.lineWidth, 3)
    assert.strictEqual(d.visible, false)
    assert.strictEqual(d.selected, true)
    assert.strictEqual(d.editing, false)
    assert.strictEqual(d.locked, false)
    assert.strictEqual(d.ghost, false)
    assert.strictEqual(d.style.b, '#ff0000')
    assert.strictEqual(d.status.v, 0)
    assert.strictEqual(d.status.s, 1)
  });

  it('style / status 为普通对象时会被包装成类实例', () => {
    const d = new ShapeData({ a: { g: 5 }, b: { s: 1 } })
    assert.ok(d.style instanceof ShapeStyle)
    assert.strictEqual(d.lineWidth, 5)
    assert.ok(d.status instanceof ShapeStatus)
    assert.strictEqual(d.selected, true)
  });

  it('read / merge 只覆盖传递的字段', () => {
    const d = new ShapeData({ x: 1, y: 2, w: 3, h: 4 })
    d.read({ x: 100, a: { b: 'blue' } })
    assert.deepStrictEqual([d.x, d.y, d.w, d.h], [100, 2, 3, 4])
    assert.strictEqual(d.fillStyle, 'blue')
    assert.strictEqual(d.merge({ y: 200 }), d)
    assert.strictEqual(d.y, 200)
  });

  it('read 的 style / status 别名键使用紧凑字段名', () => {
    const d = new ShapeData({ style: { g: 7 }, status: { f: 1 } })
    assert.strictEqual(d.lineWidth, 7)
    assert.strictEqual(d.locked, true)
  });

  it('read 忽略访问器名称，只认紧凑字段', () => {
    const d = new ShapeData({ x: 1 })
    d.read({ fillStyle: 'blue', visible: false })
    assert.strictEqual(d.fillStyle, '')
    assert.strictEqual(d.visible, true)
  });

  it('copy 返回同类型的新实例，二者互不影响', () => {
    const d = new ShapeData({ x: 1, y: 2, w: 3, h: 4, t: ShapeEnum.Rect, i: 'i-1' })
    d.fillStyle = 'red'
    const copy = d.copy()
    assert.notStrictEqual(copy, d)
    assert.ok(copy instanceof ShapeData)
    assert.deepStrictEqual(
      { x: copy.x, y: copy.y, w: copy.w, h: copy.h, t: copy.type, i: copy.id },
      { x: 1, y: 2, w: 3, h: 4, t: ShapeEnum.Rect, i: 'i-1' }
    )
    assert.strictEqual(copy.fillStyle, 'red')
    copy.x = 999
    assert.strictEqual(d.x, 1)
  });

  it('wash 清理空对象与 undefined 字段', () => {
    const d = new ShapeData({ x: 1, y: 2 })
    void d.style // 访问 style 会创建空实例
    d.rotation = 0
    const washed = d.wash()
    assert.strictEqual(washed, d)
    assert.ok(!('a' in washed), '空的 style 应被删除')
    assert.ok(!('r' in washed), 'undefined 的自定义字段应被删除')
    assert.ok(!('l' in washed))
  });

  it('wash 保留有内容的 style / status', () => {
    const d = new ShapeData({ x: 1 })
    d.fillStyle = 'red'
    d.selected = true
    d.wash()
    assert.strictEqual(d.fillStyle, 'red')
    assert.strictEqual(d.selected, true)
  });
  it('scaleY（d 字段）可以随 read / copy 一起还原', () => {
    const fromPartial = new ShapeData({ c: 2, d: 2 })
    assert.strictEqual(fromPartial.scaleX, 2)
    assert.strictEqual(fromPartial.scaleY, 2)

    const src = new ShapeData()
    src.scaleY = 3
    assert.strictEqual(src.scaleY, 3)
    assert.strictEqual(src.copy().scaleY, 3)
  });
});

describe('class ShapeStyle', () => {
  it('默认值', () => {
    const s = new ShapeStyle()
    assert.strictEqual(s.fillStyle, '')
    assert.strictEqual(s.strokeStyle, '')
    assert.strictEqual(s.lineCap, 'round')
    assert.strictEqual(s.lineJoin, 'round')
    assert.strictEqual(s.lineWidth, 0)
    assert.strictEqual(s.miterLimit, 0)
    assert.strictEqual(s.lineDashOffset, 0)
    assert.deepStrictEqual(s.lineDash, [])
  });

  it('setter 收到空值时删除底层字段，读取端回落到默认值', () => {
    const s = new ShapeStyle()
    s.fillStyle = 'red'
    s.lineWidth = 2
    s.lineCap = 'butt'
    s.lineDash = [1, 2]
    assert.strictEqual(s.fillStyle, 'red')
    assert.strictEqual(s.lineWidth, 2)
    assert.strictEqual(s.lineCap, 'butt')
    assert.deepStrictEqual(s.lineDash, [1, 2])
    s.fillStyle = ''
    s.lineWidth = 0
    s.lineCap = ''
    s.lineDash = []
    assert.ok(!('b' in s))
    assert.ok(!('g' in s))
    assert.ok(!('c' in s))
    assert.ok(!('d' in s))
    assert.strictEqual(s.fillStyle, '')
    assert.strictEqual(s.lineWidth, 0)
    assert.strictEqual(s.lineCap, 'round')
    assert.deepStrictEqual(s.lineDash, [])
  });

  it('lineDash 会拷贝数组，避免共享引用', () => {
    const s = new ShapeStyle()
    const dash = [1, 2]
    s.lineDash = dash
    dash.push(3)
    assert.deepStrictEqual(s.lineDash, [1, 2])
  });

  it('read / merge / copy', () => {
    const s = new ShapeStyle()
    assert.strictEqual(s.merge({ a: 'black', g: 4 }), s)
    assert.strictEqual(s.strokeStyle, 'black')
    assert.strictEqual(s.lineWidth, 4)
    const copy = s.copy()
    assert.ok(copy instanceof ShapeStyle)
    assert.notStrictEqual(copy, s)
    assert.strictEqual(copy.strokeStyle, 'black')
    copy.lineWidth = 9
    assert.strictEqual(s.lineWidth, 4)
  });
});

describe('class ShapeStatus', () => {
  it('默认全部为关闭状态，visible 默认开启', () => {
    const st = new ShapeStatus()
    assert.strictEqual(st.visible, true)
    assert.strictEqual(st.selected, false)
    assert.strictEqual(st.editing, false)
    assert.strictEqual(st.locked, false)
    assert.strictEqual(st.ghost, false)
  });

  it('紧凑字段编码：visible=false 写 0，其余布尔写 1，恢复默认时删除字段', () => {
    const st = new ShapeStatus()
    st.visible = false
    st.selected = true
    st.editing = true
    st.locked = true
    st.ghost = true
    assert.deepStrictEqual(
      { v: st.v, s: st.s, e: st.e, f: st.f, g: st.g },
      { v: 0, s: 1, e: 1, f: 1, g: 1 }
    )
    st.visible = true
    st.selected = false
    st.editing = false
    st.locked = false
    st.ghost = false
    assert.strictEqual(Object.keys(st).length, 0)
  });

  it('read 以数字为准（0 也是有效值）', () => {
    const st = new ShapeStatus().read({ v: 0, s: 0 })
    assert.strictEqual(st.visible, false)
    assert.strictEqual(st.selected, false)
  });

  it('merge / copy', () => {
    const st = new ShapeStatus().merge({ s: 1 })
    assert.strictEqual(st.selected, true)
    const copy = st.copy()
    assert.ok(copy instanceof ShapeStatus)
    assert.notStrictEqual(copy, st)
    assert.strictEqual(copy.selected, true)
    copy.selected = false
    assert.strictEqual(st.selected, true)
  });
});
