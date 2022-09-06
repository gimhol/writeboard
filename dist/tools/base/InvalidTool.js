"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidTool = void 0;
var ToolEnum_1 = require("../ToolEnum");
var InvalidTool = /** @class */ (function () {
    function InvalidTool() {
    }
    InvalidTool.prototype.start = function () {
        console.warn('got InvalidTool');
    };
    InvalidTool.prototype.end = function () {
        console.warn('got InvalidTool');
    };
    Object.defineProperty(InvalidTool.prototype, "type", {
        get: function () { return ToolEnum_1.ToolEnum.Invalid; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InvalidTool.prototype, "board", {
        get: function () {
            console.warn('got InvalidTool');
            return;
        },
        set: function (v) {
            console.warn('got InvalidTool');
        },
        enumerable: false,
        configurable: true
    });
    InvalidTool.prototype.pointerMove = function (dot) {
        console.warn('got InvalidTool');
    };
    InvalidTool.prototype.pointerDown = function (dot) {
        console.warn('got InvalidTool');
    };
    InvalidTool.prototype.pointerDraw = function (dot) {
        console.warn('got InvalidTool');
    };
    InvalidTool.prototype.pointerUp = function (dot) {
        console.warn('got InvalidTool');
    };
    InvalidTool.prototype.render = function () {
        console.warn('got InvalidTool');
    };
    return InvalidTool;
}());
exports.InvalidTool = InvalidTool;
//# sourceMappingURL=InvalidTool.js.map