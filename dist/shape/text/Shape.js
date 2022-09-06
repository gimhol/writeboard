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
exports.ShapeText = void 0;
var ShapeEnum_1 = require("../ShapeEnum");
var FactoryMgr_1 = require("../../mgr/FactoryMgr");
var Data_1 = require("./Data");
var base_1 = require("../base");
var Rect_1 = require("../../utils/Rect");
var TextSelection_1 = require("./TextSelection");
var measurer = document.createElement('canvas').getContext('2d');
var ShapeText = /** @class */ (function (_super) {
    __extends(ShapeText, _super);
    function ShapeText(data) {
        var _this = _super.call(this, data) || this;
        _this._selection = new TextSelection_1.TextSelection;
        _this._lines = [];
        _this._selectionRects = [];
        _this._cursorVisible = false;
        _this._calculateLines();
        _this._calculateSectionRects();
        return _this;
    }
    Object.defineProperty(ShapeText.prototype, "text", {
        get: function () { return this.data.text; },
        set: function (v) { this.setText(v); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapeText.prototype, "selection", {
        get: function () { return this._selection; },
        set: function (v) { this.setSelection(v); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapeText.prototype, "selectionRects", {
        get: function () { return this._selectionRects; },
        enumerable: false,
        configurable: true
    });
    ShapeText.prototype.merge = function (data) {
        this.data.merge(data);
        this._calculateLines();
        this._calculateSectionRects();
        this.markDirty();
    };
    ShapeText.prototype._setCursorVisible = function (v) {
        if (v === void 0) { v = !this._cursorVisible; }
        this._cursorVisible = v;
        this.markDirty();
    };
    ShapeText.prototype._setCursorFlashing = function (v) {
        var _this = this;
        if (v)
            this._cursorVisible = true;
        if (v === !!this._cursorFlashingTimer)
            return;
        clearInterval(this._cursorFlashingTimer);
        delete this._cursorFlashingTimer;
        if (v) {
            this._cursorFlashingTimer = setInterval(function () { return _this._setCursorVisible(); }, 500);
        }
        else {
            this._setCursorVisible(true);
        }
    };
    ShapeText.prototype._applyStyle = function (ctx) {
        if (!ctx)
            return;
        ctx.font = this.data.font;
        ctx.fillStyle = this.data.fillStyle;
        ctx.strokeStyle = this.data.strokeStyle;
        ctx.lineWidth = this.data.lineWidth;
        ctx.setLineDash([]);
    };
    ShapeText.prototype.setText = function (v, dirty) {
        if (dirty === void 0) { dirty = true; }
        if (this.data.text === v)
            return;
        this.data.text = v;
        this._calculateLines();
        dirty && this.markDirty();
    };
    ShapeText.prototype.setSelection = function (v, dirty) {
        if (v === void 0) { v = { start: -1, end: -1 }; }
        if (dirty === void 0) { dirty = true; }
        if (this._selection.equal(v))
            return;
        this._selection.start = v.start;
        this._selection.end = v.end;
        this._setCursorFlashing(v.start === v.end && v.start >= 0);
        this._calculateSectionRects();
        dirty && this.markDirty();
    };
    ShapeText.prototype._calculateLines = function () {
        var _this = this;
        this._applyStyle(measurer);
        var totalH = this.data.t_t;
        var totalW = 0;
        var text = this.text;
        this._lines = text.split('\n').map(function (v) {
            var str = v + '\n';
            var tm = measurer.measureText(str);
            var y = totalH;
            var bl = y + tm.fontBoundingBoxAscent;
            totalW = Math.max(tm.width, totalW);
            totalH += tm.fontBoundingBoxAscent + tm.fontBoundingBoxDescent;
            return __assign({ str: str, x: _this.data.t_l, y: y, bl: bl }, tm);
        });
        totalH += this.data.t_b;
        totalW += this.data.t_r + this.data.t_l;
        this.resize(totalW, totalH);
    };
    ShapeText.prototype._calculateSectionRects = function () {
        this._applyStyle(measurer);
        var selection = this._selection;
        var lineStart = 0;
        var lineEnd = 0;
        this._selectionRects = [];
        for (var i = 0; i < this._lines.length; ++i) {
            var _a = this._lines[i], str = _a.str, y = _a.y, x = _a.x;
            lineEnd += str.length;
            if (lineEnd <= selection.start) {
                lineStart = lineEnd;
                continue;
            }
            if (lineStart > selection.end)
                break;
            var pre = str.substring(0, selection.start - lineStart);
            var mid = str.substring(selection.start - lineStart, selection.end - lineStart);
            var tm0 = measurer.measureText(pre);
            var tm1 = measurer.measureText(mid);
            var left = x + tm0.width;
            var top_1 = y;
            var height = tm1.fontBoundingBoxAscent + tm1.fontBoundingBoxDescent;
            this._selectionRects.push(new Rect_1.Rect(left, top_1, Math.max(2, tm1.width), height));
            lineStart = lineEnd;
        }
    };
    ShapeText.prototype.render = function (ctx) {
        if (!this.visible)
            return;
        var needStroke = this.data.strokeStyle && this.data.lineWidth;
        var needFill = this.data.fillStyle;
        if (this.editing) {
            var _a = this.boundingRect(), x = _a.x, y = _a.y, w = _a.w, h = _a.h;
            var lineWidth = 1;
            var halfLineW = lineWidth / 2;
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = this.data.fillStyle || 'white';
            ctx.setLineDash([]);
            ctx.strokeRect(x + halfLineW, y + halfLineW, w - lineWidth, h - lineWidth);
        }
        if (needStroke || needFill) {
            var _b = this.data, x = _b.x, y = _b.y;
            this._applyStyle(ctx);
            for (var i = 0; i < this._lines.length; ++i) {
                var line = this._lines[i];
                needFill && ctx.fillText(line.str, x + line.x, y + line.bl);
                needStroke && ctx.strokeText(line.str, x + line.x, y + line.bl);
            }
            if (this._cursorVisible && this.editing) {
                ctx.globalCompositeOperation = 'xor';
                for (var i = 0; i < this._selectionRects.length; ++i) {
                    var rect = this._selectionRects[i];
                    ctx.fillRect(x + rect.x, y + rect.y, rect.w, rect.h);
                }
                ctx.globalCompositeOperation = 'source-over';
            }
        }
        return _super.prototype.render.call(this, ctx);
    };
    return ShapeText;
}(base_1.Shape));
exports.ShapeText = ShapeText;
FactoryMgr_1.FactoryMgr.registerShape(ShapeEnum_1.ShapeEnum.Text, function () { return new Data_1.TextData; }, function (d) { return new ShapeText(d); });
//# sourceMappingURL=Shape.js.map