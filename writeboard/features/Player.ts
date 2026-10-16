import type { Board } from "../board";
import { EventEnum, type Events } from "../event";
import type { IShapeData } from "../shape/base/IShapeData";
import type { IScreenplay } from "./Screenplay";

/**
 * 回放器状态
 *
 * Player state: 'playing' / 'paused' / 'ended' while the timeline runs, 'idle' before it
 * starts and 'stopped' after stop().
 */
export type PlayerState = 'idle' | 'playing' | 'paused' | 'ended' | 'stopped'

/**
 * 回放进度（用来画进度条）
 *
 * Playback progress (handy for a progress bar).
 */
export interface IPlayerProgress {
  /**
   * 当前状态
   *
   * Current state of the player.
   */
  state: PlayerState
  /**
   * 当前回放时间：剧本相对时间，ms
   *
   * Current playback time, relative to the screenplay, in ms.
   */
  time: number
  /**
   * 剧本总时长，ms
   *
   * Total length of the screenplay, in ms.
   */
  duration: number
  /**
   * 0 ~ 1
   *
   * Progress of the playback, 0 ~ 1.
   */
  progress: number
  /**
   * 已应用的事件数 / 事件总数
   *
   * Applied events / total events.
   */
  eventIndex: number
  /**
   * 事件总数
   *
   * Total number of events.
   */
  eventCount: number
  /**
   * 当前倍速，负数表示倒放
   *
   * Current rate; a negative value means playing backwards.
   */
  rate: number
}

/**
 * 回放选项
 *
 * Playback options.
 */
export interface IPlayerOptions {
  /**
   * 播放倍速，默认 1；大于 1 快放，小于 1 慢放，负数倒放
   *
   * Playback rate, 1 by default: above 1 is faster, below 1 is slower, and a negative
   * value plays backwards.
   */
  rate?: number
  /**
   * 每帧回调（进度条画在这里）
   *
   * Called once per frame (a good place to draw the progress bar).
   *
   * @param {IPlayerProgress} progress 当前进度 / Current progress
   */
  onProgress?: (progress: IPlayerProgress) => void
  /**
   * 自然播放到底时回调一次（stop() 不会触发）
   *
   * Called once when the playback reaches its end naturally (stop() does not trigger it).
   *
   * @param {IPlayerProgress} progress 末帧进度 / Progress of the last frame
   */
  onEnd?: (progress: IPlayerProgress) => void
}

/**
 * 回放器：把剧本在某块黑板上回放出来（可倍速、可倒放），往回跳时先按快照重建画布，
 * 并在每帧报告一次进度
 *
 * Player: plays a screenplay back on a board (at any rate, forwards or backwards),
 * rebuilds the board from the starting snapshot when jumping backwards, and reports the
 * progress once per frame.
 */
export class Player {
  private _screenplay: IScreenplay | undefined;
  private _eventIdx: number = 0;
  private _actor: Board | undefined;
  private _options: IPlayerOptions = {};
  private _rate: number = 1;
  private _state: PlayerState = 'idle';
  private _req_id: number = 0;
  /**
   * 当前回放时间（剧本相对时间，ms）
   *
   * Current playback time, relative to the screenplay, in ms.
   */
  private _time: number = 0;
  /**
   * 已经应用到画布的时间，-1 表示还没应用过
   *
   * The time already applied to the board, -1 while nothing has been applied yet.
   */
  private _applied: number = -1;
  /**
   * 上一帧的时间戳，0 表示下一帧只对表、不推进时间
   *
   * Timestamp of the previous frame; 0 means the next frame only synchronises the clock
   * without advancing the time.
   */
  private _last_ts: number = 0;

  /**
   * 当前状态
   *
   * Current state of the player.
   */
  get state(): PlayerState { return this._state }
  /**
   * 时间轴是否正在推进
   *
   * Whether the timeline is running.
   */
  get playing(): boolean { return this._state === 'playing' }
  /**
   * 是否处于暂停中
   *
   * Whether the playback is paused.
   */
  get paused(): boolean { return this._state === 'paused' }
  /**
   * 回放所在的画布
   *
   * The board the playback works on.
   */
  get actor(): Board | undefined { return this._actor }
  /**
   * 正在回放的剧本
   *
   * The screenplay being played back.
   */
  get screenplay(): IScreenplay | undefined { return this._screenplay }
  /**
   * 当前倍速（负数表示倒放）
   *
   * Current playback rate (a negative value means backwards).
   */
  get rate(): number { return this._rate }
  /**
   * 设置倍速（不是有效数字时回退到 1）
   *
   * Sets the playback rate (a value that is not a finite number falls back to 1).
   */
  set rate(v: number) { this._rate = Number.isFinite(v) ? v : 1 }
  /**
   * 当前回放时间（剧本相对时间，ms）
   *
   * Current playback time, relative to the screenplay, in ms.
   */
  get time(): number { return this._time }
  /**
   * 剧本总时长（ms）；旧格式剧本没有 endTime 时按最后一个事件的时间戳推断
   *
   * Total length of the screenplay in ms; for old screenplays without endTime it is
   * inferred from the timestamp of the last event.
   */
  get duration(): number {
    const screenplay = this._screenplay
    if (!screenplay) return 0
    const start = screenplay.startTime || 0
    let end = screenplay.endTime || 0
    if (!(end >= start)) {
      const last = screenplay.events[screenplay.events.length - 1]
      end = start + Math.max(0, last?.timestamp || 0)
    }
    return end - start
  }
  /**
   * 回放进度，0 ~ 1
   *
   * Progress of the playback, 0 ~ 1.
   */
  get progress(): number {
    const duration = this.duration
    if (duration <= 0) return this._state === 'idle' ? 0 : 1
    return Math.min(1, Math.max(0, this._time / duration))
  }
  /**
   * 已应用的事件下标
   *
   * Index of the last applied event.
   */
  get eventIndex(): number { return this._eventIdx }
  /**
   * 事件总数
   *
   * Total number of events.
   */
  get eventCount(): number { return this._screenplay?.events.length ?? 0 }

  /**
   * 取一份当前进度（状态 / 时间 / 时长 / 进度 / 事件计数 / 倍速）
   *
   * Gets a snapshot of the current progress (state, time, duration, progress, event
   * counters and rate).
   *
   * @return {IPlayerProgress} 当前进度 / Current progress
   */
  getProgress(): IPlayerProgress {
    return {
      state: this._state,
      time: this._time,
      duration: this.duration,
      progress: this.progress,
      eventIndex: this._eventIdx,
      eventCount: this.eventCount,
      rate: this._rate,
    }
  }

  /**
   * 从剧本起点开始回放
   *
   * Plays the screenplay back from its very beginning: stop() runs first, so calling it
   * again does not stack timelines; the state at time 0 is shown right away and the
   * timeline then runs on requestAnimationFrame.
   *
   * @description 内部会先 stop()，所以重复调用不会叠加时间轴
   *
   * @param {Board} actor 回放所在的画布 / The board to play back on
   * @param {Partial<IScreenplay>} screenplay 剧本（可以只给一部分字段）/ The screenplay (a partial one is fine)
   * @param {IPlayerOptions} [options] 回放选项 / Playback options
   * @return {this} 便于链式调用 / The player itself, for chaining
   */
  play(actor: Board, screenplay: Partial<IScreenplay>, options: IPlayerOptions = {}): this {
    this.stop()
    this._options = { ...options }
    if (options.rate !== undefined) this.rate = options.rate
    this.begin(actor, screenplay)
    this._applyTo(0)        // 立刻呈现「第 0 帧」：快照 + 零时刻的事件
    this._state = 'playing'
    this._emitProgress()
    this._req_id = requestAnimationFrame(this._frame)
    return this
  }

  /**
   * 准备回放：只还原快照、不启动时间轴
   *
   * Prepares a playback: only the snapshot is restored, the timeline is not started.
   *
   * @description 之后可用 update_once() / seek() 手动驱动，或在测试里逐步应用
   *
   * @param {Board} actor 回放所在的画布 / The board to play back on
   * @param {Partial<IScreenplay>} screenplay 剧本（可以只给一部分字段）/ The screenplay (a partial one is fine)
   * @return {this} 便于链式调用 / The player itself, for chaining
   */
  begin(actor: Board, screenplay: Partial<IScreenplay>): this {
    this._cancelFrame()
    this._actor = actor
    this._screenplay = {
      startTime: screenplay.startTime || 0,
      endTime: screenplay.endTime || 0,
      snapshot: screenplay.snapshot,
      events: screenplay.events || [],
    }
    this._eventIdx = 0
    this._time = 0
    this._applied = -1
    this._last_ts = 0
    this._state = 'idle'
    if (screenplay.snapshot) actor.fromSnapshot(screenplay.snapshot)
    return this
  }

  /**
   * 暂停，保留当前位置，可用 resume() 继续
   *
   * Pauses the playback at the current position; resume() continues from there.
   *
   * @return {this} 便于链式调用 / The player itself, for chaining
   */
  pause(): this {
    if (this._state !== 'playing') return this
    this._cancelFrame()
    this._state = 'paused'
    this._last_ts = 0
    this._emitProgress()
    return this
  }

  /**
   * 继续播放
   *
   * Resumes a paused playback.
   *
   * @return {this} 便于链式调用 / The player itself, for chaining
   */
  resume(): this {
    if (this._state !== 'paused') return this
    this._state = 'playing'
    this._last_ts = 0
    this._req_id = requestAnimationFrame(this._frame)
    this._emitProgress()
    return this
  }

  /**
   * 停止：取消时间轴，画面停在当前位置；不会触发 onEnd
   *
   * Stops the timeline and leaves the board where it is; onEnd is not called.
   *
   * @return {this} 便于链式调用 / The player itself, for chaining
   */
  stop(): this {
    this._cancelFrame()
    this._last_ts = 0
    if (this._state !== 'ended') this._state = 'stopped'
    return this
  }

  /**
   * 跳到指定回放时间（ms）
   *
   * Jumps to the given playback time (ms): jumping forward applies the events in
   * between, jumping backwards rebuilds the board from the snapshot first.
   *
   * @description 往前跳是增量应用；往回跳会先从快照重建，再重放到目标时间
   *
   * @param {number} time 目标时间（剧本相对时间，ms）/ Target time, relative to the screenplay, in ms
   * @return {this} 便于链式调用 / The player itself, for chaining
   */
  seek(time: number): this {
    if (!this._screenplay) return this
    const { min, max } = Math
    const to = max(0, min(time, this.duration))
    this._time = to
    this._last_ts = 0
    this._applyTo(to)
    this._emitProgress()
    return this
  }

  /**
   * 倒放（把倍速取负）
   *
   * Plays backwards (makes the rate negative).
   *
   * @return {this} 便于链式调用 / The player itself, for chaining
   */
  backward(): this {
    this._rate = -Math.abs(this._rate || 1)
    return this
  }

  /**
   * 正放（把倍速取正）
   *
   * Plays forwards (makes the rate positive).
   *
   * @return {this} 便于链式调用 / The player itself, for chaining
   */
  forward(): this {
    this._rate = Math.abs(this._rate || 1)
    return this
  }

  /**
   * 应用到指定时间为止的所有事件
   *
   * Applies every event up to the given time, without changing the playback state and
   * without starting the timeline.
   *
   * @description 只推进事件、不改变播放状态，也不会启动时间轴
   * @param {number} time 剧本相对时间（ms），传 Infinity 表示全部应用 / Screenplay-relative time in ms, Infinity applies everything
   */
  update_once(time: number): void {
    const screenplay = this._screenplay;
    if (!screenplay) return;

    while (this._eventIdx < screenplay.events.length) {
      const event = screenplay.events[this._eventIdx];
      if (!event || event.timestamp > time) { break; }
      this._applyEvent(event);
      ++this._eventIdx;
    }
  }

  /**
   * 推进一帧（平时由 requestAnimationFrame 驱动，测试里可以手动调用）
   *
   * Advances one frame (normally driven by requestAnimationFrame, but it can be called by
   * hand in tests).
   *
   * @param {number} time 帧时间戳（ms）/ Frame timestamp in ms
   */
  tick(time: number): void {
    this._frame(time)
  }

  private _frame = (ts: number): void => {
    this._req_id = 0
    if (this._state !== 'playing') return
    const duration = this.duration
    if (this._last_ts) this._time += (ts - this._last_ts) * this._rate
    this._last_ts = ts
    const finished = this._rate >= 0 ? this._time >= duration : this._time <= 0
    if (finished) {
      this._time = this._rate >= 0 ? duration : 0
      this._applyTo(this._time)
      this._finish()
      return
    }
    this._applyTo(this._time)
    this._emitProgress()
    this._req_id = requestAnimationFrame(this._frame)
  }

  private _finish(): void {
    this._cancelFrame()
    this._state = 'ended'
    const progress = this.getProgress()
    this._emitProgress()
    this._options.onEnd?.(progress)
  }

  private _emitProgress(): void {
    this._options.onProgress?.(this.getProgress())
  }

  private _cancelFrame(): void {
    if (this._req_id) {
      cancelAnimationFrame(this._req_id)
      this._req_id = 0
    }
  }

  /**
   * 把画布推进（或回退）到指定时间；回退时从快照重建，保证状态精确
   *
   * Moves the board forward (or backward) to the given time; going backwards rebuilds it
   * from the snapshot so that the state stays exact.
   *
   * @param {number} time 目标时间（剧本相对时间，ms）/ Target time, relative to the screenplay, in ms
   */
  private _applyTo(time: number): void {
    if (time < this._applied) { this._rebuildTo(time); return }
    this.update_once(time)
    this._applied = time
  }

  private _rebuildTo(time: number): void {
    const actor = this._actor
    const screenplay = this._screenplay
    if (!actor || !screenplay) return
    this._eventIdx = 0
    if (screenplay.snapshot) actor.fromSnapshot(screenplay.snapshot)
    else actor.removeAll(false)
    this.update_once(time)
    this._applied = time
  }

  private _applyEvent(e: Events.IBaseDetail) {
    switch (e.type) {
      case EventEnum.ShapesAdded: {
        const { shapeDatas } = e as Events.IDetailMap[typeof e.type];
        this._addShape(shapeDatas)
        break;
      }
      case EventEnum.ShapesGeoChanging:
      case EventEnum.ShapesGeoChanged:
      case EventEnum.ShapesChanging:
      case EventEnum.ShapesChanged: {
        const { shapeDatas } = e as Events.IDetailMap[typeof e.type];
        this._changeShapes(shapeDatas, 0);
        break;
      }
      case EventEnum.ShapesRemoved: {
        const { shapeDatas } = e as Events.IDetailMap[typeof e.type];
        this._removeShape(shapeDatas);
        break;
      }
      case EventEnum.WorldRectChanged: {
        const { to } = e as Events.IDetailMap[typeof e.type];
        this._actor!.set_world_rect(to)
        break;
      }
      case EventEnum.ViewportChanged: {
        const { to } = e as Events.IDetailMap[typeof e.type];
        this._actor!.set_viewport(to)
      }
    }
  }

  private _addShape(shapeDatas?: IShapeData[]) {
    const shapes = shapeDatas?.map(v => this._actor!.factory.newShape(v));
    shapes && this._actor!.add(shapes, false);
  }
  private _removeShape(shapeDatas?: IShapeData[]) {
    const shapes = shapeDatas?.map(data => this._actor!.find(data.i)!).filter(v => v);
    shapes && this._actor!.remove(shapes, false);
  }
  private _changeShapes(shapeDatas: (readonly [Partial<IShapeData>, Partial<IShapeData>])[], which: 0 | 1) {
    shapeDatas.forEach((currAndPrev) => {
      const data = currAndPrev[which];
      const id = data.i;
      id && this._actor!.find(id)?.merge(data);
    });
  }
}
