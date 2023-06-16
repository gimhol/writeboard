import { Board } from "../board";
import { EventEnum } from "../event";
import { Screenplay } from "./Screenplay";

export class Recorder {
  private cancellers: (() => void)[] = []
  private _screenplay: Screenplay = {
    startTime: Date.now(),
    snapshot: {},
    events: []
  }
  destory(): void {
    console.log('[Recorder] destory()')
    this.cancellers.forEach(v => v())
    this.cancellers = []
  }
  start(actor: Board) {
    console.log('[Recorder] start()')
    this.cancellers.forEach(v => v())
    this.cancellers = []
    const startTime = new CustomEvent('').timeStamp;
    this._screenplay = {
      startTime,
      snapshot: actor.toJson(),
      events: []
    }
    for (const key in EventEnum) {
      const v = (EventEnum as any)[key]
      const func = (e: CustomEvent) => {
        this._screenplay.events.push({
          timeStamp: e.timeStamp - startTime,
          type: e.type,
          detail: e.detail
        })
      };
      actor.addEventListener(v, func);
      const canceller = () => actor.removeEventListener(v, func);
      this.cancellers.push(canceller);
    }
  }
  toJson(): Screenplay {
    return this._screenplay
  }
  toJsonStr(): string {
    return JSON.stringify(this.toJson(), null, 2)
  }
}

