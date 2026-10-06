import { CAM_SIZE, CAM_DOCK_SCALE } from './config.js'

/** 停靠边 / 对齐（对应 blogim Chatroom 的 DockType / DockAlign） */
export const CAM_EDGES = [
  { key: 'top', label: '顶部' },
  { key: 'left', label: '左侧' },
  { key: 'bottom', label: '底部' },
  { key: 'right', label: '右侧' },
]
export const CAM_ALIGNS = [
  { key: 'start', label: '起始' },
  { key: 'center', label: '居中' },
  { key: 'end', label: '末尾' },
]
/** 摄像头窗口尺寸（像素）：黑板比例 -> 像素，黑板缩放时窗口跟着缩放 */
export const camSizePx = (fw, fh) => ({
  w: Math.round(CAM_SIZE.w * fw),
  h: Math.round(CAM_SIZE.h * fh),
})

/** 比例盒子（cx / cy / w / h 都是 0~1）-> 像素盒子 */
export function fracBox({ cx, cy, w, h }, fw, fh) {
  const pw = Math.round(w * fw)
  const ph = Math.round(h * fh)
  return { x: Math.round(cx * fw - pw / 2), y: Math.round(cy * fh - ph / 2), w: pw, h: ph }
}

/** 像素盒子 -> 比例盒子（拖动 / 缩放之后写回状态用） */
export function boxFrac({ x, y, w, h }, fw, fh) {
  return { cx: (x + w / 2) / fw, cy: (y + h / 2) / fh, w: w / fw, h: h / fh }
}

/** 停靠带里小画面的尺寸（标准尺寸 × CAM_DOCK_SCALE） */
export function camDockSize(fw, fh) {
  const s = camSizePx(fw, fh)
  return { w: Math.round(s.w * CAM_DOCK_SCALE), h: Math.round(s.h * CAM_DOCK_SCALE) }
}

/** 对齐方式 -> 0 / 0.5 / 1（demo 的 DockAlign.Start / Center / End） */
export const alignFactor = (align) => (align === 'start' ? 0 : align === 'end' ? 1 : 0.5)

/** 停靠带：贴着停靠边的一条区域，厚度 = 小画面的高度（上 / 下）或宽度（左 / 右） */
export function dockStrip(edge, cell, fw, fh) {
  if (edge === 'top') return { x: 0, y: 0, w: fw, h: cell.h }
  if (edge === 'bottom') return { x: 0, y: fh - cell.h, w: fw, h: cell.h }
  if (edge === 'left') return { x: 0, y: 0, w: cell.w, h: fh }
  return { x: fw - cell.w, y: 0, w: cell.w, h: fh }
}

/**
 * 是否算停靠（和 demo 的 Solution.should_dock 一致）：
 * 只有当前停靠边那一条停靠带才认，不看别的边；
 * 判定用窗口中心 —— 中心进了停靠带就停靠，否则回自由区。
 */
export function dockHit(edge, box, cell, fw, fh) {
  const cx = box.x + box.w / 2
  const cy = box.y + box.h / 2
  if (edge === 'top') return cy <= cell.h
  if (edge === 'bottom') return cy >= fh - cell.h
  if (edge === 'left') return cx <= cell.w
  return cx >= fw - cell.w
}

/** 窗口 8 个方向的拉伸把手（对应 demo 里的 resizer_l / _r / _t / _b / _lt / _rt / _lb / _rb） */
export const RESIZE_DIRS = [
  { key: 'l', cursor: 'w-resize' },
  { key: 'r', cursor: 'e-resize' },
  { key: 't', cursor: 'n-resize' },
  { key: 'b', cursor: 's-resize' },
  { key: 'lt', cursor: 'nw-resize' },
  { key: 'rt', cursor: 'ne-resize' },
  { key: 'lb', cursor: 'sw-resize' },
  { key: 'rb', cursor: 'se-resize' },
]
