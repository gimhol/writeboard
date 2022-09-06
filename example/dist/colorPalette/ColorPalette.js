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
exports.ColorPalette = void 0;
var Rect_1 = require("../../../dist/utils/Rect");
var Vector_1 = require("../../../dist/utils/Vector");
var Color_1 = require("./Color");
var Base = /** @class */ (function () {
    function Base(onscreen, offscreen, rect) {
        var _this = this;
        this._pos = new Vector_1.Vector(0, 0);
        this._requested = false;
        if (rect)
            this._rect = Rect_1.Rect.create(rect);
        else
            this._rect = new Rect_1.Rect(0, 0, onscreen.width, onscreen.height);
        this._offscreen = offscreen;
        this._onscreen = onscreen;
        onscreen.addEventListener('pointerdown', function (e) { return _this.pointerstart(e); });
        document.addEventListener('pointermove', function (e) { return _this.pointermove(e); });
        document.addEventListener('pointerup', function (e) { return _this.pointerend(e); });
        document.addEventListener('pointercancel', function (e) { return _this.pointerend(e); });
        setTimeout(function () { return _this.update(); }, 1);
    }
    Base.prototype.pointerstart = function (e) {
        if (!this.pressOnMe(e) || this._pointerId)
            return;
        this._pointerId = e.pointerId;
        this.updatePos(e);
        this.update();
    };
    Base.prototype.pointermove = function (e) {
        if (e.pointerId !== this._pointerId)
            return;
        this.updatePos(e);
        this.update();
    };
    Base.prototype.pointerend = function (e) {
        if (e.pointerId !== this._pointerId)
            return;
        delete this._pointerId;
        this.updatePos(e);
        this.update();
    };
    Base.prototype.pressOnMe = function (e) {
        if (e.pointerType === 'mouse' && e.button !== 0)
            return false;
        var _a = this.pos(e), x = _a.x, y = _a.y;
        return x < this._rect.w && y < this._rect.h && x >= 0 && y >= 0;
    };
    Base.prototype.pos = function (e) {
        var _a = this._onscreen.getBoundingClientRect(), left = _a.left, top = _a.top, width = _a.width, height = _a.height;
        var _b = this._rect, x = _b.x, y = _b.y, w = _b.w, h = _b.h;
        return new Vector_1.Vector((e.clientX - left) * this._onscreen.width / width - x, (e.clientY - top) * this._onscreen.height / height - y);
    };
    Base.prototype.clampPos = function (e) {
        var pos = this.pos(e);
        pos.x = (0, Color_1.clampI)(0, this._rect.w, pos.x);
        pos.y = (0, Color_1.clampI)(0, this._rect.h, pos.y);
        return pos;
    };
    Base.prototype.updatePos = function (e) {
        this._pos = this.clampPos(e);
        this.update();
    };
    Base.prototype.update = function () {
        var _this = this;
        if (this._requested)
            return;
        this._requested = true;
        requestAnimationFrame(function () {
            _this.drawOffscreen();
            var onscreen = _this._onscreen.getContext('2d');
            onscreen.clearRect(_this._rect.x, _this._rect.y, _this._rect.w, _this._rect.h);
            onscreen.drawImage(_this._offscreen, _this._rect.x, _this._rect.y, _this._rect.w, _this._rect.h, _this._rect.x, _this._rect.y, _this._rect.w, _this._rect.h);
            _this._requested = false;
        });
    };
    Base.prototype.drawOffscreen = function () { };
    return Base;
}());
var ColorCol = /** @class */ (function (_super) {
    __extends(ColorCol, _super);
    function ColorCol() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.__colors = [
            new Color_1.RGB(255, 0, 0),
            new Color_1.RGB(255, 255, 0),
            new Color_1.RGB(0, 255, 0),
            new Color_1.RGB(0, 255, 255),
            new Color_1.RGB(0, 0, 255),
            new Color_1.RGB(255, 0, 255),
            new Color_1.RGB(255, 0, 0)
        ];
        _this._current = 0;
        return _this;
    }
    ColorCol.prototype.onChanged = function (cb) {
        this._onChanged = cb;
    };
    ColorCol.prototype.update = function () {
        _super.prototype.update.call(this);
        var y = this._pos.y;
        var hues = (0, Color_1.clampF)(0, 360, (y / this._rect.h) * 360);
        if (this._current === hues)
            return;
        this._current = hues;
        this._onChanged && this._onChanged(hues);
    };
    ColorCol.prototype.drawOffscreen = function () {
        var ctx = this._offscreen.getContext('2d');
        ctx.clearRect(this._rect.x, this._rect.y, this._rect.w, this._rect.h);
        ctx.fillStyle = 'white';
        ctx.fillRect(this._rect.x + 1, this._rect.y + 1, this._rect.w - 2, this._rect.h - 2);
        var dd = 8;
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = 'lightgray';
        for (var yy = this._rect.y; yy < this._rect.bottom; yy += dd) {
            for (var xx = this._rect.x; xx < this._rect.right; xx += dd) {
                ctx.fillRect(xx, yy, dd / 2, dd / 2);
                ctx.fillRect(xx + dd / 2, yy + dd / 2, dd / 2, dd / 2);
            }
        }
        ctx.globalCompositeOperation = 'source-over';
        var grd = ctx.createLinearGradient(this._rect.x, this._rect.y, this._rect.x, this._rect.y + this._rect.h);
        var length = this.__colors.length;
        for (var i = 0; i < length; ++i) {
            var step = i / (length - 1);
            var color = this.__colors[i].toString();
            grd.addColorStop(step, color);
        }
        ctx.fillStyle = grd;
        ctx.fillRect(this._rect.x + 1, this._rect.y + 1, this._rect.w - 2, this._rect.h - 2);
        var y = this._pos.y;
        var indicatorSize = 4;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(Math.floor(this._rect.x) + 1, Math.floor(y - indicatorSize / 2) - 0.5, Math.floor(this._rect.w) - 2, indicatorSize);
        ctx.stroke();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(Math.floor(this._rect.x) + 1, Math.floor(y - indicatorSize / 2) - 0.5, Math.floor(this._rect.w) - 2, indicatorSize);
        ctx.stroke();
    };
    return ColorCol;
}(Base));
var AlphaRow = /** @class */ (function (_super) {
    __extends(AlphaRow, _super);
    function AlphaRow() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._base = new Color_1.RGB(255, 0, 0);
        _this._current = _this._base.toRGBA(255);
        return _this;
    }
    AlphaRow.prototype.onChanged = function (cb) {
        this._onChanged = cb;
    };
    AlphaRow.prototype.setColor = function (color) {
        this._base = color.copy();
        this.update();
    };
    AlphaRow.prototype.update = function () {
        _super.prototype.update.call(this);
        var x = this._pos.x;
        var rgba = this._base.toRGBA(255);
        rgba.a = (0, Color_1.clampI)(0, 255, 255 * (1 - x / this._rect.w));
        if (this._current.equal(rgba))
            return;
        this._current = rgba;
        this._onChanged && this._onChanged(rgba);
    };
    AlphaRow.prototype.drawOffscreen = function () {
        var ctx = this._offscreen.getContext('2d');
        ctx.clearRect(this._rect.x, this._rect.y, this._rect.w, this._rect.h);
        ctx.fillStyle = 'white';
        ctx.fillRect(this._rect.x + 1, this._rect.y + 1, this._rect.w - 2, this._rect.h - 2);
        var dd = 8;
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = 'lightgray';
        for (var yy = this._rect.y; yy < this._rect.bottom; yy += dd) {
            for (var xx = this._rect.x; xx < this._rect.right; xx += dd) {
                ctx.fillRect(xx, yy, dd / 2, dd / 2);
                ctx.fillRect(xx + dd / 2, yy + dd / 2, dd / 2, dd / 2);
            }
        }
        ctx.globalCompositeOperation = 'source-over';
        var g0 = ctx.createLinearGradient(this._rect.x, this._rect.y, this._rect.x + this._rect.w, this._rect.y);
        g0.addColorStop(0, '' + this._base);
        g0.addColorStop(1, '' + this._base.toRGBA(0));
        ctx.fillStyle = g0;
        ctx.fillRect(this._rect.x + 1, this._rect.y + 1, this._rect.w - 2, this._rect.h - 2);
        var x = this._pos.x;
        var indicatorSize = 4;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(Math.floor(x - indicatorSize / 2) - 0.5, Math.floor(this._rect.y) + 1, indicatorSize, Math.floor(this._rect.h) - 2);
        ctx.stroke();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(Math.floor(x - indicatorSize / 2) - 0.5, Math.floor(this._rect.y) + 1, indicatorSize, Math.floor(this._rect.h) - 2);
        ctx.stroke();
    };
    return AlphaRow;
}(Base));
var HBZone = /** @class */ (function (_super) {
    __extends(HBZone, _super);
    function HBZone() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._hues = 0;
        _this._current = new Color_1.HSB(_this._hues, 1, 1).toRGB();
        return _this;
    }
    HBZone.prototype.onChanged = function (cb) {
        this._onChanged = cb;
    };
    HBZone.prototype.setHues = function (hues) {
        this._hues = (0, Color_1.clampI)(0, 359, hues);
        this.update();
    };
    HBZone.prototype.update = function () {
        _super.prototype.update.call(this);
        var _a = this._pos, x = _a.x, y = _a.y;
        var hsb = new Color_1.HSB(this._hues, 1, 1);
        hsb.s = (0, Color_1.clampF)(0, 1, 1 - x / this._rect.w);
        hsb.b = (0, Color_1.clampF)(0, 1, 1 - y / this._rect.h);
        var rgb = hsb.toRGB();
        if (this._current.equal(rgb))
            return;
        this._current = rgb;
        this._onChanged && this._onChanged(rgb);
    };
    HBZone.prototype.drawOffscreen = function () {
        var ctx = this._offscreen.getContext('2d');
        ctx.clearRect(this._rect.x, this._rect.y, this._rect.w, this._rect.h);
        var g0 = ctx.createLinearGradient(this._rect.x, this._rect.y, this._rect.x + this._rect.w, this._rect.y);
        g0.addColorStop(0, '' + new Color_1.HSB(this._hues, 1, 1).toRGB());
        g0.addColorStop(1, 'white');
        ctx.fillStyle = g0;
        ctx.fillRect(this._rect.x + 1, this._rect.y + 1, this._rect.w - 2, this._rect.h - 2);
        var g1 = ctx.createLinearGradient(this._rect.x, this._rect.y, this._rect.x, this._rect.y + this._rect.h);
        g1.addColorStop(0, 'transparent');
        g1.addColorStop(1, 'black');
        ctx.fillStyle = g1;
        ctx.fillRect(this._rect.x + 1, this._rect.y + 1, this._rect.w - 2, this._rect.h - 2);
        var _a = this._pos, x = _a.x, y = _a.y;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(Math.floor(x) - 0.5, Math.floor(y) - 0.5, 4, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(Math.floor(x) - 0.5, Math.floor(y) - 0.5, 4, 0, 2 * Math.PI);
        ctx.stroke();
    };
    return HBZone;
}(Base));
var FinalZone = /** @class */ (function (_super) {
    __extends(FinalZone, _super);
    function FinalZone() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this._curr = Color_1.RGBA.BlackT.copy();
        _this._prev = Color_1.RGBA.BlackT.copy();
        return _this;
    }
    FinalZone.prototype.setCurr = function (color) {
        this._curr = color.copy();
        this.update();
    };
    FinalZone.prototype.setPrev = function (color) {
        if (color === void 0) { color = this._curr; }
        this._prev = color.copy();
        this.update();
    };
    FinalZone.prototype.drawOffscreen = function () {
        var ctx = this._offscreen.getContext('2d');
        ctx.clearRect(this._rect.x, this._rect.y, this._rect.w, this._rect.h);
        ctx.fillStyle = 'white';
        ctx.fillRect(this._rect.x + 1, this._rect.y + 1, this._rect.w - 2, this._rect.h - 2);
        var dd = 8;
        ctx.globalCompositeOperation = 'source-atop';
        ctx.fillStyle = 'lightgray';
        for (var yy = this._rect.y; yy < this._rect.bottom; yy += dd) {
            for (var xx = this._rect.x; xx < this._rect.right; xx += dd) {
                ctx.fillRect(xx, yy, dd / 2, dd / 2);
                ctx.fillRect(xx + dd / 2, yy + dd / 2, dd / 2, dd / 2);
            }
        }
        ctx.globalCompositeOperation = 'source-over';
        {
            ctx.fillStyle = '' + this._curr;
            var x = Math.floor(this._rect.x + 1);
            var y = Math.floor(this._rect.y + 1);
            var w = Math.floor((this._rect.w - 2) / 2);
            var h = Math.floor(this._rect.h - 2);
            ctx.fillRect(x, y, w, h);
            x += w;
            ctx.fillStyle = '' + this._prev;
            ctx.fillRect(x, y, w, h);
        }
    };
    return FinalZone;
}(Base));
var ColorPalette = /** @class */ (function () {
    function ColorPalette(onscreen) {
        var _this = this;
        var offscreen = document.createElement('canvas');
        offscreen.width = onscreen.width;
        offscreen.height = onscreen.height;
        var w = onscreen.width, h = onscreen.height;
        var rowH = 16;
        var colW = 16;
        this._colorCol = new ColorCol(onscreen, offscreen, new Rect_1.Rect(w - colW, 0, colW, h - rowH));
        this._hbZone = new HBZone(onscreen, offscreen, new Rect_1.Rect(0, 0, w - colW, h - rowH));
        this._alphaRow = new AlphaRow(onscreen, offscreen, new Rect_1.Rect(0, h - rowH, w - colW, rowH));
        this._finalZone = new FinalZone(onscreen, offscreen, new Rect_1.Rect(w - colW, h - rowH, colW, rowH));
        this._colorCol.onChanged(function (v) { return _this._hbZone.setHues(v); });
        this._hbZone.onChanged(function (v) { return _this._alphaRow.setColor(v); });
        this._alphaRow.onChanged(function (v) {
            _this._onChanged && _this._onChanged(v);
            _this._finalZone.setCurr(v);
        });
        this._hbZone.setHues(0);
        document.addEventListener('pointerup', function (_) { return _this._finalZone.setPrev(); });
        document.addEventListener('pointercancel', function (_) { return _this._finalZone.setPrev(); });
    }
    return ColorPalette;
}());
exports.ColorPalette = ColorPalette;
//# sourceMappingURL=ColorPalette.js.map