const { Gaia, FactoryEnum, ShapeEnum, ToolEnum, EventEnum, ShapeData, Shape } = require('../dist/es5/cjs/writeboard.js')

const assert = require('assert');

describe('class Gaia（注册中心）', () => {
  describe('内置注册', () => {
    it('内置图形全部可查，且能创建数据与图形实例', () => {
      const types = Gaia.listShapes()
      for (const type of [ShapeEnum.Pen, ShapeEnum.Rect, ShapeEnum.Oval, ShapeEnum.Text, ShapeEnum.Polygon]) {
        assert.ok(types.includes(type), `缺少内置图形: ${type}`)
        const info = Gaia.shapeInfo(type)
        assert.strictEqual(info.type, type)
        assert.ok(info.name.length > 0)
        const dataCreator = Gaia.shapeData(type)
        const shapeCreator = Gaia.shape(type)
        assert.strictEqual(typeof dataCreator, 'function')
        assert.strictEqual(typeof shapeCreator, 'function')
        const data = dataCreator()
        assert.ok(data instanceof ShapeData)
        const shape = shapeCreator(data)
        assert.ok(shape instanceof Shape)
        assert.strictEqual(shape.type, type)
        assert.strictEqual(shape.data.t, type)
      }
    });

    it('内置工具全部可查，且带有关联图形信息', () => {
      const types = Gaia.listTools()
      for (const type of [ToolEnum.Selector, ToolEnum.Pen, ToolEnum.Rect, ToolEnum.Eraser]) {
        assert.ok(types.includes(type), `缺少内置工具: ${type}`)
        assert.strictEqual(typeof Gaia.tool(type), 'function')
        assert.ok(Gaia.toolInfo(type).name.length > 0)
      }
      assert.strictEqual(Gaia.toolInfo(ToolEnum.Rect).shape, ShapeEnum.Rect)
      assert.strictEqual(Gaia.toolInfo(ToolEnum.Pen).shape, ShapeEnum.Pen)
    });

    it('默认工厂已注册', () => {
      assert.ok(Gaia.listFactories().includes(FactoryEnum.Default))
      assert.strictEqual(typeof Gaia.factory(FactoryEnum.Default), 'function')
    });

    it('内置撤销动作已注册', () => {
      const actions = Gaia.listActions()
      for (const type of [EventEnum.ShapesDone, EventEnum.ShapesRemoved, EventEnum.ShapesGeoChanged]) {
        assert.ok(actions.includes(type), `缺少动作: ${type}`)
        const handler = Gaia.action(type)
        assert.strictEqual(typeof handler.isAction, 'function')
        assert.strictEqual(typeof handler.undo, 'function')
        assert.strictEqual(typeof handler.redo, 'function')
      }
    });

    it('查询未注册的类型返回 undefined', () => {
      assert.strictEqual(Gaia.shape('NOT_A_SHAPE'), undefined)
      assert.strictEqual(Gaia.shapeInfo('NOT_A_SHAPE'), undefined)
      assert.strictEqual(Gaia.shapeData('NOT_A_SHAPE'), undefined)
      assert.strictEqual(Gaia.tool('NOT_A_TOOL'), undefined)
      assert.strictEqual(Gaia.toolInfo('NOT_A_TOOL'), undefined)
      assert.strictEqual(Gaia.factory('NOT_A_FACTORY'), undefined)
      assert.strictEqual(Gaia.action('NOT_AN_ACTION'), undefined)
    });
  });

  describe('自定义注册', () => {
    it('registerShape 注册数据/图形创建函数与信息', () => {
      const dataCreator = () => new ShapeData({ t: 'TEST_SHAPE' })
      const shapeCreator = (data) => new Shape(data, ShapeData)
      Gaia.registerShape('TEST_SHAPE', dataCreator, shapeCreator, { name: '测试图形', desc: '用于测试' })
      assert.strictEqual(Gaia.shapeData('TEST_SHAPE'), dataCreator)
      assert.strictEqual(Gaia.shape('TEST_SHAPE'), shapeCreator)
      assert.deepStrictEqual(Gaia.shapeInfo('TEST_SHAPE'), { name: '测试图形', desc: '用于测试', type: 'TEST_SHAPE' })
      assert.ok(Gaia.listShapes().includes('TEST_SHAPE'))
    });

    it('重复 registerShape 会告警但仍覆盖注册', () => {
      const cap = __captureConsole('warn')
      try {
        const other = (data) => new Shape(data, ShapeData)
        Gaia.registerShape('TEST_SHAPE', () => new ShapeData({ t: 'TEST_SHAPE' }), other)
        assert.strictEqual(cap.calls.length, 1)
        assert.ok(cap.calls[0].includes('already exists'))
        assert.strictEqual(Gaia.shape('TEST_SHAPE'), other)
      } finally {
        cap.restore()
      }
    });

    it('未提供 name/desc 时以类型名作为展示名', () => {
      Gaia.registerShape('TEST_SHAPE_2', () => new ShapeData(), (data) => new Shape(data, ShapeData))
      const info = Gaia.shapeInfo('TEST_SHAPE_2')
      assert.strictEqual(info.name, 'TEST_SHAPE_2')
      assert.strictEqual(info.desc, 'TEST_SHAPE_2')
      assert.strictEqual(info.type, 'TEST_SHAPE_2')
    });

    it('overrideShape 可以只更新信息，不动创建函数', () => {
      const dataCreator = Gaia.shapeData('TEST_SHAPE_2')
      const shapeCreator = Gaia.shape('TEST_SHAPE_2')
      Gaia.overrideShape('TEST_SHAPE_2', undefined, undefined, { name: '改过的名字' })
      assert.strictEqual(Gaia.shapeInfo('TEST_SHAPE_2').name, '改过的名字')
      assert.strictEqual(Gaia.shapeData('TEST_SHAPE_2'), dataCreator)
      assert.strictEqual(Gaia.shape('TEST_SHAPE_2'), shapeCreator)
    });

    it('registerTool 注册工具创建函数与信息，editToolInfo 修改信息', () => {
      const creator = () => ({ type: 'TEST_TOOL' })
      Gaia.registerTool('TEST_TOOL', creator, { name: '测试工具', desc: 'tool for test', shape: ShapeEnum.Rect })
      assert.strictEqual(Gaia.tool('TEST_TOOL'), creator)
      assert.deepStrictEqual(Gaia.toolInfo('TEST_TOOL'), { name: '测试工具', desc: 'tool for test', shape: ShapeEnum.Rect })
      assert.ok(Gaia.listTools().includes('TEST_TOOL'))

      Gaia.editToolInfo('TEST_TOOL', (info) => ({ ...info, desc: '改过的描述' }))
      assert.strictEqual(Gaia.toolInfo('TEST_TOOL').desc, '改过的描述')
    });

    it('editToolInfo 对未注册的工具是空操作', () => {
      Gaia.editToolInfo('NOT_A_TOOL', (info) => ({ ...info, name: 'x' }))
      assert.strictEqual(Gaia.toolInfo('NOT_A_TOOL'), undefined)
    });

    it('overrideTool 未提供 name/desc 时回落到类型名', () => {
      Gaia.overrideTool('TEST_TOOL_2', () => ({ type: 'TEST_TOOL_2' }), { shape: ShapeEnum.Oval })
      assert.deepStrictEqual(Gaia.toolInfo('TEST_TOOL_2'), { name: 'TEST_TOOL_2', desc: 'TEST_TOOL_2', shape: ShapeEnum.Oval })
    });

    it('重复 registerTool 会告警', () => {
      const cap = __captureConsole('warn')
      try {
        Gaia.registerTool('TEST_TOOL_2', () => ({}))
        assert.strictEqual(cap.calls.length, 1)
      } finally {
        cap.restore()
      }
    });

    it('registerFactory 注册/覆盖工厂', () => {
      const creator = () => ({})
      Gaia.registerFactory('TEST_FACTORY', creator, { name: '测试工厂', desc: 'factory for test' })
      assert.strictEqual(Gaia.factory('TEST_FACTORY'), creator)
      assert.ok(Gaia.listFactories().includes('TEST_FACTORY'))

      const cap = __captureConsole('warn')
      try {
        const creator2 = () => ({ v: 2 })
        Gaia.registerFactory('TEST_FACTORY', creator2)
        assert.strictEqual(cap.calls.length, 1)
        assert.strictEqual(Gaia.factory('TEST_FACTORY'), creator2)
      } finally {
        cap.restore()
      }
    });

    it('registAction 注册自定义撤销动作', () => {
      const handler = { isAction: () => true, undo: () => { }, redo: () => { } }
      Gaia.registAction('TEST_ACTION', handler)
      assert.ok(Gaia.listActions().includes('TEST_ACTION'))
      assert.strictEqual(Gaia.action('TEST_ACTION'), handler)
    });
  });

  describe('字体注册', () => {
    it('通过 checkFont 判定是否收录，重复注册会告警', () => {
      const original = Gaia.checkFont
      try {
        Gaia.checkFont = () => true
        Gaia.registerFont([{ family: 'Test Font', name: '测试字体', desc: '用于测试' }])
        assert.strictEqual(Gaia.fonts.get('Test Font').name, '测试字体')

        const cap = __captureConsole('warn')
        Gaia.registerFont([{ family: 'Test Font', name: '另一个', desc: '重复' }])
        cap.restore()
        assert.strictEqual(cap.calls.length, 1)
        assert.ok(cap.calls[0].includes('already exists'))
        assert.strictEqual(Gaia.fonts.get('Test Font').name, '测试字体')
      } finally {
        Gaia.checkFont = original
      }
    });

    it('checkFont 判定不支持时不收录', () => {
      const original = Gaia.checkFont
      try {
        Gaia.checkFont = () => false
        const cap = __captureConsole('warn')
        Gaia.registerFont([{ family: 'Unsupported Font', name: '不支持', desc: '用于测试' }])
        cap.restore()
        assert.ok(!Gaia.fonts.has('Unsupported Font'))
        assert.strictEqual(cap.calls.length, 1)
        assert.ok(cap.calls[0].includes('not supported'))
      } finally {
        Gaia.checkFont = original
      }
    });
  });
});
