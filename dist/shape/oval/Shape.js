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
exports.ShapeOval = void 0;
var ShapeEnum_1 = require("../ShapeEnum");
var FactoryMgr_1 = require("../../mgr/FactoryMgr");
var Data_1 = require("./Data");
var ShapeNeedPath_1 = require("../base/ShapeNeedPath");
var ShapeOval = /** @class */ (function (_super) {
    __extends(ShapeOval, _super);
    function ShapeOval() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ShapeOval.prototype.path = function (ctx) {
        var d = this.data;
        var _a = this.drawingRect(), x = _a.x, y = _a.y, w = _a.w, h = _a.h;
        var drawOffset = (d.w % 2) ? 0.5 : 0;
        // 贝塞尔曲线拟合椭圆
        var kappa = 0.5522848;
        var ox = (w / 2) * kappa;
        var oy = (h / 2) * kappa;
        var xe = x + w;
        var ye = y + h;
        var xm = Math.floor(d.x + d.w / 2) + drawOffset;
        var ym = Math.floor(d.y + d.h / 2) + drawOffset;
        ctx.beginPath();
        ctx.moveTo(x, ym);
        ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
        ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
        ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
        ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
        ctx.closePath();
    };
    return ShapeOval;
}(ShapeNeedPath_1.ShapeNeedPath));
exports.ShapeOval = ShapeOval;
FactoryMgr_1.FactoryMgr.registerShape(ShapeEnum_1.ShapeEnum.Oval, function () { return new Data_1.OvalData; }, function (d) { return new ShapeOval(d); });
//# sourceMappingURL=Shape.js.map