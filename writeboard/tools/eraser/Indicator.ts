import { ShapeData, ShapeRect } from "../../shape";

/**
 * 橡皮擦的指示框：跟着指针的方形框（半透明底色 + 黑色边框），按下时描边 / 填充色加深
 *
 * The eraser's indicator box: a square that follows the pointer (translucent fill with a
 * black border); pressing deepens the stroke / fill color.
 */
export class Indicator extends ShapeRect {
  /**
   * 新建指示框：默认 100×100、半透明、按下前的配色；擦除范围由板子按橡皮擦粗细改
   *
   * Creates the indicator box: 100×100 by default, translucent, in the "not pressed"
   * colors; the board resizes it to the eraser width.
   */
  constructor() {
    super(new ShapeData);
    this.data.lineWidth = 1
    this.data.strokeStyle = '#00000055'
    this.data.fillStyle = '#FFFFFF55'
    this.data.ghost = true;
    this.data.w = 100;
    this.data.h = 100;
  }

  /**
   * 按下（擦除中）：描边 / 填充色加深
   *
   * Pressed (erasing): deepens the stroke / fill color.
   */
  press() {
    this.data.strokeStyle = '#000000FF'
    this.data.fillStyle = '#FFFFFFFF'
    this.markDirty();
  }

  /**
   * 抬起：恢复半透明的配色
   *
   * Released: restores the translucent colors.
   */
  release() {
    this.data.strokeStyle = '#00000055'
    this.data.fillStyle = '#FFFFFF55'
    this.markDirty();
  }
}
