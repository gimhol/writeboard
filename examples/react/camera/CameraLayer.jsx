import { CameraWindow } from './CameraWindow.jsx'
import { CAM_ALIGNS, CAM_EDGES } from './dock.js'
import { CAM_DOCK_SCALE, CAM_PLACES } from './config.js'
import { trackPointer } from './use-solution.js'
import { Icon } from '../icons.jsx'

/**
 * 摄像头窗口层（相当于 blogim Chatroom 里的 Bridging）：
 * 布局 / 形态 / 拖动 / 拉伸的规则都在 CameraSolution 里，这一层只做两件事 ——
 *   1. 把 solution 算出来的矩形画成窗口（顺带画拖动时的停靠带 / 自由区提示）；
 *   2. 把指针事件接给 solution（黑板尺寸由 useSolution 那边喂进 setFrame()）。
 */
export function CameraLayer({ solution }) {
  const { views, rects, drag, resizing, zone } = solution
  if (!zone) return null
  const { strip, free, maxed } = zone

  /** 窗口上的按下：先抬到最上层，再决定这次是不是拖动 */
  const onWinDown = (cam, e) => {
    solution.raise(cam.id)
    if (e.button !== 0) return
    if (e.target.closest('.cam-btn, .cam-resize')) return
    /* 悬浮窗口只认头栏（别在画面上拖着走），停靠的小画面整个都能拖 */
    if (cam.place !== CAM_PLACES.Docked && !e.target.closest('.cam-head')) return
    if (!solution.beginDrag(cam.id, { x: e.clientX, y: e.clientY })) return
    e.preventDefault()
    trackPointer({
      onMove: (ev) => solution.moveDrag({ x: ev.clientX, y: ev.clientY }),
      onEnd: () => solution.endDrag(),
    })
  }

  const onWinDoubleClick = (cam, e) => {
    if (e.target.closest('.cam-btn, .cam-resize')) return
    if (cam.place === CAM_PLACES.Floating && !e.target.closest('.cam-head')) return
    solution.toggleMaximized(cam.id)
  }

  const onResizeDown = (cam, e, dir) => {
    if (e.button !== 0) return
    e.preventDefault()
    e.stopPropagation()
    if (!solution.beginResize(cam.id, dir, { x: e.clientX, y: e.clientY })) return
    trackPointer({
      onMove: (ev) => solution.moveResize({ x: ev.clientX, y: ev.clientY }),
      onEnd: () => solution.endResize(),
    })
  }

  const preview = solution.previewRect
  const labels = {
    edge: (CAM_EDGES.find((e) => e.key === solution.edge) || {}).label,
    align: (CAM_ALIGNS.find((a) => a.key === solution.align) || {}).label,
  }

  return (
    <>
      {drag && <>
        <div
          className={`drop-zone${drag.dock ? ' active' : ''}`}
          style={{ left: strip.x, top: strip.y, width: strip.w, height: strip.h }}
        >
          <span className="drop-zone-text">在此停靠窗口</span>
        </div>
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
      {views.filter((cam) => cam.place !== CAM_PLACES.Minimized).map((cam) => (
        <CameraWindow
          key={cam.id}
          cam={cam}
          box={rects[cam.id]}
          scale={cam.place === CAM_PLACES.Docked ? CAM_DOCK_SCALE : 1}
          dragging={!!drag && drag.id === cam.id}
          resizing={!!resizing && resizing.id === cam.id}
          onDown={(e) => onWinDown(cam, e)}
          onDoubleClick={(e) => onWinDoubleClick(cam, e)}
          onResize={(e, dir) => onResizeDown(cam, e, dir)}
          onMinimize={() => solution.minimize(cam.id)}
          onToggleMax={() => solution.toggleMaximized(cam.id)}
          onClose={() => solution.remove(cam.id)}
        />
      ))}
      {views.some((cam) => cam.place === CAM_PLACES.Minimized) && <div className="cam-mini-bar">
        {views.filter((cam) => cam.place === CAM_PLACES.Minimized).map((cam) => (
          <button
            key={cam.id}
            className="cam-mini"
            title="恢复摄像头窗口"
            onClick={() => solution.restore(cam.id)}
          >
            <Icon name="camera" size={16} />
            {cam.name}
          </button>
        ))}
      </div>}
    </>
  )
}
