/**
 * 窗口（视图）的配置（对应 blogim Chatroom ViewsSolution 里的 ViewPlace / DockType / DockAlign）。
 * 这一层刻意不依赖 React、也不碰 DOM：views/ 下的 config / dock / distribution / solution
 * 合起来就是一个能在任何渲染层（React、DOM、Canvas、单测）里用的“方案”。
 */

/** 窗口形态（对应 ViewPlace：浮动 / 停靠 / 最小化 / 最大化） */
export const CAM_PLACES = {
  Floating: 'floating',
  Docked: 'docked',
  Minimized: 'minimized',
  Maximized: 'maximized',
}

/* 默认停在黑板顶部居中 —— 就是 blogim 里的 DockType.Top + DockAlign.Center */
export const CAM_DEFAULT_EDGE = 'top'
export const CAM_DEFAULT_ALIGN = 'center'

/*
 * 悬浮窗口的尺寸 / 位置一律按黑板的**比例**记（0~1）：
 * 黑板怎么缩放，窗口就跟着等比缩放，相对大小不变。
 * w = 黑板宽度的 20%，h 按 4:3 换算（16:9 黑板上 h = w * 4 / 3）。
 */
export const CAM_SIZE = { w: 0.2, h: 0.2 * 4 / 3 }
/*
 * 停靠带里是小画面：尺寸 = 标准尺寸 × CAM_DOCK_SCALE，
 * 一行能排好几路摄像头；双击小画面就放大到自由区，多个则均分自由区。
 */
export const CAM_DOCK_SCALE = 0.45
export const CAM_MAX = 8

/*
 * 窗口种类：摄像头 / 草稿。
 * 草稿窗口里是另一块黑板，可以单独书写；它的默认尺寸按参考尺寸 1280×720 下的 600×400
 * 折算成**黑板比例**，所以黑板怎么缩放，草稿窗口和里面的笔迹都跟着一起缩放。
 * place 是新建时的默认形态：摄像头照旧停靠在停靠带，草稿是拿来写的，直接悬浮在黑板中间。
 */
export const VIEW_KINDS = {
  camera: { label: '摄像头', icon: 'camera', size: CAM_SIZE, place: CAM_PLACES.Docked },
  draft: { label: '草稿', icon: 'draft', size: { w: 600 / 1280, h: 400 / 720 }, place: CAM_PLACES.Floating },
}
export const VIEW_DEFAULT_KIND = 'camera'

/** 容错：认不出来的种类一律当摄像头 */
export const kindOf = (kind) => (VIEW_KINDS[kind] ? kind : VIEW_DEFAULT_KIND)
export const viewSize = (kind) => VIEW_KINDS[kindOf(kind)].size
export const viewPlace = (kind) => VIEW_KINDS[kindOf(kind)].place
export const viewIcon = (kind) => VIEW_KINDS[kindOf(kind)].icon
export const viewLabel = (kind) => VIEW_KINDS[kindOf(kind)].label

/** 草稿窗口里那块黑板的设计尺寸（单页，不滚动） */
export const DRAFT_W = 600
export const DRAFT_H = 400

/** 新建一个窗口（z 记录叠放次序，点一下就抬到最上面） */
export const makeView = (id, kind, name) => ({
  id,
  kind: kindOf(kind),
  name: name || `${viewLabel(kind)} ${id}`,
  z: id,
  place: viewPlace(kind),
  back: viewPlace(kind),
  rect: { cx: 0.5, cy: 0.5, ...viewSize(kind) },
})

/** 一起悬浮时按序号错开一点，别全部叠在一起 */
export const cascadeRect = (i, kind) => ({
  cx: 0.5 + i * 0.045,
  cy: 0.5 + i * 0.045,
  ...viewSize(kind),
})
