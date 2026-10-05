import { Board, Player, Recorder, type IPlayerProgress, type IScreenplay } from "../writeboard";
import { Button } from "./G/BaseView/Button";
import { CssDisplay, CssFlexDirection } from "./G/BaseView/StyleType";
import { View } from "./G/BaseView/View";
import { Subwin } from "./G/CompoundView/SubWin";

/**
 * 内置示例剧本，直接从 assets 加载（不打包进 bundle）
 *
 * 它们录于 1024 × 1024 的板子，对应 demo/index_2.ts 的画布尺寸
 */
const DEMO_SCREENPLAYS = [
  { label: '"hello world"', file: 'demo_helloworld.json' },
  { label: '"rect & oval"', file: 'demo_rect_n_oval.json' },
]

export class RecorderView extends Subwin {
  private _btnStartRecord = new Button().init({ content: '开始录制' });
  private _btnStopRecord = new Button().init({ content: '停止录制' });
  private _btnPlay = new Button().init({ content: '播放' });
  private _btnPause = new Button().init({ content: '暂停' });
  private _btnDemo0 = new Button().init({ content: DEMO_SCREENPLAYS[0].label });
  private _btnDemo1 = new Button().init({ content: DEMO_SCREENPLAYS[1].label });
  private _textarea = new View('textarea');
  private _bar = new View('div');
  private _barFill = new View('div');
  private _recorder: Recorder | undefined
  private _player = new Player()
  private _screenplay: IScreenplay | undefined
  private _board: (() => Board | undefined) | undefined

  get btnStartRecord() { return this._btnStartRecord; }
  get btnStopRecord() { return this._btnStopRecord; }
  get btnPlay() { return this._btnPlay; }
  get btnPause() { return this._btnPause; }
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
    this._bar.styles.apply('', {
      height: '6px',
      minHeight: '6px',
      borderRadius: '3px',
      overflow: 'hidden',
      background: 'rgba(255, 255, 255, .2)',
      display: 'none',
    })
    this._barFill.styles.apply('', { width: '0%', height: '100%', background: '#ff5722' })
    this._bar.addChild(this._barFill)
    this.content.addChild(
      this._btnStartRecord,
      this._btnStopRecord,
      this._btnPlay,
      this._btnPause,
      this._btnDemo0,
      this._btnDemo1,
      this._bar,
      this._textarea,
    );
    this._textarea.styles.apply('', { resize: 'vertical' })

    this.btnStartRecord.addEventListener('click', () => this.startRecord());
    this.btnStopRecord.addEventListener('click', () => this.endRecord());
    this.btnPlay.addEventListener('click', () => {
      this.endRecord();
      this.replay();
    });
    this.btnPause.addEventListener('click', () => this.togglePause());
    this.btnDemo0.addEventListener('click', () => this.playDemo(0));
    this.btnDemo1.addEventListener('click', () => this.playDemo(1));
  }

  startRecord(): void {
    const board = this._board?.();
    if (!board) { return; }
    this._player.stop();
    this._hideBar();
    this._recorder?.destory();
    this._recorder = new Recorder();
    this._recorder.setActor(board).start();
  }

  endRecord(): void {
    if (!this._recorder) { return; }
    this.textarea.inner.value = this._recorder.getJson() ?? ''
    this._screenplay = this._recorder.getScreenplay() ?? undefined
    this._recorder?.destory()
    this._recorder = undefined
  }

  /** 播放 textarea 里的剧本（也可以手动改文本后再点播放） */
  replay(): void {
    const board = this._board?.();
    if (!board) { return; }
    const text = this.textarea.inner.value;
    if (!text) { return; }
    try {
      this.play(board, JSON.parse(text));
    } catch (e) {
      console.error('[RecorderView] 剧本解析失败', e);
    }
  }

  /** 加载内置示例剧本并播放 */
  async playDemo(index: number): Promise<void> {
    const board = this._board?.();
    if (!board) { return; }
    const demo = DEMO_SCREENPLAYS[index];
    if (!demo) { return; }
    try {
      const resp = await fetch(`./assets/screenplays/${demo.file}`);
      const screenplay: IScreenplay = await resp.json();
      this.textarea.inner.value = JSON.stringify(screenplay);
      this.play(board, screenplay);
    } catch (e) {
      console.error('[RecorderView] 示例剧本加载失败', e);
    }
  }

  private play(board: Board, screenplay: IScreenplay): void {
    this._screenplay = screenplay
    this._player.stop()
    this._showBar()
    this._player.play(board, screenplay, {
      rate: 2,                                    // 示例用 2 倍速，看得快一点
      onProgress: (p: IPlayerProgress) => { this._barFill.inner.style.width = `${p.progress * 100}%` },
      onEnd: () => { this._barFill.inner.style.width = '100%' },
    })
  }

  private togglePause(): void {
    if (this._player.playing) {
      this._player.pause()
      this._btnPause.content = '继续'
    } else if (this._player.paused) {
      this._player.resume()
      this._btnPause.content = '暂停'
    }
  }

  private _showBar(): void {
    this._bar.inner.style.display = 'block'
    this._barFill.inner.style.width = '0%'
  }

  private _hideBar(): void {
    this._bar.inner.style.display = 'none'
    this._barFill.inner.style.width = '0%'
  }
}

