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
exports.RectData = void 0;
var ShapeEnum_1 = require("../ShapeEnum");
var base_1 = require("../base");
var RectData = /** @class */ (function (_super) {
    __extends(RectData, _super);
    function RectData() {
        var _this = _super.call(this) || this;
        _this.type = ShapeEnum_1.ShapeEnum.Rect;
        _this.fillStyle = '#ff0000';
        _this.strokeStyle = '#000000';
        _this.lineWidth = 2;
        return _this;
    }
    RectData.prototype.copy = function () {
        return new RectData().copyFrom(this);
    };
    return RectData;
}(base_1.ShapeData));
exports.RectData = RectData;
//# sourceMappingURL=Data.js.map