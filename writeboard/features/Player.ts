import { Board } from "../board";
import { EventEnum, Events } from "../event";
import { IShapeData } from "../shape/base/IShapeData";
import { IPureCustomEvent, IScreenplay } from "./Screenplay";

type EMap = Events.EventDetailMap;

export class Player {
  private screenplay: IScreenplay | undefined;
  private eventIdx = 0;
  private actor: Board | undefined;
  private _backwarding: boolean = false;
  private _req_id: number = 0;
  private _time: number = 0;
  private _start_time: number = 0;
  private _prev_time: number = 0;

  play(actor: Board, screenplay: Partial<IScreenplay>) {
    console.log('[Player]play()', screenplay)
    this.begin(actor, screenplay)
    this.tick(this._start_time)
  }

  begin(actor: Board, screenplay: Partial<IScreenplay>) {
    console.log('[Player]begin()', screenplay)
    this.eventIdx = 0;
    this.actor = actor;
    this.screenplay = {
      startTime: screenplay.startTime || 0,
      endTime: screenplay.endTime || 0,
      snapshot: screenplay.snapshot,
      events: screenplay.events || [],
    };
    if (screenplay.snapshot) {
      actor.fromSnapshot(screenplay.snapshot);
    }
    this._time = this._prev_time = this._start_time = performance.now();
  }

  stop() {
    console.log('[Player]stop()')
    if (this._req_id) {
      cancelAnimationFrame(this._req_id);
      this._req_id = 0;
    }
  }

  update_once(time: number) {
    const { screenplay } = this;
    if (!screenplay) return;
    while (true) {
      const event = screenplay.events[this.eventIdx];
      if (!event) { return this.stop() };
      const event_time = event.timestamp;
      if (event_time > time) { break; }
      this._applyEvent(event);
      ++this.eventIdx;
    }
  }
  
  tick(time: number) {
    const { screenplay } = this;
    if (!screenplay) { return this.stop() };
    const dt = time - this._prev_time
    if (this._backwarding)
      this._time -= dt;
    else
      this._time += dt;
    const { min, max } = Math;
    const duration = screenplay.endTime - screenplay.startTime
    this.update_once(max(0, min(this._time - this._start_time, duration)))
    this._req_id = requestAnimationFrame(time => this.tick(time))
    this._prev_time = time;
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
      case EventEnum.ShapesChanging: {
        const { shapeDatas } = e.detail as EMap[typeof e.type];
        this._changeShapes(shapeDatas, 0);
        break;
      }
      case EventEnum.ShapesRemoved: {
        const { shapeDatas } = e.detail as EMap[typeof e.type];
        this._removeShape(shapeDatas);
        break;
      }
      case EventEnum.WorldRectChanged: {
        const { to } = e.detail as EMap[typeof e.type];
        this.actor!.set_world_rect(to)
        break;
      }
      case EventEnum.ViewportChanged: {
        const { to } = e.detail as EMap[typeof e.type];
        this.actor!.set_viewport(to)
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
      case EventEnum.ShapesChanging: {
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
  private _changeShapes(shapeDatas: (readonly [Partial<IShapeData>, Partial<IShapeData>])[], which: 0 | 1) {
    shapeDatas.forEach((currAndPrev) => {
      const data = currAndPrev[which];
      const id = data.i;
      id && this.actor!.find(id)?.merge(data);
    });
  }
}
