import { useEffect, useRef, useState } from '../deps.js'
import { Icon } from '../icons.jsx'

/**
 * 摄像头窗口的画面区：视频 + 没开启时的占位。
 * 状态只用图标表示（不开 = 摄像头图标，打不开 = 红色带斜杠的摄像头图标），
 * 点一下图标就尝试开启；不放文字和按钮，画面保持干净。
 */
export function CameraBody() {
  const videoRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [camError, setCamError] = useState(false)
  const streamRef = useRef(null)
  streamRef.current = stream

  useEffect(() => () => streamRef.current?.getTracks().forEach((t) => t.stop()), [])
  useEffect(() => {
    const video = videoRef.current
    if (video && stream) video.srcObject = stream
  }, [stream])

  const openCamera = async () => {
    setCamError(false)
    try {
      setStream(await navigator.mediaDevices.getUserMedia({ video: true, audio: false }))
    } catch {
      setCamError(true)
    }
  }

  if (stream) return <video ref={videoRef} autoPlay muted playsInline />
  return (
    <div
      className={`cam-ph${camError ? ' error' : ''}`}
      title={camError ? '打不开摄像头，点击重试' : '点击开启摄像头'}
      onClick={openCamera}
    >
      <Icon name={camError ? 'camera-off' : 'camera'} size={28} />
    </div>
  )
}
