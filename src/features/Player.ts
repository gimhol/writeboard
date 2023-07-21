import { Board } from "../board";
import { EventEnum, Events } from "../event";
import type { IShapeData } from "../shape";
import { IPureCustomEvent, IScreenplay } from "./Screenplay";

type EMap = Events.EventDetailMap;

export class Player {
  private screenplay: IScreenplay | undefined;
  private eventIdx = 0;
  private actor: Board | undefined;
  private firstEventTime: number = 0;
  private startTime: number = 0;
  private timer: number = 0
  start(actor: Board, screenplay: Partial<IScreenplay>) {
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

    this._applyEvent(event);
    ++this.eventIdx;
    const next = screenplay.events[this.eventIdx];
    if (!next)
      return this.stop();
    timeStamp = next.timestamp;
    const diff = Math.max(1, (timeStamp - screenplay.startTime) - (this.firstEventTime - screenplay.startTime) - (Date.now() - this.startTime));
    this.timer = setTimeout(() => this.tick(), diff);
  }

  private _applyEvent(e: IPureCustomEvent<any>) {
    switch (e.type) {
      case EventEnum.ShapesAdded: {
        const { shapeDatas } = e.detail as EMap[typeof e.type];
        this._addShape(shapeDatas)
        break;
      }
      case EventEnum.ShapesMoved:
      case EventEnum.ShapesResized:
      case EventEnum.ShapesChanged: {
        const { shapeDatas } = e.detail as EMap[typeof e.type];
        this._changeShapes(shapeDatas, 0);
        break;
      }
      case EventEnum.ShapesRemoved: {
        const { shapeDatas } = e.detail as EMap[typeof e.type];
        this._removeShape(shapeDatas);
        break;
      }
    }
  }
  private _undoEvent(e: IPureCustomEvent<any>) {
    switch (e.type) {
      case EventEnum.ShapesAdded: {
        const { shapeDatas } = e.detail as EMap[typeof e.type];
        this._removeShape(shapeDatas)
        break;
      }
      case EventEnum.ShapesMoved:
      case EventEnum.ShapesResized:
      case EventEnum.ShapesChanged: {
        const { shapeDatas } = e.detail as EMap[typeof e.type];
        this._changeShapes(shapeDatas, 1);
        break;
      }
      case EventEnum.ShapesRemoved: {
        const { shapeDatas } = e.detail as EMap[typeof e.type];
        this._addShape(shapeDatas)
        break;
      }
    }
  }
  private _addShape(shapeDatas?: IShapeData[]) {
    const shapes = shapeDatas?.map(v => this.actor!.factory.newShape(v));
    shapes && this.actor!.add(shapes, false);
  }
  private _removeShape(shapeDatas?: IShapeData[]) {
    const shapes = shapeDatas?.map(data => this.actor!.find(data.i)!).filter(v => v);
    shapes && this.actor!.remove(shapes, false);
  }
  private _changeShapes(shapeDatas: [Partial<IShapeData>, Partial<IShapeData>][], which: 0 | 1) {
    shapeDatas.forEach((currAndPrev) => {
      const data = currAndPrev[which];
      const id = data.i;
      id && this.actor!.find(id)?.merge(data);
    });
  }
}
