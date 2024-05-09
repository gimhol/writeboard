
export namespace FontFamilysChecker {
  export function check(fontFamilys: string[]): string[] {
    const w = 64;
    const h = 64;
    const txt = "a啊";
    const fontSize = 64;
    const arial = "arial";
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
    canvas.width = w;
    canvas.height = h;
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.textBaseline = "middle";
    const _drawTxt = function (fontFamily: string) {
      ctx.clearRect(0, 0, w, h);
      ctx.font = fontSize + "px " + fontFamily + ", " + arial;
      ctx.fillText(txt, w / 2, h / 2);
      return ctx.getImageData(0, 0, w, h).data.filter(v => v != 0).join("");
    };
    return fontFamilys.filter(fontFamily => {
      if (typeof fontFamily !== "string") { return false }
      if (fontFamily.toLowerCase() === arial.toLowerCase()) { return true }
      return _drawTxt(arial) !== _drawTxt(fontFamily)
    })
  };
}


