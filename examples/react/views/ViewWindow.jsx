import { RESIZE_DIRS } from './dock.js'
import { CAM_PLACES, VIEW_KINDS } from './config.js'
import { CameraBody } from './CameraBody.jsx'
import { DraftBoard } from './DraftBoard.jsx'
import { Icon } from '../icons.jsx'

/**
 * 单个窗口：内容区（摄像头画面 / 草稿黑板）+ 8 向把手，操作按钮浮在右上角。
 * 摄像头窗口没有头栏 —— 整块都能拖、都能双击放大，标题只放在 tooltip 和底部名字里；
 * 草稿窗口里是一块能写的黑板，所以保留头栏（专门用来拖它）。
 * 布局、形态、拖动都在 ViewLayer / ViewSolution 里，这里只管画。
 */
export function ViewWindow({
  view, box, scale, dragging, resizing, docked, boardStyle,
  onDown, onDoubleClick, onResize, onMinimize, onToggleMax, onClose,
  onToolChange, onFocusBoard, onDirty,
}) {
  const isMax = view.place === CAM_PLACES.Maximized
  const isDraft = view.kind === 'draft'
  const className = `cam-window ${view.place}${isDraft ? ' draft' : ''}${dragging ? ' dragging' : ''}${resizing ? ' resizing' : ''}`
  const buttons = (
    <>
      <button className="cam-btn" title="最小化" onClick={onMinimize}>
        <Icon name="minimize" size={15} />
      </button>
      <button className="cam-btn" title={isMax ? '还原到停靠带' : '放大到自由区'} onClick={onToggleMax}>
        <Icon name={isMax ? 'restore' : 'maximize'} size={15} />
      </button>
      <button className="cam-btn danger" title="关闭" onClick={onClose}>
        <Icon name="close" size={15} />
      </button>
    </>
  )
  return (
    <div
      className={className}
      /* 4 是基准层（最小化胶囊 50 / 工具栏 100 在上面），加 view.z 决定窗口之间的叠放 */
      style={{
        left: box.x,
        top: box.y,
        width: box.w,
        height: box.h,
        zIndex: 4 + (view.z || 0),
        '--ws': scale,
        /* 拖动 / 拉伸时关掉过渡：位置由「缓动跟随」逐帧算好，再叠一层 CSS 过渡就拖手了 */
        transition: dragging || resizing ? 'none' : undefined,
      }}
      title={isMax
        ? `${view.name}：双击还原到停靠带`
        : isDraft
          ? `${view.name}：草稿窗口，拖头栏移动，滚轮可滚`
          : `${view.name}：拖动移动 / 停靠，双击放大到自由区`}
      onPointerDown={onDown}
      onDoubleClick={onDoubleClick}
    >
      {isDraft
        ? <div className="cam-head">
          <Icon name={VIEW_KINDS[view.kind].icon} size={15} />
          <span className="cam-title">{view.name}</span>
          {buttons}
        </div>
        : <div className="cam-actions">{buttons}</div>}

      <div className={`cam-body${isDraft ? ' is-draft' : ''}`}>{isDraft
        ? <DraftBoard
          style={boardStyle}
          docked={docked}
          onToolChange={onToolChange}
          onFocus={onFocusBoard}
          onDirty={onDirty}
        />
        : <>
          <CameraBody />
          <div className="cam-name">{view.name}</div>
        </>}</div>

      {view.place === CAM_PLACES.Floating && RESIZE_DIRS.map(({ key, cursor }) => (
        <div
          key={key}
          className={`cam-resize cam-resize-${key}`}
          style={{ cursor }}
          title="拖动拉伸窗口"
          onPointerDown={(e) => onResize(e, key)}
        />
      ))}
    </div>
  )
}
