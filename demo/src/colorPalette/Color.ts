

export const clampF = (min: number, max: number, value: number) =>
  Math.max(min, Math.min(max, value))
export const clampI = (min: number, max: number, value: number) =>
  Math.floor(clampF(min, max, value))

export class RGB {
  static get White() { return new RGB(255, 255, 255) }
  static get Black() { return new RGB(0, 0, 0) }
  private _r: number = 0
  private _g: number = 0
  private _b: number = 0
  get r() { return this._r }
  set r(v) {
    this._r = clampI(0, 255, v)
  }
  get g() { return this._g }
  set g(v) {
    this._g = clampI(0, 255, v)
  }
  get b() { return this._b }
  set b(v) {
    this._b = clampI(0, 255, v)
  }
  equal(o: RGB) {
    return this.r === o.r && this.g === o.g && this.b === o.b
  }
  setR(v: number) {
    this.r = v
    return this
  }
  setG(v: number) {
    this.g = v
    return this
  }
  setB(v: number) {
    this.b = v
    return this
  }
  constructor(r = 0, g = 0, b = 0) {
    this.r = r
    this.g = g
    this.b = b
  }
  copy() {
    return new RGB(this.r, this.g, this.b);
  }
  toString() {
    return `rgb(${this.r},${this.g},${this.b})`
  }
  toHex() {
    return "#" +
      (this.r < 16 ? '0' : '') +
      Math.floor(this.r).toString(16) +
      (this.g < 16 ? '0' : '') +
      Math.floor(this.g).toString(16) +
      (this.b < 16 ? '0' : '') +
      Math.floor(this.b).toString(16);
  }
  toHSB(): HSB | null
  toHSB(hues: number): HSB;
  toHSB(hues?: number): HSB | null {
    var rgb = [
      this.r,
      this.g,
      this.b
    ]
    rgb.sort(function sortNumber(a, b) {
      return a - b
    });
    var max = rgb[2];
    var min = rgb[0];
    var ret = new HSB(
      0,
      max == 0 ? 0 : (max - min) / max,
      max / 255,
    );
    var rgbR = this.r;
    var rgbG = this.g;
    var rgbB = this.b;
    if (max == min) {// lost rgb 
      if (hues === undefined) {
        return null;
      } else {
        ret.h = hues
      }
    }
    else if (max == rgbR && rgbG >= rgbB)
      ret.h = (rgbG - rgbB) * 60 / (max - min) + 0
    else if (max == rgbR && rgbG < rgbB)
      ret.h = (rgbG - rgbB) * 60 / (max - min) + 360
    else if (max == rgbG)
      ret.h = (rgbB - rgbR) * 60 / (max - min) + 120
    else if (max == rgbB)
      ret.h = (rgbR - rgbG) * 60 / (max - min) + 240
    return ret;
  }
  toRGBA(a: number) {
    return new RGBA(this.r, this.g, this.b, a);
  }
}

export class RGBA extends RGB {
  static get White() { return new RGBA(255, 255, 255, 255) }
  static get Black() { return new RGBA(0, 0, 0, 255) }
  static get WhiteT() { return new RGBA(255, 255, 255, 0) }
  static get BlackT() { return new RGBA(0, 0, 0, 0) }
  private _a: number = 0
  get a() { return this._a }
  set a(v) {
    this._a !== v
    this._a = clampI(0, 255, v)
  }
  equal(o: RGBA) {
    return this.r === o.r && this.g === o.g && this.b === o.b && this.a === o.a
  }
  setA(v: number) {
    this.a = v
    return this
  }
  constructor(r = 0, g = 0, b = 0, a = 0) {
    super(r, g, b)
    this.a = a
  }
  copy() {
    return new RGBA(this.r, this.g, this.b, this.a)
  }
  toString() {
    return `rgba(${this.r},${this.g},${this.b},${(this.a / 255).toFixed(2)})`;
  }
  toHex() {
    return "#" +
      (this.r < 16 ? '0' : '') +
      Math.floor(this.r).toString(16) +
      (this.g < 16 ? '0' : '') +
      Math.floor(this.g).toString(16) +
      (this.b < 16 ? '0' : '') +
      Math.floor(this.b).toString(16) +
      (this.a < 16 ? '0' : '') +
      Math.floor(this.a).toString(16)
  }
  toRGB() {
    return new RGB(this.r, this.g, this.b);
  }
}

export class HSB {
  private _h: number = 0
  private _s: number = 0
  private _b: number = 0
  get h() { return this._h }
  set h(v) { this._h = clampI(0, 360, v) }
  get s() { return this._s }
  set s(v) { this._s = clampF(0, 1, v) }
  get b() { return this._b }
  set b(v) { this._b = clampF(0, 1, v) }
  equal(o: HSB) {
    return this.h === o.h && this.s === o.s && this.b === o.b
  }
  constructor(h: number, s: number, b: number) {
    this.h = h
    this.s = s
    this.b = b
  }
  copy() {
    return new HSB(this.h, this.s, this.b)
  }
  toString() {
    return 'hsb(' + this.h + ',' + this.s + ',' + this.b + ')'
  }
  toRGB() {
    if (isNaN(this.h))
      console.warn('lost hues!')

    var i = Math.floor((this.h / 60) % 6);
    var f = (this.h / 60) - i;
    var pool = {
      f: f,
      p: this.b * (1 - this.s),
      q: this.b * (1 - f * this.s),
      t: this.b * (1 - (1 - f) * this.s),
      v: this.b
    };
    var relations: (keyof typeof pool)[][] = [
      ['v', 't', 'p'],
      ['q', 'v', 'p'],
      ['p', 'v', 't'],
      ['p', 'q', 'v'],
      ['t', 'p', 'v'],
      ['v', 'p', 'q'],
    ];
    return new RGB(
      255 * pool[relations[i][0]],
      255 * pool[relations[i][1]],
      255 * pool[relations[i][2]]
    );
  }
  toRGBA(a: number) {
    return this.toRGB().toRGBA(a)
  }
  stripSB() {
    return new HSB(this.h, 1, 1);
  }
}