import { PAGES } from '../constants.js'

/** 分页线 + 页码水印 + 空板提示：都是 DOM 覆盖层，不挡指针事件 */
export function PageOverlay({ view, page, empty, scaleY }) {
  const { scrollTop, viewportH } = view
  if (!viewportH) return null
  /* 滚动量是设计坐标，覆盖层是屏幕像素，要按缩放换算 */
  const scale = scaleY || 1
  const viewH = viewportH * scale
  const marks = []
  for (let i = 0; i < PAGES; i++) {
    const y = (i * viewportH - scrollTop) * scale
    if (y <= 8 || y >= viewH - 8) continue
    marks.push(
      <React.Fragment key={i}>
        {i > 0 && <div className="page-divider" style={{ top: y }} />}
        <div className="page-mark" style={{ top: y + (i > 0 ? 10 : 14) }}>第 {i + 1} 页</div>
      </React.Fragment>
    )
  }
  return (
    <div className="overlay">
      {marks}
      {empty && page === 1 && <div className="board-hint">用右侧工具栏书写批注，滚轮向下滚动黑板</div>}
    </div>
  )
}
