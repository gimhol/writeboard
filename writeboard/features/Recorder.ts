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

/**
 * 工具事件里的 tool 是工具实例（循环引用），导出前替换成它的类型字符串
 *
 * The `tool` of a tool event is a tool instance (a circular reference), so it is replaced
 * by its type string before the screenplay is exported.
 *
 * @param {Events.IBaseDetail} detail 事件载荷 / Event payload
 * @return {{tool?: ToolType}} 只带工具类型的事件片段 / Event part holding the tool type only
 */
function pickTool(detail: Events.IBaseDetail): { tool?: ToolType } {
  const tool = (detail as { tool?: ToolType | ITool }).tool
  if (tool === void 0 || tool === null) return {}
  return { tool: typeof tool === 'string' ? tool : tool.type }
}

/**
 * 事件记录器：挂到某块黑板上后，把发生的事件按时间顺序录成剧本（开头带一份画布快照），
 * 剧本可以交给 Player 回放
 *
 * Event recorder: once bound to a board it records the events into a screenplay in
 * chronological order (with a snapshot of the board at the beginning), and the Player can
 * play that screenplay back.
 */
export class Recorder {
  private _actor?: Board;
  private _cancellers: (() => void)[] = []
  private _screenplay?: IScreenplay;
  private _running = false;

  /**
   * 是否正在录制
   *
   * Whether it is recording.
   */
  get running() { return this._running }
  /**
   * 当前绑定的黑板
   *
   * The board it is currently bound to.
   */
  get actor() { return this._actor }

  /**
   * 建一个记录器（还没绑定黑板，用 setActor 绑定）
   *
   * Creates a recorder (it is not bound to a board yet, use setActor for that).
   */
  constructor() {
    console.log('[Recorder] constructor()')
  }

  /**
   * 取当前剧本（还没录过则返回 null）
   *
   * Gets the current screenplay (null when nothing has been recorded yet).
   *
   * @return {IScreenplay | null} 剧本 / The screenplay
   */
  getScreenplay(): IScreenplay | null {
    return this._screenplay || null
  }

  /**
   * 取当前剧本的 JSON（还没录过则返回 null）
   *
   * Gets the current screenplay as JSON (null when nothing has been recorded yet).
   *
   * @return {string | null} 剧本 JSON / Screenplay JSON
   */
  getJson(): string | null {
    return this._screenplay ? JSON.stringify(this._screenplay) : null
  }

  /**
   * 取当前绑定的黑板
   *
   * Gets the board it is currently bound to.
   *
   * @return {Board | undefined} 黑板 / The board
   */
  getActor(): Board | undefined {
    return this._actor;
  }

  /**
   * 切换绑定的黑板（同一块则不做事；正在录制时先停止）
   *
   * Switches the bound board (the same board does nothing; recording stops first).
   *
   * @param {Board | undefined} v 黑板（undefined 则解绑） / The board (undefined unbinds)
   * @return {this} 便于链式调用 / The recorder itself, for chaining
   */
  setActor(v: Board | undefined): this {
    if (this._actor === v) {
      return this;
    }
    if (this._running) { this.stop(); }
    this._actor = v;
    return this;
  }

  /**
   * 销毁记录器
   *
   * Destroys the recorder.
   */
  destroy(): void {
    console.log('[Recorder] destroy()');
  }

  /**
   * @deprecated 拼写错误，请使用 destroy()
   * @deprecated misspelled, use destroy() instead
   */
  destory(): void { this.destroy(); }

  /**
   * 停止录制：给当前剧本写上结束时间、卸掉全部事件监听，剧本保留下来可以继续取用
   *
   * Stops recording: the screenplay gets its end time, every listener is removed, and the
   * screenplay stays available afterwards.
   *
   * @return {this} 便于链式调用 / The recorder itself, for chaining
   */
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

  /**
   * 开始录制：新建一份剧本（带一份当前画布的快照），并给 EventEnum 里每种事件挂上监听
   *
   * Starts recording: a new screenplay is created (with a snapshot of the board) and one
   * listener is attached per EventEnum value.
   *
   * @return {this} 便于链式调用 / The recorder itself, for chaining
   */
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

