import { Board } from "../board";
import { EventEnum, Events } from "../event";
import { PureCustomEvent, Screenplay } from "./Screenplay";
export class Player {
  private screenplay: Screenplay | undefined;
  private eventIdx = 0;
  private actor: Board | undefined;
  private firstEventTime: number = 0;
  private startTime: number = 0;
  private timer: number = 0
  start(actor: Board, screenplay: Partial<Screenplay>) {
    this.actor = actor;
    this.screenplay = {
      startTime: screenplay.startTime || 0,
      snapshot: screenplay.snapshot,
      events: screenplay.events || [],
    };
    this.startTime = Date.now();
    this.firstEventTime = 0;
    if (screenplay.snapshot) {
      actor.fromSnapshot(screenplay.snapshot);
    }
    this.tick();
  }
  stop() {
    clearTimeout(this.timer)
  }
  tick() {
    const screenplay = this.screenplay;
    if (!screenplay)
      return this.stop();
    const event = screenplay.events[this.eventIdx];
    if (!event)
      return this.stop();
    let timeStamp = event.timestamp
    if (!this.firstEventTime && timeStamp)
      this.firstEventTime = timeStamp;

    this.applyEvent(event);
    ++this.eventIdx;
    const next = screenplay.events[this.eventIdx];
    if (!next)
      return this.stop();
    timeStamp = next.timestamp;
    const diff = Math.max(1, (timeStamp - screenplay.startTime) - (this.firstEventTime - screenplay.startTime) - (Date.now() - this.startTime));
    this.timer = setTimeout(() => this.tick(), diff);
  }
  applyEvent(e: PureCustomEvent<any>) {
    const actor = this.actor;
    if (!actor) { return; }
    switch (e.type) {
      case EventEnum.ShapesAdded: {
        const detail = e.detail as Events.EventDetailMap[typeof e.type];
        const shapes = detail.shapeDatas?.map(v => actor.factory.newShape(v));
        shapes && actor.add(shapes, false);
        break;
      }
      case EventEnum.ShapesMoved:
      case EventEnum.ShapesResized:
      case EventEnum.ShapesChanged: {
        const detail = e.detail as Events.EventDetailMap[typeof e.type];
        detail.shapeDatas.forEach(([curr]) => {
          const id = curr.i;
          id && actor.find(id)?.merge(curr);
        });
        break;
      }
      case EventEnum.ShapesRemoved: {
        const detail = e.detail as Events.EventDetailMap[typeof e.type];
        const shapes = detail.shapeDatas?.map(data => actor.find(data.i)!).filter(v => v);
        shapes && actor.remove(shapes, false);
        break;
      }
    }
  }
}
