"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rect = exports.getValue = void 0;
function getValue(v, prev) {
    return typeof v !== 'function' ? v : v(prev);
}
exports.getValue = getValue;
var Rect_1 = require("./Rect");
Object.defineProperty(exports, "Rect", { enumerable: true, get: function () { return Rect_1.Rect; } });
//# sourceMappingURL=index.js.map