import { Board } from "../../dist";
import { Button } from "./G/BaseView/Button";
import { CssDisplay, CssFlexDirection } from "./G/BaseView/StyleType";
import { View } from "./G/BaseView/View";
import { Subwin } from "./G/CompoundView/SubWin";

export class SnapshotView extends Subwin {
  private _textarea = new View('textarea')
  private _board: (() => Board | undefined) | undefined
  get board() { return this._board; }
  set board(v) { this._board = v; }

  constructor() {
    super();
    this.header.title = 'snapshot';
    this.content = new View('div');
    this.content.styles.apply('', { flex: 1, display: CssDisplay.Flex, flexDirection: CssFlexDirection.column })
    this.content.addChild(new Button().init({ content: 'save Snapshot' }).addEventListener('click', () => {
      const board = this._board?.();
      if (!board) { return; }
      this._textarea.inner.value = board.toJson();
    }));
    this.content.addChild(new Button().init({ content: 'load Snapshot' }).addEventListener('click', () => {
      const board = this._board?.();
      if (!board) { return; }
      board.fromJson(this._textarea.inner.value)
    }));
    this.content.addChild(this._textarea);
    this._textarea.styles.apply('', { resize: 'vertical' })
  }
}
