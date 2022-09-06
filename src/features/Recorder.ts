import { WhiteBoard } from "../board";
import { EventEnum, BaseEvent } from "../event";
import { EventDataVisitor } from "../event/EventDataVisitor";
import { Screenplay } from "./Screenplay";

export class Recorder {
  private cancellers: (() => void)[] = []
  destory(): void {
    this.cancellers.forEach(v => v())
    this.cancellers = []
  }
  private _screenplay: Screenplay = {
    startTime: Date.now(),
    snapshot: {},
    events: []
  }
  start(actor: WhiteBoard) {
    this.cancellers.forEach(v => v())
    this.cancellers = []
    const startTime = Date.now()
    this._screenplay = {
      startTime,
      snapshot: actor.toJson(),
      events: []
    }
    for (const key in EventEnum) {
      const v = (EventEnum as any)[key]
      const func = (e: BaseEvent) => {
        const puree = e.pure()
        EventDataVisitor.setTime(puree, v => v - startTime)
        this._screenplay.events.push(puree)
      }
      const canceller = actor.on(v, func)
      this.cancellers.push(canceller)
    }
  }
  toJson(): Screenplay {
    return this._screenplay
  }
  toJsonStr(): string {
    return JSON.stringify(this.toJson())
  }
}

