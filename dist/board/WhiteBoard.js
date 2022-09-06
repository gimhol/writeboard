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
exports.WhiteBoard = void 0;
var event_1 = require("../event");
var tools_1 = require("../tools");
var utils_1 = require("../utils");
var Tag = '[WhiteBoard]';
var WhiteBoard = /** @class */ (function () {
    function WhiteBoard(factory, options) {
        var _this = this;
        this._toolType = tools_1.ToolEnum.Pen;
        this._mousedown = false;
        this._tools = {};
        this._selects = [];
        this._eventsObserver = new event_1.Observer();
        this._eventEmitter = new event_1.Emitter(this);
        this._operators = ['whiteboard'];
        this._operator = 'whiteboard';
        this.pointerdown = function (e) {
            var _a;
            if (e.button !== 0) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            _this._mousedown = true;
            (_a = _this.tool) === null || _a === void 0 ? void 0 : _a.pointerDown(_this.getDot(e));
        };
        this.pointermove = function (e) {
            var _a, _b;
            if (_this._mousedown)
                (_a = _this.tool) === null || _a === void 0 ? void 0 : _a.pointerDraw(_this.getDot(e));
            else
                (_b = _this.tool) === null || _b === void 0 ? void 0 : _b.pointerMove(_this.getDot(e));
        };
        this.pointerup = function (e) {
            var _a;
            _this._mousedown = false;
            (_a = _this.tool) === null || _a === void 0 ? void 0 : _a.pointerUp(_this.getDot(e));
        };
        this._factory = factory;
        this._shapesMgr = this._factory.newShapesMgr();
        this._offscreen = options.offscreen;
        this._onscreen = options.onscreen;
        this._dirty = { x: 0, y: 0, w: options.onscreen.width, h: options.onscreen.height };
        this.listenTo(this._onscreen, 'pointerdown', this.pointerdown, undefined);
        this.listenTo(this._onscreen, 'pointermove', this.pointermove, undefined);
        this.listenTo(this._onscreen, 'pointerup', this.pointerup, undefined);
        this._onscreen.addEventListener('contextmenu', function (e) { e.preventDefault(); e.stopPropagation(); });
        this.render();
    }
    WhiteBoard.prototype.finds = function (ids) {
        return this._shapesMgr.finds(ids);
    };
    WhiteBoard.prototype.find = function (id) {
        return this._shapesMgr.find(id);
    };
    WhiteBoard.prototype.toJson = function () {
        return {
            x: 0, y: 0,
            w: this._onscreen.width,
            h: this._onscreen.height,
            shapes: this.shapes().map(function (v) { return v.data; })
        };
    };
    WhiteBoard.prototype.toJsonStr = function () {
        return JSON.stringify(this.toJson());
    };
    WhiteBoard.prototype.fromJson = function (jobj) {
        var _this = this;
        this.removeAll();
        this._offscreen.width = jobj.w;
        this._offscreen.height = jobj.h;
        this._onscreen.width = jobj.w;
        this._onscreen.height = jobj.h;
        var shapes = jobj.shapes.map(function (v) { return _this.factory.newShape(v); });
        this.add.apply(this, shapes);
    };
    WhiteBoard.prototype.fromJsonStr = function (json) {
        this.fromJson(JSON.parse(json));
    };
    WhiteBoard.prototype.shapes = function () {
        return this._shapesMgr.shapes();
    };
    WhiteBoard.prototype.exists = function () {
        var _a;
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        return (_a = this._shapesMgr).exists.apply(_a, items);
    };
    WhiteBoard.prototype.hit = function (rect) {
        return this._shapesMgr.hit(rect);
    };
    WhiteBoard.prototype.hits = function (rect) {
        return this._shapesMgr.hits(rect);
    };
    WhiteBoard.prototype.addEventListener = function (type, callback, options) {
        return this._eventEmitter.addEventListener(type, callback, options);
    };
    WhiteBoard.prototype.removeEventListener = function (type, callback, options) {
        return this._eventEmitter.removeEventListener(type, callback, options);
    };
    WhiteBoard.prototype.dispatchEvent = function (e) {
        return this._eventEmitter.dispatchEvent(e);
    };
    WhiteBoard.prototype.on = function (type, callback, options) {
        return this._eventEmitter.on(type, callback, options);
    };
    WhiteBoard.prototype.once = function (type, callback, options) {
        return this._eventEmitter.once(type, callback, options);
    };
    WhiteBoard.prototype.emit = function (e) {
        return this._eventEmitter.emit(e);
    };
    WhiteBoard.prototype.listenTo = function (target, type, callback, options) {
        return this._eventsObserver.listenTo(target, type, callback, options);
    };
    WhiteBoard.prototype.destory = function () { return this._eventsObserver.destory(); };
    Object.defineProperty(WhiteBoard.prototype, "factory", {
        get: function () { return this._factory; },
        set: function (v) { this._factory = v; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WhiteBoard.prototype, "ctx", {
        get: function () { return this._onscreen.getContext('2d'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WhiteBoard.prototype, "octx", {
        get: function () { return this._offscreen.getContext('2d'); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WhiteBoard.prototype, "onscreen", {
        get: function () { return this._onscreen; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WhiteBoard.prototype, "offscreen", {
        get: function () { return this._offscreen; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WhiteBoard.prototype, "toolType", {
        get: function () { return this._toolType; },
        set: function (v) { this.setToolType(v); },
        enumerable: false,
        configurable: true
    });
    WhiteBoard.prototype.setToolType = function (to) {
        if (this._toolType === to)
            return;
        var from = this._toolType;
        this._toolType = to;
        this.emit(new event_1.ToolChangedEvent(this._operator, { from: from, to: to }));
    };
    Object.defineProperty(WhiteBoard.prototype, "selects", {
        get: function () {
            return this._selects;
        },
        set: function (v) {
            this._selects.forEach(function (v) { return v.selected = false; });
            this._selects = v;
            this._selects.forEach(function (v) { return v.selected = true; });
        },
        enumerable: false,
        configurable: true
    });
    WhiteBoard.prototype.add = function () {
        var _a;
        var _this = this;
        var shapes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            shapes[_i] = arguments[_i];
        }
        if (!shapes.length)
            return 0;
        var ret = (_a = this._shapesMgr).add.apply(_a, shapes);
        shapes.forEach(function (item) {
            item.board = _this;
            if (item.selected)
                _this._selects.push(item);
            _this.markDirty(item.boundingRect());
        });
        var e = new event_1.ShapesAddedEvent(this._operator, { shapeDatas: shapes.map(function (v) { return v.data.copy(); }) });
        this.emit(e);
        return ret;
    };
    WhiteBoard.prototype.remove = function () {
        var _a;
        var _this = this;
        var shapes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            shapes[_i] = arguments[_i];
        }
        if (!shapes.length)
            return 0;
        var ret = (_a = this._shapesMgr).remove.apply(_a, shapes);
        shapes.forEach(function (item) {
            _this.markDirty(item.boundingRect());
            item.board = undefined;
        });
        var e = new event_1.ShapesRemovedEvent(this._operator, { shapeDatas: shapes.map(function (v) { return v.data.copy(); }) });
        this.emit(e);
        return ret;
    };
    WhiteBoard.prototype.removeAll = function () {
        return this.remove.apply(this, this._shapesMgr.shapes());
    };
    WhiteBoard.prototype.removeSelected = function () {
        this.remove.apply(this, this._selects);
        this._selects = [];
    };
    WhiteBoard.prototype.selectAll = function () {
        this.selects = __spreadArray([], this._shapesMgr.shapes(), true);
    };
    WhiteBoard.prototype.deselect = function () {
        this.selects = [];
    };
    WhiteBoard.prototype.selectAt = function (rect) {
        var ret = this._shapesMgr.hits(rect);
        this.selects = ret;
        return ret;
    };
    WhiteBoard.prototype.selectNear = function (rect) {
        var ret = this._shapesMgr.hit(rect);
        this.selects = ret ? [ret] : [];
        return ret;
    };
    WhiteBoard.prototype.getDot = function (ev) {
        var ele = this._onscreen;
        var sw = ele.width / ele.offsetWidth;
        var sh = ele.height / ele.offsetHeight;
        var _a = ev.pressure, pressure = _a === void 0 ? 0.5 : _a;
        return {
            x: Math.floor(sw * ev.offsetX),
            y: Math.floor(sh * ev.offsetY),
            p: pressure
        };
    };
    Object.defineProperty(WhiteBoard.prototype, "tools", {
        get: function () { return this._tools; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WhiteBoard.prototype, "tool", {
        get: function () {
            var _a;
            var toolType = this._toolType;
            if (!this._tool || this._tool.type !== toolType) {
                (_a = this._tool) === null || _a === void 0 ? void 0 : _a.end();
                this._tool = this._factory.newTool(toolType);
                if (this._tool) {
                    this._tool.board = this;
                    this._tools[toolType] = this._tool;
                    this._tool.start();
                }
            }
            return this._tool;
        },
        enumerable: false,
        configurable: true
    });
    WhiteBoard.prototype.markDirty = function (rect) {
        var _this = this;
        var requestRender = !this._dirty;
        this._dirty = this._dirty ? utils_1.Rect.bounds(this._dirty, rect) : rect;
        requestRender && requestAnimationFrame(function () { return _this.render(); });
    };
    WhiteBoard.prototype.render = function () {
        var _a;
        var ctx = this.ctx;
        var octx = this.octx;
        var dirty = this._dirty;
        if (!dirty || !ctx || !octx)
            return;
        if (dirty) {
            octx.clearRect(dirty.x, dirty.y, dirty.w, dirty.h);
            ctx.clearRect(dirty.x, dirty.y, dirty.w, dirty.h);
        }
        this._shapesMgr.shapes().forEach(function (v) {
            var br = v.boundingRect();
            if (utils_1.Rect.hit(br, dirty))
                v.render(octx);
        });
        (_a = this.tool) === null || _a === void 0 ? void 0 : _a.render(octx);
        ctx.drawImage(this.offscreen, dirty.x, dirty.y, dirty.w, dirty.h, dirty.x, dirty.y, dirty.w, dirty.h);
        delete this._dirty;
    };
    return WhiteBoard;
}());
exports.WhiteBoard = WhiteBoard;
//# sourceMappingURL=WhiteBoard.js.map