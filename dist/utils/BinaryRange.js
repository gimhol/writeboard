"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinaryRange = void 0;
var BinaryRange = /** @class */ (function () {
    function BinaryRange(f, t) {
        this.from = f;
        this.to = t;
    }
    BinaryRange.prototype.set = function (range) {
        this.from = range.from;
        this.to = range.to;
    };
    Object.defineProperty(BinaryRange.prototype, "mid", {
        get: function () {
            return (this.from + this.to) / 2;
        },
        enumerable: false,
        configurable: true
    });
    BinaryRange.prototype.hit = function (other) {
        return !(this.from > other.to) && !(this.to < other.from);
    };
    return BinaryRange;
}());
exports.BinaryRange = BinaryRange;
//# sourceMappingURL=BinaryRange.js.map