import { useCallback, useSyncExternalStore } from '../deps.js'

/**
 * React 侧的「桥」：订阅 CameraSolution，有变化就重渲染（对应 blogim 里
 * Bridging_HTMLElement 把 solution 的矩形同步到 DOM 元素）。
 * 状态本身存在 solution 里，React 只负责画出来。
 *
 * 用 useSyncExternalStore 而不是 useState + useEffect(subscribe)：后者在
 * 「首帧渲染 ~ effect 订阅」之间漏掉的变更会被永久丢掉（例如窗口一挂载就
 * 被 setFrame 触发重排），前者由 React 负责补订阅与对齐，不会漏。
 */
export function useSolution(solution) {
  const subscribe = useCallback((onChange) => solution.subscribe(onChange), [solution])
  const version = useCallback(() => solution.version, [solution])
  useSyncExternalStore(subscribe, version)
  return solution
}

/**
 * 拖动 / 拉伸用的指针接线：监听挂在 window 上 —— 拖快时指针会瞬间离开窗口本身，
 * 只靠元素上的 pointermove / capture 会丢掉后续事件（连松手都收不到）。
 */
export function trackPointer({ onMove, onEnd }) {
  const move = (e) => onMove(e)
  const end = (e) => {
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', end)
    window.removeEventListener('pointercancel', end)
    onEnd(e)
  }
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', end)
  window.addEventListener('pointercancel', end)
}
