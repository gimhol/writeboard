/******************************************************************
 * Copyright @ 2023 朱剑豪. All rights reserverd.
 * @file   src\features\Recorder.ts
 * @author 朱剑豪
 * @date   2023/07/02 23:31
 * @desc   事件记录器
 ******************************************************************/

import { Board } from "../board";
import { EventEnum } from "../event";
import { IScreenplay } from "./Screenplay";

export class Recorder {
  private _actor?: Board;
  private _cancellers: (() => void)[] = []
  private _screenplay?: IScreenplay;
  private _running = false;

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

    const startTime = performance.now();
    const screenplay: IScreenplay = {
      startTime,
      snapshot: actor.toSnapshot(),
      events: []
    }
    for (const key in EventEnum) {
      const v = (EventEnum as any)[key]
      const func = (e: CustomEvent) => screenplay.events.push({
        timestamp: e.timeStamp - startTime,
        type: e.type,
        detail: e.detail
      });
      this._screenplay = screenplay;
      actor.addEventListener(v, func);
      const canceller = () => actor.removeEventListener(v, func);
      this._cancellers.push(canceller);
    }
    return this;
  }

}

