"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShapesMgr = void 0;
var Array_1 = require("../utils/Array");
var Rect_1 = require("../utils/Rect");
var Tag = '[ShapesMgr]';
var ShapesMgr = /** @class */ (function () {
    function ShapesMgr() {
        this._items = [];
        this._kvs = {};
    }
    ShapesMgr.prototype.finds = function (ids) {
        var _this = this;
        var ret = [];
        ids.forEach(function (id) {
            var shape = _this._kvs[id];
            shape && ret.push(shape);
        });
        return ret;
    };
    ShapesMgr.prototype.find = function (id) {
        return this._kvs[id];
    };
    ShapesMgr.prototype.shapes = function () { return this._items; };
    ShapesMgr.prototype.exists = function () {
        var _this = this;
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        var ret = 0;
        items.forEach(function (v) {
            if (_this._kvs[v.data.id])
                ++ret;
        });
        return ret;
    };
    ShapesMgr.prototype.add = function () {
        var _this = this;
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        var ret = 0;
        items.forEach(function (item) {
            if (_this.exists(item))
                return console.warn(Tag, "can not add \"".concat(item.data.id, "\", already exists!"));
            _this._kvs[item.data.id] = item;
            _this._items.push(item);
            ++ret;
        });
        this._items.sort(function (a, b) { return a.data.z - b.data.z; });
        return ret;
    };
    ShapesMgr.prototype.remove = function () {
        var _this = this;
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        var ret = 0;
        items.forEach(function (item) {
            var idx = (0, Array_1.findIndex)(_this._items, function (v) { return v === item; });
            if (idx < 0)
                return;
            _this._items = _this._items.filter(function (_, i) { return i !== idx; });
            delete _this._kvs[item.data.id];
            ++ret;
        });
        return ret;
    };
    ShapesMgr.prototype.hits = function (rect) {
        var count = this._items.length;
        var ret = [];
        for (var idx = count - 1; idx >= 0; --idx) {
            var v = this._items[idx];
            if (Rect_1.Rect.hit(v.data, rect))
                ret.push(v);
        }
        return ret;
    };
    ShapesMgr.prototype.hit = function (rect) {
        var count = this._items.length;
        for (var idx = count - 1; idx >= 0; --idx) {
            var v = this._items[idx];
            if (Rect_1.Rect.hit(v.data, rect))
                return v;
        }
    };
    return ShapesMgr;
}());
exports.ShapesMgr = ShapesMgr;
//# sourceMappingURL=ShapesMgr.js.map