/******************************************************************
 * Copyright @ 2023 朱剑豪. All rights reserverd.
 * @file   src\features\Recorder.ts
 * @author 朱剑豪
 * @date   2023/07/02 23:31
 * @desc   事件记录器
 ******************************************************************/

import type { Board } from "../board";
import { EventEnum, type Events } from "../event";
import type { ITool } from "../tools/base/Tool";
import type { ToolType } from "../tools/ToolEnum";
import type { IScreenplay } from "./Screenplay";

/** 工具事件里的 tool 是工具实例（循环引用），导出前替换成它的类型字符串 */
function pickTool(detail: Events.IBaseDetail): { tool?: ToolType } {
  const tool = (detail as { tool?: ToolType | ITool }).tool
  if (tool === void 0 || tool === null) return {}
  return { tool: typeof tool === 'string' ? tool : tool.type }
}

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

  destroy(): void {
    console.log('[Recorder] destroy()');
  }

  /**
   * @deprecated 拼写错误，请使用 destroy()
   * @deprecated misspelled, use destroy() instead
   */
  destory(): void { this.destroy(); }

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
        const now = performance.now()
        screenplay.events.push({
          ...detail,
          ...pickTool(detail),
          timestamp: now - start_time,
        })
        screenplay.endTime = now
      }
      this._cancellers.push(actor.on(v, func));
    }

    return this;
  }

}

