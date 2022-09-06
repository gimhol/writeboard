import { WhiteBoard } from "../board";
import { EventEnum, EventPureMap, EventDataVisitor, EventData } from "../event";
import { Screenplay } from "./Screenplay";
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
    let timeStamp = EventDataVisitor.getTime(event)
    if (!this.firstEventTime && timeStamp)
      this.firstEventTime = timeStamp;

    this.applyEvent(event);
    ++this.eventIdx;
    const next = screenplay.events[this.eventIdx];
    if (!next)
      return this.stop();
    timeStamp = EventDataVisitor.getTime(next)
    const diff = Math.max(1, (timeStamp - screenplay.startTime) - (this.firstEventTime - screenplay.startTime) - (Date.now() - this.startTime));
    this.timer = setTimeout(() => this.tick(), diff);
  }
  applyEvent(e: EventData) {
    const actor = this.actor;
    if (!actor)
      return;

    const type = EventDataVisitor.getType(e) as EventEnum;
    switch (type) {
      case EventEnum.ShapesAdded: {
        const event = e as EventPureMap[EventEnum.ShapesAdded];
        const shapes = EventDataVisitor.getDetail(event).shapeDatas.map(v => actor.factory.newShape(v));
        actor.add(...shapes);
        break;
      }
      case EventEnum.ShapesChanged: {
        const event = e as EventPureMap[EventEnum.ShapesChanged];
        EventDataVisitor.getDetail(event).shapeDatas.forEach(([curr, prev]) => {
          const id = curr.i;
          id && actor.find(id)?.merge(curr);
        });
        break;
      }
      case EventEnum.ShapesRemoved: {
        const event = e as EventPureMap[EventEnum.ShapesRemoved];
        const shapes = EventDataVisitor.getDetail(event).shapeDatas.map(data => actor.find(data.i)!).filter(v => v);
        actor.remove(...shapes);
        break;
      }
    }
  }
}
