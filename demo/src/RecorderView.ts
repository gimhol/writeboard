import { Board } from "../../dist";
import { Player } from "../../dist/features/Player";
import { Recorder } from "../../dist/features/Recorder";
import { Button } from "./G/BaseView/Button";
import { CssDisplay, CssFlexDirection } from "./G/BaseView/StyleType";
import { View } from "./G/BaseView/View";
import { Subwin } from "./G/CompoundView/SubWin";
import demo_helloworld from "./demo_helloworld";
import demo_rect_n_oval from "./demo_rect_n_oval";

export class RecorderView extends Subwin {
  private _btnStartRecord = new Button().init({ content: '开始录制' });
  private _btnStopRecord = new Button().init({ content: '停止录制' });
  private _btnPlay = new Button().init({ content: '播放' });
  private _btnDemo0 = new Button().init({ content: '"hello world"' });
  private _btnDemo1 = new Button().init({ content: '"rect & oval"' });
  private _textarea = new View('textarea');
  private _recorder: Recorder | undefined
  private _player: Player | undefined
  private _board: (() => Board | undefined) | undefined

  get btnStartRecord() { return this._btnStartRecord; }
  get btnStopRecord() { return this._btnStopRecord; }
  get btnPlay() { return this._btnPlay; }
  get btnDemo0() { return this._btnDemo0; }
  get btnDemo1() { return this._btnDemo1; }
  get textarea() { return this._textarea; }
  get board() { return this._board; }
  set board(v) { this._board = v; }

  constructor() {
    super();
    this.header.title = 'recorder';
    this.content = new View('div');
    this.content.styles.apply('', { flex: 1, display: CssDisplay.Flex, flexDirection: CssFlexDirection.column });
    this.content.addChild(this._btnStartRecord);
    this.content.addChild(this._btnStopRecord);
    this.content.addChild(this._btnPlay);
    this.content.addChild(this._btnDemo0);
    this.content.addChild(this._btnDemo1);
    this.content.addChild(this._textarea);

    this._textarea.styles.apply('', { resize: 'vertical' })

    this.btnStartRecord.addEventListener('click', () => this.startRecord());
    this.btnStopRecord.addEventListener('click', () => this.endRecord());
    this.btnPlay.addEventListener('click', () => {
      this.endRecord();
      this.replay();
    });

    this.btnDemo0.addEventListener('click', () => {
      this.endRecord();
      this.textarea.inner.value = demo_helloworld;
      this.replay();
    });
    this.btnDemo1.addEventListener('click', () => {
      this.endRecord();
      this.textarea.inner.value = demo_rect_n_oval;
      this.replay();
    });
  }

  startRecord(): void {
    const board = this._board?.();
    if (!board) { return; }
    this._recorder?.destory();
    this._recorder = new Recorder();
    this._recorder.setActor(board).start();
  }

  endRecord(): void {
    if (!this._recorder) { return; }
    this.textarea.inner.value = this._recorder.getJson() ?? ''
    this._recorder?.destory()
    this._recorder = undefined
  }

  replay(): void {
    const board = this._board?.();
    if (!board) { return; }
    this.endRecord();
    const str = this.textarea.inner.value;
    this._player?.stop();
    this._player = new Player()
    this._player.start(board, JSON.parse(str))
  }

}
