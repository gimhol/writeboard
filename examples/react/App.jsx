import { ViewLayer } from './views/ViewLayer.jsx'
import { ViewSolution } from './views/solution.js'
import { useSolution } from './views/use-solution.js'
import { PAGES, DESIGN_W, DESIGN_H, DESIGN_K, COLORS, WIDTHS, TRANSPARENT } from './constants.js'
import { CAM_PLACES } from './views/config.js'
import { EventEnum, ToolEnum, useCallback, useEffect, useReducer, useRef, useState } from './deps.js'
import { useBoardStyle, useBoardTool, useWriteboard, useElementSize } from './hooks.js'
import { BoardScrollbar } from './ui/BoardScrollbar.jsx'
import { PageOverlay } from './ui/PageOverlay.jsx'
import { Toolbar } from './ui/Toolbar.jsx'
import { WindowMenu } from './ui/WindowMenu.jsx'

export function App() {
  const frameRef = useRef(null)
  const boardElRef = useRef(null)
  const { board, actions } = useWriteboard(boardElRef) ?? {}
  const frameSize = useElementSize(frameRef)
  const [, forceRender] = useReducer((x) => x + 1, 0)

  /*
   * 可见窗口管理：工具栏收起状态 + 窗口的「方案」（ViewSolution）。
   * 窗口列表 / 种类 / 形态 / 布局都在 solution 里，React 这边只订阅它重渲染。
   * 顶栏的撤销 / 重做作用于「最后碰过的那块黑板」，所以草稿窗口被点亮时要把自己的
   * board / actions 交给 App（默认就是主黑板）。
   */
  const [collapsed, setCollapsed] = useState(false)
  const [solution] = useState(() => new ViewSolution({ views: ['老师'] }))
  useSolution(solution)
  useEffect(() => () => solution.release(), [solution])
  const views = solution.views
  const [activeId, setActiveId] = useState(null)
  const boardCtxRef = useRef({})

  /* 黑板尺寸喂给 solution（窗口尺寸 / 停靠带都按黑板比例算） */
  useEffect(() => {
    solution.setFrame({ x: 0, y: 0, w: frameSize.w, h: frameSize.h })
  }, [solution, frameSize.w, frameSize.h])

  const dockedCount = views.filter((c) => c.place === CAM_PLACES.Docked).length
  const allDocked = views.length > 0 && dockedCount === views.length
  const allFloating = views.length > 0 && views.every((c) => c.place === CAM_PLACES.Floating)

  const [toolType, setToolType] = useState(ToolEnum.Pen)
  const [color, setColor] = useState(COLORS[0])
  const [fill, setFill] = useState(TRANSPARENT)   /* 默认不填充，和以前的样子一致 */
  const [lineWidth, setLineWidth] = useState(WIDTHS[1])
  const [view, setView] = useState({ scrollTop: 0, scrollHeight: 0, viewportH: 0 })
  const [shapeCount, setShapeCount] = useState(0)

  /*
   * 画布整体缩放：画布按设计尺寸绘制，用 CSS transform 铺满黑板矩形。
   * x / y 各算一份，正好把设计尺寸铺到实际矩形上（同 gim.ink demo 的做法）。
   */
  const kx = frameSize.w ? frameSize.w / DESIGN_W : 1
  const ky = frameSize.h ? frameSize.h / DESIGN_H : 1

  /* 工具 / 颜色 / 填充 / 粗细：主黑板和草稿里那块黑板用的是同一套（见 hooks.js） */
  useBoardTool(board, toolType, setToolType, DESIGN_K)
  useBoardStyle(board, { color, fill, lineWidth, k: DESIGN_K })

  /*
   * 哪块黑板在“当前手边”：默认主黑板；点过草稿窗口里的板子就换成它，
   * 顶栏的撤销 / 重做 / 清空 都跟着走（配好的草稿窗口被关掉时自动落回主黑板）。
   */
  const draftAlive = activeId != null && views.some((v) => v.id === activeId)
  const activeCtx = (draftAlive && boardCtxRef.current[activeId]) || { board, actions }
  const activeBoard = activeCtx.board
  const activeActions = activeCtx.actions
  const focusBoard = useCallback((id, ctx) => {
    if (ctx) boardCtxRef.current[id] = ctx
    setActiveId(id)
  }, [])

  /*
   * 滚轮：画布坐标是设计尺寸的，滚轮量是屏幕像素，
   * 所以要按缩放比例换算一下，滚动手感才和视觉一致（并拦掉板子内部的处理）。
   */
  useEffect(() => {
    const el = boardElRef.current
    if (!el || !board) return
    const onWheel = (e) => {
      if (e.ctrlKey) return
      e.preventDefault()
      e.stopPropagation()
      const k = ky || 1
      board.scroll_by(e.shiftKey ? e.deltaY / k : 0, e.shiftKey ? 0 : e.deltaY / k, true)
    }
    el.addEventListener('wheel', onWheel, { capture: true, passive: false })
    return () => el.removeEventListener('wheel', onWheel, { capture: true })
  }, [board, ky])

  /* 滚动状态：画布的世界坐标 -> React 状态，供滚动条 / 页码 / 分页线使用 */
  useEffect(() => {
    if (!board) return
    const sync = () => setView({
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

  /* 撤销 / 重做按钮的可用状态、以及“黑板是否为空”，都从事件里刷新 */
  useEffect(() => {
    if (!board) return
    const events = [
      EventEnum.ShapesAdded, EventEnum.ShapesRemoved, EventEnum.ShapesDone,
      EventEnum.ShapesChanged, EventEnum.ShapesGeoChanged,
    ]
    const sync = () => {
      forceRender()
      /* ShapesRemoved 是在图形真正移除前发出的，延后一拍再读数量 */
      queueMicrotask(() => setShapeCount(board.shapes().length))
    }
    const offs = events.map((e) => board.on(e, sync))
    sync()
    return () => offs.forEach((off) => off())
  }, [board])

  const scrollTo = useCallback((y) => {
    if (board) board.scroll_to(0, y, true)
  }, [board])

  const undo = useCallback(() => activeActions?.undo(), [activeActions])
  const redo = useCallback(() => activeActions?.redo(), [activeActions])

  const clearAll = useCallback(() => {
    if (!activeBoard || !activeBoard.shapes().length) return
    if (!window.confirm('清空这块黑板？（可用 Ctrl+Z 撤销）')) return
    activeBoard.removeAll(true)
    if (activeBoard === board) board.scroll_to(0, 0, true)
  }, [activeBoard, board])

  /* Ctrl+Z / Ctrl+Y（文本编辑框内不拦截，交给输入框自己处理） */
  useEffect(() => {
    const onKeyDown = (e) => {
      const t = e.target
      if (t instanceof HTMLElement && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      if (!(e.ctrlKey || e.metaKey) || e.altKey) return
      const key = e.key.toLowerCase()
      if (key === 'z' && !e.shiftKey) {
        e.preventDefault()
        activeActions?.undo()
      } else if (key === 'y' || (key === 'z' && e.shiftKey)) {
        e.preventDefault()
        activeActions?.redo()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [activeActions])

  const page = view.viewportH ? Math.min(PAGES, Math.floor(view.scrollTop / view.viewportH) + 1) : 1
  const canUndo = !!(activeActions && activeActions.canUndo)
  const canRedo = !!(activeActions && activeActions.canRedo)
  const empty = shapeCount === 0
  const boardStyle = { tool: toolType, color, fill, lineWidth }

  return (
    <div className="app">
      <header className="topbar">
        <span className="dot" />
        <span className="title">示例课堂 · 黑板</span>
        <span className="sub">writeboard × React</span>
        <span className="spacer" />
        <span className="chip chip-hint">滚轮 / 拖动滚动条 / 中键拖拽 滚动黑板</span>
        <span className="chip">第 <b>{page}</b> / {PAGES} 页</span>
        <WindowMenu
          views={views}
          dockedCount={dockedCount}
          allDocked={allDocked}
          allFloating={allFloating}
          onAddView={(kind) => solution.add(kind)}
          onCloseAllCams={() => solution.removeAll()}
          onSetAllPlace={(place) => solution.setAllPlace(place)}
          dockEdge={solution.edge} dockAlign={solution.align}
          onDockEdge={(edge) => solution.setDock({ edge })}
          onDockAlign={(align) => solution.setDock({ align })}
          toolbarCollapsed={collapsed} onToolbarCollapsed={setCollapsed}
          onResetCams={() => solution.reset()}
        />
      </header>

      <div className="workspace">
        <div className="board-frame" data-tool={toolType} ref={frameRef}>
          <div
            className="blackboard"
            ref={boardElRef}
            /* 在主黑板上按下 = 把「手边的黑板」切回主黑板（撤销 / 重做跟着走） */
            onPointerDown={() => setActiveId(null)}
            style={{
              color, caretColor: color,
              width: DESIGN_W, height: DESIGN_H,
              transform: `scale(${kx}, ${ky})`,
            }}
          />
          <PageOverlay view={view} page={page} empty={empty} scaleY={ky} />
          <BoardScrollbar view={view} onScrollTo={scrollTo} scaleY={ky} />
          <ViewLayer
            solution={solution}
            frameRef={frameRef}
            boardStyle={boardStyle}
            onToolChange={setToolType}
            onFocusBoard={focusBoard}
            onDirty={forceRender}
          />
          <Toolbar
            frameRef={frameRef}
            collapsed={collapsed} onToggleCollapsed={() => setCollapsed((v) => !v)}
            tool={toolType} onTool={setToolType}
            color={color} onColor={setColor}
            fill={fill} onFill={setFill}
            width={lineWidth} onWidth={setLineWidth}
            canUndo={canUndo} canRedo={canRedo}
            onUndo={undo} onRedo={redo}
            empty={empty} onClear={clearAll}
            side={solution.edge === 'right' ? 'left' : 'right'}
          />
        </div>
      </div>
    </div>
  )
}
