import { CameraWindow } from './CameraWindow.jsx'
import { distributeAlong, zoneMinus, fillRects } from './distribution.js'
import { CAM_EDGES, CAM_ALIGNS, fracBox, boxFrac, camDockSize, alignFactor, dockStrip, dockHit } from './dock.js'
import { CAM_PLACES, CAM_DOCK_SCALE } from '../constants.js'
import { useState } from '../deps.js'
import { Icon } from '../icons.jsx'

/**
 * 摄像头窗口层：多个窗口一套布局（对应 blogim Chatroom 的 ViewsSolution）。
 * - 停靠：小画面沿「当前停靠边」的停靠带排成一行，贴边、不留缝、不要投影（align 决定整排位置）；
 * - 最大化：双击小画面 / 头栏就铺进自由区（整块黑板减去停靠带），
 *   多个最大化在自由区里均分（1 个铺满、2 个左右分、3 个三列、4 个 2×2 …）；
 * - 悬浮：拖动 + 8 个方向拉伸（只有悬浮态的尺寸由自己决定，其他形态都归布局排）；
 * - 最小化：收进左下角的小胶囊。
 */
export function CameraLayer({ frameSize, cams, onUpdate, onClose, onRaise, edge, align }) {
  const { w: fw, h: fh } = frameSize
  const full = { x: 0, y: 0, w: fw, h: fh }
  const cell = camDockSize(fw, fh)
  const strip = dockStrip(edge, cell, fw, fh)
  const horizontal = edge === 'top' || edge === 'bottom'
  const docked = cams.filter((c) => c.place === CAM_PLACES.Docked)
  const maxed = cams.filter((c) => c.place === CAM_PLACES.Maximized)
  const minimized = cams.filter((c) => c.place === CAM_PLACES.Minimized)
  /* 有窗口停在停靠带里时，自由区要从整块黑板里扣掉停靠带（demo 的 main_zone） */
  const free = docked.length ? zoneMinus(full, strip, edge) : full
  const dockRects = distributeAlong(docked.length, strip, cell, horizontal, alignFactor(align))
  const maxRects = fillRects(maxed.length, free)
  const [drag, setDrag] = useState(null)        // { id, dock, box }：正在拖的窗口
  const [resizingId, setResizingId] = useState(null)

  /** 每个窗口当前该待的像素盒子：停靠 / 最大化由布局定，悬浮按自己的比例算 */
  const boxOf = (cam) => {
    if (cam.place === CAM_PLACES.Docked) return dockRects[docked.indexOf(cam)]
    if (cam.place === CAM_PLACES.Maximized) return maxRects[maxed.indexOf(cam)]
    return fracBox(cam.rect, fw, fh)
  }

  const clamp = (v, min, max) => Math.min(Math.max(v, min), Math.max(max, min))
  /* 最小尺寸按黑板比例（demo 里是最小 100 × 100） */
  const minW = Math.max(72, Math.round((100 * fw) / 1280))
  const minH = Math.max(56, Math.round((100 * fh) / 692))

  /*
   * 双击 / 放大按钮：放大到自由区；已经最大化 → 回停靠带。
   * 有多个游离窗口时一起放大（它们一起均分自由区），停靠的小画面与最小化的不动。
   */
  const toggleMaximized = (cam) => {
    if (cam.place === CAM_PLACES.Maximized) {
      onUpdate(cam.id, { place: CAM_PLACES.Docked })
      return
    }
    const ids = new Set([
      cam.id,
      ...cams.filter((c) => c.place === CAM_PLACES.Floating).map((c) => c.id),
    ])
    ids.forEach((id) => onUpdate(id, { place: CAM_PLACES.Maximized }))
  }
  const onWinDoubleClick = (cam, e) => {
    if (e.target.closest('.cam-btn, .cam-resize')) return
    /* 悬浮窗口只认头栏，停靠的小画面整个都能双击 */
    if (cam.place === CAM_PLACES.Floating && !e.target.closest('.cam-head')) return
    onRaise(cam.id)
    toggleMaximized(cam)
  }

  /*
   * 拖动：监听挂在 window 上 —— 拖快时指针会瞬间离开窗口本身，
   * 只靠元素上的 pointermove / capture 会丢掉后续事件（连松手都收不到）；
   * 没有真正移动过的“点一下”不算拖动。
   */
  const onWinDown = (cam, e) => {
    onRaise(cam.id)             /* 点哪个窗口，哪个就抬到最上层（和 demo 的 raise 一致） */
    if (e.button !== 0 || cam.place === CAM_PLACES.Maximized) return
    if (e.target.closest('.cam-btn, .cam-resize')) return
    if (cam.place !== CAM_PLACES.Docked && !e.target.closest('.cam-head')) return
    e.preventDefault()
    const from = cam.place
    const slot = camDockSize(fw, fh)   // 停靠带里的格子尺寸
    const d = { px: e.clientX, py: e.clientY, box: boxOf(cam), moved: false, dock: false }
    const onMove = (ev) => {
      if (!d.moved) {
        if (Math.abs(ev.clientX - d.px) + Math.abs(ev.clientY - d.py) < 3) return
        d.moved = true
      }
      /* 跟着指针走到的位置（先不夹紧，停靠判定用真实中心） */
      const raw = {
        w: d.box.w, h: d.box.h,
        x: d.box.x + ev.clientX - d.px,
        y: d.box.y + ev.clientY - d.py,
      }
      /* 只认「当前停靠边」那一条带，中心在里面才算停靠 */
      d.dock = dockHit(edge, raw, slot, fw, fh)
      setDrag({ id: cam.id, dock: d.dock, box: raw })
      if (d.dock && from === CAM_PLACES.Docked) return   /* 停靠中在带里挪：还是它原来的格子 */
      onUpdate(cam.id, {
        place: CAM_PLACES.Floating,
        rect: boxFrac({
          w: raw.w, h: raw.h,
          x: clamp(raw.x, 0, fw - raw.w),
          y: clamp(raw.y, 0, fh - raw.h),
        }, fw, fh),
      })
    }
    const onEnd = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onEnd)
      window.removeEventListener('pointercancel', onEnd)
      setDrag(null)
      if (!d.moved) return
      /* 松手：进了停靠带就停靠；落在自由区且已经有窗口最大化 → 跟着一起均分 */
      if (d.dock) onUpdate(cam.id, { place: CAM_PLACES.Docked })
      else if (maxed.length) onUpdate(cam.id, { place: CAM_PLACES.Maximized })
      else onUpdate(cam.id, { place: CAM_PLACES.Floating })
    }
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onEnd)
    window.addEventListener('pointercancel', onEnd)
  }

  /*
   * 拉伸：8 个方向都有把手（左右上下 + 四个角），拖哪条边就改哪条边 ——
   * 和 demo 的 resizer_l/r/t/b/lt/rt/lb/rb 一样，把手只出现在悬浮窗口上。
   */
  const onResizeDown = (cam, e, dir) => {
    if (e.button !== 0) return
    e.preventDefault()
    e.stopPropagation()
    const d = { px: e.clientX, py: e.clientY, box: boxOf(cam) }
    const onMove = (ev) => {
      const dx = ev.clientX - d.px
      const dy = ev.clientY - d.py
      let { x, y, w, h } = d.box
      if (dir.includes('l')) {
        const nx = Math.min(x + dx, x + w - minW)
        w += x - nx
        x = nx
      }
      if (dir.includes('r')) w = Math.max(minW, w + dx)
      if (dir.includes('t')) {
        const ny = Math.min(y + dy, y + h - minH)
        h += y - ny
        y = ny
      }
      if (dir.includes('b')) h = Math.max(minH, h + dy)
      /* 别拉出黑板 */
      w = Math.min(w, fw - x)
      h = Math.min(h, fh - y)
      onUpdate(cam.id, { rect: boxFrac({ x, y, w, h }, fw, fh) })
    }
    const onEnd = () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onEnd)
      window.removeEventListener('pointercancel', onEnd)
      setResizingId(null)
    }
    setResizingId(cam.id)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onEnd)
    window.addEventListener('pointercancel', onEnd)
  }

  const draft = {
    edge: (CAM_EDGES.find((e) => e.key === edge) || {}).label,
    align: (CAM_ALIGNS.find((a) => a.key === align) || {}).label,
  }
  /* 拖动时才亮出的两块区域（对应 demo 的 dock_zone / main_zone），停靠带只画在当前停靠边上 */
  const preview = drag && drag.dock
    ? distributeAlong(1, strip, cell, horizontal, alignFactor(align))[0]
    : null

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
          <span>{draft.edge} · {draft.align}</span>
        </div>}
      </>}
      {cams.filter((cam) => cam.place !== CAM_PLACES.Minimized).map((cam) => (
        <CameraWindow
          key={cam.id}
          cam={cam}
          box={boxOf(cam)}              scale={cam.place === CAM_PLACES.Docked ? CAM_DOCK_SCALE : 1}
          dragging={!!drag && drag.id === cam.id}
          resizing={resizingId === cam.id}
          onDown={(e) => onWinDown(cam, e)}
          onDoubleClick={(e) => onWinDoubleClick(cam, e)}
          onResize={(e, dir) => onResizeDown(cam, e, dir)}
          onMinimize={() => onUpdate(cam.id, { place: CAM_PLACES.Minimized, back: cam.place })}
          onToggleMax={() => toggleMaximized(cam)}
          onClose={() => onClose(cam.id)}
        />
      ))}
      {minimized.length > 0 && <div className="cam-mini-bar">
        {minimized.map((cam) => (
          <button
            key={cam.id}
            className="cam-mini"
            title="恢复摄像头窗口"
            onClick={() => onUpdate(cam.id, { place: cam.back || CAM_PLACES.Docked })}
          >
            <Icon name="camera" size={16} />
            {cam.name}
          </button>
        ))}
      </div>}
    </>
  )
}
