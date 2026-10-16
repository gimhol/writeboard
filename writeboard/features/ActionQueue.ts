import type { Board } from "../board/Board";
import { Events } from "../event/Events";
import { EventEnum } from "../event/EventType";
import { Gaia } from "../mgr";
import { IShapeData } from "../shape/base/IShapeData";
import { ToolEnum } from "../tools";

export class ActionQueue {
  setActor(actor: Board | undefined): this {
    this._cancellers.forEach(v => v())
    this._cancellers = [];
    if (!actor) { return this; }

    Gaia.listActions().forEach(eventType => {
      const handler = Gaia.action(eventType);
      if (!handler) { return }
      const func: any = (detail: Events.IBaseDetail) => {
        if (detail.operator !== actor.whoami) {
          return;
        }
        if (!handler.isAction(actor, detail)) {
          return;
        }
        const step: ActionStep = [
          () => handler.undo(actor, detail),
          () => handler.redo(actor, detail),
        ];
        const atTip = this._actionsIdx === this._actions.length - 1;
        const last = atTip ? this._actions[this._actionsIdx] : void 0;
        if (detail.tx && last?.tx === detail.tx) {
          last.steps.push(step);
          return;
        }
        if (!atTip) {
          /* 丢弃被撤销的分支，保留仍然生效的 [0, _actionsIdx] */
          this._actions = this._actions.slice(0, this._actionsIdx + 1);
        }
        this._actions.push({ tx: detail.tx, steps: [step] });
        this._actionsIdx = this._actions.length - 1;
      };
      this._cancellers.push(actor.on(eventType, func));
    })
    return this;
  }
  clear(): this {
    this._actions = [];
    this._actionsIdx = -1;
    return this;
  }
  undo(): this {
    if (this._actionsIdx < 0) {
      console.log('[ActionQueue] no more undo.')
      return this;
    }
    const { steps } = this._actions[this._actionsIdx];
    for (let i = steps.length - 1; i >= 0; --i) steps[i][0]();
    --this._actionsIdx;
    return this;
  }
  redo(): this {
    if (this._actionsIdx >= this._actions.length - 1) {
      console.log('[ActionQueue] no more redo.')
      return this;
    }
    ++this._actionsIdx;
    const { steps } = this._actions[this._actionsIdx];
    for (let i = 0, len = steps.length; i < len; ++i) steps[i][1]();
    return this;
  }
  get index() { return this._actionsIdx }
  get length() { return this._actions.length }
  get canRedo() { return this._actionsIdx < this._actions.length - 1 }
  get canUndo() { return this._actionsIdx >= 0 }
  private _maxLen: number | undefined;
  private _actionsIdx: number = -1;
  private _actions: IActionRecord[] = [];
  private _cancellers: (() => void)[] = []
}
/**
 * 单个动作：[撤回, 重做]（都是指向该事件载荷的闭包）
 *
 * One action: [undo, redo] (both are closures over that event payload).
 */
type ActionStep = [() => void, () => void]
/**
 * 撤回溯里的一条记录：同一手势（同一个 tx）的多个动作按发生顺序排在 steps 里
 *
 * One record in the undo stack: the actions of one gesture (the same `tx`) are kept in
 * `steps`, in the order they happened.
 */
interface IActionRecord {
  /**
   * 事务 id（见 Events.IBaseDetail.tx）：与上一条记录相同则并入上一条
   *
   * Transaction id (see Events.IBaseDetail.tx): the same as the previous record means
   * it merges into that record.
   */
  tx?: string
  /**
   * 记录里的动作：撤回逆序执行、重做正序执行
   *
   * Actions of this record: undo runs them backwards, redo runs them forwards.
   */
  steps: ActionStep[]
}
const _changeShapes = (board: Board, shapeDatas: (readonly [Partial<IShapeData>, Partial<IShapeData>])[], which: 0 | 1) => {
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
  isAction: () => true,
  undo: (board, detail) => {
    const { shapeDatas } = detail;
    _removeShapes(board, shapeDatas)
  },
  redo: (board, detail) => {
    const { shapeDatas } = detail;
    _addShapes(board, shapeDatas)
  }
})
Gaia.registAction(EventEnum.ShapesRemoved, {
  isAction: () => true,
  undo: (board, detail) => {
    const { shapeDatas } = detail;
    _addShapes(board, shapeDatas)
  },
  redo: (board, detail) => {
    const { shapeDatas } = detail;
    _removeShapes(board, shapeDatas)
  }
})
Gaia.registAction(EventEnum.ShapesGeoChanged, {
  isAction: (board, detail) => {
    return detail.tool === ToolEnum.Selector
  },
  undo: (board, detail) => {
    const { shapeDatas } = detail;
    _changeShapes(board, shapeDatas, 1);
    board.emit(EventEnum.ShapesGeoChanged, {
      operator: 'action_queue',
      tool: ToolEnum.Invalid,
      shapeDatas: shapeDatas.map(arr => [arr[1], arr[0]]) as typeof shapeDatas
    })
  },
  redo: (board, detail) => {
    const { shapeDatas } = detail;
    _changeShapes(board, shapeDatas, 0);
    board.emit(EventEnum.ShapesGeoChanged, {
      operator: 'action_queue',
      tool: ToolEnum.Invalid,
      shapeDatas
    })
  }
})