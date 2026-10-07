import { PAGES } from '../constants.js'
import { DRAFT_W, DRAFT_H } from './config.js'
import { useBoardStyle, useBoardTool, useElementSize, useWriteboard } from '../hooks.js'
import { EventEnum, useEffect, useRef, useState } from '../deps.js'
import { BoardScrollbar } from '../ui/BoardScrollbar.jsx'

/**
 * 草稿窗口里的那块黑板：一块独立的 writeboard 实例（设计尺寸 600×400、PAGES 页）。
 *
 * 笔迹画在 600×400 的设计坐标里，外层再用 CSS transform 缩放到窗口大小 ——
 * 所以窗口怎么拉，笔迹相对窗口宽度的比例都不变（和主黑板一个道理）；
 * 滚轮 / 滚动条 / 中键拖拽都能滚这块草稿。
 *
 * docked：停在停靠带里的小画面 —— 那会儿整个窗口都要能拖出来，
 * 所以画布不吃指针事件、指针事件也不拦着窗口（写字让位给拖拽，双击小画面照样放大）。
 */
export function DraftBoard({ style, docked, onToolChange, onFocus, onDirty }) {
  const wrapRef = useRef(null)
  const boardElRef = useRef(null)
  const { board, actions } = useWriteboard(boardElRef, { width: DRAFT_W, height: DRAFT_H, pages: PAGES }) ?? {}
  const box = useElementSize(wrapRef)
  /*
   * 内容整体**等比**缩放并居中：窗口比例和 3:2 不一样时（停靠的小画面、最大化后的自由区、
   * 手动拉出来的任意形状）笔迹也不会被拉变形，多出来的地方就是一块同色底板。
   */
  const k = Math.min(box.w ? box.w / DRAFT_W : 1, box.h ? box.h / DRAFT_H : 1)
  const ox = Math.max(0, (box.w - DRAFT_W * k) / 2)
  const oy = Math.max(0, (box.h - DRAFT_H * k) / 2)
  const [scroll, setScroll] = useState({ scrollTop: 0, scrollHeight: 0, viewportH: 0 })

  useBoardStyle(board, style)
  useBoardTool(board, style.tool, onToolChange)

  /* 有笔迹变化就告诉 App 一声：顶栏的撤销 / 重做按钮要跟着亮起来 */
  useEffect(() => {
    if (!board || !onDirty) return
    const events = [
      EventEnum.ShapesAdded, EventEnum.ShapesRemoved, EventEnum.ShapesDone,
      EventEnum.ShapesChanged, EventEnum.ShapesGeoChanged,
    ]
    const offs = events.map((e) => board.on(e, onDirty))
    return () => offs.forEach((off) => off())
  }, [board, onDirty])

  /* 滚轮：deltaY 是屏幕像素，除以缩放才是设计坐标里的位移（和主黑板一样） */
  useEffect(() => {
    const el = wrapRef.current
    if (!el || !board) return
    const onWheel = (e) => {
      /* 停靠带里的小画面不滚（那时候整个窗口都是用来拖的） */
      if (e.ctrlKey || docked) return
      e.preventDefault()
      e.stopPropagation()
      board.scroll_by(e.shiftKey ? e.deltaY / k : 0, e.shiftKey ? 0 : e.deltaY / k, true)
    }
    el.addEventListener('wheel', onWheel, { capture: true, passive: false })
    return () => el.removeEventListener('wheel', onWheel, { capture: true })
  }, [board, k, docked])

  /* 世界坐标 -> 状态，给滚动条用 */
  useEffect(() => {
    if (!board) return
    const sync = () => setScroll({
      scrollTop: -board.world.y,
      scrollHeight: board.world.h,
      viewportH: board.viewport.h,
    })
    const offs = [
      board.on(EventEnum.WorldRectChanged, sync),
      board.on(EventEnum.ViewportChanged, sync),
    ]
    sync()
    return () => offs.forEach((off) => off())
  }, [board])

  return (
    <div
      className="draft-board"
      ref={wrapRef}
      data-tool={style.tool}
      /* 用 capture：画布自己会 stopPropagation，冒泡阶段收不到这个 pointerdown。
         这里不能拦事件（拦了画布就收不到，写不了字），只管把「手边的黑板」切过来。 */
      onPointerDownCapture={() => { if (!docked) onFocus?.({ board, actions }) }}
    >
      <div
        className="blackboard"
        ref={boardElRef}
        style={{
          color: style.color,
          caretColor: style.color,
          width: DRAFT_W,
          height: DRAFT_H,
          transform: `translate(${ox}px, ${oy}px) scale(${k})`,
        }}
      />
      <BoardScrollbar view={scroll} scaleY={k} onScrollTo={(y) => board?.scroll_to(0, y, true)} />
    </div>
  )
}
