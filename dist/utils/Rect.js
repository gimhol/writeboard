"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rect = void 0;
var Rect = /** @class */ (function () {
    function Rect(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    Object.defineProperty(Rect.prototype, "top", {
        get: function () { return this.y; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "left", {
        get: function () { return this.x; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "right", {
        get: function () { return this.x + this.w; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "bottom", {
        get: function () { return this.y + this.h; },
        enumerable: false,
        configurable: true
    });
    Rect.prototype.set = function (o) {
        this.x = o.x;
        this.y = o.y;
        this.w = o.w;
        this.h = o.h;
    };
    Rect.prototype.hit = function (b) {
        return Rect.hit(this, b);
    };
    Rect.prototype.toString = function () {
        return "Rect(x=".concat(this.x, ", y=").concat(this.x, ", w=").concat(this.w, ", h=").concat(this.h, ")");
    };
    Rect.prototype.mid = function () {
        return { x: this.x + this.w / 2, y: this.y + this.h / 2 };
    };
    Rect.create = function (rect) {
        return new Rect(rect.x, rect.y, rect.w, rect.h);
    };
    Rect.pure = function (x, y, w, h) {
        return { x: x, y: y, w: w, h: h };
    };
    Rect.bounds = function (r1, r2) {
        var x = Math.min(r1.x, r2.x);
        var y = Math.min(r1.y, r2.y);
        return {
            x: x,
            y: y,
            w: Math.max(r1.x + r1.w, r2.x + r2.w) - x,
            h: Math.max(r1.y + r1.h, r2.y + r2.h) - y
        };
    };
    Rect.hit = function (a, b) {
        var w = 0;
        var h = 0;
        if ('w' in b && 'h' in b) {
            w = b.w;
            h = b.h;
        }
        return (a.x + a.w >= b.x &&
            b.x + w >= a.x &&
            a.y + a.h >= b.y &&
            b.y + h >= a.y);
    };
    Rect.intersect = function (a, b) {
        var x = Math.max(a.x, b.x);
        var y = Math.max(a.y, b.y);
        var right = Math.min(a.x + a.w, b.x + b.w);
        var bottom = Math.min(a.y + a.h, b.y + b.h);
        return {
            x: x,
            y: y,
            w: right - x,
            h: bottom - y
        };
    };
    return Rect;
}());
exports.Rect = Rect;
//# sourceMappingURL=Rect.js.map