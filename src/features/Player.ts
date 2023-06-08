import { WhiteBoard } from "../board";
import { EventEnum, WhiteBoardEvent } from "../event";
import { PureCustomEvent, Screenplay } from "./Screenplay";
export class Player {
  private screenplay: Screenplay | undefined;
  private eventIdx = 0;
  private actor: WhiteBoard | undefined;
  private firstEventTime: number = 0;
  private startTime: number = 0;
  private timer: number = 0
  start(actor: WhiteBoard, screenplay: Partial<Screenplay>) {
    this.actor = actor;
    this.screenplay = {
      startTime: screenplay.startTime || 0,
      snapshot: screenplay.snapshot || {},
      events: screenplay.events || [],
    };
    this.startTime = Date.now();
    this.firstEventTime = 0;
    actor.fromJson(screenplay.snapshot);
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
    let timeStamp = event.timeStamp
    if (!this.firstEventTime && timeStamp)
      this.firstEventTime = timeStamp;

    this.applyEvent(event);
    ++this.eventIdx;
    const next = screenplay.events[this.eventIdx];
    if (!next)
      return this.stop();
    timeStamp = next.timeStamp;
    const diff = Math.max(1, (timeStamp - screenplay.startTime) - (this.firstEventTime - screenplay.startTime) - (Date.now() - this.startTime));
    this.timer = setTimeout(() => this.tick(), diff);
  }
  applyEvent(e: PureCustomEvent<any>) {
    console.log('[Player] applyEvent(), e = ', e);
    const actor = this.actor;
    if (!actor) { return; }
    switch (e.type) {
      case EventEnum.ShapesAdded: {
        const event = <WhiteBoardEvent.EventMap[EventEnum.ShapesAdded]>(e);
        const shapes = event.detail.shapeDatas?.map(v => actor.factory.newShape(v));
        shapes && actor.add(...shapes);
        break;
      }
      case EventEnum.ShapesMoved:
      case EventEnum.ShapesResized:
      case EventEnum.ShapesChanged: {
        type Event =
          WhiteBoardEvent.EventMap[EventEnum.ShapesMoved] |
          WhiteBoardEvent.EventMap[EventEnum.ShapesResized] |
          WhiteBoardEvent.EventMap[EventEnum.ShapesChanged];
        const event = <Event>(e);
        event.detail.shapeDatas.forEach(([curr]) => {
          const id = curr.i;
          id && actor.find(id)?.merge(curr);
        });
        break;
      }
      case EventEnum.ShapesRemoved: {
        const event = <WhiteBoardEvent.EventMap[EventEnum.ShapesRemoved]>(e);
        const shapes = event.detail.shapeDatas?.map(data => actor.find(data.i)!).filter(v => v);
        shapes && actor.remove(...shapes);
        break;
      }
    }
  }
}
