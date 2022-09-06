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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PenData = exports.DotsType = void 0;
var ShapeEnum_1 = require("../ShapeEnum");
var base_1 = require("../base");
var DotsType;
(function (DotsType) {
    DotsType[DotsType["Invalid"] = 0] = "Invalid";
    DotsType[DotsType["All"] = 1] = "All";
    DotsType[DotsType["Append"] = 2] = "Append";
})(DotsType = exports.DotsType || (exports.DotsType = {}));
var PenData = /** @class */ (function (_super) {
    __extends(PenData, _super);
    function PenData() {
        var _this = _super.call(this) || this;
        _this.dotsType = DotsType.All;
        _this.coords = [];
        _this.type = ShapeEnum_1.ShapeEnum.Pen;
        _this.strokeStyle = 'white';
        _this.lineCap = 'round';
        _this.lineJoin = 'round';
        _this.lineWidth = 3;
        return _this;
    }
    PenData.prototype.copyFrom = function (other) {
        _super.prototype.copyFrom.call(this, other);
        if (other.dotsType)
            this.dotsType = other.dotsType;
        if (Array.isArray(other.coords))
            this.coords = __spreadArray([], other.coords, true);
        return this;
    };
    PenData.prototype.merge = function (other) {
        var _a;
        _super.prototype.copyFrom.call(this, other);
        if (Array.isArray(other.coords)) {
            if (other.dotsType === DotsType.Append)
                (_a = this.coords).push.apply(_a, other.coords);
            else
                this.coords = __spreadArray([], other.coords, true);
        }
        return this;
    };
    PenData.prototype.copy = function () {
        return new PenData().copyFrom(this);
    };
    return PenData;
}(base_1.ShapeData));
exports.PenData = PenData;
//# sourceMappingURL=Data.js.map