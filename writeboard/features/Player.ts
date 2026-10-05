import type { Board } from "../board";
import { EventEnum, type Events } from "../event";
import type { IShapeData } from "../shape/base/IShapeData";
import type { IScreenplay } from "./Screenplay";

/** 回放器状态 */
export type PlayerState = 'idle' | 'playing' | 'paused' | 'ended' | 'stopped'

/** 回放进度（用来画进度条） */
export interface IPlayerProgress {
  state: PlayerState
  /** 当前回放时间：剧本相对时间，ms */
  time: number
  /** 剧本总时长，ms */
  duration: number
  /** 0 ~ 1 */
  progress: number
  /** 已应用的事件数 / 事件总数 */
  eventIndex: number
  eventCount: number
  /** 当前倍速，负数表示倒放 */
  rate: number
}

export interface IPlayerOptions {
  /** 播放倍速，默认 1；大于 1 快放，小于 1 慢放，负数倒放 */
  rate?: number
  /** 每帧回调（进度条画在这里） */
  onProgress?: (progress: IPlayerProgress) => void
  /** 自然播放到底时回调一次（stop() 不会触发） */
  onEnd?: (progress: IPlayerProgress) => void
}

export class Player {
  private _screenplay: IScreenplay | undefined;
  private _eventIdx: number = 0;
  private _actor: Board | undefined;
  private _options: IPlayerOptions = {};
  private _rate: number = 1;
  private _state: PlayerState = 'idle';
  private _req_id: number = 0;
  /** 当前回放时间（剧本相对时间，ms） */
  private _time: number = 0;
  /** 已经应用到画布的时间，-1 表示还没应用过 */
  private _applied: number = -1;
  /** 上一帧的时间戳，0 表示下一帧只对表、不推进时间 */
  private _last_ts: number = 0;

  get state(): PlayerState { return this._state }
  get playing(): boolean { return this._state === 'playing' }
  get paused(): boolean { return this._state === 'paused' }
  get actor(): Board | undefined { return this._actor }
  get screenplay(): IScreenplay | undefined { return this._screenplay }
  get rate(): number { return this._rate }
  set rate(v: number) { this._rate = Number.isFinite(v) ? v : 1 }
  /** 当前回放时间（剧本相对时间，ms） */
  get time(): number { return this._time }
  /** 剧本总时长（ms）；旧格式剧本没有 endTime 时按最后一个事件的时间戳推断 */
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
  /** 回放进度，0 ~ 1 */
  get progress(): number {
    const duration = this.duration
    if (duration <= 0) return this._state === 'idle' ? 0 : 1
    return Math.min(1, Math.max(0, this._time / duration))
  }
  /** 已应用的事件下标 */
  get eventIndex(): number { return this._eventIdx }
  get eventCount(): number { return this._screenplay?.events.length ?? 0 }

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
   * @description 内部会先 stop()，所以重复调用不会叠加时间轴
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
   * @description 之后可用 update_once() / seek() 手动驱动，或在测试里逐步应用
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

  /** 暂停，保留当前位置，可用 resume() 继续 */
  pause(): this {
    if (this._state !== 'playing') return this
    this._cancelFrame()
    this._state = 'paused'
    this._last_ts = 0
    this._emitProgress()
    return this
  }

  /** 继续播放 */
  resume(): this {
    if (this._state !== 'paused') return this
    this._state = 'playing'
    this._last_ts = 0
    this._req_id = requestAnimationFrame(this._frame)
    this._emitProgress()
    return this
  }

  /** 停止：取消时间轴，画面停在当前位置；不会触发 onEnd */
  stop(): this {
    this._cancelFrame()
    this._last_ts = 0
    if (this._state !== 'ended') this._state = 'stopped'
    return this
  }

  /**
   * 跳到指定回放时间（ms）
   *
   * @description 往前跳是增量应用；往回跳会先从快照重建，再重放到目标时间
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

  /** 倒放（把倍速取负） */
  backward(): this {
    this._rate = -Math.abs(this._rate || 1)
    return this
  }

  /** 正放（把倍速取正） */
  forward(): this {
    this._rate = Math.abs(this._rate || 1)
    return this
  }

  /**
   * 应用到指定时间为止的所有事件
   *
   * @description 只推进事件、不改变播放状态，也不会启动时间轴
   * @param {number} time 剧本相对时间（ms），传 Infinity 表示全部应用
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

  /** 推进一帧（平时由 requestAnimationFrame 驱动，测试里可以手动调用） */
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

  /** 把画布推进（或回退）到指定时间；回退时从快照重建，保证状态精确 */
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
