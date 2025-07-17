/******************************************************************
 * Copyright @ 2023 朱剑豪. All rights reserverd.
 * @file   src\features\Recorder.ts
 * @author 朱剑豪
 * @date   2023/07/02 23:31
 * @desc   事件记录器
 ******************************************************************/

import type { Board } from "../board";
import { EventEnum, type Events } from "../event";
import type { IScreenplay } from "./Screenplay";

export class Recorder {
  private _actor?: Board;
  private _cancellers: (() => void)[] = []
  private _screenplay?: IScreenplay;
  private _running = false;

  get running() { return this._running }
  get actor() { return this._actor }

  constructor() {
    console.log('[Recorder] constructor()')
  }

  getScreenplay(): IScreenplay | null {
    return this._screenplay || null
  }

  getJson(): string | null {
    return this._screenplay ? JSON.stringify(this._screenplay) : null
  }

  getActor(): Board | undefined {
    return this._actor;
  }

  setActor(v: Board | undefined): this {
    if (this._actor === v) {
      return this;
    }
    if (this._running) { this.stop(); }
    this._actor = v;
    return this;
  }

  destory(): void {
    console.log('[Recorder] destory()');
  }

  stop(): this {
    console.log('[Recorder] stop()');
    if (this._screenplay) {
      this._screenplay.endTime = performance.now();
    }
    this._running = false;
    this._cancellers.forEach(v => v())
    this._cancellers = [];
    return this;
  }

  start(): this {
    console.log('[Recorder] start()')
    const actor = this._actor;
    if (!actor) {
      console.warn('[Recorder] start() faild, actor not set.')
      return this;
    }

    this._running = true;
    this._cancellers.forEach(v => v())
    this._cancellers = [];

    const start_time = performance.now();
    const screenplay: IScreenplay = this._screenplay = {
      startTime: start_time,
      endTime: start_time,
      snapshot: actor.toSnapshot(),
      events: []
    }
    for (const key in EventEnum) {
      const v = (EventEnum as any)[key]
      const func = (detail: Events.IBaseDetail) => {
        screenplay.events.push({ ...detail, timestamp: performance.now() - start_time })
        screenplay.endTime = detail.timestamp
      }
      this._cancellers.push(actor.on(v, func));
    }

    return this;
  }

}

