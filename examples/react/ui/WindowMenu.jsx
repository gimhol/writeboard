import { CAM_EDGES, CAM_ALIGNS } from '../views/dock.js'
import { CAM_PLACES, CAM_MAX, VIEW_KINDS } from '../views/config.js'
import { useEffect, useRef, useState } from '../deps.js'
import { Icon } from '../icons.jsx'

/** 可见窗口管理：统一开关浮在黑板上的窗口 / 面板 */
export function WindowMenu({
  views, dockedCount, allDocked, allFloating,
  onAddView, onCloseAllCams, onSetAllPlace,
  dockEdge, dockAlign, onDockEdge, onDockAlign,
  toolbarCollapsed, onToolbarCollapsed, onResetCams,
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const countOf = (kind) => views.filter((v) => v.kind === kind).length

  useEffect(() => {
    if (!open) return
    const onDown = (e) => {
      if (rootRef.current?.contains(e.target)) return
      setOpen(false)
    }
    const onKey = (e) => { e.key === 'Escape' && setOpen(false) }
    document.addEventListener('pointerdown', onDown, true)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown, true)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className="win-menu" ref={rootRef}>
      <button className={`win-menu-btn${open ? ' open' : ''}`} title="可见窗口" onClick={() => setOpen((v) => !v)}>
        <Icon name="windows" size={15} />
        窗口
      </button>
      {open && <div className="win-panel">
        <div className="win-panel-title">可见窗口</div>
        {Object.entries(VIEW_KINDS).map(([kind, { label, icon }]) => (
          <button
            key={kind}
            className="win-item"
            disabled={views.length >= CAM_MAX}
            onClick={() => onAddView(kind)}
          >
            <Icon name="plus" size={16} />
            添加{label}窗口{countOf(kind) ? `（${countOf(kind)} 个）` : ''}
          </button>
        ))}
        <button className="win-item" disabled={views.length === 0} onClick={onCloseAllCams}>
          <Icon name="close" size={16} />
          关闭全部窗口（{views.length}/{CAM_MAX}）
        </button>
        <button className="win-item" onClick={() => onToolbarCollapsed(!toolbarCollapsed)}>
          <span className={toolbarCollapsed ? '' : 'checked'}>
            <Icon name={toolbarCollapsed ? 'unchecked' : 'checked'} size={16} />
          </span>
          工具栏
        </button>
        <div className="tb-divider" />
        <div className="win-panel-title">摄像头停靠</div>
        <div className="win-row">
          <span className="win-row-label">停靠边</span>
          <div className="win-seg">
            {CAM_EDGES.map(({ key, label }) => (
              <button
                key={key}
                className={dockedCount > 0 && dockEdge === key ? 'on' : ''}
                onClick={() => onDockEdge(key)}
              >{label}</button>
            ))}
          </div>
        </div>
        <div className="win-row">
          <span className="win-row-label">对齐</span>
          <div className="win-seg">
            {CAM_ALIGNS.map(({ key, label }) => (
              <button
                key={key}
                className={dockedCount > 0 && dockAlign === key ? 'on' : ''}
                onClick={() => onDockAlign(key)}
              >{label}</button>
            ))}
          </div>
        </div>
        <div className="win-row">
          <span className="win-row-label">形态</span>
          <div className="win-seg">
            <button
              className={allDocked ? 'on' : ''}
              onClick={() => onSetAllPlace(CAM_PLACES.Docked)}
            >全部停靠</button>
            <button
              className={allFloating ? 'on' : ''}
              onClick={() => onSetAllPlace(CAM_PLACES.Floating)}
            >全部悬浮</button>
          </div>
        </div>
        <div className="win-hint">
          双击小画面 / 窗口头栏 → 放大到自由区；再双击另一个就均分自由区。
          只有摄像头窗口会停靠（拖进停靠带即停靠，其他位置松手是悬浮）；草稿窗口始终悬浮，拖动只认头栏。
        </div>
        <div className="tb-divider" />
        <button className="win-item" onClick={() => { onResetCams(); setOpen(false) }}>
          <Icon name="reset" size={16} />
          重置窗口位置
        </button>
      </div>}
    </div>
  )
}
