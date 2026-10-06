import { ShapeEnum, ToolEnum } from './deps.js'

/** 黑板总高度是可视区域的 PAGES 倍 —— 这就是“可滚动”的来源 */
export const PAGES = 3

/*
 * 画布固定按这个“设计尺寸”绘制，再用 CSS transform 缩放到黑板矩形
 * （和 gim.ink/chatroom/views_solution_demo 的做法一样）：
 * 笔迹、文字、已画内容都画在设计坐标里，窗口怎么缩放，
 * 它们相对黑板矩形的大小与位置都不变。
 * 参考尺寸 = 1280 宽舞台下的黑板矩形 1280 × (720 - 28)，这里取它的 1.5 倍。
 */
export const DESIGN_W = 1920
export const DESIGN_H = 1038
/* 设计尺寸 / 参考尺寸：面板上的粗细、字号都以参考尺寸为基准，落到画布上要乘它 */
export const DESIGN_K = DESIGN_W / 1280

export const TOOLS = [
  { type: ToolEnum.Selector, name: '选择', icon: 'cursor' },
  { type: ToolEnum.Pen, name: '画笔', icon: 'pen' },
  { type: ToolEnum.Eraser, name: '橡皮擦（擦除笔迹）', icon: 'eraser' },
  { type: ToolEnum.Text, name: '文本', icon: 'text' },
  { type: ToolEnum.Lines, name: '直线', icon: 'line' },
  { type: ToolEnum.Rect, name: '矩形', icon: 'rect' },
  { type: ToolEnum.Oval, name: '椭圆', icon: 'oval' },
  { type: ToolEnum.Tick, name: '打钩', icon: 'tick' },
  { type: ToolEnum.Cross, name: '打叉', icon: 'cross' },
]

/* 黑板是深色的，所以默认是“白粉笔”，其余是明亮的粉笔色 */
export const COLORS = ['#f2f4f7', '#ff6b6b', '#4d9bff', '#4ade80', '#fbbf24', '#c084fc', '#f472b6', '#22d3ee']
export const WIDTHS = [2, 4, 8]

/** 这些工具才需要“颜色 / 粗细”浮层 */
export const STYLE_TOOLS = new Set([
  ToolEnum.Pen, ToolEnum.Rect, ToolEnum.Oval, ToolEnum.Text,
  ToolEnum.Lines, ToolEnum.Tick, ToolEnum.Cross,
])

/** 这些图形的绘制样式由“模板”决定，改模板即可决定之后新图形的颜色 / 粗细 */
export const STROKE_SHAPES = [
  ShapeEnum.Pen, ShapeEnum.Rect, ShapeEnum.Oval,
  ShapeEnum.Lines, ShapeEnum.Tick, ShapeEnum.Cross, ShapeEnum.HalfTick,
]

/**
 * 「透明」色：描边 / 填充都能选它（= 不描边 / 不填充）。
 * 画布本身就认 transparent，所以直接当颜色传下去就行。
 */
export const TRANSPARENT = 'transparent'

/** 这些图形支持填充（对应库里的 needFill：Rect / Oval / Polygon / Text） */
export const FILL_SHAPES = [ShapeEnum.Rect, ShapeEnum.Oval]

/** 这些工具的样式浮层里要出现「填充」色板 */
export const FILL_TOOLS = new Set([ToolEnum.Rect, ToolEnum.Oval])
