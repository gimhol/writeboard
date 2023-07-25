import type { Board } from "../board/Board";
import { EventEnum } from "../event/EventType";
import { Events } from "../event/Events";
import { Gaia } from "../mgr";
import { IShapeData } from "../shape/base/Data";
type EMap = Events.EventDetailMap;

export class ActionQueue {
  setActor(actor: Board | undefined): this {
    this._cancellers.forEach(v => v())
    this._cancellers = [];
    if (!actor) { return this; }

    Gaia.listActions().forEach(eventType => {
      const handler = Gaia.action(eventType);
      if (!handler) { return }
      const func: any = (e: CustomEvent) => {
        if (e.detail.operator !== actor.whoami) {
          return;
        }
        if (this._actionsIdx < this._actions.length - 1) {
          this._actions = this._actions.slice(0, this._actionsIdx);
        }
        this._actions.push([
          () => handler.undo(actor, e),
          () => handler.redo(actor, e),
        ]);
        this._actionsIdx = this._actions.length - 1;
      };
      actor.addEventListener(eventType, func);
      const canceller = () => actor.removeEventListener(eventType, func);
      this._cancellers.push(canceller);
    })
    return this;
  }
  undo(): this {
    if (this._actionsIdx < 0) {
      console.log('[ActionQueue] no more undo.')
      return this;
    }
    this._actions[this._actionsIdx][0]();
    --this._actionsIdx;
    return this;
  }
  redo(): this {
    if (this._actionsIdx >= this._actions.length - 1) {
      console.log('[ActionQueue] no more redo.')
      return this;
    }
    ++this._actionsIdx;
    this._actions[this._actionsIdx][1]();
    return this;
  }
  private _maxLen: number | undefined;
  private _actionsIdx: number = -1;
  private _actions: [() => void, () => void][] = [];
  private _cancellers: (() => void)[] = []
}
const _changeShapes = (board: Board, shapeDatas: [Partial<IShapeData>, Partial<IShapeData>][], which: 0 | 1) => {
  shapeDatas.forEach((currAndPrev) => {
    const data = currAndPrev[which];
    const id = data.i;
    id && board!.find(id)?.merge(data);
  });
}
const _addShapes = (board: Board, shapeDatas: IShapeData[]) => {
  const shapes = shapeDatas.map(v => board.factory.newShape(v));
  board.add(shapes, { operator: 'action_queue' });
}
const _removeShapes = (board: Board, shapeDatas: IShapeData[]) => {
  const shapes = shapeDatas?.map(data => board.find(data.i)!).filter(v => v);
  board.remove(shapes, { operator: 'action_queue' });
}
Gaia.registAction(EventEnum.ShapesDone, {
  undo: (board, event) => {
    const { detail: { shapeDatas } } = event;
    _removeShapes(board, shapeDatas)
  },
  redo: (board, event) => {
    const { detail: { shapeDatas } } = event;
    _addShapes(board, shapeDatas)
  }
})
Gaia.registAction(EventEnum.ShapesRemoved, {
  undo: (board, event) => {
    const { detail: { shapeDatas } } = event;
    _addShapes(board, shapeDatas)
  },
  redo: (board, event) => {
    const { detail: { shapeDatas } } = event;
    _removeShapes(board, shapeDatas)
  }
})
Gaia.registAction(EventEnum.ShapesGeoChanged, {
  undo: (board, event) => {
    const { detail: { shapeDatas } } = event;
    _changeShapes(board, shapeDatas, 1);
    board.emitEvent(EventEnum.ShapesGeoChanged, {
      operator: 'action_queue',
      shapeDatas: shapeDatas.map(arr => [arr[1], arr[0]]) as typeof shapeDatas
    })
  },
  redo: (board, event) => {
    const { detail: { shapeDatas } } = event;
    _changeShapes(board, shapeDatas, 0);
    board.emitEvent(EventEnum.ShapesGeoChanged, {
      operator: 'action_queue',
      shapeDatas
    })
  }
})