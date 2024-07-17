import { Board } from "../writeboard";
import { Button } from "./G/BaseView/Button";
import { CssDisplay, CssFlexDirection } from "./G/BaseView/StyleType";
import { View } from "./G/BaseView/View";
import { Subwin } from "./G/CompoundView/SubWin";

export class SnapshotView extends Subwin {
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

      const blob = new Blob([board.toJson(void 0, 2)])
      const ele_a = document.createElement('a');
      ele_a.href = URL.createObjectURL(blob);
      ele_a.download = `snapshot_${Date.now()}.json`
      ele_a.click()
    }));
    this.content.addChild(new Button().init({ content: 'load Snapshot' }).addEventListener('click', () => {
      const board = this._board?.();
      if (!board) { return; }

      const ele_input = document.createElement('input');
      ele_input.type = 'file';
      ele_input.accept = '.json';
      ele_input.click()

      const json_file = ele_input.files?.item(0);
      if (json_file) {
        json_file.text().then(txt => board.fromJson(txt))
      }
    }));
  }
}
