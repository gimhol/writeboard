import type { Board } from "../board/Board";
import { EventEnum } from "../event/EventType";
import { Events } from "../event/Events";
import { IShapeData } from "../shape/base/Data";
type EMap = Events.EventDetailMap;

export class ActionQueue {

  getActor(): Board | undefined {
    return this._actor;
  }

  setActor(actor: Board | undefined): this {
    if (this._actor === actor) {
      return this;
    }
    this._cancellers.forEach(v => v())
    this._cancellers = [];
    for (const key in EventEnum) {
      const v = (EventEnum as any)[key]
      const func = (e: CustomEvent) => {
        if (this._actionsIdx < this._actions.length - 1) {
          this._actions = this._actions.slice(0, this._actionsIdx);
        }
        this._actions.push(e);
      };
      v.addEventListener(v, func);
      const canceller = () => v.removeEventListener(v, func);
      this._cancellers.push(canceller);
    }
    this._actor = actor;
    return this;
  }

  undo(): this {
    if (this._actionsIdx < 0) { return this; }
    const action = this._actions[this._actionsIdx];
    this._undoAction(action);
    --this._actionsIdx;
    return this;
  }

  redo(): this {
    if (this._actionsIdx >= this._actions.length) { return this; }
    const action = this._actions[this._actionsIdx];
    this._redoAction(action);
    ++this._actionsIdx;
    return this;
  }
  private _maxLen: number | undefined;
  private _actionsIdx: number = -1;
  private _actions: CustomEvent<any>[] = [];
  private _cancellers: (() => void)[] = []
  private _actor: Board | undefined;
  private _redoAction(e: CustomEvent<any>) {
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

  private _undoAction(e: CustomEvent<any>) {
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
    const shapes = shapeDatas?.map(v => this._actor!.factory.newShape(v));
    shapes && this._actor!.add(shapes, false);
  }
  private _removeShape(shapeDatas?: IShapeData[]) {
    const shapes = shapeDatas?.map(data => this._actor!.find(data.i)!).filter(v => v);
    shapes && this._actor!.remove(shapes, false);
  }
  private _changeShapes(shapeDatas: [Partial<IShapeData>, Partial<IShapeData>][], which: 0 | 1) {
    shapeDatas.forEach((currAndPrev) => {
      const data = currAndPrev[which];
      const id = data.i;
      id && this._actor!.find(id)?.merge(data);
    });
  }
}