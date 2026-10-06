import { RESIZE_DIRS } from './dock.js'
import { CAM_PLACES } from './config.js'
import { useEffect, useRef, useState } from '../deps.js'
import { Icon } from '../icons.jsx'

/** 单个摄像头窗口：只管画自己（视频 / 占位 + 头栏 + 把手），布局与拖动都在 CameraLayer 里 */
export function CameraWindow({
  cam, box, scale, dragging, resizing,
  onDown, onDoubleClick, onResize, onMinimize, onToggleMax, onClose,
}) {
  const videoRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [camError, setCamError] = useState('')
  const streamRef = useRef(null)
  streamRef.current = stream

  useEffect(() => () => streamRef.current?.getTracks().forEach((t) => t.stop()), [])
  useEffect(() => {
    const video = videoRef.current
    if (video && stream) video.srcObject = stream
  }, [stream])

  const openCamera = async () => {
    setCamError('')
    try {
      setStream(await navigator.mediaDevices.getUserMedia({ video: true, audio: false }))
    } catch (e) {
      setCamError('无法访问摄像头')
    }
  }

  const isMax = cam.place === CAM_PLACES.Maximized
  const className = `cam-window ${cam.place}${dragging ? ' dragging' : ''}${resizing ? ' resizing' : ''}`
  return (
    <div
      className={className}
      /* 4 是基准层（最小化胶囊 50 / 工具栏 100 在上面），加 cam.z 决定窗口之间的叠放 */
      style={{ left: box.x, top: box.y, width: box.w, height: box.h, zIndex: 4 + (cam.z || 0), '--ws': scale }}
      title={isMax ? '双击还原到停靠带' : '双击放大到自由区，拖动可移动 / 停靠'}
      onPointerDown={onDown}
      onDoubleClick={onDoubleClick}
    >
      <div className="cam-head">
        <Icon name="camera" size={15} />
        <span className="cam-title">{cam.name}</span>
        <button className="cam-btn" title="最小化" onClick={onMinimize}>
          <Icon name="minimize" size={15} />
        </button>
        <button className="cam-btn" title={isMax ? '还原到停靠带' : '放大到自由区'} onClick={onToggleMax}>
          <Icon name={isMax ? 'restore' : 'maximize'} size={15} />
        </button>
        <button className="cam-btn danger" title="关闭" onClick={onClose}>
          <Icon name="close" size={15} />
        </button>
      </div>

      <div className="cam-body">
        {stream
          ? <video ref={videoRef} autoPlay muted playsInline />
          : <div className="cam-ph">
            <Icon name="camera" size={26} />
            <span className={camError ? 'cam-tip' : ''}>{camError || '摄像头未开启'}</span>
            <button className="cam-open" onClick={openCamera}>{camError ? '重试' : '开启摄像头'}</button>
            {camError && <button className="cam-open" onClick={() => setCamError('')}>忽略</button>}
          </div>}
        <div className="cam-name">{cam.name}</div>
      </div>

      {cam.place === CAM_PLACES.Floating && RESIZE_DIRS.map(({ key, cursor }) => (
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
