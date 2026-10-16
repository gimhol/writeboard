
/**
 * 字体支持检查：同一段文字分别用 Arial 与目标家族各画一次，位图不同就说明目标家族存在
 *
 * Font support check: the same text is drawn once with Arial and once with the target
 * family; a different bitmap means the target family exists.
 */
export namespace FontFamilysChecker {
  /**
   * 检查辅助：自己维护一块小画布，把同一段文字画两次后比对位图
   *
   * Check helper: it owns a small canvas and compares the bitmaps of the same text drawn
   * twice.
   */
  class Checker {
    w = 128;
    h = 128;
    txt = "a啊.?!";
    fontSize = 128;
    arial = "arial";
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    constructor() {
      const canvas = this.canvas = document.createElement("canvas");
      const ctx = this.ctx = canvas.getContext("2d", { willReadFrequently: true })!;
      canvas.width = this.w = 64;
      canvas.height = this.h = 64;
      ctx.textAlign = "center";
      ctx.fillStyle = "black";
      ctx.textBaseline = "middle";
    }

    /**
     * 用指定字体家族把样本文本画一次，返回非空像素拼成的字符串（可用来比对两次绘制）
     *
     * Draws the sample text with the given font family and returns the non-empty pixels as
     * a string, which can be compared between two draws.
     *
     * @param {string} fontFamily 字体家族名（缺省 Arial）/ Font family name (Arial by default)
     * @return {string} 非空像素拼成的字符串 / String made of the non-empty pixels
     */
    draw(fontFamily: string = this.arial) {
      this.ctx.clearRect(0, 0, this.w, this.h);
      this.ctx.font = this.fontSize + "px " + fontFamily + ", " + this.arial;
      this.ctx.fillText(this.txt, this.w / 2, this.h / 2);
      return this.ctx.getImageData(0, 0, this.w, this.h).data.filter(v => v != 0).join("");
    };
  }
  let _checker: Checker | null = null

  /**
   * 检查当前环境里有没有某个字体家族
   *
   * Checks whether the current environment has a font family.
   *
   * @param {string} fontFamily 字体家族名 / Font family name
   * @return {boolean} 有则 true（Arial 恒为 true，参数不是字符串时返回 false）
   *   / True when the family exists (Arial is always true, a non-string argument returns false)
   */
  export function check(fontFamily: string): boolean {
    const checker = _checker ?? new Checker();
    if (typeof fontFamily !== "string") { return false }
    if (fontFamily.toLowerCase() === checker.arial.toLowerCase()) { return true }
    return checker.draw() !== checker.draw(fontFamily)
  };
}


