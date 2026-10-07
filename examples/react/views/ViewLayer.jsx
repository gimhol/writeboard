import { ViewWindow } from './ViewWindow.jsx'
import { CAM_ALIGNS, CAM_EDGES } from './dock.js'
import { CAM_DOCK_SCALE, CAM_PLACES, VIEW_KINDS } from './config.js'
import { trackPointer } from './use-solution.js'
import { Icon } from '../icons.jsx'

/*
 * 谁能「整块拖」：摄像头窗口没有头栏，整块都是抓手；草稿窗口里是一块能写的黑板，
 * 所以只认头栏（不然写字就变成拖窗口）。
 */
const draggableFromBody = (view) => view.kind === 'camera'

/**
 * 窗口层（相当于 blogim Chatroom 里的 Bridging）：
 * 布局 / 形态 / 拖动 / 拉伸的规则都在 ViewSolution 里，这一层只做两件事 ——
 *   1. 把 solution 算出来的矩形画成窗口（顺带画拖动时的停靠带 / 自由区提示）；
 *   2. 把指针事件接给 solution（黑板尺寸由 App 那边喂进 setFrame()）。
 *
 * 注意：喂给 solution 的指针坐标要换算成**黑板坐标**（减去黑板左上角），
 * 因为 solution 里的矩形都是黑板坐标 —— 两套坐标混用会让停靠 / 悬浮判定错位。
 */
export function ViewLayer({
  solution, frameRef, boardStyle,
  onToolChange, onFocusBoard, onDirty,
}) {
  const { views, rects, drag, resizing, zone } = solution
  if (!zone) return null
  const { strip, free, maxed } = zone

  /** 屏幕坐标 -> 黑板坐标 */
  const at = (e) => {
    const rect = frameRef?.current?.getBoundingClientRect()
    return rect ? { x: e.clientX - rect.left, y: e.clientY - rect.top } : { x: e.clientX, y: e.clientY }
  }

  /** 窗口上的按下：先抬到最上层，再决定这次是不是拖动 */
  const onWinDown = (view, e) => {
    solution.raise(view.id)
    if (e.button !== 0) return
    if (e.target.closest('.cam-btn, .cam-resize')) return
    /* 摄像头整块都能拖（没有头栏）；草稿里是一块能写的黑板，只认头栏 */
    if (!draggableFromBody(view) && !e.target.closest('.cam-head')) return
    if (!solution.beginDrag(view.id, at(e))) return
    e.preventDefault()
    trackPointer({
      onMove: (ev) => solution.moveDrag(at(ev)),
      onEnd: (ev) => solution.endDrag(ev && typeof ev.clientX === 'number' ? at(ev) : undefined),
    })
  }

  const onWinDoubleClick = (view, e) => {
    if (e.target.closest('.cam-btn, .cam-resize')) return
    /* 草稿同上：只有头栏能触发；摄像头整块都行 */
    if (!draggableFromBody(view) && !e.target.closest('.cam-head')) return
    solution.toggleMaximized(view.id)
  }

  const onResizeDown = (view, e, dir) => {
    if (e.button !== 0) return
    e.preventDefault()
    e.stopPropagation()
    if (!solution.beginResize(view.id, dir, at(e))) return
    trackPointer({
      onMove: (ev) => solution.moveResize(at(ev)),
      onEnd: () => solution.endResize(),
    })
  }

  const preview = solution.previewRect
  const labels = {
    edge: (CAM_EDGES.find((e) => e.key === solution.edge) || {}).label,
    align: (CAM_ALIGNS.find((a) => a.key === solution.align) || {}).label,
  }
  /* 只有摄像头会停靠：拖草稿时不提示停靠带 */
  const dockable = !!drag && drag.kind === 'camera'

  return (
    <>
      {drag && <>
        {dockable && <div
          className={`drop-zone${drag.dock ? ' active' : ''}`}
          style={{ left: strip.x, top: strip.y, width: strip.w, height: strip.h }}
        >
          <span className="drop-zone-text">在此停靠窗口</span>
        </div>}
        <div
          className={`drop-zone${drag.dock ? '' : ' active'}`}
          style={{ left: free.x, top: free.y, width: free.w, height: free.h }}
        >
          <span className="drop-zone-text">{maxed.length ? '在此加入拼接画面' : '在此悬浮窗口'}</span>
        </div>
        {preview && <div
          className="dock-preview"
          style={{ left: preview.x, top: preview.y, width: preview.w, height: preview.h }}
        >
          <span>{labels.edge} · {labels.align}</span>
        </div>}
      </>}
      {views.filter((view) => view.place !== CAM_PLACES.Minimized).map((view) => (
        <ViewWindow
          key={view.id}
          view={view}
          box={rects[view.id]}
          scale={view.place === CAM_PLACES.Docked ? CAM_DOCK_SCALE : 1}
          dragging={!!drag && drag.id === view.id}
          resizing={!!resizing && resizing.id === view.id}
          docked={view.place === CAM_PLACES.Docked}
          boardStyle={boardStyle}
          onDown={(e) => onWinDown(view, e)}
          onDoubleClick={(e) => onWinDoubleClick(view, e)}
          onResize={(e, dir) => onResizeDown(view, e, dir)}
          onMinimize={() => solution.minimize(view.id)}
          onToggleMax={() => solution.toggleMaximized(view.id)}
          onClose={() => solution.remove(view.id)}
          onToolChange={onToolChange}
          onFocusBoard={(ctx) => onFocusBoard(view.id, ctx)}
          onDirty={onDirty}
        />
      ))}
      {views.some((view) => view.place === CAM_PLACES.Minimized) && <div className="cam-mini-bar">
        {views.filter((view) => view.place === CAM_PLACES.Minimized).map((view) => (
          <button
            key={view.id}
            className="cam-mini"
            title="恢复窗口"
            onClick={() => solution.restore(view.id)}
          >
            <Icon name={VIEW_KINDS[view.kind].icon} size={16} />
            {view.name}
          </button>
        ))}
      </div>}
    </>
  )
}
