"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findIndex = void 0;
const findIndex = (arr, func) => {
    for (let i = 0; i < arr.length; ++i) {
        if (func(arr[i], i, arr))
            return i;
    }
    return -1;
};
exports.findIndex = findIndex;
//# sourceMappingURL=Array.js.map