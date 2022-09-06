"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findIndex = void 0;
var findIndex = function (arr, func) {
    for (var i = 0; i < arr.length; ++i) {
        if (func(arr[i], i, arr))
            return i;
    }
    return -1;
};
exports.findIndex = findIndex;
//# sourceMappingURL=Array.js.map