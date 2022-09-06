"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RectHelper = exports.LockMode = exports.GenMode = void 0;
var Vector_1 = require("./Vector");
var GenMode;
(function (GenMode) {
    GenMode[GenMode["FromCorner"] = 0] = "FromCorner";
    GenMode[GenMode["FromCenter"] = 1] = "FromCenter";
})(GenMode = exports.GenMode || (exports.GenMode = {}));
var LockMode;
(function (LockMode) {
    LockMode[LockMode["Default"] = 0] = "Default";
    LockMode[LockMode["Square"] = 1] = "Square";
    LockMode[LockMode["Circle"] = 2] = "Circle";
})(LockMode = exports.LockMode || (exports.LockMode = {}));
var RectHelper = /** @class */ (function () {
    function RectHelper() {
        this._from = Vector_1.Vector.pure(-999, -999);
        this._to = Vector_1.Vector.pure(-999, -999);
    }
    RectHelper.prototype.start = function (x, y) {
        this._from.x = x;
        this._from.y = y;
        this._to.x = x;
        this._to.y = y;
    };
    RectHelper.prototype.end = function (x, y) {
        this._to.x = x;
        this._to.y = y;
    };
    RectHelper.prototype.clear = function () {
        this._from = Vector_1.Vector.pure(-999, -999);
        this._to = Vector_1.Vector.pure(-999, -999);
    };
    RectHelper.prototype.gen = function (options) {
        // PREF: IMPROVE ME
        var lockMode = (options === null || options === void 0 ? void 0 : options.lockMode) || LockMode.Default;
        var genMode = (options === null || options === void 0 ? void 0 : options.genMode) || GenMode.FromCorner;
        var _a = this._from, x0 = _a.x, y0 = _a.y;
        var _b = this._to, x1 = _b.x, y1 = _b.y;
        switch (lockMode) {
            case LockMode.Square:
                if (genMode === GenMode.FromCenter) {
                    var d = Math.max(Math.abs(x0 - x1), Math.abs(y0 - y1));
                    x1 = x0 + d;
                    y1 = y0 + d;
                }
                else if (genMode === GenMode.FromCorner) {
                    var k = (y0 - y1) / (x0 - x1) > 0 ? 1 : -1;
                    var b = y1 + k * x1;
                    x1 = (b - y0 + k * x0) / (2 * k);
                    y1 = -k * x1 + b;
                }
                break;
            case LockMode.Circle:
                if (genMode === GenMode.FromCenter) {
                    var r = Math.sqrt(Math.pow(Math.abs(x0 - x1), 2) + Math.pow(Math.abs(y0 - y1), 2));
                    x1 = x0 + r;
                    y1 = y0 + r;
                }
                else if (genMode === GenMode.FromCorner) {
                    var d = Math.sqrt(Math.pow(Math.abs(x0 - x1), 2) + Math.pow(Math.abs(y0 - y1), 2));
                    var xo = (x0 + x1) / 2;
                    var yo = (y0 + y1) / 2;
                    return {
                        x: xo - d / 2,
                        y: yo - d / 2,
                        w: d,
                        h: d,
                    };
                }
                break;
        }
        switch (genMode) {
            case GenMode.FromCenter: {
                var halfW = Math.abs(x0 - x1);
                var halfH = Math.abs(y0 - y1);
                return {
                    x: x0 - halfW,
                    y: y0 - halfH,
                    w: 2 * halfW,
                    h: 2 * halfH,
                };
            }
            default: {
                var x = Math.min(x0, x1);
                var y = Math.min(y0, y1);
                return {
                    x: x,
                    y: y,
                    w: Math.max(x0, x1) - x,
                    h: Math.max(y0, y1) - y
                };
            }
        }
    };
    return RectHelper;
}());
exports.RectHelper = RectHelper;
//# sourceMappingURL=RectHelper.js.map