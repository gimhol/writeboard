import {
  CAM_DEFAULT_ALIGN, CAM_DEFAULT_EDGE, CAM_MAX, CAM_PLACES, DRAFT_H, DRAFT_W,
  VIEW_DEFAULT_KIND, VIEW_KINDS, cascadeRect, makeView, viewPlace, viewSize,
} from './config.js'
import { alignFactor, boxFrac, camDockSize, dockHit, dockStrip, fracBox } from './dock.js'
import { distributeAlong, fillRects, zoneMinus } from './distribution.js'

/** 拖动 / 拉伸时超过这个位移才算真的动过（免得点一下就把窗口挪了） */
const DRAG_THRESHOLD = 3
/** 还停在停靠带里时，垂直于带的方向只走 10%（照搬 demo：带里是「顺着带滑」的手感） */
const DOCK_DAMP = 0.1
/** 拖出停靠带之后，窗口每帧向指针靠拢一半 —— 60fps 的缓动跟随（对应 demo 的 _start_dragging_following） */
const FOLLOW_RATE = 0.5
const FOLLOW_MS = 1000 / 60

/** 默认的缓动节拍器：60fps 定时器（测试里可以换成手动步进的实现） */
const defaultTicker = {
  start(cb, ms) { return setInterval(cb, ms) },
  stop(id) { clearInterval(id) },
}

/** 窗口最小尺寸：按黑板比例算（demo 里是最小 100 × 100） */
const minSize = (fw, fh) => ({
  w: Math.max(72, Math.round((100 * fw) / 1280)),
  h: Math.max(56, Math.round((100 * fh) / 692)),
})

/** 把盒子调成给定宽高比（以宽度为准，高度居中微调）—— 草稿窗口用，保证正好 3:2 */
const fitRatio = ({ x, y, w, h }, ratio) => {
  const nh = Math.round(w / ratio)
  return { x, y: y + (h - nh) / 2, w, h: nh }
}

/** 会停靠的只有摄像头：草稿窗口里是一块能写的黑板，停到小画面里没法用 */
const canDock = (view) => view.kind === 'camera'

/**
 * 黑板上的窗口「方案」：窗口列表、种类（摄像头 / 草稿）、形态、停靠带 / 自由区、
 * 拖动与拉伸的状态机都在这里，不碰 DOM、不依赖 React
 * —— 对应 blogim Chatroom 的 ViewsSolution/Solution.ts。
 *
 * 用法：上层（React 的 useSolution / ViewLayer，相当于那里的 Bridging）负责
 *   - 把黑板尺寸喂进 setFrame()；
 *   - 把指针事件喂进 beginDrag/moveDrag/endDrag（拉伸同理）；
 *   - 订阅 subscribe()，按 rects / drag 把窗口画出来。
 *
 * 因为没有任何渲染层依赖，这个文件可以直接在 Node 里跑单测。
 */
export class ViewSolution {
  constructor({ views = [], edge = CAM_DEFAULT_EDGE, align = CAM_DEFAULT_ALIGN, ticker = defaultTicker } = {}) {
    this.full = { x: 0, y: 0, w: 0, h: 0 }
    this.edge = edge
    this.align = align
    this.views = []
    /* 正在拖的窗口：偏离的 offset / 开始时的位置 begin / 目标位置 target / 缓动出来的 preview */
    this.drag = null
    this.resizing = null    // { id, dir, px, py, box }
    this.zone = null        // 布局算出来的停靠带 / 自由区 / 各种矩形
    this.rects = {}         // id -> { x, y, w, h }
    this.ticker = ticker    // 缓动跟随用的定时器（测试里可以手动步进）
    this.followId = null
    this.seq = 0
    this.z = 0
    this.version = 0      // 每次 emit 自增：React 的 useSyncExternalStore 用它判断“变了”
    this.listeners = new Set()
    /* views 里可以写字符串（当摄像头名字）也可以写 { kind, name } */
    views.forEach((v) => (v && typeof v === 'object'
      ? this.add(v.kind || VIEW_DEFAULT_KIND, v.name)
      : this.add(VIEW_DEFAULT_KIND, v)))
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
      /* 正在拖的窗口：先按拖动中的临时位置画（从停靠带里拖出来时它会跟着指针滑） */
      const preview = this.drag && this.drag.id === view.id ? this.drag.preview : null
      if (preview) this.rects[view.id] = preview
      else if (view.place === CAM_PLACES.Docked) this.rects[view.id] = dockRects[docked.indexOf(view)]
      else if (view.place === CAM_PLACES.Maximized) this.rects[view.id] = maxRects[maxed.indexOf(view)]
      else {
        const rect = fracBox(view.rect, fw, fh)
        /* 悬浮的草稿：框本身就锁成 3:2，和里面的黑板完全重合（停靠 / 最大化时按格子给，
           内容再等比缩放居中，都不会变形） */
        this.rects[view.id] = view.kind === 'draft' ? fitRatio(rect, DRAFT_W / DRAFT_H) : rect
      }
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

  /**
   * 加一个窗口：add('draft') / add('draft', '板书') / add() 默认摄像头。
   * 兼容只给名字的老写法（add('老师') 就是加一路叫“老师”的摄像头）。
   */
  add(kind = VIEW_DEFAULT_KIND, name) {
    if (this.views.length >= CAM_MAX) return null
    if (!VIEW_KINDS[kind]) {
      name = kind
      kind = VIEW_DEFAULT_KIND
    }
    const id = ++this.seq
    const view = makeView(id, kind, name)
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
    if (place === CAM_PLACES.Docked && !canDock(view)) return
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

  /** 全部停靠 / 全部悬浮（一起悬浮时按序号错开一点，各自用自己的默认尺寸） */
  setAllPlace(place) {
    this.views.forEach((view, i) => {
      if (view.place === place) return
      if (place === CAM_PLACES.Docked && !canDock(view)) return   /* 草稿不进停靠带 */
      view.place = place
      if (place === CAM_PLACES.Floating) view.rect = cascadeRect(i, view.kind)
    })
    this.emit()
  }

  /** 复位：停靠边 / 对齐回默认，每个窗口回到自己的默认形态与默认尺寸 */
  reset() {
    this.edge = CAM_DEFAULT_EDGE
    this.align = CAM_DEFAULT_ALIGN
    this.drag = null
    this.resizing = null
    this.views.forEach((view) => {
      view.place = viewPlace(view.kind)
      view.rect = { cx: 0.5, cy: 0.5, ...viewSize(view.kind) }
    })
    this.emit()
  }

  /** 卸载时调用：停掉缓动定时器，别留下悬挂的 interval */
  release() {
    if (this.followId != null) {
      this.ticker.stop(this.followId)
      this.followId = null
    }
    this.listeners.clear()
  }

  /* ---------------- 拖动（对应 demo 的 on_drag_begin / move / end） ---------------- */

  /** 缓动跟随：每帧把窗口往指针方向靠一半（demo 的 _start_dragging_following） */
  startFollow() {
    if (this.followId != null) return
    this.followId = this.ticker.start(() => this.followStep(), FOLLOW_MS)
  }

  followStep() {
    const d = this.drag
    if (!d || !d.target) return
    const cur = this.rects[d.id] || d.target
    /* 差 1px 就直接贴上去：避免「四舍五入 + 折半」在目标附近来回抖 */
    const near = Math.abs(d.target.x - cur.x) <= 1 && Math.abs(d.target.y - cur.y) <= 1
    d.preview = {
      w: cur.w,
      h: cur.h,
      x: near ? d.target.x : Math.round(cur.x + (d.target.x - cur.x) * FOLLOW_RATE),
      y: near ? d.target.y : Math.round(cur.y + (d.target.y - cur.y) * FOLLOW_RATE),
    }
    this.emit()
  }

  /** 停缓动，并把窗口直接对齐到目标位置（松手时会用到） */
  stopFollow() {
    if (this.followId != null) {
      this.ticker.stop(this.followId)
      this.followId = null
    }
    const d = this.drag
    if (d && d.target) {
      const cur = this.rects[d.id] || d.target
      d.preview = { w: cur.w, h: cur.h, x: d.target.x, y: d.target.y }
    }
  }

  /**
   * 按住窗口：不能拖最大化的窗口；抬手时如果没真正移动过，就当点击处理（不改形态）。
   * 坐标一律用**黑板坐标**（和 this.rects 同一套）—— 混用屏幕坐标会让
   * 「从停靠带拖出来」那步算错位置，停靠 / 悬浮的判定就跟着错。
   * @returns 是否可以继续拖动
   */
  beginDrag(id, { x, y }) {
    const view = this.get(id)
    if (!view || view.place === CAM_PLACES.Maximized) return false
    this.raise(id)
    const box = this.rects[id]
    this.drag = {
      id,
      kind: view.kind,
      from: view.place,
      begin: { ...box },
      /* 按下时抓住的位置（相对窗口左上角），拖动时它要一直待在指针下 */
      offset: { x: x - box.x, y: y - box.y },
      pointer: { x, y },
      target: null,
      preview: null,
      moved: false,
      dock: false,
      /* 一旦被拖出停靠带就置为 true（这一整次拖动里不会退回带里滑动） */
      dragout: false,
      grown: false,
    }
    this.emit()      /* 让窗口立刻进「拖动中」的样式（光标等） */
    return true
  }

  moveDrag(point) {
    const d = this.drag
    if (!d) return
    const { x, y } = point
    if (!d.moved) {
      if (Math.abs(x - d.pointer.x) + Math.abs(y - d.pointer.y) < DRAG_THRESHOLD) return
      d.moved = true
    }
    d.pointer = { x, y }
    const { w: fw, h: fh } = this.full
    const { cell, horizontal } = this.zone
    const view = this.get(d.id)
    /* 只看指针在不在当前停靠边那一条带里（对应 should_dock，用的就是指针位置）；草稿不停靠 */
    d.dock = canDock(view) && dockHit(this.edge, point, cell, fw, fh)

    if (d.from === CAM_PLACES.Docked && !d.grown) {
      if (!d.dock) d.dragout = true
      if (!d.dragout) {
        /* 还在带里：顺着带滑 —— 沿带方向跟满，垂直方向只走 10%（demo 的阻尼手感） */
        this.stopFollow()
        const want = { x: x - d.offset.x, y: y - d.offset.y }
        d.preview = {
          w: d.begin.w, h: d.begin.h,
          x: Math.round(horizontal ? d.begin.x + (want.x - d.begin.x) : d.begin.x + (want.x - d.begin.x) * DOCK_DAMP),
          y: Math.round(horizontal ? d.begin.y + (want.y - d.begin.y) * DOCK_DAMP : d.begin.y + (want.y - d.begin.y)),
        }
        this.emit()
        return
      }
      /* 拖出带：小画面只是缩放显示，出来就回到自己的标准尺寸（摄像头 20% 宽、草稿 600/1280 宽），
         抓住的那个点按比例换算，继续待在指针下 */
      const ratio = viewSize(view.kind)
      d.offset = {
        x: (d.offset.x / d.begin.w) * Math.round(ratio.w * fw),
        y: (d.offset.y / d.begin.h) * Math.round(ratio.h * fh),
      }
      d.grown = true
    }

    const w = d.grown ? Math.round(viewSize(view.kind).w * fw) : d.begin.w
    const h = d.grown ? Math.round(viewSize(view.kind).h * fh) : d.begin.h
    /* 指针决定目标位置（夹在黑板里，取整避免缓动收敛出 1px 残差），缓动只是让画面跟上得更顺 */
    d.target = {
      x: Math.round(Math.min(Math.max(x - d.offset.x, 0), Math.max(fw - w, 0))),
      y: Math.round(Math.min(Math.max(y - d.offset.y, 0), Math.max(fh - h, 0))),
    }
    view.place = CAM_PLACES.Floating
    /* 第一帧直接摆到指针位置（抓取点不跳），之后的移动交给缓动跟随；
       位置先存在拖动状态里，抬手时才写回 view.rect（对应 demo 拖动中只挪 DOM，松手才落定） */
    if (!d.preview || d.preview.w !== w || d.preview.h !== h) {
      d.preview = { w, h, x: d.target.x, y: d.target.y }
    }
    this.emit()
    this.startFollow()
  }

  /** 松手：用**指针最后的位置**决定落点（demo 也是在 pointerup 时判 should_dock） */
  endDrag(point) {
    const d = this.drag
    if (!d) return
    this.stopFollow()
    const view = this.get(d.id)
    const p = point || d.pointer
    if (d.moved && view) {
      if (canDock(view) && dockHit(this.edge, p, this.zone.cell, this.full.w, this.full.h)) {
        view.place = CAM_PLACES.Docked
      } else if (d.from === CAM_PLACES.Docked) {
        /* 原本是停靠的：自由区里已经有人在拼接就加入拼接，否则就悬浮 */
        view.place = this.zone.maxed.length ? CAM_PLACES.Maximized : CAM_PLACES.Floating
      } else {
        view.place = CAM_PLACES.Floating
      }
      /* 落在自由区：把拖动结束的位置写回窗口自己的矩形（拖回停靠带时保留旧矩形，
         下次浮起来还能回到原来的位置） */
      if (view.place === CAM_PLACES.Floating && d.target) {
        view.rect = boxFrac({ x: d.target.x, y: d.target.y, w: d.preview.w, h: d.preview.h }, this.full.w, this.full.h)
      }
    }
    this.drag = null
    this.followId = null
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
    const view = this.get(r.id)
    /*
     * 草稿窗口里是 3:2 的黑板：拉伸时锁定这个比例，内容不会被拉变形
     * （拖哪条边就用哪条边定尺寸，另一边按比例算，对边保持不动）。
     */
    if (view.kind === 'draft') {
      const ratio = DRAFT_W / DRAFT_H
      const minW = Math.max(min.w, min.h * ratio)
      const horizontal = r.dir.includes('l') || r.dir.includes('r')
      /* 拖哪条边就用哪条边定尺寸，另一边按 3:2 算 */
      if (horizontal) w = Math.max(minW, w)
      else h = Math.max(minW / ratio, h)
      if (horizontal) h = w / ratio
      else w = h * ratio
      /* 没被拖的两条边钉住：拖动中盒子和黑板一样大时，整体缩回去也不破坏锚点 */
      const right = r.box.x + r.box.w
      const bottom = r.box.y + r.box.h
      const leftA = !r.dir.includes('l')
      const topA = !r.dir.includes('t')
      const fit = Math.min(1, (leftA ? fw - bx : right) / w, (topA ? fh - by : bottom) / h)
      w *= fit
      h *= fit
      bx = leftA ? bx : right - w
      by = topA ? by : bottom - h
      bx = Math.min(Math.max(bx, 0), Math.max(fw - w, 0))
      by = Math.min(Math.max(by, 0), Math.max(fh - h, 0))
    } else {
      /* 别拉出黑板 */
      w = Math.min(w, fw - bx)
      h = Math.min(h, fh - by)
    }
    view.place = CAM_PLACES.Floating
    view.rect = boxFrac({ x: bx, y: by, w, h }, fw, fh)
    this.emit()
  }

  endResize() {
    this.resizing = null
    this.emit()
  }
}
