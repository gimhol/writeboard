import { Board } from "../../board";
import { Gaia } from "../../mgr/Gaia";
import { IDot } from "../../utils";
import { ITool } from "../base";
import { ToolEnum } from "../ToolEnum";
import { Indicator } from "./Indicator";

export class EraserTool implements ITool {
  readonly type = ToolEnum.Eraser
  indicator = new Indicator()
  get board(): Board { return this.indicator.board!!; }
  set board(v: Board) { this.indicator.board = v; }
  start(): void { console.log('[EraserTool::start]') }
  end(): void {
    this.indicator.markDirty();
  }
  update_geo(dot: IDot) {
    this.indicator.move(
      dot.x - this.indicator.w / 2,
      dot.y - this.indicator.h / 2
    )
  }
  pointerDown(dot: IDot): void {
    this.indicator.data.strokeStyle = '#000000AA'
    this.indicator.data.fillStyle = '#FFFFFFAA'
    this.indicator.markDirty();
  }
  pointerUp(dot: IDot): void {
    this.indicator.data.strokeStyle = '#00000055'
    this.indicator.data.fillStyle = '#FFFFFF55'
    this.indicator.markDirty();
  }
  pointerDraw(dot: IDot): void {
    this.update_geo(dot);
  }
  pointerMove(dot: IDot): void {
    this.update_geo(dot);
  }
  render(ctx: CanvasRenderingContext2D): void {
    this.indicator.render(ctx)
  }
}
Gaia.registerTool(ToolEnum.Eraser, () => new EraserTool, {
  name: 'Eraser',
  desc: 'erase pen'
})
