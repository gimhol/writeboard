import { PAGES, DESIGN_W, DESIGN_H } from './constants.js'
import { ActionQueue, FactoryEnum, Gaia, useEffect, useState } from './deps.js'

/**
 * 在容器里创建板子，并跟随容器尺寸自适应：
 * - 可视区（viewport）= 容器大小
 * - 世界（world）= PAGES 倍高度；滚轮 / 滚动条 / 中键拖拽都是在世界里移动可视区
 * 板子的生命周期挂在 effect 上：卸载时 destroy，避免残留。
 */
/**
 * 创建 writeboard 实例：
 * - 画布按固定的“设计尺寸”绘制（DESIGN_W × DESIGN_H），外层再用 CSS transform
 *   缩放到黑板矩形 —— 所以板子本身不需要跟着窗口改尺寸，缩放由 CSS 完成
 * - 世界（world）= PAGES 倍高度；滚轮 / 滚动条 / 中键拖拽都是在世界里移动可视区
 * 板子的生命周期挂在 effect 上：卸载时 destroy，避免残留。
 */
export function useWriteboard(containerRef) {
  const [ctx, setCtx] = useState(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const factory = Gaia.factory(FactoryEnum.Default)()
    const board = factory.newBoard({
      element: el,
      width: DESIGN_W,
      height: DESIGN_H,
      scrollWidth: DESIGN_W,
      scrollHeight: DESIGN_H * PAGES,
    })
    const actions = new ActionQueue().setActor(board)

    setCtx({ board, actions })
    return () => {
      actions.setActor(undefined)
      board.destroy()
      setCtx(null)
    }
  }, [containerRef])

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
