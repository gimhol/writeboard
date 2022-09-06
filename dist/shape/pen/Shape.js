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
exports.ShapePen = void 0;
var ShapeEnum_1 = require("../ShapeEnum");
var FactoryMgr_1 = require("../../mgr/FactoryMgr");
var base_1 = require("../base");
var Data_1 = require("./Data");
var ShapePen = /** @class */ (function (_super) {
    __extends(ShapePen, _super);
    function ShapePen(v) {
        var _this = _super.call(this, v) || this;
        _this._lineFactor = 0.5;
        _this._smoothFactor = 0.5;
        _this._srcGeo = null;
        _this._path2D = new Path2D();
        var x, y;
        for (var i = 0; i < v.coords.length; i += 2) {
            x = v.coords[i];
            y = v.coords[i + 1];
            _this.updateSrcGeo(x, y);
            if (i === 0)
                _this.updatePath(x, y, 'first');
            else if (i >= v.coords.length - 2)
                _this.updatePath(x, y, 'last');
            else
                _this.updatePath(x, y);
        }
        return _this;
    }
    ShapePen.prototype.merge = function (data) {
        this.markDirty();
        var startIdx = this.data.coords.length;
        this.data.merge(data);
        var endIdx = this.data.coords.length - 1;
        if (startIdx !== endIdx) {
            var x = void 0, y = void 0;
            for (var i = startIdx; i <= endIdx; i += 2) {
                x = this.data.coords[i];
                y = this.data.coords[i + 1];
                this.updateSrcGeo(x, y);
                if (i === 0)
                    this.updatePath(x, y, 'first');
                else if (!this.data.editing && i === endIdx)
                    this.updatePath(x, y, 'last');
                else
                    this.updatePath(x, y);
            }
        }
        this.data.dotsType = Data_1.DotsType.All;
        this.markDirty();
    };
    /**
     * 根据新加入的点，计算原始矩形
     * @param dot
     */
    ShapePen.prototype.updateSrcGeo = function (x, y) {
        if (this._srcGeo) {
            var left = Math.min(this._srcGeo.x, x);
            var top_1 = Math.min(this._srcGeo.y, y);
            var w = Math.max(this._srcGeo.x + this._srcGeo.w, x) - left;
            var h = Math.max(this._srcGeo.y + this._srcGeo.h, y) - top_1;
            if (w !== w)
                w = 0; // NaN check
            if (h !== h)
                h = 0; // NaN check
            this._srcGeo = { x: left, y: top_1, w: w, h: h };
        }
        else {
            this._srcGeo = {
                x: x,
                y: y,
                w: 0,
                h: 0
            };
        }
        return this._srcGeo;
    };
    ShapePen.prototype.updatePath = function (x, y, type) {
        if (this.prev_dot === undefined) {
            this.prev_dot = { x: x, y: y };
            this._path2D.moveTo(x, y);
        }
        if (type === 'first')
            return;
        var _a = this.prev_dot, prev_x = _a.x, prev_y = _a.y;
        if (this.prev_t === undefined) {
            this.prev_t = {
                x: x - (x - prev_x) * this._lineFactor,
                y: y - (y - prev_y) * this._lineFactor
            };
            this._path2D.lineTo(this.prev_t.x, this.prev_t.y);
        }
        var _b = this.prev_t, prev_t_x = _b.x, prev_t_y = _b.y;
        var t_x_0 = prev_x + (x - prev_x) * this._lineFactor;
        var t_y_0 = prev_y + (y - prev_y) * this._lineFactor;
        var t_x_1 = x - (x - prev_x) * this._lineFactor;
        var t_y_1 = y - (y - prev_y) * this._lineFactor;
        var c_x_0 = prev_t_x + (prev_x - prev_t_x) * this._smoothFactor; // 第一控制点x坐标
        var c_y_0 = prev_t_y + (prev_y - prev_t_y) * this._smoothFactor; // 第一控制点y坐标
        var c_x_1 = prev_x + (t_x_0 - prev_x) * (1 - this._smoothFactor); // 第二控制点x坐标
        var c_y_1 = prev_y + (t_y_0 - prev_y) * (1 - this._smoothFactor); // 第二控制点y坐标
        this._path2D.bezierCurveTo(c_x_0, c_y_0, c_x_1, c_y_1, t_x_0, t_y_0);
        if (type === 'last') {
            delete this.prev_t;
            delete this.prev_dot;
            this._path2D.lineTo(x, y);
        }
        else {
            this.prev_t = { x: t_x_1, y: t_y_1 };
            this.prev_dot = { x: x, y: y };
        }
    };
    ShapePen.prototype.appendDot = function (dot, type) {
        var coords = this.data.coords;
        var prevY = coords[coords.length - 1];
        var prevX = coords[coords.length - 2];
        if (prevY === dot.y && prevX === dot.x && type !== 'last')
            return;
        this.data.coords.push(dot.x, dot.y);
        var geo = this.updateSrcGeo(dot.x, dot.y);
        this.updatePath(dot.x, dot.y, type);
        this.geo(geo.x, geo.y, geo.w, geo.h);
        this.markDirty();
    };
    ShapePen.prototype.render = function (ctx) {
        if (!this.visible)
            return;
        var d = this.data;
        if (d.lineWidth && d.strokeStyle && this._srcGeo) {
            ctx.save();
            ctx.translate(this.data.x - this._srcGeo.x, this.data.y - this._srcGeo.y);
            ctx.lineCap = d.lineCap;
            ctx.lineDashOffset = d.lineDashOffset || 0;
            ctx.lineJoin = d.lineJoin;
            ctx.lineWidth = d.lineWidth || 0;
            ctx.miterLimit = d.miterLimit || 0;
            ctx.strokeStyle = d.strokeStyle;
            ctx.setLineDash(d.lineDash);
            ctx.stroke(this._path2D);
            ctx.restore();
        }
        _super.prototype.render.call(this, ctx);
    };
    return ShapePen;
}(base_1.Shape));
exports.ShapePen = ShapePen;
FactoryMgr_1.FactoryMgr.registerShape(ShapeEnum_1.ShapeEnum.Pen, function () { return new Data_1.PenData; }, function (d) { return new ShapePen(d); });
//# sourceMappingURL=Shape.js.map