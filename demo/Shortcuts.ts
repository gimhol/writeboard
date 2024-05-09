import { ActionQueue, Board, SelectorTool, ToolEnum } from "../writeboard";
import { FClipboard } from "../writeboard";

/**
 * 处理键盘输入产生的事件
 */
export interface ShortcutHandle {
  /**
   * 处理键盘输入产生的事件
   *
   * @param {KeyboardEvent} e 键盘事件
   * @return {((void | boolean))} 当返回true时，说明本回调不应拦截默认行为且不阻止“事件冒泡”
   * @memberof ShortcutHandle
   */
  (e: KeyboardEvent): (void | boolean)
}
export enum ShortcutKind {
  None = 0,
  Ctrl = 'ctrl',
  Shift = 'shift',
  Alt = 'alt',
  Single = 'single',
}


enum BehaviorEnum {
  Copy = 1,
  Cut,
  Paste,
  Delete,
  SelectAll,
  Deselect,
  ToggleLock,
  Undo,
  Redo,
  MoveShapesUp,
  MoveShapesDown,
  MoveShapesLeft,
  MoveShapesRight,
  MoveShapesUpABit,
  MoveShapesDownABit,
  MoveShapesLeftABit,
  MoveShapesRightABit,
  MoveShapesUpMore,
  MoveShapesDownMore,
  MoveShapesLeftMore,
  MoveShapesRightMore,
  ToolSelector,
  ToolPen,
  ToolRect,
  ToolOval,
  ToolText,
  ToolTick,
  ToolCross,
  ToolHalfTick,
  ToolLines,
}
export class ShortcutsKeeper {
  private _board: Board;
  get board() { return this._board }

  private _actionQueue: ActionQueue;
  get actionQueue() { return this._actionQueue }

  private _clipboard: FClipboard

  constructor(board: Board, actionQueue: ActionQueue) {
    this._board = board
    this._actionQueue = actionQueue
    this._clipboard = new FClipboard(board)
  }

  selectAll() {
    this.board.selectAll(true)
  }
  deselect() {
    this.board.deselect(true)
  }
  toggleShapeLocks() {
    const { selects } = this.board;
    if (!selects) { return }
    const locked = !selects.find(v => !v.locked);
    selects.forEach(v => v.locked = !locked);
  }
  undo: ShortcutHandle = () => {
    this.actionQueue.canUndo && this.actionQueue.undo()
    return true
  }
  redo: ShortcutHandle = () => {
    this.actionQueue.canRedo && this.actionQueue.redo()
    return true
  }
  moveShapes: ShortcutHandle = (e) => {
    const { board } = this
    const { selects, toolType } = board;
    if (!selects) { return true; }

    if (toolType !== ToolEnum.Selector) {
      board.toolType = ToolEnum.Selector;
    };
    let diffX = 0;
    let diffY = 0;
    /*
    按着shift移动50像素
    按着alt移动1像素
    否则移动5像素
    */
    let diff = e.shiftKey ? 50 : e.altKey ? 1 : 5;
    switch (e.key) {
      case 'ArrowUp': diffY = -diff; break;
      case 'ArrowDown': diffY = diff; break;
      case 'ArrowLeft': diffX = -diff; break;
      case 'ArrowRight': diffX = diff; break;
      default: return true;
    }
    const selector = board.tool as SelectorTool;
    selector.connect(selects).moveBy(diffX, diffY).emitGeoEvent.enforce(true);

    board.toolType = toolType;
    board.setSelects(selects, true); // 切回其他工具时，会自动取消选择，这里重新选择已选择的图形
    return false;
  }

  shortcutKind(e: KeyboardEvent): ShortcutKind {
    if (e.ctrlKey && !e.shiftKey && !e.altKey)
      return ShortcutKind.Ctrl; // 快捷键： ctrl + key
    else if (!e.ctrlKey && e.shiftKey && !e.altKey)
      return ShortcutKind.Shift; // 快捷键： alt + key
    else if (!e.ctrlKey && !e.shiftKey && e.altKey)
      return ShortcutKind.Alt; // 快捷键： alt + key
    return ShortcutKind.Single; // 快捷键： key
  }

  handleKeyboardEvent = (e: KeyboardEvent) => {
    const kind = this.shortcutKind(e);
    if (!kind) return;

    const behavior = this.keys.get(kind)?.get(e.key);
    if (!behavior) return;

    const func = this.behaviors[behavior]
    if (func(e) === true) { return; } // func返回true时，意味着不要拦截默认事件。
    e.stopPropagation();
    e.preventDefault();
  }
  descriptions: Record<BehaviorEnum, string | undefined> = {
    [BehaviorEnum.Copy]: "复制",
    [BehaviorEnum.Cut]: "剪切",
    [BehaviorEnum.Paste]: "粘贴",
    [BehaviorEnum.Delete]: "删除",
    [BehaviorEnum.SelectAll]: "全选",
    [BehaviorEnum.Deselect]: "取消选择",
    [BehaviorEnum.ToggleLock]: "锁定/解锁图形",
    [BehaviorEnum.Undo]: "撤销",
    [BehaviorEnum.Redo]: "重做",
    [BehaviorEnum.MoveShapesUp]: "向上移动图形",
    [BehaviorEnum.MoveShapesDown]: "向下移动图形",
    [BehaviorEnum.MoveShapesLeft]: "向左移动图形",
    [BehaviorEnum.MoveShapesRight]: "向右移动图形",
    [BehaviorEnum.MoveShapesUpABit]: "向上移动图形",
    [BehaviorEnum.MoveShapesDownABit]: "向下移动图形",
    [BehaviorEnum.MoveShapesLeftABit]: "向左移动图形",
    [BehaviorEnum.MoveShapesRightABit]: "向右移动图形",
    [BehaviorEnum.MoveShapesUpMore]: "向上移动图形",
    [BehaviorEnum.MoveShapesDownMore]: "向下移动图形",
    [BehaviorEnum.MoveShapesLeftMore]: "向左移动图形",
    [BehaviorEnum.MoveShapesRightMore]: "向右移动图形",
    [BehaviorEnum.ToolSelector]: "切换工具：选择器",
    [BehaviorEnum.ToolPen]: "切换工具：笔",
    [BehaviorEnum.ToolRect]: "切换工具：矩形",
    [BehaviorEnum.ToolOval]: "切换工具：椭圆",
    [BehaviorEnum.ToolText]: "切换工具：文本",
    [BehaviorEnum.ToolTick]: "切换工具：打钩",
    [BehaviorEnum.ToolCross]: "切换工具：打叉",
    [BehaviorEnum.ToolHalfTick]: "切换工具：打半对",
    [BehaviorEnum.ToolLines]: "切换工具：直线",
  }
  behaviors: Record<BehaviorEnum, ShortcutHandle> = {
    [BehaviorEnum.Copy]: () => { this._clipboard.copy(); },
    [BehaviorEnum.Cut]: () => { this._clipboard.cut(); },
    [BehaviorEnum.Paste]: () => { this._clipboard.paste(); },
    [BehaviorEnum.Delete]: () => this.board.removeSelected(true),
    [BehaviorEnum.SelectAll]: () => { this.selectAll(); },
    [BehaviorEnum.Deselect]: () => { this.deselect(); },
    [BehaviorEnum.ToggleLock]: () => { this.toggleShapeLocks(); },
    [BehaviorEnum.Undo]: this.undo,
    [BehaviorEnum.Redo]: this.redo,
    [BehaviorEnum.MoveShapesUp]: this.moveShapes,
    [BehaviorEnum.MoveShapesDown]: this.moveShapes,
    [BehaviorEnum.MoveShapesLeft]: this.moveShapes,
    [BehaviorEnum.MoveShapesRight]: this.moveShapes,
    [BehaviorEnum.MoveShapesUpABit]: this.moveShapes,
    [BehaviorEnum.MoveShapesDownABit]: this.moveShapes,
    [BehaviorEnum.MoveShapesLeftABit]: this.moveShapes,
    [BehaviorEnum.MoveShapesRightABit]: this.moveShapes,
    [BehaviorEnum.MoveShapesUpMore]: this.moveShapes,
    [BehaviorEnum.MoveShapesDownMore]: this.moveShapes,
    [BehaviorEnum.MoveShapesLeftMore]: this.moveShapes,
    [BehaviorEnum.MoveShapesRightMore]: this.moveShapes,
    [BehaviorEnum.ToolSelector]: () => this.board.setToolType(ToolEnum.Selector),
    [BehaviorEnum.ToolPen]: () => this.board.setToolType(ToolEnum.Pen),
    [BehaviorEnum.ToolRect]: () => this.board.setToolType(ToolEnum.Rect),
    [BehaviorEnum.ToolOval]: () => this.board.setToolType(ToolEnum.Oval),
    [BehaviorEnum.ToolText]: () => this.board.setToolType(ToolEnum.Text),
    [BehaviorEnum.ToolTick]: () => this.board.setToolType(ToolEnum.Tick),
    [BehaviorEnum.ToolCross]: () => this.board.setToolType(ToolEnum.Cross),
    [BehaviorEnum.ToolHalfTick]: () => this.board.setToolType(ToolEnum.HalfTick),
    [BehaviorEnum.ToolLines]: () => this.board.setToolType(ToolEnum.Lines),
  }
  keys = new Map<ShortcutKind, Map<string, BehaviorEnum>>([
    [ShortcutKind.Ctrl, new Map<string, BehaviorEnum>([
      ['c', BehaviorEnum.Copy],
      ['x', BehaviorEnum.Cut],
      ['v', BehaviorEnum.Paste],
      ['a', BehaviorEnum.SelectAll],
      ['d', BehaviorEnum.Deselect],
      ['l', BehaviorEnum.ToggleLock],
      ['z', BehaviorEnum.Undo],
      ['y', BehaviorEnum.Redo]
    ])],
    [ShortcutKind.Shift, new Map<string, BehaviorEnum>([
      ['ArrowUp', BehaviorEnum.MoveShapesUpMore],
      ['ArrowDown', BehaviorEnum.MoveShapesDownMore],
      ['ArrowLeft', BehaviorEnum.MoveShapesLeftMore],
      ['ArrowRight', BehaviorEnum.MoveShapesRightMore],
    ])],
    [ShortcutKind.Alt, new Map<string, BehaviorEnum>([
      ['ArrowUp', BehaviorEnum.MoveShapesUpABit],
      ['ArrowDown', BehaviorEnum.MoveShapesDownABit],
      ['ArrowLeft', BehaviorEnum.MoveShapesLeftABit],
      ['ArrowRight', BehaviorEnum.MoveShapesRightABit],
    ])],
    [ShortcutKind.Single, new Map<string, BehaviorEnum>([
      ['Delete', BehaviorEnum.Delete],
      ['s', BehaviorEnum.ToolSelector],
      ['p', BehaviorEnum.ToolPen],
      ['r', BehaviorEnum.ToolRect],
      ['o', BehaviorEnum.ToolOval],
      ['t', BehaviorEnum.ToolText],
      ['z', BehaviorEnum.ToolTick],
      ['c', BehaviorEnum.ToolCross],
      ['x', BehaviorEnum.ToolHalfTick],
      ['l', BehaviorEnum.ToolLines],
      ['ArrowUp', BehaviorEnum.MoveShapesUp],
      ['ArrowDown', BehaviorEnum.MoveShapesDown],
      ['ArrowLeft', BehaviorEnum.MoveShapesLeft],
      ['ArrowRight', BehaviorEnum.MoveShapesRight],
    ])]
  ])

  shortcuts: Map<BehaviorEnum, [ShortcutKind, string, string]> = (() => {
    const ret = new Map<BehaviorEnum, [ShortcutKind, string, string]>()
    this.keys.forEach((v0, shortcutKind) => v0.forEach((behavior, key) => {
      ret.set(behavior, [shortcutKind, key, this.descriptions[behavior] ?? ""])
    }))
    return ret
  })()
}