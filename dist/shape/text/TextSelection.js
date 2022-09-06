"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextSelection = void 0;
var TextSelection = /** @class */ (function () {
    function TextSelection(start, end) {
        if (start === void 0) { start = -1; }
        if (end === void 0) { end = -1; }
        this.start = -1;
        this.end = -1;
        this.start = start;
        this.end = end;
    }
    TextSelection.prototype.equal = function (other) {
        return this.start === other.start && this.end === other.end;
    };
    return TextSelection;
}());
exports.TextSelection = TextSelection;
//# sourceMappingURL=TextSelection.js.map