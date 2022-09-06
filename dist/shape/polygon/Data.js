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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PolygonData = void 0;
var ShapeEnum_1 = require("../ShapeEnum");
var base_1 = require("../base");
var PolygonData = /** @class */ (function (_super) {
    __extends(PolygonData, _super);
    function PolygonData() {
        var _this = _super.call(this) || this;
        _this.dots = [];
        _this.type = ShapeEnum_1.ShapeEnum.Polygon;
        _this.fillStyle = '#ff0000';
        _this.strokeStyle = '#000000';
        _this.lineWidth = 2;
        return _this;
    }
    PolygonData.prototype.copyFrom = function (other) {
        _super.prototype.copyFrom.call(this, other);
        if ('dots' in other)
            this.dots = other.dots.map(function (v) { return (__assign({}, v)); });
        return this;
    };
    PolygonData.prototype.copy = function () {
        return new PolygonData().copyFrom(this);
    };
    return PolygonData;
}(base_1.ShapeData));
exports.PolygonData = PolygonData;
//# sourceMappingURL=Data.js.map