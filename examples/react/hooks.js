import { PAGES, DESIGN_W, DESIGN_H, STROKE_SHAPES, FILL_SHAPES } from './constants.js'
import { ActionQueue, EventEnum, FactoryEnum, Gaia, ShapeEnum, ToolEnum, useEffect, useState } from './deps.js'

/**
 * 创建 writeboard 实例：
 * - 画布按固定的“设计尺寸”绘制，外层再用 CSS transform 缩放到容器矩形
 *   —— 所以板子本身不需要跟着窗口改尺寸，缩放由 CSS 完成。
 *   主黑板是 DESIGN_W × DESIGN_H；草稿窗口里的板子传自己的尺寸（600×400 单页）。
 * - 世界（world）= pages 倍高度；滚轮 / 滚动条 / 中键拖拽都是在世界里移动可视区
 * 板子的生命周期挂在 effect 上：卸载时 destroy，避免残留。
 */
export function useWriteboard(containerRef, { width = DESIGN_W, height = DESIGN_H, pages = PAGES } = {}) {
  const [ctx, setCtx] = useState(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const factory = Gaia.factory(FactoryEnum.Default)()
    const board = factory.newBoard({
      element: el,
      width,
      height,
      scrollWidth: width,
      scrollHeight: height * pages,
    })
    const actions = new ActionQueue().setActor(board)

    setCtx({ board, actions })
    return () => {
      actions.setActor(undefined)
      board.destroy()
      setCtx(null)
    }
  }, [containerRef, width, height, pages])

  return ctx
}

/** 监听元素尺寸（摄像头窗口要靠它做吸附、最大化等布局） */
export function useElementSize(ref) {
  const [size, setSize] = useState({ w: 0, h: 0 })
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const update = () => setSize({ w: el.clientWidth, h: el.clientHeight })
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [ref])
  return size
}

/**
 * 描边 / 填充 / 粗细：直接改图形模板，之后新建的图形就用这套样式（对应 App 里的写法）。
 * k 是“设计尺寸 / 参考尺寸”的倍数：主黑板 1920 = 1280 × 1.5，所以 k = DESIGN_K；
 * 草稿窗口那块板本身就是参考尺寸（600×400），k = 1。
 */
export function useBoardStyle(board, { color, fill, lineWidth, k = 1 }) {
  useEffect(() => {
    if (!board) return
    const factory = board.factory
    const width = lineWidth * k
    STROKE_SHAPES.forEach((type) => {
      const data = factory.shapeTemplate(type)
      data.strokeStyle = color
      data.lineWidth = width
      /* 矩形 / 椭圆支持填充；选「透明」就是不填充 */
      if (FILL_SHAPES.includes(type)) data.fillStyle = fill
    })
    const text = factory.shapeTemplate(ShapeEnum.Text)
    text.fillStyle = color
    text.font_family = '"Microsoft YaHei", "PingFang SC", Arial, sans-serif'
    text.font_size = 28 * k
  }, [board, color, fill, lineWidth, k])
}

/** 工具与状态双向同步：状态驱动板子；板子内部切换（如文本编辑结束）时回写状态 */
export function useBoardTool(board, toolType, onToolChange, k = 1) {
  useEffect(() => {
    board?.setToolType(toolType)
  }, [board, toolType])

  useEffect(() => {
    if (!board || !onToolChange) return
    return board.on(EventEnum.ToolChanged, ({ to }) => onToolChange(to ?? ToolEnum.Selector))
  }, [board, onToolChange])

  /* 橡皮擦的“擦除范围”同样按设计尺寸换算 */
  useEffect(() => {
    const indicator = board?.tools?.get(ToolEnum.Eraser)?.indicator
    if (!indicator) return
    indicator.data.w = 100 * k
    indicator.data.h = 100 * k
    indicator.markDirty()
  }, [board, toolType, k])
}
