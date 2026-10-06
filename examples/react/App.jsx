import { CameraLayer } from './camera/CameraLayer.jsx'
import { CameraSolution } from './camera/solution.js'
import { useSolution } from './camera/use-solution.js'
import { PAGES, DESIGN_W, DESIGN_H, DESIGN_K, COLORS, WIDTHS, STROKE_SHAPES, FILL_SHAPES, TRANSPARENT } from './constants.js'
import { CAM_PLACES } from './camera/config.js'
import { EventEnum, ShapeEnum, ToolEnum, useCallback, useEffect, useReducer, useRef, useState } from './deps.js'
import { useWriteboard, useElementSize } from './hooks.js'
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
   * 可见窗口管理：工具栏收起状态 + 摄像头窗口的「方案」（CameraSolution）。
   * 窗口列表 / 形态 / 布局都在 solution 里，React 这边只订阅它重渲染。
   */
  const [collapsed, setCollapsed] = useState(false)
  const [solution] = useState(() => new CameraSolution({ views: ['老师'] }))
  useSolution(solution)
  const cams = solution.views

  /* 黑板尺寸喂给 solution（窗口尺寸 / 停靠带都按黑板比例算） */
  useEffect(() => {
    solution.setFrame({ x: 0, y: 0, w: frameSize.w, h: frameSize.h })
  }, [solution, frameSize.w, frameSize.h])

  const dockedCount = cams.filter((c) => c.place === CAM_PLACES.Docked).length
  const allDocked = cams.length > 0 && dockedCount === cams.length
  const allFloating = cams.length > 0 && cams.every((c) => c.place === CAM_PLACES.Floating)

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

  /* 工具与状态双向同步：状态驱动板子；板子内部切换（如文本编辑结束）时回写状态 */
  useEffect(() => {
    board?.setToolType(toolType)
  }, [board, toolType])

  useEffect(() => {
    if (!board) return
    return board.on(EventEnum.ToolChanged, ({ to }) => setToolType(to ?? ToolEnum.Selector))
  }, [board])

  /*
   * 颜色 / 粗细：直接改图形模板，之后新建的图形就使用新样式。
   * 粗细 / 字号都乘 DESIGN_K —— 工具面板上的数字是“参考尺寸”下的值，
   * 落到 1.5 倍的设计画布上要放大同样的倍数，视觉粗细才和以前一致。
   */
  useEffect(() => {
    if (!board) return
    const factory = board.factory
    const width = lineWidth * DESIGN_K
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
    text.font_size = 28 * DESIGN_K
  }, [board, color, fill, lineWidth])

  /* 橡皮擦的“擦除范围”同样按设计尺寸换算 */
  useEffect(() => {
    const indicator = board?.tools?.get(ToolEnum.Eraser)?.indicator
    if (!indicator) return
    indicator.data.w = 100 * DESIGN_K
    indicator.data.h = 100 * DESIGN_K
    indicator.markDirty()
  }, [board, toolType])

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

  const undo = useCallback(() => actions?.undo(), [actions])
  const redo = useCallback(() => actions?.redo(), [actions])

  const clearAll = useCallback(() => {
    if (!board || !board.shapes().length) return
    if (!window.confirm('清空整块黑板？（可用 Ctrl+Z 撤销）')) return
    board.removeAll(true)
    board.scroll_to(0, 0, true)
  }, [board])

  /* Ctrl+Z / Ctrl+Y（文本编辑框内不拦截，交给输入框自己处理） */
  useEffect(() => {
    const onKeyDown = (e) => {
      const t = e.target
      if (t instanceof HTMLElement && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      if (!(e.ctrlKey || e.metaKey) || e.altKey) return
      const key = e.key.toLowerCase()
      if (key === 'z' && !e.shiftKey) {
        e.preventDefault()
        actions?.undo()
      } else if (key === 'y' || (key === 'z' && e.shiftKey)) {
        e.preventDefault()
        actions?.redo()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [actions])

  const page = view.viewportH ? Math.min(PAGES, Math.floor(view.scrollTop / view.viewportH) + 1) : 1
  const canUndo = !!(actions && actions.canUndo)
  const canRedo = !!(actions && actions.canRedo)
  const empty = shapeCount === 0

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
          camCount={cams.length}
          dockedCount={dockedCount}
          allDocked={allDocked}
          allFloating={allFloating}
          onAddCam={() => solution.add()}
          onCloseAllCams={() => solution.removeAll()}
          onSetAllPlace={(place) => solution.setAllPlace(place)}
          camEdge={solution.edge} camAlign={solution.align}
          onCamEdge={(edge) => solution.setDock({ edge })}
          onCamAlign={(align) => solution.setDock({ align })}
          toolbarCollapsed={collapsed} onToolbarCollapsed={setCollapsed}
          onResetCams={() => solution.reset()}
        />
      </header>

      <div className="workspace">
        <div className="board-frame" data-tool={toolType} ref={frameRef}>
          <div
            className="blackboard"
            ref={boardElRef}
            style={{
              color, caretColor: color,
              width: DESIGN_W, height: DESIGN_H,
              transform: `scale(${kx}, ${ky})`,
            }}
          />
          <PageOverlay view={view} page={page} empty={empty} scaleY={ky} />
          <BoardScrollbar view={view} onScrollTo={scrollTo} scaleY={ky} />
          <CameraLayer solution={solution} />
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
