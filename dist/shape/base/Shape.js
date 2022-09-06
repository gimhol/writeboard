"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shape = void 0;
var Rect_1 = require("../../utils/Rect");
var Shape = /** @class */ (function () {
    function Shape(data) {
        this._data = data;
    }
    Object.defineProperty(Shape.prototype, "data", {
        get: function () { return this._data; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "type", {
        get: function () { return this._data.type; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "board", {
        get: function () { return this._board; },
        set: function (v) { this._board = v; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "visible", {
        get: function () {
            return !!this._data.visible;
        },
        set: function (v) {
            if (!!this._data.visible === v)
                return;
            this._data.visible = v;
            this.markDirty();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "editing", {
        get: function () { return !!this._data.editing; },
        set: function (v) {
            if (!!this._data.editing === v)
                return;
            this._data.editing = v;
            this.markDirty();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Shape.prototype, "selected", {
        get: function () { return !!this._data.selected; },
        set: function (v) {
            if (!!this._data.selected === v)
                return;
            this._data.selected = v;
            this.markDirty();
        },
        enumerable: false,
        configurable: true
    });
    Shape.prototype.merge = function (data) {
        this.markDirty();
        this.data.merge(data);
        this.markDirty();
    };
    Shape.prototype.markDirty = function (rect) {
        var _a;
        if (rect === void 0) { rect = this.boundingRect(); }
        (_a = this.board) === null || _a === void 0 ? void 0 : _a.markDirty(rect);
    };
    Shape.prototype.move = function (x, y) {
        if (x === this._data.x && y === this._data.y)
            return;
        this.markDirty();
        this._data.x = x;
        this._data.y = y;
        this.markDirty();
    };
    Shape.prototype.resize = function (w, h) {
        if (w === this._data.w && h === this._data.h)
            return;
        this.markDirty();
        this._data.w = w;
        this._data.h = h;
        this.markDirty();
    };
    Shape.prototype.getGeo = function () {
        return new Rect_1.Rect(this._data.x, this._data.y, this._data.w, this._data.h);
    };
    Shape.prototype.geo = function (x, y, w, h) {
        if (x === this._data.x &&
            y === this._data.y &&
            w === this._data.w &&
            h === this._data.h)
            return;
        this.markDirty();
        this._data.x = x;
        this._data.y = y;
        this._data.w = w;
        this._data.h = h;
        this.markDirty();
    };
    Shape.prototype.moveBy = function (x, y) {
        this.markDirty();
        this._data.x += x;
        this._data.y += y;
        this.markDirty();
    };
    Shape.prototype.resizeBy = function (w, h) {
        this.markDirty();
        this._data.w += w;
        this._data.h += h;
        this.markDirty();
    };
    Shape.prototype.geoBy = function (x, y, w, h) {
        this.markDirty();
        this._data.x += x;
        this._data.y += y;
        this._data.w += w;
        this._data.h += h;
        this.markDirty();
    };
    Shape.prototype.render = function (ctx) {
        if (!this.visible)
            return;
        if (this.selected) {
            // 虚线其实相当损耗性能
            var lineWidth = 1;
            var halfLineW = lineWidth / 2;
            ctx.lineWidth = lineWidth;
            var _a = this.boundingRect(), x = _a.x, y = _a.y, w = _a.w, h = _a.h;
            ctx.beginPath();
            ctx.rect(x + halfLineW, y + halfLineW, w - lineWidth, h - lineWidth);
            ctx.closePath();
            ctx.strokeStyle = 'white';
            ctx.setLineDash([]);
            ctx.stroke();
            ctx.strokeStyle = 'black';
            ctx.setLineDash([lineWidth * 4]);
            ctx.stroke();
        }
    };
    Shape.prototype.drawingRect = function () {
        var d = this._data;
        var drawOffset = (d.lineWidth % 2) ? 0.5 : 0;
        return {
            x: Math.floor(d.x) + drawOffset,
            y: Math.floor(d.y) + drawOffset,
            w: Math.floor(d.w),
            h: Math.floor(d.h)
        };
    };
    Shape.prototype.boundingRect = function () {
        var d = this.data;
        var offset = (d.lineWidth % 2) ? 1 : 0;
        return {
            x: Math.floor(d.x - d.lineWidth / 2),
            y: Math.floor(d.y - d.lineWidth / 2),
            w: Math.ceil(d.w + d.lineWidth + offset),
            h: Math.ceil(d.h + d.lineWidth + offset)
        };
    };
    return Shape;
}());
exports.Shape = Shape;
//# sourceMappingURL=Shape.js.map