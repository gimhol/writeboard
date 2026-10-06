import { useRef } from '../deps.js'

export function BoardScrollbar({ view, onScrollTo, scaleY }) {
  const trackRef = useRef(null)
  const dragRef = useRef(null)
  const { scrollTop, scrollHeight, viewportH } = view
  if (!scrollHeight || !viewportH || scrollHeight <= viewportH) return null

  /* 滚动量是世界（设计）坐标，拖动量是屏幕像素，比例换算即可 */
  const scale = scaleY || 1
  const maxScroll = scrollHeight - viewportH
  const thumbTopRate = scrollTop / scrollHeight
  const thumbHeightRate = viewportH / scrollHeight

  const thumbMetrics = () => {
    const rect = trackRef.current.getBoundingClientRect()
    const thumbH = Math.max(24, rect.height * thumbHeightRate)
    return { rect, thumbH, space: rect.height - thumbH }
  }

  const onThumbDown = (e) => {
    if (e.button !== 0) return
    e.preventDefault()
    const { space } = thumbMetrics()
    dragRef.current = { startY: e.clientY, startScroll: scrollTop, space, maxScroll }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onThumbMove = (e) => {
    const drag = dragRef.current
    if (!drag || !drag.space) return
    onScrollTo(drag.startScroll + ((e.clientY - drag.startY) / drag.space) * drag.maxScroll)
  }
  const onThumbUp = (e) => {
    dragRef.current = null
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
  }
  const onTrackDown = (e) => {
    if (e.target !== trackRef.current || e.button !== 0) return
    const { rect, thumbH, space } = thumbMetrics()
    if (space <= 0) return
    const y = e.clientY - rect.top - thumbH / 2
    onScrollTo((Math.min(Math.max(y, 0), space) / space) * maxScroll)
  }
  const onWheel = (e) => onScrollTo(scrollTop + e.deltaY / scale)

  return (
    <div className="scrollbar" ref={trackRef} onPointerDown={onTrackDown} onWheel={onWheel}>
      <div
        className="scrollbar-thumb"
        style={{
          top: `${thumbTopRate * 100}%`,
          height: `${thumbHeightRate * 100}%`,
        }}
        onPointerDown={onThumbDown}
        onPointerMove={onThumbMove}
        onPointerUp={onThumbUp}
        onPointerCancel={onThumbUp}
      />
    </div>
  )
}
