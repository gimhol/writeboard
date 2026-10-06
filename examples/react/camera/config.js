/**
 * 摄像头窗口的配置（对应 blogim Chatroom ViewsSolution 里的 ViewPlace / DockType / DockAlign）。
 * 这一层刻意不依赖 React、也不碰 DOM：camera/ 下的 config / dock / distribution / solution
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
export const CAM_DEFAULT = { cx: 0.5, cy: 0.5, ...CAM_SIZE }
/*
 * 停靠带里是小画面：尺寸 = 标准尺寸 × CAM_DOCK_SCALE，
 * 一行能排好几路摄像头；双击小画面就放大到自由区，多个则均分自由区。
 */
export const CAM_DOCK_SCALE = 0.45
export const CAM_MAX = 8

/** 新建一个摄像头窗口（默认停在停靠带里；z 记录叠放次序，点一下就抬到最上面） */
export const makeCam = (id, name) => ({
  id, name, z: id, place: CAM_PLACES.Docked, rect: CAM_DEFAULT, back: CAM_PLACES.Docked,
})

/** 一起悬浮时按序号错开一点，别全部叠在一起 */
export const cascadeRect = (i) => ({
  ...CAM_DEFAULT,
  cx: CAM_DEFAULT.cx + i * 0.045,
  cy: CAM_DEFAULT.cy + i * 0.045,
})
