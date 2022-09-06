"use strict";
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
exports.ShapeData = void 0;
var ShapeEnum_1 = require("../ShapeEnum");
var ShapeData = /** @class */ (function () {
    function ShapeData() {
        this.t = ShapeEnum_1.ShapeEnum.Invalid;
        this.i = '';
        this.x = 0;
        this.y = 0;
        this.w = -0;
        this.h = -0;
        this.z = -0;
        this.style = {};
        this.status = {};
    }
    Object.defineProperty(ShapeData.prototype, "type", {
        get: function () { return this.t; },
        set: function (v) { this.t = v; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapeData.prototype, "id", {
        get: function () { return this.i; },
        set: function (v) { this.i = v; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapeData.prototype, "fillStyle", {
        get: function () { var _a; return ((_a = this.style) === null || _a === void 0 ? void 0 : _a.b) || ''; },
        set: function (v) {
            if (!this.style)
                this.style = {};
            if (v)
                this.style.b = v;
            else
                delete this.style.b;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapeData.prototype, "strokeStyle", {
        get: function () { var _a; return ((_a = this.style) === null || _a === void 0 ? void 0 : _a.a) || ''; },
        set: function (v) {
            if (!this.style)
                this.style = {};
            if (v)
                this.style.a = v;
            else
                delete this.style.a;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapeData.prototype, "lineCap", {
        get: function () { var _a; return ((_a = this.style) === null || _a === void 0 ? void 0 : _a.c) || 'round'; },
        set: function (v) {
            if (!this.style)
                this.style = {};
            if (v)
                this.style.c = v;
            else
                delete this.style.c;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapeData.prototype, "lineDash", {
        get: function () { var _a; return ((_a = this.style) === null || _a === void 0 ? void 0 : _a.d) || []; },
        set: function (v) {
            if (!this.style)
                this.style = {};
            if (Array.isArray(v) && v.length > 0)
                this.style.d = __spreadArray([], v, true);
            else
                delete this.style.d;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapeData.prototype, "lineDashOffset", {
        get: function () { var _a; return ((_a = this.style) === null || _a === void 0 ? void 0 : _a.e) || 0; },
        set: function (v) {
            if (!this.style)
                this.style = {};
            if (v)
                this.style.e = v;
            else
                delete this.style.e;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapeData.prototype, "lineJoin", {
        get: function () { var _a; return ((_a = this.style) === null || _a === void 0 ? void 0 : _a.f) || 'round'; },
        set: function (v) {
            if (!this.style)
                this.style = {};
            if (v)
                this.style.f = v;
            else
                delete this.style.f;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapeData.prototype, "lineWidth", {
        get: function () { var _a; return ((_a = this.style) === null || _a === void 0 ? void 0 : _a.g) || 0; },
        set: function (v) {
            if (!this.style)
                this.style = {};
            if (v)
                this.style.g = v;
            else
                delete this.style.g;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapeData.prototype, "miterLimit", {
        get: function () { var _a; return ((_a = this.style) === null || _a === void 0 ? void 0 : _a.h) || 0; },
        set: function (v) {
            if (!this.style)
                this.style = {};
            if (v)
                this.style.h = v;
            else
                delete this.style.h;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapeData.prototype, "visible", {
        get: function () { var _a; return ((_a = this.status) === null || _a === void 0 ? void 0 : _a.v) !== 0; },
        set: function (v) {
            if (!this.status)
                this.status = {};
            if (v)
                this.status.v = 1;
            else if (v === false)
                this.status.v = 0;
            else
                delete this.status.v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapeData.prototype, "selected", {
        get: function () { var _a; return !!((_a = this.status) === null || _a === void 0 ? void 0 : _a.s); },
        set: function (v) {
            if (!this.status)
                this.status = {};
            if (v)
                this.status.s = 1;
            else
                delete this.status.s;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ShapeData.prototype, "editing", {
        get: function () { var _a; return !!((_a = this.status) === null || _a === void 0 ? void 0 : _a.e); },
        set: function (v) {
            if (!this.status)
                this.status = {};
            if (v)
                this.status.e = 1;
            else
                delete this.status.e;
        },
        enumerable: false,
        configurable: true
    });
    ShapeData.prototype.merge = function (other) {
        this.copyFrom(other);
        return this;
    };
    ShapeData.prototype.copyFrom = function (other) {
        if (typeof other.t === 'string' || typeof other.t === 'number')
            this.t = other.t;
        if (typeof other.i === 'string')
            this.i = other.i;
        if (typeof other.x === 'number')
            this.x = other.x;
        if (typeof other.y === 'number')
            this.y = other.y;
        if (typeof other.z === 'number')
            this.z = other.z;
        if (typeof other.w === 'number')
            this.w = other.w;
        if (typeof other.h === 'number')
            this.h = other.h;
        var style = other.style, status = other.status;
        if (style) {
            if (!this.style)
                this.style = {};
            if (style.a)
                this.style.a = style.a;
            if (style.b)
                this.style.b = style.b;
            if (style.c)
                this.style.c = style.c;
            if (style.d)
                this.style.d = __spreadArray([], style.d, true);
            if (typeof style.e === 'number')
                this.style.e = style.e;
            if (style.f)
                this.style.f = style.f;
            if (typeof style.g === 'number')
                this.style.g = style.g;
            if (typeof style.h === 'number')
                this.style.h = style.h;
        }
        if (status) {
            if (!this.status)
                this.status = {};
            if (typeof status.v === 'number')
                this.status.v = status.v;
            if (typeof status.s === 'number')
                this.status.s = status.s;
            if (typeof status.e === 'number')
                this.status.e = status.e;
        }
        return this;
    };
    ShapeData.prototype.copy = function () {
        return new ShapeData().copyFrom(this);
    };
    return ShapeData;
}());
exports.ShapeData = ShapeData;
//# sourceMappingURL=Data.js.map