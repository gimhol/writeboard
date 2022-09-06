"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector = void 0;
var Vector = /** @class */ (function () {
    function Vector(x, y) {
        this.x = 0;
        this.y = 0;
        this.x = x;
        this.y = y;
    }
    Vector.mid = function (v0, v1, factor) {
        if (factor === void 0) { factor = 0.5; }
        return {
            x: v0.x + (v1.x - v0.x) * factor,
            y: v0.y + (v1.y - v0.y) * factor,
        };
    };
    Vector.pure = function (x, y) {
        return { x: x, y: y };
    };
    Vector.distance = function (v0, v1) {
        return Math.sqrt(Math.pow(v0.x - v1.x, 2) +
            Math.pow(v0.y - v1.y, 2));
    };
    return Vector;
}());
exports.Vector = Vector;
//# sourceMappingURL=Vector.js.map