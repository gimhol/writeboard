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
exports.TextData = void 0;
var ShapeEnum_1 = require("../ShapeEnum");
var base_1 = require("../base");
var TextData = /** @class */ (function (_super) {
    __extends(TextData, _super);
    function TextData() {
        var _this = _super.call(this) || this;
        _this.text = '';
        _this.font = '24px Simsum';
        _this.t_l = 3;
        _this.t_r = 3;
        _this.t_t = 3;
        _this.t_b = 3;
        _this.type = ShapeEnum_1.ShapeEnum.Text;
        _this.fillStyle = 'white';
        _this.strokeStyle = '';
        _this.lineWidth = 0;
        return _this;
    }
    TextData.prototype.copyFrom = function (other) {
        _super.prototype.copyFrom.call(this, other);
        if (typeof other.text === 'string')
            this.text = other.text;
        if (typeof other.font === 'string')
            this.font = other.font;
        if (typeof other.t_l === 'number')
            this.t_l = other.t_l;
        if (typeof other.t_r === 'number')
            this.t_r = other.t_r;
        if (typeof other.t_t === 'number')
            this.t_t = other.t_t;
        if (typeof other.t_b === 'number')
            this.t_b = other.t_b;
        return this;
    };
    TextData.prototype.copy = function () {
        return new TextData().copyFrom(this);
    };
    return TextData;
}(base_1.ShapeData));
exports.TextData = TextData;
//# sourceMappingURL=Data.js.map