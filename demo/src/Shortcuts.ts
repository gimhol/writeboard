import { ActionQueue, Board, SelectorTool, ToolEnum } from "../../dist";

export interface ShortcutHandle {
  (e: KeyboardEvent): (void | boolean)
}
export enum ShortcutKind {
  None = 0,
  Ctrl = 'ctrl',
  Shift = 'shift',
  Alt = 'alt',
  Single = 'single',
}
export class ShortcutsKeeper {
  private _board: Board;
  get board() { return this._board }

  private _actionQueue: ActionQueue;
  get actionQueue() { return this._actionQueue }

  constructor(board: Board, actionQueue: ActionQueue) {
    this._board = board
    this._actionQueue = actionQueue
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
    if (this.actionQueue.canUndo)
      this.actionQueue.undo()
    return true
  }
  redo: ShortcutHandle = () => {
    if (this.actionQueue.canRedo)
      this.actionQueue.redo()
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
    否则移动4像素
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
    selector.connect(selects).moveBy(diffX, diffY).emitGeoEvent(true);

    board.toolType = toolType;
    board.setSelects(selects, true); // 切回其他工具时，会自动取消选择，这里重新选择已选择的图形

    return false;
  }

  handles = new Map<ShortcutKind, Map<string, ShortcutHandle>>([
    [ShortcutKind.Ctrl, new Map<string, (e: KeyboardEvent) => (void | boolean)>([
      ['a', () => { this.selectAll() }],
      ['d', () => { this.deselect() }],
      ['l', () => { this.toggleShapeLocks() }],
      ['z', this.undo],
      ['y', this.redo]
    ])],
    [ShortcutKind.Shift, new Map<string, (e: KeyboardEvent) => (void | boolean)>([
      ['ArrowUp', this.moveShapes],
      ['ArrowDown', this.moveShapes],
      ['ArrowLeft', this.moveShapes],
      ['ArrowRight', this.moveShapes],
    ])],
    [ShortcutKind.Alt, new Map<string, (e: KeyboardEvent) => (void | boolean)>([
      ['ArrowUp', this.moveShapes],
      ['ArrowDown', this.moveShapes],
      ['ArrowLeft', this.moveShapes],
      ['ArrowRight', this.moveShapes],
    ])],
    [ShortcutKind.Single, new Map<string, (e: KeyboardEvent) => (void | boolean)>([
      ['Delete', () => this.board.removeSelected(true)],
      ['s', () => this.board.setToolType(ToolEnum.Selector)],
      ['p', () => this.board.setToolType(ToolEnum.Pen)],
      ['r', () => this.board.setToolType(ToolEnum.Rect)],
      ['o', () => this.board.setToolType(ToolEnum.Oval)],
      ['t', () => this.board.setToolType(ToolEnum.Text)],
      ['z', () => this.board.setToolType(ToolEnum.Tick)],
      ['c', () => this.board.setToolType(ToolEnum.Cross)],
      ['x', () => this.board.setToolType(ToolEnum.HalfTick)],
      ['l', () => this.board.setToolType(ToolEnum.Lines)],
      ['ArrowUp', this.moveShapes],
      ['ArrowDown', this.moveShapes],
      ['ArrowLeft', this.moveShapes],
      ['ArrowRight', this.moveShapes],
    ])]
  ])
}

