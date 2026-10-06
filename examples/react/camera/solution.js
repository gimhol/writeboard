import { CAM_DEFAULT, CAM_DEFAULT_ALIGN, CAM_DEFAULT_EDGE, CAM_MAX, CAM_PLACES, cascadeRect, makeCam } from './config.js'
import { alignFactor, boxFrac, camDockSize, camSizePx, dockHit, dockStrip, fracBox } from './dock.js'
import { distributeAlong, fillRects, zoneMinus } from './distribution.js'

/** 拖动 / 拉伸时超过这个位移才算真的动过（免得点一下就把窗口挪了） */
const DRAG_THRESHOLD = 3
/** 窗口最小尺寸：按黑板比例算（demo 里是最小 100 × 100） */
const minSize = (fw, fh) => ({
  w: Math.max(72, Math.round((100 * fw) / 1280)),
  h: Math.max(56, Math.round((100 * fh) / 692)),
})

/**
 * 摄像头窗口的「方案」：窗口列表、形态、停靠带 / 自由区、拖动与拉伸的状态机都在这里，
 * 不碰 DOM、不依赖 React —— 对应 blogim Chatroom 的 ViewsSolution/Solution.ts。
 *
 * 用法：上层（React 的 useSolution / CameraLayer，相当于那里的 Bridging）负责
 *   - 把黑板尺寸喂进 setFrame()；
 *   - 把指针事件喂进 beginDrag/moveDrag/endDrag（拉伸同理）；
 *   - 订阅 subscribe()，按 rects / drag 把窗口画出来。
 *
 * 因为没有任何渲染层依赖，这个文件可以直接在 Node 里跑单测。
 */
export class CameraSolution {
  constructor({ views = [], edge = CAM_DEFAULT_EDGE, align = CAM_DEFAULT_ALIGN } = {}) {
    this.full = { x: 0, y: 0, w: 0, h: 0 }
    this.edge = edge
    this.align = align
    this.views = []
    this.drag = null        // { id, from, px, py, box, moved, dock }：正在拖的窗口
    this.resizing = null    // { id, dir, px, py, box }
    this.zone = null        // 布局算出来的停靠带 / 自由区 / 各种矩形
    this.rects = {}         // id -> { x, y, w, h }
    this.seq = 0
    this.z = 0
    this.version = 0      // 每次 emit 自增：React 的 useSyncExternalStore 用它判断“变了”
    this.listeners = new Set()
    views.forEach((name) => this.add(name))
  }

  /* ---------------- 订阅（Bridging 用） ---------------- */

  subscribe(listener) {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  emit() {
    this.layout()
    this.version += 1
    this.listeners.forEach((listener) => listener(this))
  }

  /* ---------------- 布局：停靠带 / 自由区 / 每个窗口的矩形 ---------------- */

  /**
   * 和 demo 的 update_zones + update 一样：
   * 停靠带贴着当前停靠边、厚度 = 小画面尺寸；有窗口停靠时自由区要扣掉停靠带（否则就是整块黑板）；
   * 停靠的沿带排一行、最大化的在自由区里均分、悬浮的按自己的比例算。
   */
  layout() {
    const { w: fw, h: fh } = this.full
    const cell = camDockSize(fw, fh)
    const strip = dockStrip(this.edge, cell, fw, fh)
    const horizontal = this.edge === 'top' || this.edge === 'bottom'
    const docked = this.views.filter((v) => v.place === CAM_PLACES.Docked)
    const maxed = this.views.filter((v) => v.place === CAM_PLACES.Maximized)
    const free = docked.length ? zoneMinus(this.full, strip, this.edge) : this.full
    const dockRects = distributeAlong(docked.length, strip, cell, horizontal, alignFactor(this.align))
    const maxRects = fillRects(maxed.length, free)

    this.zone = { cell, strip, horizontal, free, docked, maxed }
    this.rects = {}
    this.views.forEach((view) => {
      if (view.place === CAM_PLACES.Docked) this.rects[view.id] = dockRects[docked.indexOf(view)]
      else if (view.place === CAM_PLACES.Maximized) this.rects[view.id] = maxRects[maxed.indexOf(view)]
      else this.rects[view.id] = fracBox(view.rect, fw, fh)
    })
  }

  /** 拖动时预览的落点（对齐方式决定的位置） */
  get previewRect() {
    if (!this.drag || !this.drag.dock || !this.zone) return null
    const { cell, strip, horizontal } = this.zone
    return distributeAlong(1, strip, cell, horizontal, alignFactor(this.align))[0]
  }

  /* ---------------- 窗口增删改 ---------------- */

  get(id) {
    return this.views.find((v) => v.id === id)
  }

  add(name) {
    if (this.views.length >= CAM_MAX) return null
    const id = ++this.seq
    const view = makeCam(id, name || `摄像头 ${id}`)
    this.views.push(view)
    this.z = Math.max(this.z, view.z)
    this.emit()
    return view
  }

  remove(id) {
    this.views = this.views.filter((v) => v.id !== id)
    this.emit()
  }

  removeAll() {
    this.views = []
    this.emit()
  }

  update(id, patch) {
    const view = this.get(id)
    if (!view) return
    Object.assign(view, patch)
    this.emit()
  }

  /** 点哪个窗口哪个就到最上层（对应 demo 的 raise()） */
  raise(id) {
    const view = this.get(id)
    if (!view || view.z === this.z) return
    view.z = ++this.z
    this.emit()
  }

  setFrame(full) {
    const { x = 0, y = 0, w = 0, h = 0 } = full
    if (this.full.x === x && this.full.y === y && this.full.w === w && this.full.h === h) return
    this.full = { x, y, w, h }
    this.emit()
  }

  setDock({ edge = this.edge, align = this.align } = {}) {
    if (this.edge === edge && this.align === align) return
    this.edge = edge
    this.align = align
    this.emit()
  }

  /* ---------------- 形态切换 ---------------- */

  setPlace(id, place) {
    const view = this.get(id)
    if (!view || view.place === place) return
    view.back = view.place
    view.place = place
    this.emit()
  }

  minimize(id) {
    const view = this.get(id)
    if (!view) return
    view.back = view.place
    view.place = CAM_PLACES.Minimized
    this.emit()
  }

  restore(id) {
    const view = this.get(id)
    if (!view) return
    view.place = view.back || CAM_PLACES.Docked
    this.emit()
  }

  /**
   * 放大 / 还原（双击小画面或头栏）：
   * 已经是最大化 → 回停靠带；否则铺进自由区，并且把其它**悬浮**窗口一起放大，
   * 让它们一起均分自由区（停靠的小画面与最小化的窗口不动）。
   */
  toggleMaximized(id) {
    const view = this.get(id)
    if (!view) return
    if (view.place === CAM_PLACES.Maximized) {
      view.place = CAM_PLACES.Docked
      this.emit()
      return
    }
    const floats = this.views.filter((v) => v.place === CAM_PLACES.Floating).map((v) => v.id)
    const ids = new Set([id, ...floats])
    ids.forEach((vid) => {
      const v = this.get(vid)
      if (v) v.place = CAM_PLACES.Maximized
    })
    this.emit()
  }

  /** 全部停靠 / 全部悬浮（一起悬浮时按序号错开一点） */
  setAllPlace(place) {
    this.views.forEach((view, i) => {
      if (view.place === place) return
      view.place = place
      if (place === CAM_PLACES.Floating) view.rect = cascadeRect(i)
    })
    this.emit()
  }

  /** 复位：停靠边 / 对齐回默认，所有窗口回停靠带与标准尺寸 */
  reset() {
    this.edge = CAM_DEFAULT_EDGE
    this.align = CAM_DEFAULT_ALIGN
    this.drag = null
    this.resizing = null
    this.views.forEach((view) => {
      view.place = CAM_PLACES.Docked
      view.rect = CAM_DEFAULT
    })
    this.emit()
  }

  /* ---------------- 拖动（对应 demo 的 on_drag_begin / move / end） ---------------- */

  /**
   * 按住窗口：不能拖最大化的窗口；抬手时如果没真正移动过，就当点击处理（不改形态）。
   * @returns 是否可以继续拖动
   */
  beginDrag(id, { x, y }) {
    const view = this.get(id)
    if (!view || view.place === CAM_PLACES.Maximized) return false
    this.raise(id)
    this.drag = {
      id, from: view.place, px: x, py: y, box: this.rects[id], moved: false, dock: false,
    }
    return true
  }

  moveDrag({ x, y }) {
    const d = this.drag
    if (!d) return
    if (!d.moved) {
      if (Math.abs(x - d.px) + Math.abs(y - d.py) < DRAG_THRESHOLD) return
      d.moved = true
    }
    const { w: fw, h: fh } = this.full
    /* 跟着指针走到的位置（先不夹紧，停靠判定用真实中心） */
    let raw = { w: d.box.w, h: d.box.h, x: d.box.x + x - d.px, y: d.box.y + y - d.py }
    /* 只认「当前停靠边」那一条带，中心在里面才算停靠（对应 should_dock） */
    d.dock = dockHit(this.edge, raw, this.zone.cell, fw, fh)
    const view = this.get(d.id)
    if (d.dock && d.from === CAM_PLACES.Docked) {
      this.emit()          /* 停靠中在带里挪：还是它原来的格子，只更新落点提示 */
      return
    }
    /* 从停靠带拖出来：小画面只是缩放显示，出来就回到标准尺寸，
       并且让按下时抓住的那个点继续跟手（按比例换算到新的尺寸上） */
    if (d.from === CAM_PLACES.Docked && !d.grown) {
      const size = camSizePx(fw, fh)
      const rx = (d.px - d.box.x) / d.box.w
      const ry = (d.py - d.box.y) / d.box.h
      d.box = { x: d.px - rx * size.w, y: d.py - ry * size.h, w: size.w, h: size.h }
      d.grown = true
      raw = { w: d.box.w, h: d.box.h, x: d.box.x + x - d.px, y: d.box.y + y - d.py }
    }
    view.place = CAM_PLACES.Floating
    view.rect = boxFrac({
      w: raw.w, h: raw.h,
      x: Math.min(Math.max(raw.x, 0), Math.max(fw - raw.w, 0)),
      y: Math.min(Math.max(raw.y, 0), Math.max(fh - raw.h, 0)),
    }, fw, fh)
    this.emit()
  }

  endDrag() {
    const d = this.drag
    this.drag = null
    if (d && d.moved) {
      const view = this.get(d.id)
      if (d.dock) view.place = CAM_PLACES.Docked                                   /* 进停靠带 → 停靠 */
      else if (this.zone.maxed.length) view.place = CAM_PLACES.Maximized            /* 自由区里已有人最大化 → 加入拼接 */
      else view.place = CAM_PLACES.Floating
    }
    this.emit()
  }

  /* ---------------- 拉伸：8 个方向（对应 demo 的 resizer_l/r/t/b/lt/rt/lb/rb） ---------------- */

  beginResize(id, dir, { x, y }) {
    const view = this.get(id)
    if (!view || view.place === CAM_PLACES.Maximized) return false
    this.resizing = { id, dir, px: x, py: y, box: this.rects[id] }
    this.emit()
    return true
  }

  moveResize({ x, y }) {
    const r = this.resizing
    if (!r) return
    const { w: fw, h: fh } = this.full
    const min = minSize(fw, fh)
    const dx = x - r.px
    const dy = y - r.py
    let { x: bx, y: by, w, h } = r.box
    if (r.dir.includes('l')) {
      const nx = Math.min(bx + dx, bx + w - min.w)
      w += bx - nx
      bx = nx
    }
    if (r.dir.includes('r')) w = Math.max(min.w, w + dx)
    if (r.dir.includes('t')) {
      const ny = Math.min(by + dy, by + h - min.h)
      h += by - ny
      by = ny
    }
    if (r.dir.includes('b')) h = Math.max(min.h, h + dy)
    /* 别拉出黑板 */
    w = Math.min(w, fw - bx)
    h = Math.min(h, fh - by)
    const view = this.get(r.id)
    view.place = CAM_PLACES.Floating
    view.rect = boxFrac({ x: bx, y: by, w, h }, fw, fh)
    this.emit()
  }

  endResize() {
    this.resizing = null
    this.emit()
  }
}
