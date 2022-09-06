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
exports.ShapeNeedPath = void 0;
var Shape_1 = require("./Shape");
var ShapeNeedPath = /** @class */ (function (_super) {
    __extends(ShapeNeedPath, _super);
    function ShapeNeedPath() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ShapeNeedPath.prototype.path = function (ctx) {
        throw new Error("Method 'path' not implemented.");
    };
    ShapeNeedPath.prototype.render = function (ctx) {
        if (!this.visible)
            return;
        var d = this.data;
        if (d.fillStyle || (d.lineWidth && d.strokeStyle))
            this.path(ctx);
        if (d.fillStyle) {
            ctx.fillStyle = d.fillStyle;
            ctx.fill();
        }
        if (d.lineWidth && d.strokeStyle) {
            ctx.lineCap = d.lineCap;
            ctx.lineDashOffset = d.lineDashOffset;
            ctx.lineJoin = d.lineJoin;
            ctx.lineWidth = d.lineWidth;
            ctx.miterLimit = d.miterLimit;
            ctx.strokeStyle = d.strokeStyle;
            ctx.setLineDash(d.lineDash);
            ctx.stroke();
        }
        _super.prototype.render.call(this, ctx);
    };
    return ShapeNeedPath;
}(Shape_1.Shape));
exports.ShapeNeedPath = ShapeNeedPath;
//# sourceMappingURL=ShapeNeedPath.js.map