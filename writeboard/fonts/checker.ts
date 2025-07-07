
export namespace FontFamilysChecker {
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

    draw(fontFamily: string = this.arial) {
      this.ctx.clearRect(0, 0, this.w, this.h);
      this.ctx.font = this.fontSize + "px " + fontFamily + ", " + this.arial;
      this.ctx.fillText(this.txt, this.w / 2, this.h / 2);
      return this.ctx.getImageData(0, 0, this.w, this.h).data.filter(v => v != 0).join("");
    };
  }
  let _checker: Checker | null = null

  export function check(fontFamily: string): boolean {
    const checker = _checker ?? new Checker();
    if (typeof fontFamily !== "string") { return false }
    if (fontFamily.toLowerCase() === checker.arial.toLowerCase()) { return true }
    return checker.draw() !== checker.draw(fontFamily)
  };
}


