import { Board } from "../board";
import { EventEnum, Events } from "../event";
import type { IShapeData } from "../shape";
import { IPureCustomEvent, IScreenplay } from "./Screenplay";

type EMap = Events.EventDetailMap;

export class Player {
  private screenplay: IScreenplay | undefined;
  private eventIdx = 0;
  private actor: Board | undefined;
  private startTime: number = 0;
  private _backwarding: boolean = false;
  private _requestId: number = 0;

  play(actor: Board, screenplay: Partial<IScreenplay>) {
    console.log('[Player]play()', screenplay)
    this.eventIdx = 0;
    this.actor = actor;
    this.screenplay = {
      startTime: screenplay.startTime || 0,
      snapshot: screenplay.snapshot,
      events: screenplay.events || [],
    };
    if (screenplay.snapshot) {
      actor.fromSnapshot(screenplay.snapshot);
    }
    this.startTime = performance.now();
    this.tick(this.startTime)
  }
  stop() {
    console.log('[Player]stop()')
    if (!this._requestId) {
      cancelAnimationFrame(this._requestId);
      this._requestId = 0;
    }
  }
  tick(time: number) {
    const { screenplay } = this;
    if (!screenplay) { return this.stop() };

    const playerTime = time - this.startTime;
    while (true) {
      const event = screenplay.events[this.eventIdx];
      if (!event) { return this.stop() };
      const eventTime = event.timestamp;
      if (eventTime > playerTime) { break; }
      this._applyEvent(event);
      ++this.eventIdx;
    }
    this._requestId = requestAnimationFrame(time => this.tick(time))
  }
  backward(): this {
    this._backwarding = true;
    return this
  }
  forward(): this {
    this._backwarding = false;
    return this
  }

  private _applyEvent(e: IPureCustomEvent<any>) {
    switch (e.type) {
      case EventEnum.ShapesAdded: {
        const { shapeDatas } = e.detail as EMap[typeof e.type];
        this._addShape(shapeDatas)
        break;
      }
      case EventEnum.ShapesGeoChanging:
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
      case EventEnum.ShapesGeoChanging:
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
