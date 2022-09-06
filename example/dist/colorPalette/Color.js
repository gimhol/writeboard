"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.HSB = exports.RGBA = exports.RGB = exports.LazyHolder = exports.clampI = exports.clampF = void 0;
var clampF = function (min, max, value) {
    return Math.max(min, Math.min(max, value));
};
exports.clampF = clampF;
var clampI = function (min, max, value) {
    return Math.floor((0, exports.clampF)(min, max, value));
};
exports.clampI = clampI;
var LazyHolder = /** @class */ (function () {
    function LazyHolder(result) {
        this._result = [];
        this._dirty = [];
        this._result = result;
    }
    LazyHolder.prototype.dirty = function (i) {
        if (i === void 0) { i = 0; }
        return !!this._dirty[i];
    };
    LazyHolder.prototype.markAsDirty = function (i) {
        if (i === void 0) { i = 0; }
        this._dirty[i] = true;
    };
    LazyHolder.prototype.result = function (v, i) {
        if (i === void 0) { i = 0; }
        if (v !== undefined) {
            this._dirty[i] = false;
            this._result[i] = v;
        }
        return this._result[i];
    };
    return LazyHolder;
}());
exports.LazyHolder = LazyHolder;
var RGB = /** @class */ (function (_super) {
    __extends(RGB, _super);
    function RGB(r, g, b) {
        if (r === void 0) { r = 0; }
        if (g === void 0) { g = 0; }
        if (b === void 0) { b = 0; }
        var _this = _super.call(this, ['']) || this;
        _this._r = 0;
        _this._g = 0;
        _this._b = 0;
        _this.r = r;
        _this.g = g;
        _this.b = b;
        return _this;
    }
    Object.defineProperty(RGB, "White", {
        get: function () { return new RGB(255, 255, 255); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RGB, "Black", {
        get: function () { return new RGB(0, 0, 0); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RGB.prototype, "r", {
        get: function () { return this._r; },
        set: function (v) {
            this._r !== v && this.markAsDirty();
            this._r = (0, exports.clampI)(0, 255, v);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RGB.prototype, "g", {
        get: function () { return this._g; },
        set: function (v) {
            this._g !== v && this.markAsDirty();
            this._g = (0, exports.clampI)(0, 255, v);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RGB.prototype, "b", {
        get: function () { return this._b; },
        set: function (v) {
            this._b !== v && this.markAsDirty();
            this._b = (0, exports.clampI)(0, 255, v);
        },
        enumerable: false,
        configurable: true
    });
    RGB.prototype.equal = function (o) {
        return this.r === o.r && this.g === o.g && this.b === o.b;
    };
    RGB.prototype.setR = function (v) {
        this.r = v;
        return this;
    };
    RGB.prototype.setG = function (v) {
        this.g = v;
        return this;
    };
    RGB.prototype.setB = function (v) {
        this.b = v;
        return this;
    };
    RGB.prototype.copy = function () {
        return new RGB(this.r, this.g, this.b);
    };
    RGB.prototype.toString = function () {
        return this.dirty() ?
            this.result("rgb(".concat(this.r, ",").concat(this.g, ",").concat(this.b, ")")) :
            this.result(undefined);
    };
    RGB.prototype.toHex = function () {
        return this.dirty(1) ?
            this.result("#" +
                Math.floor(this.r).toString(16) +
                Math.floor(this.g).toString(16) +
                Math.floor(this.b).toString(16), 1) :
            this.result(undefined, 1);
    };
    RGB.prototype.toHSB = function (hues) {
        var rgb = [
            this.r,
            this.g,
            this.b
        ];
        rgb.sort(function sortNumber(a, b) {
            return a - b;
        });
        var max = rgb[2];
        var min = rgb[0];
        var ret = new HSB(0, max == 0 ? 0 : (max - min) / max, max / 255);
        var rgbR = this.r;
        var rgbG = this.g;
        var rgbB = this.b;
        if (max == min) // lost rgb
            ret.h = hues;
        else if (max == rgbR && rgbG >= rgbB)
            ret.h = (rgbG - rgbB) * 60 / (max - min) + 0;
        else if (max == rgbR && rgbG < rgbB)
            ret.h = (rgbG - rgbB) * 60 / (max - min) + 360;
        else if (max == rgbG)
            ret.h = (rgbB - rgbR) * 60 / (max - min) + 120;
        else if (max == rgbB)
            ret.h = (rgbR - rgbG) * 60 / (max - min) + 240;
        return ret;
    };
    RGB.prototype.toRGBA = function (a) {
        return new RGBA(this.r, this.g, this.b, a);
    };
    return RGB;
}(LazyHolder));
exports.RGB = RGB;
var RGBA = /** @class */ (function (_super) {
    __extends(RGBA, _super);
    function RGBA(r, g, b, a) {
        if (r === void 0) { r = 0; }
        if (g === void 0) { g = 0; }
        if (b === void 0) { b = 0; }
        if (a === void 0) { a = 0; }
        var _this = _super.call(this, r, g, b) || this;
        _this._a = 0;
        _this.a = a;
        return _this;
    }
    Object.defineProperty(RGBA, "White", {
        get: function () { return new RGBA(255, 255, 255, 255); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RGBA, "Black", {
        get: function () { return new RGBA(0, 0, 0, 255); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RGBA, "WhiteT", {
        get: function () { return new RGBA(255, 255, 255, 0); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RGBA, "BlackT", {
        get: function () { return new RGBA(0, 0, 0, 0); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RGBA.prototype, "a", {
        get: function () { return this._a; },
        set: function (v) {
            this._a !== v && this.markAsDirty();
            this._a = (0, exports.clampI)(0, 255, v);
        },
        enumerable: false,
        configurable: true
    });
    RGBA.prototype.equal = function (o) {
        return this.r === o.r && this.g === o.g && this.b === o.b && this.a === o.a;
    };
    RGBA.prototype.setA = function (v) {
        this.a = v;
        return this;
    };
    RGBA.prototype.copy = function () {
        return new RGBA(this.r, this.g, this.b, this.a);
    };
    RGBA.prototype.toString = function () {
        return this.dirty() ? this.result("rgba(".concat(this.r, ",").concat(this.g, ",").concat(this.b, ",").concat((this.a / 255).toFixed(2), ")")) : this.result(undefined);
    };
    RGBA.prototype.toHex = function () {
        return this.dirty(1) ?
            this.result("#" +
                (this.r < 16 ? '0' : '') +
                Math.floor(this.r).toString(16) +
                (this.g < 16 ? '0' : '') +
                Math.floor(this.g).toString(16) +
                (this.b < 16 ? '0' : '') +
                Math.floor(this.b).toString(16) +
                (this.a < 16 ? '0' : '') +
                Math.floor(this.a).toString(16), 1) :
            this.result(undefined, 1);
    };
    RGBA.prototype.toRGB = function () {
        return new RGB(this.r, this.g, this.b);
    };
    return RGBA;
}(RGB));
exports.RGBA = RGBA;
var HSB = /** @class */ (function () {
    function HSB(h, s, b) {
        this._h = 0;
        this._s = 0;
        this._b = 0;
        this.h = h;
        this.s = s;
        this.b = b;
    }
    Object.defineProperty(HSB.prototype, "h", {
        get: function () { return this._h; },
        set: function (v) { this._h = (0, exports.clampI)(0, 360, v); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HSB.prototype, "s", {
        get: function () { return this._s; },
        set: function (v) { this._s = (0, exports.clampF)(0, 1, v); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HSB.prototype, "b", {
        get: function () { return this._b; },
        set: function (v) { this._b = (0, exports.clampF)(0, 1, v); },
        enumerable: false,
        configurable: true
    });
    HSB.prototype.equal = function (o) {
        return this.h === o.h && this.s === o.s && this.b === o.b;
    };
    HSB.prototype.copy = function () {
        return new HSB(this.h, this.s, this.b);
    };
    HSB.prototype.toString = function () {
        return 'hsb(' + this.h + ',' + this.s + ',' + this.b + ')';
    };
    HSB.prototype.toRGB = function () {
        if (isNaN(this.h))
            console.warn('lost hues!');
        var i = Math.floor((this.h / 60) % 6);
        var f = (this.h / 60) - i;
        var pool = {
            f: f,
            p: this.b * (1 - this.s),
            q: this.b * (1 - f * this.s),
            t: this.b * (1 - (1 - f) * this.s),
            v: this.b
        };
        var relations = [
            ['v', 't', 'p'],
            ['q', 'v', 'p'],
            ['p', 'v', 't'],
            ['p', 'q', 'v'],
            ['t', 'p', 'v'],
            ['v', 'p', 'q'],
        ];
        return new RGB(255 * pool[relations[i][0]], 255 * pool[relations[i][1]], 255 * pool[relations[i][2]]);
    };
    HSB.prototype.toRGBA = function (a) {
        return this.toRGB().toRGBA(a);
    };
    HSB.prototype.stripSB = function () {
        return new HSB(this.h, 1, 1);
    };
    return HSB;
}());
exports.HSB = HSB;
//# sourceMappingURL=Color.js.map