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
exports.OvalData = void 0;
var ShapeEnum_1 = require("../ShapeEnum");
var base_1 = require("../base");
var OvalData = /** @class */ (function (_super) {
    __extends(OvalData, _super);
    function OvalData() {
        var _this = _super.call(this) || this;
        _this.type = ShapeEnum_1.ShapeEnum.Oval;
        _this.fillStyle = '#0000ff';
        _this.strokeStyle = '#000000';
        _this.lineWidth = 2;
        return _this;
    }
    OvalData.prototype.copy = function () {
        return new OvalData().copyFrom(this);
    };
    return OvalData;
}(base_1.ShapeData));
exports.OvalData = OvalData;
//# sourceMappingURL=Data.js.map