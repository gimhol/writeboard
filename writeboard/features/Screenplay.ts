import type { ISnapshot } from "../board/ISnapshot";
import type { Events } from "../event/Events";

/**
 * 剧本：一段可以回放的黑板操作录像（起始快照 + 按时间排列的事件）
 *
 * Screenplay: a record of board activity that can be played back (a starting snapshot
 * plus the events in chronological order).
 */
export interface IScreenplay {
  /**
   * 录制开始的时刻（performance.now()）
   *
   * When the recording started (performance.now()).
   */
  startTime: number,
  /**
   * 最后一个事件的时刻（停止录制时也会刷新，performance.now()）
   *
   * When the last event happened (also refreshed on stop, performance.now()).
   */
  endTime: number,
  /**
   * 录制开始时画布的快照（回放前先用它还原画布）
   *
   * Snapshot of the board taken when recording started (playback restores it first).
   */
  snapshot?: ISnapshot;
  /**
   * 按时间排列的事件（timestamp 是相对 startTime 的毫秒数，不是绝对时间）
   *
   * Events in chronological order (timestamp is relative to startTime, in milliseconds
   * rather than an absolute clock reading).
   */
  events: Events.IBaseDetail[];
}
