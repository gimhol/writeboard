import { TOOLS, COLORS, WIDTHS, STYLE_TOOLS, FILL_TOOLS, TRANSPARENT } from '../constants.js'
import { useEffect, useRef, useState } from '../deps.js'
import { Icon } from '../icons.jsx'

/**
 * 悬浮工具栏：浮在黑板右侧，可整体收起；
 * 颜色 / 粗细放在浮层里，只在 hover 或点击工具按钮时出现。
 */
export function Toolbar({
  frameRef, collapsed, onToggleCollapsed, tool, onTool, color, onColor, fill, onFill, width, onWidth,
  canUndo, canRedo, onUndo, onRedo, empty, onClear, side,
}) {
  const toolbarRef = useRef(null)
  const openTimer = useRef(0)
  const closeTimer = useRef(0)
  const pinnedRef = useRef(false)
  const [popover, setPopover] = useState(null)   // { tool, top, right }
  const [pinned, setPinned] = useState(false)
  /* 收起按钮的「延时消失」：鼠标还没挪到它上面，别急着藏起来 */
  const [toggleOpen, setToggleOpen] = useState(false)
  const toggleTimer = useRef(0)
  const toggleRef = useRef(null)
  /* 收起按钮跟着鼠标上下走（但夹在工具栏的高度范围内），方便直接点 */
  const [toggleTop, setToggleTop] = useState(null)
  const showToggle = () => {
    clearTimeout(toggleTimer.current)
    setToggleOpen(true)
  }
  const hideToggle = () => {
    clearTimeout(toggleTimer.current)
    toggleTimer.current = setTimeout(() => setToggleOpen(false), 420)
  }
  const followToggle = (e) => {
    /* 鼠标已经落在按钮上了就别再跟着动，不然点不到 */
    if (e.target instanceof Element && e.target.closest('.toolbar-toggle')) return
    const bar = toolbarRef.current?.getBoundingClientRect()
    const btn = toggleRef.current?.getBoundingClientRect()
    if (!bar || !btn) return
    setToggleTop(Math.round(Math.min(
      Math.max(e.clientY - bar.top - btn.height / 2, 0),
      Math.max(bar.height - btn.height, 0),
    )))
  }
  useEffect(() => () => clearTimeout(toggleTimer.current), [])
  /* 收起 / 展开后工具栏高度变了，位置回到中间重新跟 */
  useEffect(() => { setToggleTop(null) }, [collapsed])

  const clearTimers = () => {
    clearTimeout(openTimer.current)
    clearTimeout(closeTimer.current)
  }
  const closePop = () => {
    clearTimers()
    pinnedRef.current = false
    setPinned(false)
    setPopover(null)
  }
  useEffect(() => () => clearTimers(), [])
  /* 从“窗口”菜单收起工具栏时，顺手关掉样式浮层 */
  useEffect(() => { if (collapsed) closePop() }, [collapsed])

  const openPop = (type, el) => {
    clearTimers()
    const frame = frameRef.current?.getBoundingClientRect()
    const bar = toolbarRef.current?.getBoundingClientRect()
    if (!frame || !bar) return
    const rect = el.getBoundingClientRect()
    /* 浮层跟着工具栏一起缩放，留白 / 半高都要按缩放后的尺寸算 */
    const s = Math.min(Math.max(frame.width / 1280, .8), 1.5)
    const half = 84 * s
    /* 朝黑板那一侧还要给「收起按钮」留出位置，别把按钮压在浮层底下 */
    const room = 26 * s
    setPopover({
      tool: type,
      top: Math.min(Math.max(rect.top - frame.top + rect.height / 2, half), frame.height - half),
      /* 工具栏在右边，浮层摆在它左边；工具栏在左边就摆到它右边 */
      gap: side === 'left'
        ? bar.right - frame.left + room
        : frame.right - bar.left + room,
    })
  }
  const hoverOpen = (type, el) => {
    if (!STYLE_TOOLS.has(type)) return
    clearTimeout(openTimer.current)
    clearTimeout(closeTimer.current)
    if (pinnedRef.current) return          // 已固定时不再跟随 hover
    openTimer.current = setTimeout(() => openPop(type, el), 120)
  }
  const hoverClose = () => {
    clearTimeout(openTimer.current)
    if (pinnedRef.current) return
    closeTimer.current = setTimeout(() => setPopover(null), 180)
  }
  const clickTool = (type, el) => {
    onTool(type)
    if (!STYLE_TOOLS.has(type)) {
      closePop()
      return
    }
    if (pinnedRef.current && popover && popover.tool === type) {
      closePop()                            // 再点一次同一个工具 → 收起浮层
      return
    }
    pinnedRef.current = true
    setPinned(true)
    openPop(type, el)
  }

  /* 点击别处 / Esc 收起已固定的浮层 */
  useEffect(() => {
    if (!pinned) return
    const onDown = (e) => {
      if (toolbarRef.current?.contains(e.target)) return
      if (e.target instanceof Element && e.target.closest('.style-pop')) return
      closePop()
    }
    const onKey = (e) => { e.key === 'Escape' && closePop() }
    document.addEventListener('pointerdown', onDown, true)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown, true)
      document.removeEventListener('keydown', onKey)
    }
  }, [pinned])

  return (
    <>
      <aside
        ref={toolbarRef}
        className={`toolbar${collapsed ? ' collapsed' : ''}${side === 'left' ? ' side-left' : ''}`}
        onMouseEnter={showToggle}
        onMouseMove={followToggle}
        onMouseLeave={hideToggle}
      >
        <button
          ref={toggleRef}
          className={`toolbar-toggle${toggleOpen ? ' open' : ''}`}
          style={toggleTop == null ? undefined : { top: toggleTop, transform: 'none' }}
          title={collapsed ? '展开工具栏' : '收起工具栏'}
          onMouseEnter={showToggle}
          onClick={() => { closePop(); setToggleTop(null); onToggleCollapsed() }}
        >
          {/* 收起 / 展开的箭头方向跟工具栏停在哪一侧走 */}
          <Icon name={side === 'left' ? (collapsed ? 'collapse' : 'expand') : (collapsed ? 'expand' : 'collapse')} />
        </button>

        {!collapsed && <div className="tb-body">
          <div className="tb-divider" />
          <div className="tool-list">
            {TOOLS.map((t) => (
              <button
                key={t.type}
                className={`tool-btn${tool === t.type ? ' active' : ''}`}
                title={t.name}
                onMouseEnter={(e) => hoverOpen(t.type, e.currentTarget)}
                onMouseLeave={hoverClose}
                onClick={(e) => clickTool(t.type, e.currentTarget)}
              >
                <Icon name={t.icon} />
              </button>
            ))}
          </div>

          <div className="tb-divider" />
          <div className="tool-row">
            <button className="tool-btn" title="撤销 (Ctrl+Z)" disabled={!canUndo} onClick={onUndo}>
              <Icon name="undo" />
            </button>
            <button className="tool-btn" title="重做 (Ctrl+Y)" disabled={!canRedo} onClick={onRedo}>
              <Icon name="redo" />
            </button>
          </div>

          <div className="tb-divider" />
          <button className="tool-btn danger" title="清空黑板" disabled={empty} onClick={onClear}>
            <Icon name="trash" />
          </button>
        </div>}
      </aside>

      {popover && <div
        className={`style-pop${side === 'left' ? ' side-left' : ''}`}
        style={side === 'left' ? { top: popover.top, left: popover.gap } : { top: popover.top, right: popover.gap }}
        onMouseEnter={() => clearTimeout(closeTimer.current)}
        onMouseLeave={hoverClose}
      >
        <div className="pop-label">描边</div>
        <div className="swatches">
          {COLORS.map((c) => (
            <button
              key={c}
              className={`swatch${c === color ? ' active' : ''}`}
              style={{ background: c }}
              title={`描边 ${c}`}
              onClick={() => onColor(c)}
            />
          ))}
          <button
            className={`swatch none${color === TRANSPARENT ? ' active' : ''}`}
            title="透明（不描边）"
            onClick={() => onColor(TRANSPARENT)}
          />
        </div>
        {FILL_TOOLS.has(popover.tool) && <>
          <div className="pop-label">填充</div>
          <div className="swatches">
            {COLORS.map((c) => (
              <button
                key={c}
                className={`swatch${c === fill ? ' active' : ''}`}
                style={{ background: c }}
                title={`填充 ${c}`}
                onClick={() => onFill(c)}
              />
            ))}
            <button
              className={`swatch none${fill === TRANSPARENT ? ' active' : ''}`}
              title="透明（不填充）"
              onClick={() => onFill(TRANSPARENT)}
            />
          </div>
        </>}
        <div className="pop-label">线条粗细</div>
        <div className="widths">
          {WIDTHS.map((w) => (
            <button
              key={w}
              className={`width-btn${w === width ? ' active' : ''}`}
              title={`线条粗细 ${w}`}
              onClick={() => onWidth(w)}
            >
              <i style={{ '--w': w }} />
            </button>
          ))}
        </div>
      </div>}
    </>
  )
}
