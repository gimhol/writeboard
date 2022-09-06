(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"../event":8,"../tools":42,"../utils":48}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhiteBoard = void 0;
var WhiteBoard_1 = require("./WhiteBoard");
Object.defineProperty(exports, "WhiteBoard", { enumerable: true, get: function () { return WhiteBoard_1.WhiteBoard; } });

},{"./WhiteBoard":1}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emitter = void 0;
var Array_1 = require("../utils/Array");
var Emitter = /** @class */ (function () {
    function Emitter(target) {
        this._listenersMap = {};
        this._target = target || this;
    }
    Emitter.prototype.addEventListener = function (type, callback, options) {
        var _this = this;
        var listeners = this._listenersMap[type] || [];
        var canceller = function () { return _this.removeEventListener(type, callback, options); };
        var listener = { times: -1, callback: callback, options: options, type: type, target: this._target, canceller: canceller };
        listeners.push(listener);
        this._listenersMap[type] = listeners;
        return listener;
    };
    Emitter.prototype.removeEventListener = function (type, callback, options) {
        var listeners = this._listenersMap[type];
        var idx = listeners && (0, Array_1.findIndex)(listeners, function (v) {
            return v.type === type && v.callback === callback && JSON.stringify(v.options) === JSON.stringify(options);
        });
        if (idx !== undefined && idx >= 0)
            this._listenersMap[type] = listeners === null || listeners === void 0 ? void 0 : listeners.filter(function (_, i) { return (i !== idx); });
    };
    Emitter.prototype.dispatchEvent = function (e) {
        e.target = this;
        var ret = !e.cancelable || !e.defaultPrevented;
        var listeners = this._listenersMap[e.type];
        if (!listeners)
            return ret;
        for (var i = 0; i < listeners.length; ++i) {
            var _a = listeners[i], times = _a.times, callback = _a.callback;
            if (times > 1)
                listeners[i].times = times - 1;
            else if (times === 0)
                listeners.splice(i, 1);
            if (!callback)
                continue;
            if (typeof callback === 'function')
                callback(e);
            else
                callback.handleEvent(e);
        }
        return ret;
    };
    Emitter.prototype.on = function (type, callback, options) {
        var listener = this.addEventListener(type, callback, options);
        return listener.canceller;
    };
    Emitter.prototype.once = function (type, callback, options) {
        var listener = this.addEventListener(type, callback, options);
        listener.times = 0;
        return listener.canceller;
    };
    Emitter.prototype.emit = function (e) {
        return this.dispatchEvent(e);
    };
    return Emitter;
}());
exports.Emitter = Emitter;

},{"../utils/Array":44}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventDataVisitor = void 0;
var utils_1 = require("../utils");
var EventType_1 = require("./EventType");
var EventDataVisitor = /** @class */ (function () {
    function EventDataVisitor() {
    }
    EventDataVisitor.create = function (options) {
        return {
            a: options.type,
            b: options.operator,
            c: options.timeStamp,
            d: options.detail
        };
    };
    EventDataVisitor.getType = function (e) {
        return e.a || e.type || EventType_1.EventEnum.Invalid;
    };
    EventDataVisitor.setType = function (e, v) {
        e.a = (0, utils_1.getValue)(v, this.getType(e));
        return this;
    };
    EventDataVisitor.getOperator = function (e) {
        return e.b || e.operator || EventType_1.EventEnum.Invalid;
    };
    EventDataVisitor.setOperator = function (e, v) {
        e.b = (0, utils_1.getValue)(v, this.getOperator(e));
        return this;
    };
    EventDataVisitor.getTime = function (e) {
        return e.c || e.timeStamp || 0;
    };
    EventDataVisitor.setTime = function (e, v) {
        e.c = (0, utils_1.getValue)(v, this.getTime(e));
        return this;
    };
    EventDataVisitor.getDetail = function (e) {
        return e.d || e.detail;
    };
    EventDataVisitor.setDetail = function (e, v) {
        e.d = (0, utils_1.getValue)(v, this.getDetail(e));
        return this;
    };
    return EventDataVisitor;
}());
exports.EventDataVisitor = EventDataVisitor;

},{"../utils":48,"./EventType":5}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventEnum = void 0;
var EventEnum;
(function (EventEnum) {
    EventEnum["Invalid"] = "";
    EventEnum["ShapesAdded"] = "SHAPES_ADDED";
    EventEnum["ShapesRemoved"] = "SHAPES_REMOVED";
    EventEnum["ShapesChanged"] = "SHAPES_CHANGED";
    EventEnum["ToolChanged"] = "TOOL_CHANGED";
})(EventEnum = exports.EventEnum || (exports.EventEnum = {}));

},{}],6:[function(require,module,exports){
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
exports.ToolChangedEvent = exports.ShapesGeoEvent = exports.pickShapeGeoData = exports.ShapesMovedEvent = exports.pickShapePositionData = exports.ShapesChangedEvent = exports.ShapesChangedEnum = exports.ShapesRemovedEvent = exports.ShapesAddedEvent = exports.ShapesEvent = exports.BaseEvent = void 0;
var EventDataVisitor_1 = require("./EventDataVisitor");
var EventType_1 = require("./EventType");
var tempEvent = new CustomEvent('');
var BaseEvent = /** @class */ (function () {
    function BaseEvent(type, operator, detail) {
        this._bubbles = true;
        this._cancelBubble = true;
        this._cancelable = true;
        this._composed = true;
        this._currentTarget = null;
        this._defaultPrevented = false;
        this._eventPhase = 0;
        this._isTrusted = true;
        this._returnValue = true;
        this._srcElement = null;
        this._target = null;
        this._timeStamp = Date.now();
        this.AT_TARGET = tempEvent.AT_TARGET;
        this.BUBBLING_PHASE = tempEvent.BUBBLING_PHASE;
        this.CAPTURING_PHASE = tempEvent.CAPTURING_PHASE;
        this.NONE = tempEvent.NONE;
        this._type = type;
        this._operator = operator;
        this._detail = detail;
    }
    Object.defineProperty(BaseEvent.prototype, "operator", {
        get: function () { return this._operator; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseEvent.prototype, "detail", {
        get: function () { return this._detail; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseEvent.prototype, "type", {
        get: function () { return this._type; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseEvent.prototype, "bubbles", {
        get: function () { return this._bubbles; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseEvent.prototype, "cancelBubble", {
        get: function () { return this._cancelBubble; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseEvent.prototype, "cancelable", {
        get: function () { return this._cancelable; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseEvent.prototype, "composed", {
        get: function () { return this._composed; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseEvent.prototype, "currentTarget", {
        get: function () { return this._currentTarget; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseEvent.prototype, "defaultPrevented", {
        get: function () { return this._defaultPrevented; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseEvent.prototype, "eventPhase", {
        get: function () { return this._eventPhase; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseEvent.prototype, "isTrusted", {
        get: function () { return this._isTrusted; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseEvent.prototype, "returnValue", {
        get: function () { return this._returnValue; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseEvent.prototype, "srcElement", {
        get: function () { return this._srcElement; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseEvent.prototype, "target", {
        get: function () { return this._target; },
        set: function (v) {
            this._target = v;
            this._currentTarget = v;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BaseEvent.prototype, "timeStamp", {
        get: function () { return this._timeStamp; },
        enumerable: false,
        configurable: true
    });
    BaseEvent.prototype.composedPath = function () { return []; };
    BaseEvent.prototype.initEvent = function (type, bubbles, cancelable) {
        this._type = type;
        this._bubbles = !!bubbles;
        this._cancelable = !!cancelable;
    };
    BaseEvent.prototype.preventDefault = function () {
        this._defaultPrevented = true;
    };
    BaseEvent.prototype.stopImmediatePropagation = function () { };
    BaseEvent.prototype.stopPropagation = function () { };
    BaseEvent.prototype.pure = function () {
        return EventDataVisitor_1.EventDataVisitor.create(this);
    };
    return BaseEvent;
}());
exports.BaseEvent = BaseEvent;
var ShapesEvent = /** @class */ (function (_super) {
    __extends(ShapesEvent, _super);
    function ShapesEvent(type, operator, detail) {
        return _super.call(this, type, operator, detail) || this;
    }
    return ShapesEvent;
}(BaseEvent));
exports.ShapesEvent = ShapesEvent;
var ShapesAddedEvent = /** @class */ (function (_super) {
    __extends(ShapesAddedEvent, _super);
    function ShapesAddedEvent(operator, detail) {
        return _super.call(this, EventType_1.EventEnum.ShapesAdded, operator, detail) || this;
    }
    return ShapesAddedEvent;
}(ShapesEvent));
exports.ShapesAddedEvent = ShapesAddedEvent;
var ShapesRemovedEvent = /** @class */ (function (_super) {
    __extends(ShapesRemovedEvent, _super);
    function ShapesRemovedEvent(operator, detail) {
        return _super.call(this, EventType_1.EventEnum.ShapesRemoved, operator, detail) || this;
    }
    return ShapesRemovedEvent;
}(ShapesEvent));
exports.ShapesRemovedEvent = ShapesRemovedEvent;
var ShapesChangedEnum;
(function (ShapesChangedEnum) {
    ShapesChangedEnum[ShapesChangedEnum["Invalid"] = 0] = "Invalid";
    ShapesChangedEnum[ShapesChangedEnum["Any"] = 1] = "Any";
    ShapesChangedEnum[ShapesChangedEnum["Moved"] = 2] = "Moved";
    ShapesChangedEnum[ShapesChangedEnum["Resized"] = 3] = "Resized";
})(ShapesChangedEnum = exports.ShapesChangedEnum || (exports.ShapesChangedEnum = {}));
var ShapesChangedEvent = /** @class */ (function (_super) {
    __extends(ShapesChangedEvent, _super);
    function ShapesChangedEvent(operator, detail) {
        var _this = _super.call(this, EventType_1.EventEnum.ShapesChanged, operator, detail) || this;
        _this._changedType = ShapesChangedEnum.Any;
        return _this;
    }
    Object.defineProperty(ShapesChangedEvent.prototype, "changedType", {
        get: function () { return this._changedType; },
        enumerable: false,
        configurable: true
    });
    return ShapesChangedEvent;
}(BaseEvent));
exports.ShapesChangedEvent = ShapesChangedEvent;
function pickShapePositionData(data) {
    return {
        i: data.i,
        x: data.x,
        y: data.y
    };
}
exports.pickShapePositionData = pickShapePositionData;
var ShapesMovedEvent = /** @class */ (function (_super) {
    __extends(ShapesMovedEvent, _super);
    function ShapesMovedEvent(operator, detail) {
        var _this = _super.call(this, operator, detail) || this;
        _this._changedType = ShapesChangedEnum.Moved;
        return _this;
    }
    return ShapesMovedEvent;
}(ShapesChangedEvent));
exports.ShapesMovedEvent = ShapesMovedEvent;
function pickShapeGeoData(data) {
    return {
        i: data.i,
        x: data.x,
        y: data.y,
        w: data.w,
        h: data.h
    };
}
exports.pickShapeGeoData = pickShapeGeoData;
var ShapesGeoEvent = /** @class */ (function (_super) {
    __extends(ShapesGeoEvent, _super);
    function ShapesGeoEvent(operator, detail) {
        var _this = _super.call(this, operator, detail) || this;
        _this._changedType = ShapesChangedEnum.Resized;
        return _this;
    }
    return ShapesGeoEvent;
}(ShapesChangedEvent));
exports.ShapesGeoEvent = ShapesGeoEvent;
var ToolChangedEvent = /** @class */ (function (_super) {
    __extends(ToolChangedEvent, _super);
    function ToolChangedEvent(operator, detail) {
        return _super.call(this, EventType_1.EventEnum.ToolChanged, operator, detail) || this;
    }
    return ToolChangedEvent;
}(BaseEvent));
exports.ToolChangedEvent = ToolChangedEvent;

},{"./EventDataVisitor":4,"./EventType":5}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observer = void 0;
var Emitter_1 = require("./Emitter");
var Observer = /** @class */ (function () {
    function Observer() {
        this._listeners = [];
    }
    Observer.prototype.listenTo = function (target, type, callback, options) {
        if (target instanceof Emitter_1.Emitter) {
            var canceller_1 = target.addEventListener(type, callback, options).canceller;
            return canceller_1;
        }
        var canceller = function () { return target.removeEventListener(type, callback, options); };
        var listener = { times: -1, target: target, type: type, callback: callback, canceller: canceller };
        target.addEventListener(type, callback, options);
        this._listeners.push(listener);
        return canceller;
    };
    Observer.prototype.destory = function () {
        this._listeners.forEach(function (v) { return v.canceller(); });
    };
    return Observer;
}());
exports.Observer = Observer;

},{"./Emitter":3}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventDataVisitor = exports.Observer = exports.Emitter = exports.EventEnum = exports.ShapesRemovedEvent = exports.ShapesAddedEvent = exports.ToolChangedEvent = exports.BaseEvent = void 0;
var Events_1 = require("./Events");
Object.defineProperty(exports, "BaseEvent", { enumerable: true, get: function () { return Events_1.BaseEvent; } });
Object.defineProperty(exports, "ToolChangedEvent", { enumerable: true, get: function () { return Events_1.ToolChangedEvent; } });
Object.defineProperty(exports, "ShapesAddedEvent", { enumerable: true, get: function () { return Events_1.ShapesAddedEvent; } });
Object.defineProperty(exports, "ShapesRemovedEvent", { enumerable: true, get: function () { return Events_1.ShapesRemovedEvent; } });
var EventType_1 = require("./EventType");
Object.defineProperty(exports, "EventEnum", { enumerable: true, get: function () { return EventType_1.EventEnum; } });
var Emitter_1 = require("./Emitter");
Object.defineProperty(exports, "Emitter", { enumerable: true, get: function () { return Emitter_1.Emitter; } });
var Observer_1 = require("./Observer");
Object.defineProperty(exports, "Observer", { enumerable: true, get: function () { return Observer_1.Observer; } });
var EventDataVisitor_1 = require("../event/EventDataVisitor");
Object.defineProperty(exports, "EventDataVisitor", { enumerable: true, get: function () { return EventDataVisitor_1.EventDataVisitor; } });

},{"../event/EventDataVisitor":4,"./Emitter":3,"./EventType":5,"./Events":6,"./Observer":7}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
var event_1 = require("../event");
var Player = /** @class */ (function () {
    function Player() {
        this.eventIdx = 0;
        this.firstEventTime = 0;
        this.startTime = 0;
        this.timer = 0;
    }
    Player.prototype.start = function (actor, screenplay) {
        this.actor = actor;
        this.screenplay = {
            startTime: screenplay.startTime || 0,
            snapshot: screenplay.snapshot || {},
            events: screenplay.events || [],
        };
        this.startTime = Date.now();
        this.firstEventTime = 0;
        actor.fromJson(screenplay.snapshot);
        this.tick();
    };
    Player.prototype.stop = function () {
        clearTimeout(this.timer);
    };
    Player.prototype.tick = function () {
        var _this = this;
        var screenplay = this.screenplay;
        if (!screenplay)
            return this.stop();
        var event = screenplay.events[this.eventIdx];
        if (!event)
            return this.stop();
        var timeStamp = event_1.EventDataVisitor.getTime(event);
        if (!this.firstEventTime && timeStamp)
            this.firstEventTime = timeStamp;
        this.applyEvent(event);
        ++this.eventIdx;
        var next = screenplay.events[this.eventIdx];
        if (!next)
            return this.stop();
        timeStamp = event_1.EventDataVisitor.getTime(next);
        var diff = Math.max(1, (timeStamp - screenplay.startTime) - (this.firstEventTime - screenplay.startTime) - (Date.now() - this.startTime));
        this.timer = setTimeout(function () { return _this.tick(); }, diff);
    };
    Player.prototype.applyEvent = function (e) {
        var actor = this.actor;
        if (!actor)
            return;
        var type = event_1.EventDataVisitor.getType(e);
        switch (type) {
            case event_1.EventEnum.ShapesAdded: {
                var event_2 = e;
                var shapes = event_1.EventDataVisitor.getDetail(event_2).shapeDatas.map(function (v) { return actor.factory.newShape(v); });
                actor.add.apply(actor, shapes);
                break;
            }
            case event_1.EventEnum.ShapesChanged: {
                var event_3 = e;
                event_1.EventDataVisitor.getDetail(event_3).shapeDatas.forEach(function (_a) {
                    var _b;
                    var curr = _a[0], prev = _a[1];
                    var id = curr.i;
                    id && ((_b = actor.find(id)) === null || _b === void 0 ? void 0 : _b.merge(curr));
                });
                break;
            }
            case event_1.EventEnum.ShapesRemoved: {
                var event_4 = e;
                var shapes = event_1.EventDataVisitor.getDetail(event_4).shapeDatas.map(function (data) { return actor.find(data.i); }).filter(function (v) { return v; });
                actor.remove.apply(actor, shapes);
                break;
            }
        }
    };
    return Player;
}());
exports.Player = Player;

},{"../event":8}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Recorder = void 0;
var event_1 = require("../event");
var EventDataVisitor_1 = require("../event/EventDataVisitor");
var Recorder = /** @class */ (function () {
    function Recorder() {
        this.cancellers = [];
        this._screenplay = {
            startTime: Date.now(),
            snapshot: {},
            events: []
        };
    }
    Recorder.prototype.destory = function () {
        this.cancellers.forEach(function (v) { return v(); });
        this.cancellers = [];
    };
    Recorder.prototype.start = function (actor) {
        var _this = this;
        this.cancellers.forEach(function (v) { return v(); });
        this.cancellers = [];
        var startTime = Date.now();
        this._screenplay = {
            startTime: startTime,
            snapshot: actor.toJson(),
            events: []
        };
        for (var key in event_1.EventEnum) {
            var v = event_1.EventEnum[key];
            var func = function (e) {
                var puree = e.pure();
                EventDataVisitor_1.EventDataVisitor.setTime(puree, function (v) { return v - startTime; });
                _this._screenplay.events.push(puree);
            };
            var canceller = actor.on(v, func);
            this.cancellers.push(canceller);
        }
    };
    Recorder.prototype.toJson = function () {
        return this._screenplay;
    };
    Recorder.prototype.toJsonStr = function () {
        return JSON.stringify(this.toJson());
    };
    return Recorder;
}());
exports.Recorder = Recorder;

},{"../event":8,"../event/EventDataVisitor":4}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observer = exports.Emitter = exports.BaseEvent = exports.EventEnum = exports.Player = exports.Recorder = exports.WhiteBoard = exports.ToolEnum = exports.FactoryMgr = exports.FactoryEnum = exports.ShapeText = exports.TextData = exports.ShapeOval = exports.OvalData = exports.ShapeRect = exports.RectData = exports.ShapePen = exports.PenData = exports.Shape = exports.ShapeData = exports.getShapeName = exports.ShapeEnum = void 0;
require("./tools");
var ShapeEnum_1 = require("./shape/ShapeEnum");
Object.defineProperty(exports, "ShapeEnum", { enumerable: true, get: function () { return ShapeEnum_1.ShapeEnum; } });
Object.defineProperty(exports, "getShapeName", { enumerable: true, get: function () { return ShapeEnum_1.getShapeName; } });
var base_1 = require("./shape/base");
Object.defineProperty(exports, "ShapeData", { enumerable: true, get: function () { return base_1.ShapeData; } });
Object.defineProperty(exports, "Shape", { enumerable: true, get: function () { return base_1.Shape; } });
var pen_1 = require("./shape/pen");
Object.defineProperty(exports, "PenData", { enumerable: true, get: function () { return pen_1.PenData; } });
Object.defineProperty(exports, "ShapePen", { enumerable: true, get: function () { return pen_1.ShapePen; } });
var rect_1 = require("./shape/rect");
Object.defineProperty(exports, "RectData", { enumerable: true, get: function () { return rect_1.RectData; } });
Object.defineProperty(exports, "ShapeRect", { enumerable: true, get: function () { return rect_1.ShapeRect; } });
var oval_1 = require("./shape/oval");
Object.defineProperty(exports, "OvalData", { enumerable: true, get: function () { return oval_1.OvalData; } });
Object.defineProperty(exports, "ShapeOval", { enumerable: true, get: function () { return oval_1.ShapeOval; } });
var text_1 = require("./shape/text");
Object.defineProperty(exports, "TextData", { enumerable: true, get: function () { return text_1.TextData; } });
Object.defineProperty(exports, "ShapeText", { enumerable: true, get: function () { return text_1.ShapeText; } });
var mgr_1 = require("./mgr");
Object.defineProperty(exports, "FactoryEnum", { enumerable: true, get: function () { return mgr_1.FactoryEnum; } });
Object.defineProperty(exports, "FactoryMgr", { enumerable: true, get: function () { return mgr_1.FactoryMgr; } });
var tools_1 = require("./tools");
Object.defineProperty(exports, "ToolEnum", { enumerable: true, get: function () { return tools_1.ToolEnum; } });
var WhiteBoard_1 = require("./board/WhiteBoard");
Object.defineProperty(exports, "WhiteBoard", { enumerable: true, get: function () { return WhiteBoard_1.WhiteBoard; } });
var Recorder_1 = require("./features/Recorder");
Object.defineProperty(exports, "Recorder", { enumerable: true, get: function () { return Recorder_1.Recorder; } });
var Player_1 = require("./features/Player");
Object.defineProperty(exports, "Player", { enumerable: true, get: function () { return Player_1.Player; } });
var event_1 = require("./event");
Object.defineProperty(exports, "EventEnum", { enumerable: true, get: function () { return event_1.EventEnum; } });
Object.defineProperty(exports, "BaseEvent", { enumerable: true, get: function () { return event_1.BaseEvent; } });
Object.defineProperty(exports, "Emitter", { enumerable: true, get: function () { return event_1.Emitter; } });
Object.defineProperty(exports, "Observer", { enumerable: true, get: function () { return event_1.Observer; } });

},{"./board/WhiteBoard":1,"./event":8,"./features/Player":9,"./features/Recorder":10,"./mgr":16,"./shape/ShapeEnum":17,"./shape/base":21,"./shape/oval":25,"./shape/pen":29,"./shape/rect":33,"./shape/text":38,"./tools":42}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Factory = void 0;
var Data_1 = require("../shape/base/Data");
var ShapesMgr_1 = require("./ShapesMgr");
var Shape_1 = require("../shape/base/Shape");
var InvalidTool_1 = require("../tools/base/InvalidTool");
var FactoryEnum_1 = require("./FactoryEnum");
var FactoryMgr_1 = require("./FactoryMgr");
var board_1 = require("../board");
var Tag = '[Factory]';
var Factory = /** @class */ (function () {
    function Factory() {
        this._z = 0;
        this._time = 0;
        this._shapeTemplates = {};
    }
    Object.defineProperty(Factory.prototype, "type", {
        get: function () {
            return FactoryEnum_1.FactoryEnum.Default;
        },
        enumerable: false,
        configurable: true
    });
    Factory.prototype.shapeTemplate = function (type) {
        var ret = this._shapeTemplates[type] || this.newShapeData(type);
        this._shapeTemplates[type] = ret;
        return ret;
    };
    Factory.prototype.setShapeTemplate = function (type, template) {
        this._shapeTemplates[type] = template;
    };
    Factory.prototype.newWhiteBoard = function (options) {
        return new board_1.WhiteBoard(this, options);
    };
    Factory.prototype.newShapesMgr = function () {
        return new ShapesMgr_1.ShapesMgr();
    };
    Factory.prototype.newTool = function (toolType) {
        var create = FactoryMgr_1.FactoryMgr.tools[toolType];
        if (!create) {
            console.warn(Tag, "newTool(\"".concat(toolType, "\"), ").concat(toolType, " is not registered"));
            return new InvalidTool_1.InvalidTool;
        }
        var ret = create();
        if (ret.type !== toolType) {
            console.warn(Tag, "newTool(\"".concat(toolType, "\"), ").concat(toolType, " is not corrent! check member 'type' of your Tool!"));
        }
        return ret;
    };
    Factory.prototype.newShapeData = function (shapeType) {
        var create = FactoryMgr_1.FactoryMgr.shapeDatas[shapeType];
        if (!create) {
            console.warn(Tag, "newShapeData(\"".concat(shapeType, "\"), ").concat(shapeType, " is not registered"));
            return new Data_1.ShapeData;
        }
        var ret = create();
        if (ret.type !== shapeType) {
            console.warn(Tag, "newShapeData(\"".concat(shapeType, "\"), ").concat(shapeType, " is not corrent! check member 'type' of your ShapeData!"));
        }
        return ret;
    };
    Factory.prototype.newId = function (data) {
        return data.t + '_' + Date.now() + (++this._time);
    };
    Factory.prototype.newZ = function (data) {
        return Date.now() + (++this._z);
    };
    Factory.prototype.newShape = function (v) {
        var isNew = typeof v === 'string' || typeof v === 'number';
        var type = isNew ? v : v.t;
        var data = this.newShapeData(type);
        var template = isNew ? this.shapeTemplate(v) : v;
        data.copyFrom(template);
        if (isNew) {
            data.id = this.newId(data);
            data.z = this.newZ(data);
        }
        var create = FactoryMgr_1.FactoryMgr.shapes[type];
        return create ? create(data) : new Shape_1.Shape(data);
    };
    return Factory;
}());
exports.Factory = Factory;
FactoryMgr_1.FactoryMgr.registerFactory(FactoryEnum_1.FactoryEnum.Default, function () { return new Factory(); }, { name: 'bulit-in Factory', desc: 'bulit-in Factory' });

},{"../board":2,"../shape/base/Data":18,"../shape/base/Shape":19,"../tools/base/InvalidTool":40,"./FactoryEnum":13,"./FactoryMgr":14,"./ShapesMgr":15}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFactoryName = exports.FactoryEnum = void 0;
var FactoryEnum;
(function (FactoryEnum) {
    FactoryEnum[FactoryEnum["Invalid"] = 0] = "Invalid";
    FactoryEnum[FactoryEnum["Default"] = 1] = "Default";
})(FactoryEnum = exports.FactoryEnum || (exports.FactoryEnum = {}));
function getFactoryName(type) {
    switch (type) {
        case FactoryEnum.Invalid: return 'FactoryEnum.Invalid';
        case FactoryEnum.Default: return 'FactoryEnum.Default';
        default: return type;
    }
}
exports.getFactoryName = getFactoryName;

},{}],14:[function(require,module,exports){
"use strict";
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
exports.FactoryMgr = void 0;
var ToolEnum_1 = require("../tools/ToolEnum");
var ShapeEnum_1 = require("../shape/ShapeEnum");
var Tag = '[Factory]';
var FactoryMgr = /** @class */ (function () {
    function FactoryMgr() {
    }
    FactoryMgr.listFactories = function () {
        return Object.keys(this.factoryInfos);
    };
    FactoryMgr.createFactory = function (type) {
        var create = this.factorys[type];
        if (!create) {
            var error = new Error("".concat(Tag, "create(\"").concat(type, "\"), ").concat(type, " is not registered"));
            throw error;
        }
        var ret = create();
        if (ret.type !== type) {
            console.warn(Tag, "create(\"".concat(type, "\"), ").concat(type, " is not corrent! check member 'type' of your Factory!"));
        }
        return ret;
    };
    FactoryMgr.registerFactory = function (type, creator, info) {
        this.factorys[type] = creator;
        this.factoryInfos[type] = info;
    };
    FactoryMgr.listTools = function () {
        return Object.keys(this.tools);
    };
    FactoryMgr.toolInfo = function (type) {
        return this.toolInfos[type];
    };
    FactoryMgr.registerTool = function (type, creator, info) {
        this.tools[type] = creator;
        this.toolInfos[type] = __assign(__assign({}, info), { name: (info === null || info === void 0 ? void 0 : info.name) || (0, ToolEnum_1.getToolName)(type), desc: (info === null || info === void 0 ? void 0 : info.desc) || (0, ToolEnum_1.getToolName)(type) });
    };
    FactoryMgr.listShapes = function () {
        return Object.keys(this.shapes);
    };
    FactoryMgr.registerShape = function (type, dataCreator, shapeCreator, info) {
        this.shapeDatas[type] = dataCreator;
        this.shapes[type] = shapeCreator;
        this.shapeInfos[type] = {
            name: (info === null || info === void 0 ? void 0 : info.name) || (0, ShapeEnum_1.getShapeName)(type),
            desc: (info === null || info === void 0 ? void 0 : info.desc) || (0, ShapeEnum_1.getShapeName)(type),
            type: type
        };
    };
    FactoryMgr.shapeInfo = function (type) {
        return this.shapeInfos[type];
    };
    FactoryMgr.tools = {};
    FactoryMgr.toolInfos = {};
    FactoryMgr.shapeDatas = {};
    FactoryMgr.shapes = {};
    FactoryMgr.shapeInfos = {};
    FactoryMgr.factorys = {};
    FactoryMgr.factoryInfos = {};
    return FactoryMgr;
}());
exports.FactoryMgr = FactoryMgr;

},{"../shape/ShapeEnum":17,"../tools/ToolEnum":39}],15:[function(require,module,exports){
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

},{"../utils/Array":44,"../utils/Rect":45}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShapesMgr = exports.FactoryMgr = exports.getFactoryName = exports.FactoryEnum = exports.Factory = void 0;
var Factory_1 = require("./Factory");
Object.defineProperty(exports, "Factory", { enumerable: true, get: function () { return Factory_1.Factory; } });
var FactoryEnum_1 = require("./FactoryEnum");
Object.defineProperty(exports, "FactoryEnum", { enumerable: true, get: function () { return FactoryEnum_1.FactoryEnum; } });
Object.defineProperty(exports, "getFactoryName", { enumerable: true, get: function () { return FactoryEnum_1.getFactoryName; } });
var FactoryMgr_1 = require("./FactoryMgr");
Object.defineProperty(exports, "FactoryMgr", { enumerable: true, get: function () { return FactoryMgr_1.FactoryMgr; } });
var ShapesMgr_1 = require("./ShapesMgr");
Object.defineProperty(exports, "ShapesMgr", { enumerable: true, get: function () { return ShapesMgr_1.ShapesMgr; } });

},{"./Factory":12,"./FactoryEnum":13,"./FactoryMgr":14,"./ShapesMgr":15}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getShapeName = exports.ShapeEnum = void 0;
var ShapeEnum;
(function (ShapeEnum) {
    ShapeEnum[ShapeEnum["Invalid"] = 0] = "Invalid";
    ShapeEnum[ShapeEnum["Pen"] = 1] = "Pen";
    ShapeEnum[ShapeEnum["Rect"] = 2] = "Rect";
    ShapeEnum[ShapeEnum["Oval"] = 3] = "Oval";
    ShapeEnum[ShapeEnum["Text"] = 4] = "Text";
    ShapeEnum[ShapeEnum["Polygon"] = 5] = "Polygon";
})(ShapeEnum = exports.ShapeEnum || (exports.ShapeEnum = {}));
function getShapeName(type) {
    switch (type) {
        case ShapeEnum.Invalid: return 'ShapeEnum.Invalid';
        case ShapeEnum.Pen: return 'ShapeEnum.Pen';
        case ShapeEnum.Rect: return 'ShapeEnum.Rect';
        case ShapeEnum.Oval: return 'ShapeEnum.Oval';
        case ShapeEnum.Text: return 'ShapeEnum.Text';
        case ShapeEnum.Polygon: return 'ShapeEnum.Polygon';
        default: return type;
    }
}
exports.getShapeName = getShapeName;

},{}],18:[function(require,module,exports){
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

},{"../ShapeEnum":17}],19:[function(require,module,exports){
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

},{"../../utils/Rect":45}],20:[function(require,module,exports){
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

},{"./Shape":19}],21:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShapeNeedPath = exports.Shape = exports.ShapeData = void 0;
var Data_1 = require("./Data");
Object.defineProperty(exports, "ShapeData", { enumerable: true, get: function () { return Data_1.ShapeData; } });
var Shape_1 = require("./Shape");
Object.defineProperty(exports, "Shape", { enumerable: true, get: function () { return Shape_1.Shape; } });
var ShapeNeedPath_1 = require("./ShapeNeedPath");
Object.defineProperty(exports, "ShapeNeedPath", { enumerable: true, get: function () { return ShapeNeedPath_1.ShapeNeedPath; } });

},{"./Data":18,"./Shape":19,"./ShapeNeedPath":20}],22:[function(require,module,exports){
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
exports.OvalData = void 0;
var ShapeEnum_1 = require("../ShapeEnum");
var base_1 = require("../base");
var OvalData = /** @class */ (function (_super) {
    __extends(OvalData, _super);
    function OvalData() {
        var _this = _super.call(this) || this;
        _this.type = ShapeEnum_1.ShapeEnum.Oval;
        _this.fillStyle = '#0000ff';
        _this.strokeStyle = '#000000';
        _this.lineWidth = 2;
        return _this;
    }
    OvalData.prototype.copy = function () {
        return new OvalData().copyFrom(this);
    };
    return OvalData;
}(base_1.ShapeData));
exports.OvalData = OvalData;

},{"../ShapeEnum":17,"../base":21}],23:[function(require,module,exports){
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

},{"../../mgr/FactoryMgr":14,"../ShapeEnum":17,"../base/ShapeNeedPath":20,"./Data":22}],24:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OvalTool = void 0;
var FactoryMgr_1 = require("../../mgr/FactoryMgr");
var ShapeEnum_1 = require("../ShapeEnum");
var ToolEnum_1 = require("../../tools/ToolEnum");
var SimpleTool_1 = require("../../tools/base/SimpleTool");
Object.defineProperty(exports, "OvalTool", { enumerable: true, get: function () { return SimpleTool_1.SimpleTool; } });
FactoryMgr_1.FactoryMgr.registerTool(ToolEnum_1.ToolEnum.Oval, function () { return new SimpleTool_1.SimpleTool(ToolEnum_1.ToolEnum.Oval, ShapeEnum_1.ShapeEnum.Oval); }, { name: 'oval', desc: 'oval drawer', shape: ShapeEnum_1.ShapeEnum.Oval });

},{"../../mgr/FactoryMgr":14,"../../tools/ToolEnum":39,"../../tools/base/SimpleTool":41,"../ShapeEnum":17}],25:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OvalTool = exports.ShapeOval = exports.OvalData = void 0;
var Data_1 = require("./Data");
Object.defineProperty(exports, "OvalData", { enumerable: true, get: function () { return Data_1.OvalData; } });
var Shape_1 = require("./Shape");
Object.defineProperty(exports, "ShapeOval", { enumerable: true, get: function () { return Shape_1.ShapeOval; } });
var Tool_1 = require("./Tool");
Object.defineProperty(exports, "OvalTool", { enumerable: true, get: function () { return Tool_1.OvalTool; } });

},{"./Data":22,"./Shape":23,"./Tool":24}],26:[function(require,module,exports){
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
exports.PenData = exports.DotsType = void 0;
var ShapeEnum_1 = require("../ShapeEnum");
var base_1 = require("../base");
var DotsType;
(function (DotsType) {
    DotsType[DotsType["Invalid"] = 0] = "Invalid";
    DotsType[DotsType["All"] = 1] = "All";
    DotsType[DotsType["Append"] = 2] = "Append";
})(DotsType = exports.DotsType || (exports.DotsType = {}));
var PenData = /** @class */ (function (_super) {
    __extends(PenData, _super);
    function PenData() {
        var _this = _super.call(this) || this;
        _this.dotsType = DotsType.All;
        _this.coords = [];
        _this.type = ShapeEnum_1.ShapeEnum.Pen;
        _this.strokeStyle = 'white';
        _this.lineCap = 'round';
        _this.lineJoin = 'round';
        _this.lineWidth = 3;
        return _this;
    }
    PenData.prototype.copyFrom = function (other) {
        _super.prototype.copyFrom.call(this, other);
        if (other.dotsType)
            this.dotsType = other.dotsType;
        if (Array.isArray(other.coords))
            this.coords = __spreadArray([], other.coords, true);
        return this;
    };
    PenData.prototype.merge = function (other) {
        var _a;
        _super.prototype.copyFrom.call(this, other);
        if (Array.isArray(other.coords)) {
            if (other.dotsType === DotsType.Append)
                (_a = this.coords).push.apply(_a, other.coords);
            else
                this.coords = __spreadArray([], other.coords, true);
        }
        return this;
    };
    PenData.prototype.copy = function () {
        return new PenData().copyFrom(this);
    };
    return PenData;
}(base_1.ShapeData));
exports.PenData = PenData;

},{"../ShapeEnum":17,"../base":21}],27:[function(require,module,exports){
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

},{"../../mgr/FactoryMgr":14,"../ShapeEnum":17,"../base":21,"./Data":26}],28:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PenTool = void 0;
var ToolEnum_1 = require("../../tools/ToolEnum");
var FactoryMgr_1 = require("../../mgr/FactoryMgr");
var ShapeEnum_1 = require("../ShapeEnum");
var Events_1 = require("../../event/Events");
var Data_1 = require("./Data");
var Tag = '[PenTool]';
var PenTool = /** @class */ (function () {
    function PenTool() {
    }
    PenTool.prototype.start = function () {
    };
    PenTool.prototype.end = function () {
        delete this._curShape;
    };
    Object.defineProperty(PenTool.prototype, "type", {
        get: function () { return ToolEnum_1.ToolEnum.Pen; },
        enumerable: false,
        configurable: true
    });
    PenTool.prototype.render = function () { };
    Object.defineProperty(PenTool.prototype, "board", {
        get: function () {
            return this._board;
        },
        set: function (v) {
            this._board = v;
        },
        enumerable: false,
        configurable: true
    });
    PenTool.prototype.addDot = function (dot, type) {
        var _this = this;
        var shape = this._curShape;
        var board = this.board;
        if (!shape || !board)
            return;
        if (this._prevData)
            return shape.appendDot(dot, type);
        var emitEvent = function () {
            var prev = _this._prevData;
            if (!prev)
                return;
            var curr = shape.data.copy();
            curr.dotsType = Data_1.DotsType.Append;
            curr.coords.splice(0, prev.coords.length);
            board.emit(new Events_1.ShapesChangedEvent(_this.type, { shapeDatas: [[curr, prev]] }));
            delete _this._prevData;
        };
        this._prevData = shape.data.copy();
        var prev = this._prevData;
        if (prev.coords.length <= 0) {
            shape.appendDot(dot, type);
            emitEvent();
        }
        else {
            shape.appendDot(dot, type);
            setTimeout(emitEvent, 1000 / 30);
        }
    };
    PenTool.prototype.pointerMove = function (dot) { };
    PenTool.prototype.pointerDown = function (dot) {
        var board = this.board;
        if (!board)
            return;
        this._curShape = board.factory.newShape(ShapeEnum_1.ShapeEnum.Pen);
        this._curShape.data.editing = true;
        board.add(this._curShape);
        this.addDot(dot, 'first');
    };
    PenTool.prototype.pointerDraw = function (dot) {
        this.addDot(dot);
    };
    PenTool.prototype.pointerUp = function (dot) {
        var shape = this._curShape;
        if (shape)
            shape.data.editing = false;
        this.addDot(dot, 'last');
        this.end();
    };
    return PenTool;
}());
exports.PenTool = PenTool;
FactoryMgr_1.FactoryMgr.registerTool(ToolEnum_1.ToolEnum.Pen, function () { return new PenTool(); }, { name: 'pen', desc: 'simple pen', shape: ShapeEnum_1.ShapeEnum.Pen });

},{"../../event/Events":6,"../../mgr/FactoryMgr":14,"../../tools/ToolEnum":39,"../ShapeEnum":17,"./Data":26}],29:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PenTool = exports.ShapePen = exports.PenData = void 0;
var Data_1 = require("./Data");
Object.defineProperty(exports, "PenData", { enumerable: true, get: function () { return Data_1.PenData; } });
var Shape_1 = require("./Shape");
Object.defineProperty(exports, "ShapePen", { enumerable: true, get: function () { return Shape_1.ShapePen; } });
var Tool_1 = require("./Tool");
Object.defineProperty(exports, "PenTool", { enumerable: true, get: function () { return Tool_1.PenTool; } });

},{"./Data":26,"./Shape":27,"./Tool":28}],30:[function(require,module,exports){
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
exports.RectData = void 0;
var ShapeEnum_1 = require("../ShapeEnum");
var base_1 = require("../base");
var RectData = /** @class */ (function (_super) {
    __extends(RectData, _super);
    function RectData() {
        var _this = _super.call(this) || this;
        _this.type = ShapeEnum_1.ShapeEnum.Rect;
        _this.fillStyle = '#ff0000';
        _this.strokeStyle = '#000000';
        _this.lineWidth = 2;
        return _this;
    }
    RectData.prototype.copy = function () {
        return new RectData().copyFrom(this);
    };
    return RectData;
}(base_1.ShapeData));
exports.RectData = RectData;

},{"../ShapeEnum":17,"../base":21}],31:[function(require,module,exports){
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
exports.ShapeRect = void 0;
var ShapeEnum_1 = require("../ShapeEnum");
var FactoryMgr_1 = require("../../mgr/FactoryMgr");
var Data_1 = require("./Data");
var ShapeNeedPath_1 = require("../base/ShapeNeedPath");
var ShapeRect = /** @class */ (function (_super) {
    __extends(ShapeRect, _super);
    function ShapeRect() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ShapeRect.prototype.path = function (ctx) {
        var _a = this.drawingRect(), x = _a.x, y = _a.y, w = _a.w, h = _a.h;
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.closePath();
    };
    return ShapeRect;
}(ShapeNeedPath_1.ShapeNeedPath));
exports.ShapeRect = ShapeRect;
FactoryMgr_1.FactoryMgr.registerShape(ShapeEnum_1.ShapeEnum.Rect, function () { return new Data_1.RectData; }, function (d) { return new ShapeRect(d); });

},{"../../mgr/FactoryMgr":14,"../ShapeEnum":17,"../base/ShapeNeedPath":20,"./Data":30}],32:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RectTool = void 0;
var FactoryMgr_1 = require("../../mgr/FactoryMgr");
var ShapeEnum_1 = require("../ShapeEnum");
var ToolEnum_1 = require("../../tools/ToolEnum");
var SimpleTool_1 = require("../../tools/base/SimpleTool");
Object.defineProperty(exports, "RectTool", { enumerable: true, get: function () { return SimpleTool_1.SimpleTool; } });
FactoryMgr_1.FactoryMgr.registerTool(ToolEnum_1.ToolEnum.Rect, function () { return new SimpleTool_1.SimpleTool(ToolEnum_1.ToolEnum.Rect, ShapeEnum_1.ShapeEnum.Rect); }, { name: 'rect', desc: 'rect drawer', shape: ShapeEnum_1.ShapeEnum.Rect });

},{"../../mgr/FactoryMgr":14,"../../tools/ToolEnum":39,"../../tools/base/SimpleTool":41,"../ShapeEnum":17}],33:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RectTool = exports.ShapeRect = exports.RectData = void 0;
var Data_1 = require("./Data");
Object.defineProperty(exports, "RectData", { enumerable: true, get: function () { return Data_1.RectData; } });
var Shape_1 = require("./Shape");
Object.defineProperty(exports, "ShapeRect", { enumerable: true, get: function () { return Shape_1.ShapeRect; } });
var Tool_1 = require("./Tool");
Object.defineProperty(exports, "RectTool", { enumerable: true, get: function () { return Tool_1.RectTool; } });

},{"./Data":30,"./Shape":31,"./Tool":32}],34:[function(require,module,exports){
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

},{"../ShapeEnum":17,"../base":21}],35:[function(require,module,exports){
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

},{"../../mgr/FactoryMgr":14,"../../utils/Rect":45,"../ShapeEnum":17,"../base":21,"./Data":34,"./TextSelection":36}],36:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextSelection = void 0;
var TextSelection = /** @class */ (function () {
    function TextSelection(start, end) {
        if (start === void 0) { start = -1; }
        if (end === void 0) { end = -1; }
        this.start = -1;
        this.end = -1;
        this.start = start;
        this.end = end;
    }
    TextSelection.prototype.equal = function (other) {
        return this.start === other.start && this.end === other.end;
    };
    return TextSelection;
}());
exports.TextSelection = TextSelection;

},{}],37:[function(require,module,exports){
"use strict";
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
exports.TextTool = void 0;
var FactoryMgr_1 = require("../../mgr/FactoryMgr");
var ShapeEnum_1 = require("../ShapeEnum");
var ToolEnum_1 = require("../../tools/ToolEnum");
var Events_1 = require("../../event/Events");
var Tag = '[TextTool]';
var TextTool = /** @class */ (function () {
    function TextTool() {
        var _this = this;
        this._editor = document.createElement('textarea');
        this.setCurShape = function (shape) {
            var preShape = _this._curShape;
            if (preShape === shape)
                return;
            preShape && (preShape.editing = false);
            _this._curShape = shape;
            shape && (shape.editing = true);
            if (shape) {
                _this._updateEditorStyle(shape);
                _this._editor.style.display = 'block';
                _this._editor.value = shape.text;
            }
            else {
                _this._editor.style.display = 'gone';
            }
            if (preShape && !preShape.text) {
                var board = _this.board;
                if (!board)
                    return;
                board.remove(preShape);
            }
        };
        this._updateEditorStyle = function (shape) {
            _this._editor.style.font = shape.data.font;
            _this._editor.style.left = shape.data.x + 'px';
            _this._editor.style.top = shape.data.y + 'px';
            _this._editor.style.minWidth = shape.data.w + 'px';
            _this._editor.style.minHeight = shape.data.h + 'px';
            _this._editor.style.maxWidth = shape.data.w + 'px';
            _this._editor.style.maxHeight = shape.data.h + 'px';
            _this._editor.style.paddingLeft = shape.data.t_l + 'px';
            _this._editor.style.paddingTop = shape.data.t_t + 'px';
        };
        this._updateShapeText = function () {
            var shape = _this._curShape;
            if (!shape)
                return;
            var prev = shape.data.copy();
            shape.setText(_this._editor.value, false);
            shape.setSelection({
                start: _this._editor.selectionStart,
                end: _this._editor.selectionEnd
            });
            _this._updateEditorStyle(shape);
            var board = _this.board;
            if (!board)
                return;
            var curr = shape.data.copy();
            board.emit(new Events_1.ShapesChangedEvent(_this.type, { shapeDatas: [[curr, prev]] }));
        };
        this._editor.wrap = 'off';
        this._editor.style.display = 'none';
        this._editor.style.position = 'absolute';
        this._editor.style.left = '0px';
        this._editor.style.top = '0px';
        this._editor.style.boxSizing = 'border-box';
        this._editor.style.outline = 'none';
        this._editor.style.border = 'none';
        this._editor.style.resize = 'none';
        this._editor.style.padding = '0px';
        this._editor.style.margin = '0px';
        this._editor.style.transition = 'none';
        this._editor.style.opacity = '0%';
    }
    TextTool.prototype.start = function () {
        this._editor.addEventListener('input', this._updateShapeText);
        document.addEventListener('selectionchange', this._updateShapeText);
    };
    TextTool.prototype.end = function () {
        this._editor.removeEventListener('input', this._updateShapeText);
        document.removeEventListener('selectionchange', this._updateShapeText);
        this.setCurShape();
    };
    Object.defineProperty(TextTool.prototype, "type", {
        get: function () { return ToolEnum_1.ToolEnum.Text; },
        enumerable: false,
        configurable: true
    });
    TextTool.prototype.render = function () { };
    Object.defineProperty(TextTool.prototype, "board", {
        get: function () {
            return this._board;
        },
        set: function (v) {
            var _a, _b;
            this._board = v;
            (_b = (_a = this._board) === null || _a === void 0 ? void 0 : _a.onscreen.parentElement) === null || _b === void 0 ? void 0 : _b.appendChild(this._editor);
        },
        enumerable: false,
        configurable: true
    });
    TextTool.prototype.pointerMove = function (dot) { };
    TextTool.prototype.pointerDown = function (dot) {
        var _this = this;
        var board = this.board;
        if (!board)
            return;
        var shapeText;
        var shapes = board.hits(__assign(__assign({}, dot), { w: 0, h: 0 }));
        for (var i = 0; i < shapes.length; ++i) {
            var shape = shapes[i];
            if (shape.data.type !== ShapeEnum_1.ShapeEnum.Text)
                continue;
            shapeText = shapes[i];
            break;
        }
        if (!shapeText && this._curShape) {
            return this.setCurShape();
        }
        else if (!shapeText) {
            var newShapeText = board.factory.newShape(ShapeEnum_1.ShapeEnum.Text);
            newShapeText.move(dot.x, dot.y);
            board.add(newShapeText);
            shapeText = newShapeText;
        }
        this.setCurShape(shapeText);
        setTimeout(function () { return _this._editor.focus(); }, 10);
    };
    TextTool.prototype.pointerDraw = function (dot) { };
    TextTool.prototype.pointerUp = function (dot) { };
    return TextTool;
}());
exports.TextTool = TextTool;
FactoryMgr_1.FactoryMgr.registerTool(ToolEnum_1.ToolEnum.Text, function () { return new TextTool; }, { name: 'text', desc: 'text drawer', shape: ShapeEnum_1.ShapeEnum.Text });

},{"../../event/Events":6,"../../mgr/FactoryMgr":14,"../../tools/ToolEnum":39,"../ShapeEnum":17}],38:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextSelection = exports.TextTool = exports.ShapeText = exports.TextData = void 0;
var Data_1 = require("./Data");
Object.defineProperty(exports, "TextData", { enumerable: true, get: function () { return Data_1.TextData; } });
var Shape_1 = require("./Shape");
Object.defineProperty(exports, "ShapeText", { enumerable: true, get: function () { return Shape_1.ShapeText; } });
var Tool_1 = require("./Tool");
Object.defineProperty(exports, "TextTool", { enumerable: true, get: function () { return Tool_1.TextTool; } });
var TextSelection_1 = require("./TextSelection");
Object.defineProperty(exports, "TextSelection", { enumerable: true, get: function () { return TextSelection_1.TextSelection; } });

},{"./Data":34,"./Shape":35,"./TextSelection":36,"./Tool":37}],39:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToolName = exports.ToolEnum = void 0;
var ToolEnum;
(function (ToolEnum) {
    ToolEnum["Invalid"] = "";
    ToolEnum["Selector"] = "TOOL_SELECTOR";
    ToolEnum["Pen"] = "TOOL_PEN";
    ToolEnum["Rect"] = "TOOL_RECT";
    ToolEnum["Oval"] = "TOOL_OVAL";
    ToolEnum["Text"] = "TOOL_TEXT";
    ToolEnum["Polygon"] = "TOOL_Polygon";
})(ToolEnum = exports.ToolEnum || (exports.ToolEnum = {}));
function getToolName(type) {
    switch (type) {
        case ToolEnum.Invalid: return 'ToolEnum.Invalid';
        case ToolEnum.Pen: return 'ToolEnum.Pen';
        case ToolEnum.Rect: return 'ToolEnum.Rect';
        case ToolEnum.Oval: return 'ToolEnum.Oval';
        case ToolEnum.Text: return 'ToolEnum.Text';
        case ToolEnum.Polygon: return 'ToolEnum.Polygon';
        default: return type;
    }
}
exports.getToolName = getToolName;

},{}],40:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidTool = void 0;
var ToolEnum_1 = require("../ToolEnum");
var InvalidTool = /** @class */ (function () {
    function InvalidTool() {
    }
    InvalidTool.prototype.start = function () {
        console.warn('got InvalidTool');
    };
    InvalidTool.prototype.end = function () {
        console.warn('got InvalidTool');
    };
    Object.defineProperty(InvalidTool.prototype, "type", {
        get: function () { return ToolEnum_1.ToolEnum.Invalid; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(InvalidTool.prototype, "board", {
        get: function () {
            console.warn('got InvalidTool');
            return;
        },
        set: function (v) {
            console.warn('got InvalidTool');
        },
        enumerable: false,
        configurable: true
    });
    InvalidTool.prototype.pointerMove = function (dot) {
        console.warn('got InvalidTool');
    };
    InvalidTool.prototype.pointerDown = function (dot) {
        console.warn('got InvalidTool');
    };
    InvalidTool.prototype.pointerDraw = function (dot) {
        console.warn('got InvalidTool');
    };
    InvalidTool.prototype.pointerUp = function (dot) {
        console.warn('got InvalidTool');
    };
    InvalidTool.prototype.render = function () {
        console.warn('got InvalidTool');
    };
    return InvalidTool;
}());
exports.InvalidTool = InvalidTool;

},{"../ToolEnum":39}],41:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleTool = void 0;
var RectHelper_1 = require("../../utils/RectHelper");
var Events_1 = require("../../event/Events");
var Tag = '[SimpleTool]';
var SimpleTool = /** @class */ (function () {
    function SimpleTool(type, shapeType) {
        this._rect = new RectHelper_1.RectHelper();
        this._type = type;
        this._shapeType = shapeType;
    }
    Object.defineProperty(SimpleTool.prototype, "type", {
        get: function () { return this._type; },
        enumerable: false,
        configurable: true
    });
    SimpleTool.prototype.start = function () {
    };
    SimpleTool.prototype.end = function () {
        delete this._curShape;
    };
    SimpleTool.prototype.render = function () { };
    Object.defineProperty(SimpleTool.prototype, "board", {
        get: function () {
            return this._board;
        },
        set: function (v) {
            this._board = v;
        },
        enumerable: false,
        configurable: true
    });
    SimpleTool.prototype.pointerMove = function (dot) { };
    SimpleTool.prototype.pointerDown = function (dot) {
        var x = dot.x, y = dot.y;
        var board = this.board;
        if (!board)
            return;
        this._curShape = board.factory.newShape(this._shapeType);
        var shape = this._curShape;
        if (!shape)
            return;
        board.add(shape);
        this._rect.start(x, y);
        this.updateGeo();
    };
    SimpleTool.prototype.pointerDraw = function (dot) {
        var x = dot.x, y = dot.y;
        this._rect.end(x, y);
        this.updateGeo();
    };
    SimpleTool.prototype.pointerUp = function (dot) {
        var x = dot.x, y = dot.y;
        this._rect.end(x, y);
        this.updateGeo();
        delete this._curShape;
    };
    SimpleTool.prototype.updateGeo = function () {
        var _this = this;
        var _a = this._rect.gen(), x = _a.x, y = _a.y, w = _a.w, h = _a.h;
        var shape = this._curShape;
        var board = this.board;
        if (!shape || !board)
            return;
        if (this._prevData) {
            shape.geo(x, y, w, h);
            return;
        }
        this._prevData = (0, Events_1.pickShapeGeoData)(shape.data);
        var prev = this._prevData;
        var emitEvent = function () {
            var curr = (0, Events_1.pickShapeGeoData)(shape.data);
            board.emit(new Events_1.ShapesGeoEvent(_this.type, { shapeDatas: [[curr, prev]] }));
            delete _this._prevData;
        };
        shape.geo(x, y, w, h);
        setTimeout(emitEvent, 1000 / 60);
    };
    return SimpleTool;
}());
exports.SimpleTool = SimpleTool;

},{"../../event/Events":6,"../../utils/RectHelper":46}],42:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getToolName = exports.ToolEnum = exports.SelectorTool = void 0;
var SelectorTool_1 = require("./selector/SelectorTool");
Object.defineProperty(exports, "SelectorTool", { enumerable: true, get: function () { return SelectorTool_1.SelectorTool; } });
var ToolEnum_1 = require("./ToolEnum");
Object.defineProperty(exports, "ToolEnum", { enumerable: true, get: function () { return ToolEnum_1.ToolEnum; } });
Object.defineProperty(exports, "getToolName", { enumerable: true, get: function () { return ToolEnum_1.getToolName; } });

},{"./ToolEnum":39,"./selector/SelectorTool":43}],43:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectorTool = exports.SelectorStatus = void 0;
var RectHelper_1 = require("../../utils/RectHelper");
var Data_1 = require("../../shape/base/Data");
var FactoryMgr_1 = require("../../mgr/FactoryMgr");
var Shape_1 = require("../../shape/rect/Shape");
var Events_1 = require("../../event/Events");
var ToolEnum_1 = require("../ToolEnum");
var SelectorStatus;
(function (SelectorStatus) {
    SelectorStatus["Invalid"] = "SELECTOR_STATUS_INVALID";
    SelectorStatus["Dragging"] = "SELECTOR_STATUS_DRAGGING";
    SelectorStatus["Selecting"] = "SELECTOR_STATUS_SELECTING";
})(SelectorStatus = exports.SelectorStatus || (exports.SelectorStatus = {}));
var Tag = '[SelectorTool]';
var SelectorTool = /** @class */ (function () {
    function SelectorTool() {
        this._rect = new Shape_1.ShapeRect(new Data_1.ShapeData);
        this._rectHelper = new RectHelper_1.RectHelper();
        this._status = SelectorStatus.Invalid;
        this._prevPos = { x: 0, y: 0 };
        this._shapes = [];
        this._waiting = false;
        this._rect.data.lineWidth = 2;
        this._rect.data.strokeStyle = '#003388FF';
        this._rect.data.fillStyle = '#00338855';
    }
    Object.defineProperty(SelectorTool.prototype, "type", {
        get: function () { return ToolEnum_1.ToolEnum.Selector; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SelectorTool.prototype, "board", {
        get: function () {
            return this._rect.board;
        },
        set: function (v) {
            this._rect.board = v;
        },
        enumerable: false,
        configurable: true
    });
    SelectorTool.prototype.render = function (ctx) {
        this._rect.render(ctx);
    };
    SelectorTool.prototype.start = function () {
    };
    SelectorTool.prototype.end = function () {
        var _a;
        (_a = this.board) === null || _a === void 0 ? void 0 : _a.deselect();
    };
    SelectorTool.prototype.pointerDown = function (dot) {
        var x = dot.x, y = dot.y;
        this._prevPos = { x: x, y: y };
        var board = this.board;
        if (!board)
            return;
        switch (this._status) {
            case SelectorStatus.Invalid:
                this._rectHelper.start(x, y);
                this.updateGeo();
                var shape = board.hit({ x: x, y: y, w: 0, h: 0 });
                if (!shape || !shape.selected)
                    shape = board.selectNear({ x: x, y: y, w: 0, h: 0 });
                if (shape) {
                    this._status = SelectorStatus.Dragging;
                }
                else {
                    this._status = SelectorStatus.Selecting;
                    this._rect.visible = true;
                }
                this._shapes = board.selects.map(function (v) {
                    var data = {
                        i: v.data.i,
                        x: v.data.x,
                        y: v.data.y
                    };
                    return {
                        shape: v,
                        prevData: data
                    };
                });
                return;
        }
    };
    SelectorTool.prototype.pointerMove = function () { };
    SelectorTool.prototype.pointerDraw = function (dot) {
        var diffX = dot.x - this._prevPos.x;
        var diffY = dot.y - this._prevPos.y;
        this._prevPos = dot;
        var board = this.board;
        if (!board)
            return;
        switch (this._status) {
            case SelectorStatus.Selecting: {
                this._rectHelper.end(dot.x, dot.y);
                this.updateGeo();
                board.selectAt(this._rect.data);
                return;
            }
            case SelectorStatus.Dragging: {
                this._shapes.forEach(function (v) {
                    v.prevData = (0, Events_1.pickShapePositionData)(v.shape.data);
                    v.shape.moveBy(diffX, diffY);
                });
                this.emitEvent(false);
                return;
            }
        }
    };
    SelectorTool.prototype.emitEvent = function (immediately) {
        var _this = this;
        if (this._waiting && !immediately)
            return;
        this._waiting = true;
        var board = this.board;
        if (!board)
            return;
        board.emit(new Events_1.ShapesMovedEvent(this.type, {
            shapeDatas: this._shapes.map(function (v) {
                return [(0, Events_1.pickShapePositionData)(v.shape.data), v.prevData];
            })
        }));
        setTimeout(function () { _this._waiting = false; }, 1000 / 30);
    };
    SelectorTool.prototype.pointerUp = function () {
        this._status = SelectorStatus.Invalid;
        this._rect.visible = false;
        this._rectHelper.clear();
        this.emitEvent(true);
    };
    SelectorTool.prototype.updateGeo = function () {
        var _a = this._rectHelper.gen(), x = _a.x, y = _a.y, w = _a.w, h = _a.h;
        this._rect.geo(x, y, w, h);
    };
    return SelectorTool;
}());
exports.SelectorTool = SelectorTool;
FactoryMgr_1.FactoryMgr.registerTool(ToolEnum_1.ToolEnum.Selector, function () { return new SelectorTool; }, {
    name: 'selector',
    desc: 'selector'
});

},{"../../event/Events":6,"../../mgr/FactoryMgr":14,"../../shape/base/Data":18,"../../shape/rect/Shape":31,"../../utils/RectHelper":46,"../ToolEnum":39}],44:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findIndex = void 0;
var findIndex = function (arr, func) {
    for (var i = 0; i < arr.length; ++i) {
        if (func(arr[i], i, arr))
            return i;
    }
    return -1;
};
exports.findIndex = findIndex;

},{}],45:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rect = void 0;
var Rect = /** @class */ (function () {
    function Rect(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    Object.defineProperty(Rect.prototype, "top", {
        get: function () { return this.y; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "left", {
        get: function () { return this.x; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "right", {
        get: function () { return this.x + this.w; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Rect.prototype, "bottom", {
        get: function () { return this.y + this.h; },
        enumerable: false,
        configurable: true
    });
    Rect.prototype.set = function (o) {
        this.x = o.x;
        this.y = o.y;
        this.w = o.w;
        this.h = o.h;
    };
    Rect.prototype.hit = function (b) {
        return Rect.hit(this, b);
    };
    Rect.prototype.toString = function () {
        return "Rect(x=".concat(this.x, ", y=").concat(this.x, ", w=").concat(this.w, ", h=").concat(this.h, ")");
    };
    Rect.prototype.mid = function () {
        return { x: this.x + this.w / 2, y: this.y + this.h / 2 };
    };
    Rect.create = function (rect) {
        return new Rect(rect.x, rect.y, rect.w, rect.h);
    };
    Rect.pure = function (x, y, w, h) {
        return { x: x, y: y, w: w, h: h };
    };
    Rect.bounds = function (r1, r2) {
        var x = Math.min(r1.x, r2.x);
        var y = Math.min(r1.y, r2.y);
        return {
            x: x,
            y: y,
            w: Math.max(r1.x + r1.w, r2.x + r2.w) - x,
            h: Math.max(r1.y + r1.h, r2.y + r2.h) - y
        };
    };
    Rect.hit = function (a, b) {
        var w = 0;
        var h = 0;
        if ('w' in b && 'h' in b) {
            w = b.w;
            h = b.h;
        }
        return (a.x + a.w >= b.x &&
            b.x + w >= a.x &&
            a.y + a.h >= b.y &&
            b.y + h >= a.y);
    };
    Rect.intersect = function (a, b) {
        var x = Math.max(a.x, b.x);
        var y = Math.max(a.y, b.y);
        var right = Math.min(a.x + a.w, b.x + b.w);
        var bottom = Math.min(a.y + a.h, b.y + b.h);
        return {
            x: x,
            y: y,
            w: right - x,
            h: bottom - y
        };
    };
    return Rect;
}());
exports.Rect = Rect;

},{}],46:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RectHelper = exports.LockMode = exports.GenMode = void 0;
var Vector_1 = require("./Vector");
var GenMode;
(function (GenMode) {
    GenMode[GenMode["FromCorner"] = 0] = "FromCorner";
    GenMode[GenMode["FromCenter"] = 1] = "FromCenter";
})(GenMode = exports.GenMode || (exports.GenMode = {}));
var LockMode;
(function (LockMode) {
    LockMode[LockMode["Default"] = 0] = "Default";
    LockMode[LockMode["Square"] = 1] = "Square";
    LockMode[LockMode["Circle"] = 2] = "Circle";
})(LockMode = exports.LockMode || (exports.LockMode = {}));
var RectHelper = /** @class */ (function () {
    function RectHelper() {
        this._from = Vector_1.Vector.pure(-999, -999);
        this._to = Vector_1.Vector.pure(-999, -999);
    }
    RectHelper.prototype.start = function (x, y) {
        this._from.x = x;
        this._from.y = y;
        this._to.x = x;
        this._to.y = y;
    };
    RectHelper.prototype.end = function (x, y) {
        this._to.x = x;
        this._to.y = y;
    };
    RectHelper.prototype.clear = function () {
        this._from = Vector_1.Vector.pure(-999, -999);
        this._to = Vector_1.Vector.pure(-999, -999);
    };
    RectHelper.prototype.gen = function (options) {
        // PREF: IMPROVE ME
        var lockMode = (options === null || options === void 0 ? void 0 : options.lockMode) || LockMode.Default;
        var genMode = (options === null || options === void 0 ? void 0 : options.genMode) || GenMode.FromCorner;
        var _a = this._from, x0 = _a.x, y0 = _a.y;
        var _b = this._to, x1 = _b.x, y1 = _b.y;
        switch (lockMode) {
            case LockMode.Square:
                if (genMode === GenMode.FromCenter) {
                    var d = Math.max(Math.abs(x0 - x1), Math.abs(y0 - y1));
                    x1 = x0 + d;
                    y1 = y0 + d;
                }
                else if (genMode === GenMode.FromCorner) {
                    var k = (y0 - y1) / (x0 - x1) > 0 ? 1 : -1;
                    var b = y1 + k * x1;
                    x1 = (b - y0 + k * x0) / (2 * k);
                    y1 = -k * x1 + b;
                }
                break;
            case LockMode.Circle:
                if (genMode === GenMode.FromCenter) {
                    var r = Math.sqrt(Math.pow(Math.abs(x0 - x1), 2) + Math.pow(Math.abs(y0 - y1), 2));
                    x1 = x0 + r;
                    y1 = y0 + r;
                }
                else if (genMode === GenMode.FromCorner) {
                    var d = Math.sqrt(Math.pow(Math.abs(x0 - x1), 2) + Math.pow(Math.abs(y0 - y1), 2));
                    var xo = (x0 + x1) / 2;
                    var yo = (y0 + y1) / 2;
                    return {
                        x: xo - d / 2,
                        y: yo - d / 2,
                        w: d,
                        h: d,
                    };
                }
                break;
        }
        switch (genMode) {
            case GenMode.FromCenter: {
                var halfW = Math.abs(x0 - x1);
                var halfH = Math.abs(y0 - y1);
                return {
                    x: x0 - halfW,
                    y: y0 - halfH,
                    w: 2 * halfW,
                    h: 2 * halfH,
                };
            }
            default: {
                var x = Math.min(x0, x1);
                var y = Math.min(y0, y1);
                return {
                    x: x,
                    y: y,
                    w: Math.max(x0, x1) - x,
                    h: Math.max(y0, y1) - y
                };
            }
        }
    };
    return RectHelper;
}());
exports.RectHelper = RectHelper;

},{"./Vector":47}],47:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector = void 0;
var Vector = /** @class */ (function () {
    function Vector(x, y) {
        this.x = 0;
        this.y = 0;
        this.x = x;
        this.y = y;
    }
    Vector.mid = function (v0, v1, factor) {
        if (factor === void 0) { factor = 0.5; }
        return {
            x: v0.x + (v1.x - v0.x) * factor,
            y: v0.y + (v1.y - v0.y) * factor,
        };
    };
    Vector.pure = function (x, y) {
        return { x: x, y: y };
    };
    Vector.distance = function (v0, v1) {
        return Math.sqrt(Math.pow(v0.x - v1.x, 2) +
            Math.pow(v0.y - v1.y, 2));
    };
    return Vector;
}());
exports.Vector = Vector;

},{}],48:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rect = exports.getValue = void 0;
function getValue(v, prev) {
    return typeof v !== 'function' ? v : v(prev);
}
exports.getValue = getValue;
var Rect_1 = require("./Rect");
Object.defineProperty(exports, "Rect", { enumerable: true, get: function () { return Rect_1.Rect; } });

},{"./Rect":45}],49:[function(require,module,exports){
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
exports.HSB = exports.RGBA = exports.RGB = exports.LazyHolder = exports.clampI = exports.clampF = void 0;
var clampF = function (min, max, value) {
    return Math.max(min, Math.min(max, value));
};
exports.clampF = clampF;
var clampI = function (min, max, value) {
    return Math.floor((0, exports.clampF)(min, max, value));
};
exports.clampI = clampI;
var LazyHolder = /** @class */ (function () {
    function LazyHolder(result) {
        this._result = [];
        this._dirty = [];
        this._result = result;
    }
    LazyHolder.prototype.dirty = function (i) {
        if (i === void 0) { i = 0; }
        return !!this._dirty[i];
    };
    LazyHolder.prototype.markAsDirty = function (i) {
        if (i === void 0) { i = 0; }
        this._dirty[i] = true;
    };
    LazyHolder.prototype.result = function (v, i) {
        if (i === void 0) { i = 0; }
        if (v !== undefined) {
            this._dirty[i] = false;
            this._result[i] = v;
        }
        return this._result[i];
    };
    return LazyHolder;
}());
exports.LazyHolder = LazyHolder;
var RGB = /** @class */ (function (_super) {
    __extends(RGB, _super);
    function RGB(r, g, b) {
        if (r === void 0) { r = 0; }
        if (g === void 0) { g = 0; }
        if (b === void 0) { b = 0; }
        var _this = _super.call(this, ['']) || this;
        _this._r = 0;
        _this._g = 0;
        _this._b = 0;
        _this.r = r;
        _this.g = g;
        _this.b = b;
        return _this;
    }
    Object.defineProperty(RGB, "White", {
        get: function () { return new RGB(255, 255, 255); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RGB, "Black", {
        get: function () { return new RGB(0, 0, 0); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RGB.prototype, "r", {
        get: function () { return this._r; },
        set: function (v) {
            this._r !== v && this.markAsDirty();
            this._r = (0, exports.clampI)(0, 255, v);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RGB.prototype, "g", {
        get: function () { return this._g; },
        set: function (v) {
            this._g !== v && this.markAsDirty();
            this._g = (0, exports.clampI)(0, 255, v);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RGB.prototype, "b", {
        get: function () { return this._b; },
        set: function (v) {
            this._b !== v && this.markAsDirty();
            this._b = (0, exports.clampI)(0, 255, v);
        },
        enumerable: false,
        configurable: true
    });
    RGB.prototype.equal = function (o) {
        return this.r === o.r && this.g === o.g && this.b === o.b;
    };
    RGB.prototype.setR = function (v) {
        this.r = v;
        return this;
    };
    RGB.prototype.setG = function (v) {
        this.g = v;
        return this;
    };
    RGB.prototype.setB = function (v) {
        this.b = v;
        return this;
    };
    RGB.prototype.copy = function () {
        return new RGB(this.r, this.g, this.b);
    };
    RGB.prototype.toString = function () {
        return this.dirty() ?
            this.result("rgb(".concat(this.r, ",").concat(this.g, ",").concat(this.b, ")")) :
            this.result(undefined);
    };
    RGB.prototype.toHex = function () {
        return this.dirty(1) ?
            this.result("#" +
                Math.floor(this.r).toString(16) +
                Math.floor(this.g).toString(16) +
                Math.floor(this.b).toString(16), 1) :
            this.result(undefined, 1);
    };
    RGB.prototype.toHSB = function (hues) {
        var rgb = [
            this.r,
            this.g,
            this.b
        ];
        rgb.sort(function sortNumber(a, b) {
            return a - b;
        });
        var max = rgb[2];
        var min = rgb[0];
        var ret = new HSB(0, max == 0 ? 0 : (max - min) / max, max / 255);
        var rgbR = this.r;
        var rgbG = this.g;
        var rgbB = this.b;
        if (max == min) // lost rgb
            ret.h = hues;
        else if (max == rgbR && rgbG >= rgbB)
            ret.h = (rgbG - rgbB) * 60 / (max - min) + 0;
        else if (max == rgbR && rgbG < rgbB)
            ret.h = (rgbG - rgbB) * 60 / (max - min) + 360;
        else if (max == rgbG)
            ret.h = (rgbB - rgbR) * 60 / (max - min) + 120;
        else if (max == rgbB)
            ret.h = (rgbR - rgbG) * 60 / (max - min) + 240;
        return ret;
    };
    RGB.prototype.toRGBA = function (a) {
        return new RGBA(this.r, this.g, this.b, a);
    };
    return RGB;
}(LazyHolder));
exports.RGB = RGB;
var RGBA = /** @class */ (function (_super) {
    __extends(RGBA, _super);
    function RGBA(r, g, b, a) {
        if (r === void 0) { r = 0; }
        if (g === void 0) { g = 0; }
        if (b === void 0) { b = 0; }
        if (a === void 0) { a = 0; }
        var _this = _super.call(this, r, g, b) || this;
        _this._a = 0;
        _this.a = a;
        return _this;
    }
    Object.defineProperty(RGBA, "White", {
        get: function () { return new RGBA(255, 255, 255, 255); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RGBA, "Black", {
        get: function () { return new RGBA(0, 0, 0, 255); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RGBA, "WhiteT", {
        get: function () { return new RGBA(255, 255, 255, 0); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RGBA, "BlackT", {
        get: function () { return new RGBA(0, 0, 0, 0); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RGBA.prototype, "a", {
        get: function () { return this._a; },
        set: function (v) {
            this._a !== v && this.markAsDirty();
            this._a = (0, exports.clampI)(0, 255, v);
        },
        enumerable: false,
        configurable: true
    });
    RGBA.prototype.equal = function (o) {
        return this.r === o.r && this.g === o.g && this.b === o.b && this.a === o.a;
    };
    RGBA.prototype.setA = function (v) {
        this.a = v;
        return this;
    };
    RGBA.prototype.copy = function () {
        return new RGBA(this.r, this.g, this.b, this.a);
    };
    RGBA.prototype.toString = function () {
        return this.dirty() ? this.result("rgba(".concat(this.r, ",").concat(this.g, ",").concat(this.b, ",").concat((this.a / 255).toFixed(2), ")")) : this.result(undefined);
    };
    RGBA.prototype.toHex = function () {
        return this.dirty(1) ?
            this.result("#" +
                (this.r < 16 ? '0' : '') +
                Math.floor(this.r).toString(16) +
                (this.g < 16 ? '0' : '') +
                Math.floor(this.g).toString(16) +
                (this.b < 16 ? '0' : '') +
                Math.floor(this.b).toString(16) +
                (this.a < 16 ? '0' : '') +
                Math.floor(this.a).toString(16), 1) :
            this.result(undefined, 1);
    };
    RGBA.prototype.toRGB = function () {
        return new RGB(this.r, this.g, this.b);
    };
    return RGBA;
}(RGB));
exports.RGBA = RGBA;
var HSB = /** @class */ (function () {
    function HSB(h, s, b) {
        this._h = 0;
        this._s = 0;
        this._b = 0;
        this.h = h;
        this.s = s;
        this.b = b;
    }
    Object.defineProperty(HSB.prototype, "h", {
        get: function () { return this._h; },
        set: function (v) { this._h = (0, exports.clampI)(0, 360, v); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HSB.prototype, "s", {
        get: function () { return this._s; },
        set: function (v) { this._s = (0, exports.clampF)(0, 1, v); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HSB.prototype, "b", {
        get: function () { return this._b; },
        set: function (v) { this._b = (0, exports.clampF)(0, 1, v); },
        enumerable: false,
        configurable: true
    });
    HSB.prototype.equal = function (o) {
        return this.h === o.h && this.s === o.s && this.b === o.b;
    };
    HSB.prototype.copy = function () {
        return new HSB(this.h, this.s, this.b);
    };
    HSB.prototype.toString = function () {
        return 'hsb(' + this.h + ',' + this.s + ',' + this.b + ')';
    };
    HSB.prototype.toRGB = function () {
        if (isNaN(this.h))
            console.warn('lost hues!');
        var i = Math.floor((this.h / 60) % 6);
        var f = (this.h / 60) - i;
        var pool = {
            f: f,
            p: this.b * (1 - this.s),
            q: this.b * (1 - f * this.s),
            t: this.b * (1 - (1 - f) * this.s),
            v: this.b
        };
        var relations = [
            ['v', 't', 'p'],
            ['q', 'v', 'p'],
            ['p', 'v', 't'],
            ['p', 'q', 'v'],
            ['t', 'p', 'v'],
            ['v', 'p', 'q'],
        ];
        return new RGB(255 * pool[relations[i][0]], 255 * pool[relations[i][1]], 255 * pool[relations[i][2]]);
    };
    HSB.prototype.toRGBA = function (a) {
        return this.toRGB().toRGBA(a);
    };
    HSB.prototype.stripSB = function () {
        return new HSB(this.h, 1, 1);
    };
    return HSB;
}());
exports.HSB = HSB;

},{}],50:[function(require,module,exports){
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

},{"../../../dist/utils/Rect":45,"../../../dist/utils/Vector":47,"./Color":49}],51:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = "{\"snapshot\":{\"x\":0,\"y\":0,\"w\":4096,\"h\":4096,\"shapes\":[]},\"events\":[{\"type\":\"SHAPES_ADDED\",\"operator\":\"whiteboard\",\"timeStamp\":1665328524304,\"detail\":{\"shapeDatas\":[{\"t\":1,\"i\":\"1_16653285243041\",\"x\":0,\"y\":0,\"w\":0,\"h\":0,\"z\":1665328524305,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[]}]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328524304,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285243041\",\"x\":159,\"y\":199,\"w\":0,\"h\":0,\"z\":1665328524305,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[159,199]},{\"t\":1,\"i\":\"1_16653285243041\",\"x\":0,\"y\":0,\"w\":0,\"h\":0,\"z\":1665328524305,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328524343,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285243041\",\"x\":157,\"y\":199,\"w\":2,\"h\":1,\"z\":1665328524305,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[158,200,157,200]},{\"t\":1,\"i\":\"1_16653285243041\",\"x\":159,\"y\":199,\"w\":0,\"h\":0,\"z\":1665328524305,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[159,199]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328524395,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285243041\",\"x\":157,\"y\":184,\"w\":13,\"h\":16,\"z\":1665328524305,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[157,197,162,191,170,184]},{\"t\":1,\"i\":\"1_16653285243041\",\"x\":157,\"y\":199,\"w\":2,\"h\":1,\"z\":1665328524305,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[159,199,158,200,157,200]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328524443,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285243041\",\"x\":157,\"y\":181,\"w\":28,\"h\":19,\"z\":1665328524305,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[178,181,185,182]},{\"t\":1,\"i\":\"1_16653285243041\",\"x\":157,\"y\":184,\"w\":13,\"h\":16,\"z\":1665328524305,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[159,199,158,200,157,200,157,197,162,191,170,184]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328524477,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285243041\",\"x\":157,\"y\":181,\"w\":37,\"h\":58,\"z\":1665328524305,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[191,191,194,215,194,239]},{\"t\":1,\"i\":\"1_16653285243041\",\"x\":157,\"y\":181,\"w\":28,\"h\":19,\"z\":1665328524305,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[159,199,158,200,157,200,157,197,162,191,170,184,178,181,185,182]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328524530,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285243041\",\"x\":157,\"y\":181,\"w\":37,\"h\":117,\"z\":1665328524305,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[191,262,187,298]},{\"t\":1,\"i\":\"1_16653285243041\",\"x\":157,\"y\":181,\"w\":37,\"h\":58,\"z\":1665328524305,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[159,199,158,200,157,200,157,197,162,191,170,184,178,181,185,182,191,191,194,215,194,239]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328524573,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285243041\",\"x\":157,\"y\":181,\"w\":37,\"h\":118,\"z\":1665328524305,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{},\"dotsType\":2,\"coords\":[187,299,187,299]},{\"t\":1,\"i\":\"1_16653285243041\",\"x\":157,\"y\":181,\"w\":37,\"h\":117,\"z\":1665328524305,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[159,199,158,200,157,200,157,197,162,191,170,184,178,181,185,182,191,191,194,215,194,239,191,262,187,298]}]]}},{\"type\":\"SHAPES_ADDED\",\"operator\":\"whiteboard\",\"timeStamp\":1665328524692,\"detail\":{\"shapeDatas\":[{\"t\":1,\"i\":\"1_16653285246922\",\"x\":0,\"y\":0,\"w\":0,\"h\":0,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[]}]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328524693,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285246922\",\"x\":239,\"y\":159,\"w\":0,\"h\":0,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[239,159]},{\"t\":1,\"i\":\"1_16653285246922\",\"x\":0,\"y\":0,\"w\":0,\"h\":0,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328524745,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285246922\",\"x\":239,\"y\":159,\"w\":0,\"h\":36,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[239,165,239,175,239,195]},{\"t\":1,\"i\":\"1_16653285246922\",\"x\":239,\"y\":159,\"w\":0,\"h\":0,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[239,159]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328524795,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285246922\",\"x\":239,\"y\":159,\"w\":14,\"h\":97,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[242,221,245,235,253,256]},{\"t\":1,\"i\":\"1_16653285246922\",\"x\":239,\"y\":159,\"w\":0,\"h\":36,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[239,159,239,165,239,175,239,195]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328524845,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285246922\",\"x\":239,\"y\":159,\"w\":25,\"h\":116,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[258,266,263,274,264,275]},{\"t\":1,\"i\":\"1_16653285246922\",\"x\":239,\"y\":159,\"w\":14,\"h\":97,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[239,159,239,165,239,175,239,195,242,221,245,235,253,256]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328524896,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285246922\",\"x\":239,\"y\":159,\"w\":25,\"h\":116,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[262,273,255,265,246,254]},{\"t\":1,\"i\":\"1_16653285246922\",\"x\":239,\"y\":159,\"w\":25,\"h\":116,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328524946,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285246922\",\"x\":222,\"y\":159,\"w\":42,\"h\":116,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[235,242,229,239,222,241]},{\"t\":1,\"i\":\"1_16653285246922\",\"x\":239,\"y\":159,\"w\":25,\"h\":116,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328524996,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":159,\"w\":50,\"h\":116,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[217,244,214,246,214,247]},{\"t\":1,\"i\":\"1_16653285246922\",\"x\":222,\"y\":159,\"w\":42,\"h\":116,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328525044,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":159,\"w\":50,\"h\":116,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[217,250,224,253]},{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":159,\"w\":50,\"h\":116,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328525079,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":159,\"w\":57,\"h\":116,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[240,256,255,257,271,253]},{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":159,\"w\":50,\"h\":116,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328525129,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":159,\"w\":92,\"h\":116,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[286,249,297,243,306,235]},{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":159,\"w\":57,\"h\":116,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328525179,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":159,\"w\":93,\"h\":116,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[307,226,306,222,300,221]},{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":159,\"w\":92,\"h\":116,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328525228,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":159,\"w\":93,\"h\":116,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[294,223,286,229]},{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":159,\"w\":93,\"h\":116,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328525262,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":159,\"w\":93,\"h\":116,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[280,239,277,254,279,267]},{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":159,\"w\":93,\"h\":116,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328525312,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":159,\"w\":93,\"h\":117,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[284,273,292,276,302,273]},{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":159,\"w\":93,\"h\":116,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328525362,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":159,\"w\":125,\"h\":117,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[313,263,329,235,339,210]},{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":159,\"w\":93,\"h\":117,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328525412,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":143,\"w\":144,\"h\":133,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[350,176,353,162,358,143]},{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":159,\"w\":125,\"h\":117,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273,313,263,329,235,339,210]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328525462,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":133,\"w\":145,\"h\":143,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[359,134,357,133,353,139]},{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":143,\"w\":144,\"h\":133,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273,313,263,329,235,339,210,350,176,353,162,358,143]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328525513,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":133,\"w\":145,\"h\":143,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[348,153,342,174,335,207]},{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":133,\"w\":145,\"h\":143,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273,313,263,329,235,339,210,350,176,353,162,358,143,359,134,357,133,353,139]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328525563,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":133,\"w\":145,\"h\":143,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[332,235,333,251,337,260]},{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":133,\"w\":145,\"h\":143,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273,313,263,329,235,339,210,350,176,353,162,358,143,359,134,357,133,353,139,348,153,342,174,335,207]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328525613,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":133,\"w\":145,\"h\":143,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[342,263,348,257,355,242]},{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":133,\"w\":145,\"h\":143,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273,313,263,329,235,339,210,350,176,353,162,358,143,359,134,357,133,353,139,348,153,342,174,335,207,332,235,333,251,337,260]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328525663,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":133,\"w\":172,\"h\":143,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[369,201,378,176,386,156]},{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":133,\"w\":145,\"h\":143,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273,313,263,329,235,339,210,350,176,353,162,358,143,359,134,357,133,353,139,348,153,342,174,335,207,332,235,333,251,337,260,342,263,348,257,355,242]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328525711,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":133,\"w\":181,\"h\":143,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[392,143,395,138]},{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":133,\"w\":172,\"h\":143,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273,313,263,329,235,339,210,350,176,353,162,358,143,359,134,357,133,353,139,348,153,342,174,335,207,332,235,333,251,337,260,342,263,348,257,355,242,369,201,378,176,386,156]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328525746,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":133,\"w\":181,\"h\":143,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[395,137,392,145,386,167]},{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":133,\"w\":181,\"h\":143,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273,313,263,329,235,339,210,350,176,353,162,358,143,359,134,357,133,353,139,348,153,342,174,335,207,332,235,333,251,337,260,342,263,348,257,355,242,369,201,378,176,386,156,392,143,395,138]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328525796,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":133,\"w\":181,\"h\":143,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[382,192,380,215,380,234]},{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":133,\"w\":181,\"h\":143,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273,313,263,329,235,339,210,350,176,353,162,358,143,359,134,357,133,353,139,348,153,342,174,335,207,332,235,333,251,337,260,342,263,348,257,355,242,369,201,378,176,386,156,392,143,395,138,395,137,392,145,386,167]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328525846,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":133,\"w\":182,\"h\":143,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[383,246,389,252,396,250]},{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":133,\"w\":181,\"h\":143,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273,313,263,329,235,339,210,350,176,353,162,358,143,359,134,357,133,353,139,348,153,342,174,335,207,332,235,333,251,337,260,342,263,348,257,355,242,369,201,378,176,386,156,392,143,395,138,395,137,392,145,386,167,382,192,380,215,380,234]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328525896,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":133,\"w\":203,\"h\":143,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[405,235,411,219,417,206]},{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":133,\"w\":182,\"h\":143,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273,313,263,329,235,339,210,350,176,353,162,358,143,359,134,357,133,353,139,348,153,342,174,335,207,332,235,333,251,337,260,342,263,348,257,355,242,369,201,378,176,386,156,392,143,395,138,395,137,392,145,386,167,382,192,380,215,380,234,383,246,389,252,396,250]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328525947,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":133,\"w\":206,\"h\":143,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[419,200,420,204,416,211]},{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":133,\"w\":203,\"h\":143,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273,313,263,329,235,339,210,350,176,353,162,358,143,359,134,357,133,353,139,348,153,342,174,335,207,332,235,333,251,337,260,342,263,348,257,355,242,369,201,378,176,386,156,392,143,395,138,395,137,392,145,386,167,382,192,380,215,380,234,383,246,389,252,396,250,405,235,411,219,417,206]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328525997,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":133,\"w\":206,\"h\":143,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[415,221,415,230,420,239]},{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":133,\"w\":206,\"h\":143,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273,313,263,329,235,339,210,350,176,353,162,358,143,359,134,357,133,353,139,348,153,342,174,335,207,332,235,333,251,337,260,342,263,348,257,355,242,369,201,378,176,386,156,392,143,395,138,395,137,392,145,386,167,382,192,380,215,380,234,383,246,389,252,396,250,405,235,411,219,417,206,419,200,420,204,416,211]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328526047,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":133,\"w\":226,\"h\":143,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[423,242,433,242,440,237]},{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":133,\"w\":206,\"h\":143,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273,313,263,329,235,339,210,350,176,353,162,358,143,359,134,357,133,353,139,348,153,342,174,335,207,332,235,333,251,337,260,342,263,348,257,355,242,369,201,378,176,386,156,392,143,395,138,395,137,392,145,386,167,382,192,380,215,380,234,383,246,389,252,396,250,405,235,411,219,417,206,419,200,420,204,416,211,415,221,415,230,420,239]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328526096,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":133,\"w\":237,\"h\":143,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[447,227,451,216,451,207]},{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":133,\"w\":226,\"h\":143,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273,313,263,329,235,339,210,350,176,353,162,358,143,359,134,357,133,353,139,348,153,342,174,335,207,332,235,333,251,337,260,342,263,348,257,355,242,369,201,378,176,386,156,392,143,395,138,395,137,392,145,386,167,382,192,380,215,380,234,383,246,389,252,396,250,405,235,411,219,417,206,419,200,420,204,416,211,415,221,415,230,420,239,423,242,433,242,440,237]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328526147,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":133,\"w\":237,\"h\":143,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[448,206,435,212,426,219]},{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":133,\"w\":237,\"h\":143,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273,313,263,329,235,339,210,350,176,353,162,358,143,359,134,357,133,353,139,348,153,342,174,335,207,332,235,333,251,337,260,342,263,348,257,355,242,369,201,378,176,386,156,392,143,395,138,395,137,392,145,386,167,382,192,380,215,380,234,383,246,389,252,396,250,405,235,411,219,417,206,419,200,420,204,416,211,415,221,415,230,420,239,423,242,433,242,440,237,447,227,451,216,451,207]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328526197,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":133,\"w\":237,\"h\":143,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[420,225,419,227,427,223]},{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":133,\"w\":237,\"h\":143,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273,313,263,329,235,339,210,350,176,353,162,358,143,359,134,357,133,353,139,348,153,342,174,335,207,332,235,333,251,337,260,342,263,348,257,355,242,369,201,378,176,386,156,392,143,395,138,395,137,392,145,386,167,382,192,380,215,380,234,383,246,389,252,396,250,405,235,411,219,417,206,419,200,420,204,416,211,415,221,415,230,420,239,423,242,433,242,440,237,447,227,451,216,451,207,448,206,435,212,426,219]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328526235,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":133,\"w\":237,\"h\":143,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{},\"dotsType\":2,\"coords\":[434,219,434,219]},{\"t\":1,\"i\":\"1_16653285246922\",\"x\":214,\"y\":133,\"w\":237,\"h\":143,\"z\":1665328524694,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[239,159,239,165,239,175,239,195,242,221,245,235,253,256,258,266,263,274,264,275,262,273,255,265,246,254,235,242,229,239,222,241,217,244,214,246,214,247,217,250,224,253,240,256,255,257,271,253,286,249,297,243,306,235,307,226,306,222,300,221,294,223,286,229,280,239,277,254,279,267,284,273,292,276,302,273,313,263,329,235,339,210,350,176,353,162,358,143,359,134,357,133,353,139,348,153,342,174,335,207,332,235,333,251,337,260,342,263,348,257,355,242,369,201,378,176,386,156,392,143,395,138,395,137,392,145,386,167,382,192,380,215,380,234,383,246,389,252,396,250,405,235,411,219,417,206,419,200,420,204,416,211,415,221,415,230,420,239,423,242,433,242,440,237,447,227,451,216,451,207,448,206,435,212,426,219,420,225,419,227,427,223]}]]}},{\"type\":\"SHAPES_ADDED\",\"operator\":\"whiteboard\",\"timeStamp\":1665328526782,\"detail\":{\"shapeDatas\":[{\"t\":1,\"i\":\"1_16653285267823\",\"x\":0,\"y\":0,\"w\":0,\"h\":0,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[]}]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328526782,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285267823\",\"x\":522,\"y\":203,\"w\":0,\"h\":0,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[522,203]},{\"t\":1,\"i\":\"1_16653285267823\",\"x\":0,\"y\":0,\"w\":0,\"h\":0,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328526847,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285267823\",\"x\":512,\"y\":203,\"w\":10,\"h\":17,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[520,205,516,211,512,220]},{\"t\":1,\"i\":\"1_16653285267823\",\"x\":522,\"y\":203,\"w\":0,\"h\":0,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[522,203]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328526896,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":203,\"w\":12,\"h\":33,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[510,227,510,236]},{\"t\":1,\"i\":\"1_16653285267823\",\"x\":512,\"y\":203,\"w\":10,\"h\":17,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[522,203,520,205,516,211,512,220]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328526930,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":203,\"w\":24,\"h\":50,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[517,247,522,250,534,253]},{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":203,\"w\":12,\"h\":33,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[522,203,520,205,516,211,512,220,510,227,510,236]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328526980,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":203,\"w\":43,\"h\":50,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[542,248,550,235,553,222]},{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":203,\"w\":24,\"h\":50,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328527033,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":203,\"w\":43,\"h\":50,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[553,213,551,209,551,208]},{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":203,\"w\":43,\"h\":50,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328527084,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":203,\"w\":43,\"h\":50,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[551,212,551,214]},{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":203,\"w\":43,\"h\":50,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328527132,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":203,\"w\":45,\"h\":50,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[553,229,554,239,555,243]},{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":203,\"w\":43,\"h\":50,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328527179,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":203,\"w\":54,\"h\":50,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[559,246,564,247]},{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":203,\"w\":45,\"h\":50,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328527215,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":203,\"w\":74,\"h\":50,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[569,242,577,232,584,217]},{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":203,\"w\":54,\"h\":50,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328527265,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":77,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[586,209,587,204,586,202]},{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":203,\"w\":74,\"h\":50,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328527315,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":77,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[579,204,574,205,571,207]},{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":77,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328527366,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":77,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[570,208,575,208]},{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":77,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328527415,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":88,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[581,209,588,209,598,209]},{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":77,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328527463,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":100,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[603,209,610,208]},{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":88,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208,581,209,588,209,598,209]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328527499,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":101,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[611,208]},{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":100,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208,581,209,588,209,598,209,603,209,610,208]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328527538,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":101,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[610,208,608,208]},{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":101,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208,581,209,588,209,598,209,603,209,610,208,611,208]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328527580,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":101,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[606,208,602,213]},{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":101,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208,581,209,588,209,598,209,603,209,610,208,611,208,610,208,608,208]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328527614,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":101,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[598,223,597,231,598,239]},{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":101,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208,581,209,588,209,598,209,603,209,610,208,611,208,610,208,608,208,606,208,602,213]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328527663,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":101,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[601,243,606,244]},{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":101,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208,581,209,588,209,598,209,603,209,610,208,611,208,610,208,608,208,606,208,602,213,598,223,597,231,598,239]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328527696,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":108,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[611,242,618,231]},{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":101,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208,581,209,588,209,598,209,603,209,610,208,611,208,610,208,608,208,606,208,602,213,598,223,597,231,598,239,601,243,606,244]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328527731,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":111,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[621,218,621,211,616,208]},{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":108,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208,581,209,588,209,598,209,603,209,610,208,611,208,610,208,608,208,606,208,602,213,598,223,597,231,598,239,601,243,606,244,611,242,618,231]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328527780,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":111,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[613,208,605,213]},{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":111,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208,581,209,588,209,598,209,603,209,610,208,611,208,610,208,608,208,606,208,602,213,598,223,597,231,598,239,601,243,606,244,611,242,618,231,621,218,621,211,616,208]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328527814,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":111,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[601,215,601,216,609,212]},{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":111,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208,581,209,588,209,598,209,603,209,610,208,611,208,610,208,608,208,606,208,602,213,598,223,597,231,598,239,601,243,606,244,611,242,618,231,621,218,621,211,616,208,613,208,605,213]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328527864,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":118,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[620,207,628,204]},{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":111,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208,581,209,588,209,598,209,603,209,610,208,611,208,610,208,608,208,606,208,602,213,598,223,597,231,598,239,601,243,606,244,611,242,618,231,621,218,621,211,616,208,613,208,605,213,601,215,601,216,609,212]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328527898,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":140,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[644,202,648,202,650,209]},{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":118,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208,581,209,588,209,598,209,603,209,610,208,611,208,610,208,608,208,606,208,602,213,598,223,597,231,598,239,601,243,606,244,611,242,618,231,621,218,621,211,616,208,613,208,605,213,601,215,601,216,609,212,620,207,628,204]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328527948,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":140,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[650,217,650,230,650,240]},{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":140,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208,581,209,588,209,598,209,603,209,610,208,611,208,610,208,608,208,606,208,602,213,598,223,597,231,598,239,601,243,606,244,611,242,618,231,621,218,621,211,616,208,613,208,605,213,601,215,601,216,609,212,620,207,628,204,644,202,648,202,650,209]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328527998,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":140,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[650,246,650,248,650,243]},{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":140,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208,581,209,588,209,598,209,603,209,610,208,611,208,610,208,608,208,606,208,602,213,598,223,597,231,598,239,601,243,606,244,611,242,618,231,621,218,621,211,616,208,613,208,605,213,601,215,601,216,609,212,620,207,628,204,644,202,648,202,650,209,650,217,650,230,650,240]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328528048,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":150,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[650,233,652,219,660,205]},{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":140,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208,581,209,588,209,598,209,603,209,610,208,611,208,610,208,608,208,606,208,602,213,598,223,597,231,598,239,601,243,606,244,611,242,618,231,621,218,621,211,616,208,613,208,605,213,601,215,601,216,609,212,620,207,628,204,644,202,648,202,650,209,650,217,650,230,650,240,650,246,650,248,650,243]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328528098,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":199,\"w\":166,\"h\":54,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[666,200,673,199,676,202]},{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":202,\"w\":150,\"h\":51,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208,581,209,588,209,598,209,603,209,610,208,611,208,610,208,608,208,606,208,602,213,598,223,597,231,598,239,601,243,606,244,611,242,618,231,621,218,621,211,616,208,613,208,605,213,601,215,601,216,609,212,620,207,628,204,644,202,648,202,650,209,650,217,650,230,650,240,650,246,650,248,650,243,650,233,652,219,660,205]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328528148,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":199,\"w\":168,\"h\":54,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[677,208,678,217,678,225]},{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":199,\"w\":166,\"h\":54,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208,581,209,588,209,598,209,603,209,610,208,611,208,610,208,608,208,606,208,602,213,598,223,597,231,598,239,601,243,606,244,611,242,618,231,621,218,621,211,616,208,613,208,605,213,601,215,601,216,609,212,620,207,628,204,644,202,648,202,650,209,650,217,650,230,650,240,650,246,650,248,650,243,650,233,652,219,660,205,666,200,673,199,676,202]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328528197,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":199,\"w\":168,\"h\":54,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{},\"dotsType\":2,\"coords\":[677,230,675,225,675,225]},{\"t\":1,\"i\":\"1_16653285267823\",\"x\":510,\"y\":199,\"w\":168,\"h\":54,\"z\":1665328526785,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[522,203,520,205,516,211,512,220,510,227,510,236,517,247,522,250,534,253,542,248,550,235,553,222,553,213,551,209,551,208,551,212,551,214,553,229,554,239,555,243,559,246,564,247,569,242,577,232,584,217,586,209,587,204,586,202,579,204,574,205,571,207,570,208,575,208,581,209,588,209,598,209,603,209,610,208,611,208,610,208,608,208,606,208,602,213,598,223,597,231,598,239,601,243,606,244,611,242,618,231,621,218,621,211,616,208,613,208,605,213,601,215,601,216,609,212,620,207,628,204,644,202,648,202,650,209,650,217,650,230,650,240,650,246,650,248,650,243,650,233,652,219,660,205,666,200,673,199,676,202,677,208,678,217,678,225]}]]}},{\"type\":\"SHAPES_ADDED\",\"operator\":\"whiteboard\",\"timeStamp\":1665328528642,\"detail\":{\"shapeDatas\":[{\"t\":1,\"i\":\"1_16653285286424\",\"x\":0,\"y\":0,\"w\":0,\"h\":0,\"z\":1665328528646,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[]}]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328528642,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285286424\",\"x\":729,\"y\":138,\"w\":0,\"h\":0,\"z\":1665328528646,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[729,138]},{\"t\":1,\"i\":\"1_16653285286424\",\"x\":0,\"y\":0,\"w\":0,\"h\":0,\"z\":1665328528646,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328528681,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285286424\",\"x\":729,\"y\":137,\"w\":1,\"h\":1,\"z\":1665328528646,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[730,137]},{\"t\":1,\"i\":\"1_16653285286424\",\"x\":729,\"y\":138,\"w\":0,\"h\":0,\"z\":1665328528646,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[729,138]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328528731,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285286424\",\"x\":725,\"y\":137,\"w\":5,\"h\":8,\"z\":1665328528646,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[729,139,725,145]},{\"t\":1,\"i\":\"1_16653285286424\",\"x\":729,\"y\":137,\"w\":1,\"h\":1,\"z\":1665328528646,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[729,138,730,137]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328528766,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285286424\",\"x\":702,\"y\":137,\"w\":28,\"h\":56,\"z\":1665328528646,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[720,154,713,168,702,193]},{\"t\":1,\"i\":\"1_16653285286424\",\"x\":725,\"y\":137,\"w\":5,\"h\":8,\"z\":1665328528646,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[729,138,730,137,729,139,725,145]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328528815,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285286424\",\"x\":687,\"y\":137,\"w\":43,\"h\":111,\"z\":1665328528646,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[694,214,687,238,687,248]},{\"t\":1,\"i\":\"1_16653285286424\",\"x\":702,\"y\":137,\"w\":28,\"h\":56,\"z\":1665328528646,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[729,138,730,137,729,139,725,145,720,154,713,168,702,193]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328528867,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285286424\",\"x\":687,\"y\":137,\"w\":43,\"h\":119,\"z\":1665328528646,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[693,254,699,256]},{\"t\":1,\"i\":\"1_16653285286424\",\"x\":687,\"y\":137,\"w\":43,\"h\":111,\"z\":1665328528646,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[729,138,730,137,729,139,725,145,720,154,713,168,702,193,694,214,687,238,687,248]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328528915,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285286424\",\"x\":687,\"y\":137,\"w\":43,\"h\":119,\"z\":1665328528646,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{},\"dotsType\":2,\"coords\":[714,249,719,245,719,245]},{\"t\":1,\"i\":\"1_16653285286424\",\"x\":687,\"y\":137,\"w\":43,\"h\":119,\"z\":1665328528646,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[729,138,730,137,729,139,725,145,720,154,713,168,702,193,694,214,687,238,687,248,693,254,699,256]}]]}},{\"type\":\"SHAPES_ADDED\",\"operator\":\"whiteboard\",\"timeStamp\":1665328529023,\"detail\":{\"shapeDatas\":[{\"t\":1,\"i\":\"1_16653285290235\",\"x\":0,\"y\":0,\"w\":0,\"h\":0,\"z\":1665328529028,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[]}]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328529023,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285290235\",\"x\":750,\"y\":210,\"w\":0,\"h\":0,\"z\":1665328529028,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[750,210]},{\"t\":1,\"i\":\"1_16653285290235\",\"x\":0,\"y\":0,\"w\":0,\"h\":0,\"z\":1665328529028,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328529065,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285290235\",\"x\":746,\"y\":210,\"w\":4,\"h\":1,\"z\":1665328529028,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[747,211,746,211]},{\"t\":1,\"i\":\"1_16653285290235\",\"x\":750,\"y\":210,\"w\":0,\"h\":0,\"z\":1665328529028,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[750,210]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328529099,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285290235\",\"x\":742,\"y\":210,\"w\":8,\"h\":1,\"z\":1665328529028,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[744,211,742,211]},{\"t\":1,\"i\":\"1_16653285290235\",\"x\":746,\"y\":210,\"w\":4,\"h\":1,\"z\":1665328529028,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[750,210,747,211,746,211]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328529150,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285290235\",\"x\":729,\"y\":210,\"w\":21,\"h\":20,\"z\":1665328529028,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[740,212,736,217,729,230]},{\"t\":1,\"i\":\"1_16653285290235\",\"x\":742,\"y\":210,\"w\":8,\"h\":1,\"z\":1665328529028,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[750,210,747,211,746,211,744,211,742,211]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328529200,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285290235\",\"x\":723,\"y\":210,\"w\":27,\"h\":40,\"z\":1665328529028,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[724,243,723,248,728,250]},{\"t\":1,\"i\":\"1_16653285290235\",\"x\":729,\"y\":210,\"w\":21,\"h\":20,\"z\":1665328529028,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[750,210,747,211,746,211,744,211,742,211,740,212,736,217,729,230]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328529250,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285290235\",\"x\":723,\"y\":210,\"w\":42,\"h\":40,\"z\":1665328529028,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[735,246,747,236,765,214]},{\"t\":1,\"i\":\"1_16653285290235\",\"x\":723,\"y\":210,\"w\":27,\"h\":40,\"z\":1665328529028,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[750,210,747,211,746,211,744,211,742,211,740,212,736,217,729,230,724,243,723,248,728,250]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328529300,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285290235\",\"x\":723,\"y\":151,\"w\":76,\"h\":99,\"z\":1665328529028,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[779,194,793,167,799,151]},{\"t\":1,\"i\":\"1_16653285290235\",\"x\":723,\"y\":210,\"w\":42,\"h\":40,\"z\":1665328529028,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[750,210,747,211,746,211,744,211,742,211,740,212,736,217,729,230,724,243,723,248,728,250,735,246,747,236,765,214]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328529349,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285290235\",\"x\":723,\"y\":139,\"w\":78,\"h\":111,\"z\":1665328529028,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[801,142,801,139]},{\"t\":1,\"i\":\"1_16653285290235\",\"x\":723,\"y\":151,\"w\":76,\"h\":99,\"z\":1665328529028,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[750,210,747,211,746,211,744,211,742,211,740,212,736,217,729,230,724,243,723,248,728,250,735,246,747,236,765,214,779,194,793,167,799,151]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328529383,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285290235\",\"x\":723,\"y\":138,\"w\":78,\"h\":112,\"z\":1665328529028,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[796,138,791,145,783,159]},{\"t\":1,\"i\":\"1_16653285290235\",\"x\":723,\"y\":139,\"w\":78,\"h\":111,\"z\":1665328529028,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[750,210,747,211,746,211,744,211,742,211,740,212,736,217,729,230,724,243,723,248,728,250,735,246,747,236,765,214,779,194,793,167,799,151,801,142,801,139]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328529433,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285290235\",\"x\":723,\"y\":138,\"w\":78,\"h\":112,\"z\":1665328529028,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[773,179,762,209,759,228]},{\"t\":1,\"i\":\"1_16653285290235\",\"x\":723,\"y\":138,\"w\":78,\"h\":112,\"z\":1665328529028,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[750,210,747,211,746,211,744,211,742,211,740,212,736,217,729,230,724,243,723,248,728,250,735,246,747,236,765,214,779,194,793,167,799,151,801,142,801,139,796,138,791,145,783,159]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328529483,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285290235\",\"x\":723,\"y\":138,\"w\":78,\"h\":116,\"z\":1665328529028,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[760,243,770,253,781,254]},{\"t\":1,\"i\":\"1_16653285290235\",\"x\":723,\"y\":138,\"w\":78,\"h\":112,\"z\":1665328529028,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[750,210,747,211,746,211,744,211,742,211,740,212,736,217,729,230,724,243,723,248,728,250,735,246,747,236,765,214,779,194,793,167,799,151,801,142,801,139,796,138,791,145,783,159,773,179,762,209,759,228]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328529532,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285290235\",\"x\":723,\"y\":138,\"w\":85,\"h\":116,\"z\":1665328529028,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{},\"dotsType\":2,\"coords\":[792,248,805,232,808,227,808,227]},{\"t\":1,\"i\":\"1_16653285290235\",\"x\":723,\"y\":138,\"w\":78,\"h\":116,\"z\":1665328529028,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[750,210,747,211,746,211,744,211,742,211,740,212,736,217,729,230,724,243,723,248,728,250,735,246,747,236,765,214,779,194,793,167,799,151,801,142,801,139,796,138,791,145,783,159,773,179,762,209,759,228,760,243,770,253,781,254]}]]}},{\"type\":\"SHAPES_ADDED\",\"operator\":\"whiteboard\",\"timeStamp\":1665328531790,\"detail\":{\"shapeDatas\":[{\"t\":1,\"i\":\"1_16653285317906\",\"x\":0,\"y\":0,\"w\":0,\"h\":0,\"z\":1665328531796,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[]}]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328531790,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285317906\",\"x\":401,\"y\":349,\"w\":0,\"h\":0,\"z\":1665328531796,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[401,349]},{\"t\":1,\"i\":\"1_16653285317906\",\"x\":0,\"y\":0,\"w\":0,\"h\":0,\"z\":1665328531796,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328531835,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285317906\",\"x\":401,\"y\":339,\"w\":10,\"h\":10,\"z\":1665328531796,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[403,347,406,344,411,339]},{\"t\":1,\"i\":\"1_16653285317906\",\"x\":401,\"y\":349,\"w\":0,\"h\":0,\"z\":1665328531796,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[401,349]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328531885,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285317906\",\"x\":401,\"y\":331,\"w\":21,\"h\":18,\"z\":1665328531796,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[416,335,422,331]},{\"t\":1,\"i\":\"1_16653285317906\",\"x\":401,\"y\":339,\"w\":10,\"h\":10,\"z\":1665328531796,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[401,349,403,347,406,344,411,339]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328531920,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285317906\",\"x\":401,\"y\":328,\"w\":51,\"h\":21,\"z\":1665328531796,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[433,328,442,328,452,334]},{\"t\":1,\"i\":\"1_16653285317906\",\"x\":401,\"y\":331,\"w\":21,\"h\":18,\"z\":1665328531796,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[401,349,403,347,406,344,411,339,416,335,422,331]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328531969,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285317906\",\"x\":401,\"y\":328,\"w\":65,\"h\":25,\"z\":1665328531796,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[460,342,466,353]},{\"t\":1,\"i\":\"1_16653285317906\",\"x\":401,\"y\":328,\"w\":51,\"h\":21,\"z\":1665328531796,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[401,349,403,347,406,344,411,339,416,335,422,331,433,328,442,328,452,334]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328532003,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285317906\",\"x\":401,\"y\":328,\"w\":66,\"h\":31,\"z\":1665328531796,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{},\"dotsType\":2,\"coords\":[467,359,466,357,466,357]},{\"t\":1,\"i\":\"1_16653285317906\",\"x\":401,\"y\":328,\"w\":65,\"h\":25,\"z\":1665328531796,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[401,349,403,347,406,344,411,339,416,335,422,331,433,328,442,328,452,334,460,342,466,353]}]]}},{\"type\":\"SHAPES_ADDED\",\"operator\":\"whiteboard\",\"timeStamp\":1665328532414,\"detail\":{\"shapeDatas\":[{\"t\":1,\"i\":\"1_16653285324147\",\"x\":0,\"y\":0,\"w\":0,\"h\":0,\"z\":1665328532421,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[]}]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328532414,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285324147\",\"x\":499,\"y\":354,\"w\":0,\"h\":0,\"z\":1665328532421,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[499,354]},{\"t\":1,\"i\":\"1_16653285324147\",\"x\":0,\"y\":0,\"w\":0,\"h\":0,\"z\":1665328532421,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328532502,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285324147\",\"x\":499,\"y\":348,\"w\":2,\"h\":6,\"z\":1665328532421,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[500,353,500,351,501,348]},{\"t\":1,\"i\":\"1_16653285324147\",\"x\":499,\"y\":354,\"w\":0,\"h\":0,\"z\":1665328532421,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[499,354]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328532552,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285324147\",\"x\":499,\"y\":335,\"w\":20,\"h\":19,\"z\":1665328532421,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[504,344,510,339,519,335]},{\"t\":1,\"i\":\"1_16653285324147\",\"x\":499,\"y\":348,\"w\":2,\"h\":6,\"z\":1665328532421,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[499,354,500,353,500,351,501,348]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328532601,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285324147\",\"x\":499,\"y\":334,\"w\":37,\"h\":20,\"z\":1665328532421,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[526,334,536,339]},{\"t\":1,\"i\":\"1_16653285324147\",\"x\":499,\"y\":335,\"w\":20,\"h\":19,\"z\":1665328532421,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[499,354,500,353,500,351,501,348,504,344,510,339,519,335]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328532666,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285324147\",\"x\":499,\"y\":334,\"w\":53,\"h\":25,\"z\":1665328532421,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{},\"dotsType\":2,\"coords\":[549,352,552,359,552,359]},{\"t\":1,\"i\":\"1_16653285324147\",\"x\":499,\"y\":334,\"w\":37,\"h\":20,\"z\":1665328532421,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[499,354,500,353,500,351,501,348,504,344,510,339,519,335,526,334,536,339]}]]}},{\"type\":\"SHAPES_ADDED\",\"operator\":\"whiteboard\",\"timeStamp\":1665328533166,\"detail\":{\"shapeDatas\":[{\"t\":1,\"i\":\"1_16653285331668\",\"x\":0,\"y\":0,\"w\":0,\"h\":0,\"z\":1665328533174,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[]}]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328533166,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285331668\",\"x\":428,\"y\":408,\"w\":0,\"h\":0,\"z\":1665328533174,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[428,408]},{\"t\":1,\"i\":\"1_16653285331668\",\"x\":0,\"y\":0,\"w\":0,\"h\":0,\"z\":1665328533174,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328533221,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285331668\",\"x\":428,\"y\":408,\"w\":3,\"h\":8,\"z\":1665328533174,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[428,410,429,413,431,416]},{\"t\":1,\"i\":\"1_16653285331668\",\"x\":428,\"y\":408,\"w\":0,\"h\":0,\"z\":1665328533174,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[428,408]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328533270,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285331668\",\"x\":428,\"y\":408,\"w\":19,\"h\":26,\"z\":1665328533174,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[433,420,439,427,447,434]},{\"t\":1,\"i\":\"1_16653285331668\",\"x\":428,\"y\":408,\"w\":3,\"h\":8,\"z\":1665328533174,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[428,408,428,410,429,413,431,416]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328533318,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285331668\",\"x\":428,\"y\":408,\"w\":46,\"h\":38,\"z\":1665328533174,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[457,440,474,446]},{\"t\":1,\"i\":\"1_16653285331668\",\"x\":428,\"y\":408,\"w\":19,\"h\":26,\"z\":1665328533174,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[428,408,428,410,429,413,431,416,433,420,439,427,447,434]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328533352,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285331668\",\"x\":428,\"y\":408,\"w\":82,\"h\":38,\"z\":1665328533174,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":2,\"coords\":[489,446,510,438]},{\"t\":1,\"i\":\"1_16653285331668\",\"x\":428,\"y\":408,\"w\":46,\"h\":38,\"z\":1665328533174,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[428,408,428,410,429,413,431,416,433,420,439,427,447,434,457,440,474,446]}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_PEN\",\"timeStamp\":1665328533405,\"detail\":{\"shapeDatas\":[[{\"t\":1,\"i\":\"1_16653285331668\",\"x\":428,\"y\":408,\"w\":118,\"h\":38,\"z\":1665328533174,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{},\"dotsType\":2,\"coords\":[539,418,546,411,546,411]},{\"t\":1,\"i\":\"1_16653285331668\",\"x\":428,\"y\":408,\"w\":82,\"h\":38,\"z\":1665328533174,\"style\":{\"a\":\"white\",\"c\":\"round\",\"f\":\"round\",\"g\":3},\"status\":{\"e\":1},\"dotsType\":1,\"coords\":[428,408,428,410,429,413,431,416,433,420,439,427,447,434,457,440,474,446,489,446,510,438]}]]}}]}";

},{}],52:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = "{\"snapshot\":{\"x\":0,\"y\":0,\"w\":4096,\"h\":4096,\"shapes\":[]},\"events\":[{\"type\":\"TOOL_CHANGED\",\"operator\":\"whiteboard\",\"timeStamp\":1665328594833,\"detail\":{\"from\":\"TOOL_SELECTOR\",\"to\":\"TOOL_RECT\"}},{\"type\":\"SHAPES_ADDED\",\"operator\":\"whiteboard\",\"timeStamp\":1665328595289,\"detail\":{\"shapeDatas\":[{\"t\":2,\"i\":\"2_16653285952891\",\"x\":0,\"y\":0,\"w\":0,\"h\":0,\"z\":1665328595290,\"style\":{\"b\":\"#ff0000\",\"a\":\"#000000\",\"g\":2},\"status\":{}}]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328595306,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":0,\"h\":0},{\"i\":\"2_16653285952891\",\"x\":0,\"y\":0,\"w\":0,\"h\":0}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328595348,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":1,\"h\":2},{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":0,\"h\":0}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328595365,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":5,\"h\":8},{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":1,\"h\":2}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328595400,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":13,\"h\":18},{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":5,\"h\":8}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328595432,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":33,\"h\":32},{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":13,\"h\":18}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328595466,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":47,\"h\":39},{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":33,\"h\":32}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328595519,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":49,\"h\":40},{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":47,\"h\":39}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328595552,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":52,\"h\":43},{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":49,\"h\":40}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328595583,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":56,\"h\":45},{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":52,\"h\":43}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328595608,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":63,\"h\":51},{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":56,\"h\":45}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328595632,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":67,\"h\":54},{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":63,\"h\":51}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328595650,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":74,\"h\":60},{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":67,\"h\":54}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328595681,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":77,\"h\":63},{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":74,\"h\":60}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328595698,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":80,\"h\":66},{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":77,\"h\":63}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328595715,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":82,\"h\":68},{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":80,\"h\":66}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328595733,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":87,\"h\":72},{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":82,\"h\":68}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328595766,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":90,\"h\":74},{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":87,\"h\":72}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328595784,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":97,\"h\":80},{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":90,\"h\":74}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328595817,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":106,\"h\":86},{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":97,\"h\":80}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328595850,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":114,\"h\":93},{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":106,\"h\":86}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328595884,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":123,\"h\":99},{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":114,\"h\":93}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328595917,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":132,\"h\":106},{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":123,\"h\":99}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328595948,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":134,\"h\":109},{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":132,\"h\":106}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328595965,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":136,\"h\":111},{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":134,\"h\":109}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328595982,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":137,\"h\":112},{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":136,\"h\":111}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328596000,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":139,\"h\":114},{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":137,\"h\":112}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328596034,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":141,\"h\":116},{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":139,\"h\":114}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328596083,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":142,\"h\":117},{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":141,\"h\":116}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328596388,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":142,\"h\":117},{\"i\":\"2_16653285952891\",\"x\":52,\"y\":44,\"w\":142,\"h\":117}]]}},{\"type\":\"TOOL_CHANGED\",\"operator\":\"whiteboard\",\"timeStamp\":1665328598413,\"detail\":{\"from\":\"TOOL_RECT\",\"to\":\"TOOL_OVAL\"}},{\"type\":\"SHAPES_ADDED\",\"operator\":\"whiteboard\",\"timeStamp\":1665328598860,\"detail\":{\"shapeDatas\":[{\"t\":3,\"i\":\"3_16653285988602\",\"x\":0,\"y\":0,\"w\":0,\"h\":0,\"z\":1665328598862,\"style\":{\"b\":\"#0000ff\",\"a\":\"#000000\",\"g\":2},\"status\":{}}]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328598876,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":0,\"h\":0},{\"i\":\"3_16653285988602\",\"x\":0,\"y\":0,\"w\":0,\"h\":0}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328598920,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":7,\"h\":7},{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":0,\"h\":0}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328598952,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":15,\"h\":14},{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":7,\"h\":7}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328598969,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":27,\"h\":30},{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":15,\"h\":14}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328599001,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":35,\"h\":38},{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":27,\"h\":30}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328599019,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":52,\"h\":53},{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":35,\"h\":38}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328599071,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":62,\"h\":63},{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":52,\"h\":53}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328599104,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":69,\"h\":71},{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":62,\"h\":63}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328599135,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":78,\"h\":80},{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":69,\"h\":71}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328599154,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":86,\"h\":87},{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":78,\"h\":80}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328599185,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":89,\"h\":89},{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":86,\"h\":87}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328599205,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":96,\"h\":96},{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":89,\"h\":89}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328599238,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":104,\"h\":101},{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":96,\"h\":96}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328599268,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":107,\"h\":104},{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":104,\"h\":101}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328599287,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":113,\"h\":109},{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":107,\"h\":104}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328599320,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":118,\"h\":113},{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":113,\"h\":109}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328599439,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":120,\"h\":114},{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":118,\"h\":113}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328599469,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":122,\"h\":115},{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":120,\"h\":114}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328599487,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":125,\"h\":117},{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":122,\"h\":115}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328599504,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":129,\"h\":121},{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":125,\"h\":117}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328599535,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":131,\"h\":122},{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":129,\"h\":121}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328599707,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":129,\"h\":120},{\"i\":\"3_16653285988602\",\"x\":282,\"y\":49,\"w\":131,\"h\":122}]]}},{\"type\":\"SHAPES_ADDED\",\"operator\":\"whiteboard\",\"timeStamp\":1665328601336,\"detail\":{\"shapeDatas\":[{\"t\":3,\"i\":\"3_16653286013363\",\"x\":0,\"y\":0,\"w\":0,\"h\":0,\"z\":1665328601339,\"style\":{\"b\":\"#0000ff\",\"a\":\"#000000\",\"g\":2},\"status\":{}}]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328601353,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653286013363\",\"x\":212,\"y\":327,\"w\":2,\"h\":0},{\"i\":\"3_16653286013363\",\"x\":0,\"y\":0,\"w\":0,\"h\":0}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328601374,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653286013363\",\"x\":202,\"y\":324,\"w\":12,\"h\":3},{\"i\":\"3_16653286013363\",\"x\":212,\"y\":327,\"w\":2,\"h\":0}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328601407,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653286013363\",\"x\":186,\"y\":314,\"w\":28,\"h\":13},{\"i\":\"3_16653286013363\",\"x\":202,\"y\":324,\"w\":12,\"h\":3}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328601438,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653286013363\",\"x\":172,\"y\":305,\"w\":42,\"h\":22},{\"i\":\"3_16653286013363\",\"x\":186,\"y\":314,\"w\":28,\"h\":13}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328601454,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653286013363\",\"x\":159,\"y\":295,\"w\":55,\"h\":32},{\"i\":\"3_16653286013363\",\"x\":172,\"y\":305,\"w\":42,\"h\":22}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328601472,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653286013363\",\"x\":132,\"y\":276,\"w\":82,\"h\":51},{\"i\":\"3_16653286013363\",\"x\":159,\"y\":295,\"w\":55,\"h\":32}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328601504,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653286013363\",\"x\":122,\"y\":270,\"w\":92,\"h\":57},{\"i\":\"3_16653286013363\",\"x\":132,\"y\":276,\"w\":82,\"h\":51}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328601522,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653286013363\",\"x\":106,\"y\":259,\"w\":108,\"h\":68},{\"i\":\"3_16653286013363\",\"x\":122,\"y\":270,\"w\":92,\"h\":57}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328601590,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653286013363\",\"x\":91,\"y\":246,\"w\":123,\"h\":81},{\"i\":\"3_16653286013363\",\"x\":106,\"y\":259,\"w\":108,\"h\":68}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328601624,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653286013363\",\"x\":80,\"y\":237,\"w\":134,\"h\":90},{\"i\":\"3_16653286013363\",\"x\":91,\"y\":246,\"w\":123,\"h\":81}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328601654,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653286013363\",\"x\":77,\"y\":235,\"w\":137,\"h\":92},{\"i\":\"3_16653286013363\",\"x\":80,\"y\":237,\"w\":134,\"h\":90}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328601672,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653286013363\",\"x\":76,\"y\":233,\"w\":138,\"h\":94},{\"i\":\"3_16653286013363\",\"x\":77,\"y\":235,\"w\":137,\"h\":92}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328601689,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653286013363\",\"x\":74,\"y\":232,\"w\":140,\"h\":95},{\"i\":\"3_16653286013363\",\"x\":76,\"y\":233,\"w\":138,\"h\":94}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328601707,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653286013363\",\"x\":73,\"y\":230,\"w\":141,\"h\":97},{\"i\":\"3_16653286013363\",\"x\":74,\"y\":232,\"w\":140,\"h\":95}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328601740,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653286013363\",\"x\":72,\"y\":229,\"w\":142,\"h\":98},{\"i\":\"3_16653286013363\",\"x\":73,\"y\":230,\"w\":141,\"h\":97}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328601771,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653286013363\",\"x\":71,\"y\":228,\"w\":143,\"h\":99},{\"i\":\"3_16653286013363\",\"x\":72,\"y\":229,\"w\":142,\"h\":98}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328601892,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653286013363\",\"x\":70,\"y\":226,\"w\":144,\"h\":101},{\"i\":\"3_16653286013363\",\"x\":71,\"y\":228,\"w\":143,\"h\":99}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328601921,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653286013363\",\"x\":69,\"y\":224,\"w\":145,\"h\":103},{\"i\":\"3_16653286013363\",\"x\":70,\"y\":226,\"w\":144,\"h\":101}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328601939,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653286013363\",\"x\":67,\"y\":219,\"w\":147,\"h\":108},{\"i\":\"3_16653286013363\",\"x\":69,\"y\":224,\"w\":145,\"h\":103}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328601972,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653286013363\",\"x\":65,\"y\":213,\"w\":149,\"h\":114},{\"i\":\"3_16653286013363\",\"x\":67,\"y\":219,\"w\":147,\"h\":108}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328602004,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653286013363\",\"x\":64,\"y\":211,\"w\":150,\"h\":116},{\"i\":\"3_16653286013363\",\"x\":65,\"y\":213,\"w\":149,\"h\":114}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328602023,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653286013363\",\"x\":64,\"y\":208,\"w\":150,\"h\":119},{\"i\":\"3_16653286013363\",\"x\":64,\"y\":211,\"w\":150,\"h\":116}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328602054,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653286013363\",\"x\":64,\"y\":207,\"w\":150,\"h\":120},{\"i\":\"3_16653286013363\",\"x\":64,\"y\":208,\"w\":150,\"h\":119}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328602073,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653286013363\",\"x\":64,\"y\":204,\"w\":150,\"h\":123},{\"i\":\"3_16653286013363\",\"x\":64,\"y\":207,\"w\":150,\"h\":120}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328602106,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653286013363\",\"x\":64,\"y\":201,\"w\":150,\"h\":126},{\"i\":\"3_16653286013363\",\"x\":64,\"y\":204,\"w\":150,\"h\":123}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328602138,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653286013363\",\"x\":65,\"y\":199,\"w\":149,\"h\":128},{\"i\":\"3_16653286013363\",\"x\":64,\"y\":201,\"w\":150,\"h\":126}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328602157,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653286013363\",\"x\":66,\"y\":197,\"w\":148,\"h\":130},{\"i\":\"3_16653286013363\",\"x\":65,\"y\":199,\"w\":149,\"h\":128}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328602188,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653286013363\",\"x\":66,\"y\":196,\"w\":148,\"h\":131},{\"i\":\"3_16653286013363\",\"x\":66,\"y\":197,\"w\":148,\"h\":130}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328602206,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653286013363\",\"x\":67,\"y\":194,\"w\":147,\"h\":133},{\"i\":\"3_16653286013363\",\"x\":66,\"y\":196,\"w\":148,\"h\":131}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_OVAL\",\"timeStamp\":1665328602363,\"detail\":{\"shapeDatas\":[[{\"i\":\"3_16653286013363\",\"x\":67,\"y\":194,\"w\":147,\"h\":133},{\"i\":\"3_16653286013363\",\"x\":67,\"y\":194,\"w\":147,\"h\":133}]]}},{\"type\":\"TOOL_CHANGED\",\"operator\":\"whiteboard\",\"timeStamp\":1665328603214,\"detail\":{\"from\":\"TOOL_OVAL\",\"to\":\"TOOL_RECT\"}},{\"type\":\"SHAPES_ADDED\",\"operator\":\"whiteboard\",\"timeStamp\":1665328603748,\"detail\":{\"shapeDatas\":[{\"t\":2,\"i\":\"2_16653286037484\",\"x\":0,\"y\":0,\"w\":0,\"h\":0,\"z\":1665328603752,\"style\":{\"b\":\"#ff0000\",\"a\":\"#000000\",\"g\":2},\"status\":{}}]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328603766,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286037484\",\"x\":385,\"y\":303,\"w\":0,\"h\":0},{\"i\":\"2_16653286037484\",\"x\":0,\"y\":0,\"w\":0,\"h\":0}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328603823,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286037484\",\"x\":384,\"y\":303,\"w\":1,\"h\":0},{\"i\":\"2_16653286037484\",\"x\":385,\"y\":303,\"w\":0,\"h\":0}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328603840,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286037484\",\"x\":370,\"y\":288,\"w\":15,\"h\":15},{\"i\":\"2_16653286037484\",\"x\":384,\"y\":303,\"w\":1,\"h\":0}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328603873,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286037484\",\"x\":358,\"y\":276,\"w\":27,\"h\":27},{\"i\":\"2_16653286037484\",\"x\":370,\"y\":288,\"w\":15,\"h\":15}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328603891,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286037484\",\"x\":337,\"y\":257,\"w\":48,\"h\":46},{\"i\":\"2_16653286037484\",\"x\":358,\"y\":276,\"w\":27,\"h\":27}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328603924,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286037484\",\"x\":331,\"y\":252,\"w\":54,\"h\":51},{\"i\":\"2_16653286037484\",\"x\":337,\"y\":257,\"w\":48,\"h\":46}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328603941,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286037484\",\"x\":326,\"y\":248,\"w\":59,\"h\":55},{\"i\":\"2_16653286037484\",\"x\":331,\"y\":252,\"w\":54,\"h\":51}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328603994,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286037484\",\"x\":320,\"y\":245,\"w\":65,\"h\":58},{\"i\":\"2_16653286037484\",\"x\":326,\"y\":248,\"w\":59,\"h\":55}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328604021,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286037484\",\"x\":313,\"y\":241,\"w\":72,\"h\":62},{\"i\":\"2_16653286037484\",\"x\":320,\"y\":245,\"w\":65,\"h\":58}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328604041,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286037484\",\"x\":307,\"y\":236,\"w\":78,\"h\":67},{\"i\":\"2_16653286037484\",\"x\":313,\"y\":241,\"w\":72,\"h\":62}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328604058,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286037484\",\"x\":296,\"y\":228,\"w\":89,\"h\":75},{\"i\":\"2_16653286037484\",\"x\":307,\"y\":236,\"w\":78,\"h\":67}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328604091,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286037484\",\"x\":291,\"y\":224,\"w\":94,\"h\":79},{\"i\":\"2_16653286037484\",\"x\":296,\"y\":228,\"w\":89,\"h\":75}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328604108,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286037484\",\"x\":283,\"y\":218,\"w\":102,\"h\":85},{\"i\":\"2_16653286037484\",\"x\":291,\"y\":224,\"w\":94,\"h\":79}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328604140,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286037484\",\"x\":279,\"y\":215,\"w\":106,\"h\":88},{\"i\":\"2_16653286037484\",\"x\":283,\"y\":218,\"w\":102,\"h\":85}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328604159,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286037484\",\"x\":273,\"y\":209,\"w\":112,\"h\":94},{\"i\":\"2_16653286037484\",\"x\":279,\"y\":215,\"w\":106,\"h\":88}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328604192,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286037484\",\"x\":269,\"y\":206,\"w\":116,\"h\":97},{\"i\":\"2_16653286037484\",\"x\":273,\"y\":209,\"w\":112,\"h\":94}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328604226,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286037484\",\"x\":267,\"y\":204,\"w\":118,\"h\":99},{\"i\":\"2_16653286037484\",\"x\":269,\"y\":206,\"w\":116,\"h\":97}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328604258,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286037484\",\"x\":266,\"y\":203,\"w\":119,\"h\":100},{\"i\":\"2_16653286037484\",\"x\":267,\"y\":204,\"w\":118,\"h\":99}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328604275,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286037484\",\"x\":264,\"y\":200,\"w\":121,\"h\":103},{\"i\":\"2_16653286037484\",\"x\":266,\"y\":203,\"w\":119,\"h\":100}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328604323,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286037484\",\"x\":263,\"y\":199,\"w\":122,\"h\":104},{\"i\":\"2_16653286037484\",\"x\":264,\"y\":200,\"w\":121,\"h\":103}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328604371,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286037484\",\"x\":262,\"y\":198,\"w\":123,\"h\":105},{\"i\":\"2_16653286037484\",\"x\":263,\"y\":199,\"w\":122,\"h\":104}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328604469,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286037484\",\"x\":262,\"y\":197,\"w\":123,\"h\":106},{\"i\":\"2_16653286037484\",\"x\":262,\"y\":198,\"w\":123,\"h\":105}]]}},{\"type\":\"SHAPES_ADDED\",\"operator\":\"whiteboard\",\"timeStamp\":1665328605718,\"detail\":{\"shapeDatas\":[{\"t\":2,\"i\":\"2_16653286057185\",\"x\":0,\"y\":0,\"w\":0,\"h\":0,\"z\":1665328605723,\"style\":{\"b\":\"#ff0000\",\"a\":\"rgba(85,51,51,1.00)\",\"g\":2},\"status\":{}}]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328605736,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286057185\",\"x\":613,\"y\":268,\"w\":0,\"h\":0},{\"i\":\"2_16653286057185\",\"x\":0,\"y\":0,\"w\":0,\"h\":0}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328605827,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286057185\",\"x\":606,\"y\":262,\"w\":7,\"h\":6},{\"i\":\"2_16653286057185\",\"x\":613,\"y\":268,\"w\":0,\"h\":0}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328605858,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286057185\",\"x\":596,\"y\":253,\"w\":17,\"h\":15},{\"i\":\"2_16653286057185\",\"x\":606,\"y\":262,\"w\":7,\"h\":6}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328605875,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286057185\",\"x\":583,\"y\":241,\"w\":30,\"h\":27},{\"i\":\"2_16653286057185\",\"x\":596,\"y\":253,\"w\":17,\"h\":15}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328605892,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286057185\",\"x\":570,\"y\":229,\"w\":43,\"h\":39},{\"i\":\"2_16653286057185\",\"x\":583,\"y\":241,\"w\":30,\"h\":27}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328605908,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286057185\",\"x\":560,\"y\":220,\"w\":53,\"h\":48},{\"i\":\"2_16653286057185\",\"x\":570,\"y\":229,\"w\":43,\"h\":39}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328605926,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286057185\",\"x\":550,\"y\":211,\"w\":63,\"h\":57},{\"i\":\"2_16653286057185\",\"x\":560,\"y\":220,\"w\":53,\"h\":48}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328605942,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286057185\",\"x\":539,\"y\":200,\"w\":74,\"h\":68},{\"i\":\"2_16653286057185\",\"x\":550,\"y\":211,\"w\":63,\"h\":57}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328605975,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286057185\",\"x\":535,\"y\":196,\"w\":78,\"h\":72},{\"i\":\"2_16653286057185\",\"x\":539,\"y\":200,\"w\":74,\"h\":68}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328605992,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286057185\",\"x\":532,\"y\":191,\"w\":81,\"h\":77},{\"i\":\"2_16653286057185\",\"x\":535,\"y\":196,\"w\":78,\"h\":72}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328606011,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286057185\",\"x\":529,\"y\":188,\"w\":84,\"h\":80},{\"i\":\"2_16653286057185\",\"x\":532,\"y\":191,\"w\":81,\"h\":77}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328606044,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286057185\",\"x\":524,\"y\":181,\"w\":89,\"h\":87},{\"i\":\"2_16653286057185\",\"x\":529,\"y\":188,\"w\":84,\"h\":80}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328606109,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286057185\",\"x\":517,\"y\":172,\"w\":96,\"h\":96},{\"i\":\"2_16653286057185\",\"x\":524,\"y\":181,\"w\":89,\"h\":87}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328606125,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286057185\",\"x\":516,\"y\":170,\"w\":97,\"h\":98},{\"i\":\"2_16653286057185\",\"x\":517,\"y\":172,\"w\":96,\"h\":96}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328606142,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286057185\",\"x\":515,\"y\":169,\"w\":98,\"h\":99},{\"i\":\"2_16653286057185\",\"x\":516,\"y\":170,\"w\":97,\"h\":98}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328606160,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286057185\",\"x\":513,\"y\":167,\"w\":100,\"h\":101},{\"i\":\"2_16653286057185\",\"x\":515,\"y\":169,\"w\":98,\"h\":99}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328606193,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286057185\",\"x\":511,\"y\":166,\"w\":102,\"h\":102},{\"i\":\"2_16653286057185\",\"x\":513,\"y\":167,\"w\":100,\"h\":101}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328606211,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286057185\",\"x\":508,\"y\":163,\"w\":105,\"h\":105},{\"i\":\"2_16653286057185\",\"x\":511,\"y\":166,\"w\":102,\"h\":102}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328606242,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286057185\",\"x\":507,\"y\":161,\"w\":106,\"h\":107},{\"i\":\"2_16653286057185\",\"x\":508,\"y\":163,\"w\":105,\"h\":105}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328606259,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286057185\",\"x\":506,\"y\":161,\"w\":107,\"h\":107},{\"i\":\"2_16653286057185\",\"x\":507,\"y\":161,\"w\":106,\"h\":107}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328606276,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286057185\",\"x\":506,\"y\":160,\"w\":107,\"h\":108},{\"i\":\"2_16653286057185\",\"x\":506,\"y\":161,\"w\":107,\"h\":107}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328606294,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286057185\",\"x\":504,\"y\":158,\"w\":109,\"h\":110},{\"i\":\"2_16653286057185\",\"x\":506,\"y\":160,\"w\":107,\"h\":108}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328606326,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286057185\",\"x\":502,\"y\":157,\"w\":111,\"h\":111},{\"i\":\"2_16653286057185\",\"x\":504,\"y\":158,\"w\":109,\"h\":110}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328606374,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286057185\",\"x\":502,\"y\":156,\"w\":111,\"h\":112},{\"i\":\"2_16653286057185\",\"x\":502,\"y\":157,\"w\":111,\"h\":111}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328606443,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286057185\",\"x\":501,\"y\":156,\"w\":112,\"h\":112},{\"i\":\"2_16653286057185\",\"x\":502,\"y\":156,\"w\":111,\"h\":112}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328606477,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286057185\",\"x\":498,\"y\":156,\"w\":115,\"h\":112},{\"i\":\"2_16653286057185\",\"x\":501,\"y\":156,\"w\":112,\"h\":112}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328606510,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286057185\",\"x\":497,\"y\":156,\"w\":116,\"h\":112},{\"i\":\"2_16653286057185\",\"x\":498,\"y\":156,\"w\":115,\"h\":112}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328606543,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286057185\",\"x\":495,\"y\":156,\"w\":118,\"h\":112},{\"i\":\"2_16653286057185\",\"x\":497,\"y\":156,\"w\":116,\"h\":112}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328606577,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286057185\",\"x\":493,\"y\":156,\"w\":120,\"h\":112},{\"i\":\"2_16653286057185\",\"x\":495,\"y\":156,\"w\":118,\"h\":112}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328606593,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286057185\",\"x\":490,\"y\":157,\"w\":123,\"h\":111},{\"i\":\"2_16653286057185\",\"x\":493,\"y\":156,\"w\":120,\"h\":112}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328606627,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286057185\",\"x\":487,\"y\":157,\"w\":126,\"h\":111},{\"i\":\"2_16653286057185\",\"x\":490,\"y\":157,\"w\":123,\"h\":111}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328606659,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286057185\",\"x\":486,\"y\":158,\"w\":127,\"h\":110},{\"i\":\"2_16653286057185\",\"x\":487,\"y\":157,\"w\":126,\"h\":111}]]}},{\"type\":\"SHAPES_CHANGED\",\"operator\":\"TOOL_RECT\",\"timeStamp\":1665328606794,\"detail\":{\"shapeDatas\":[[{\"i\":\"2_16653286057185\",\"x\":486,\"y\":157,\"w\":127,\"h\":111},{\"i\":\"2_16653286057185\",\"x\":486,\"y\":158,\"w\":127,\"h\":110}]]}}]}";

},{}],53:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ele_1 = require("./ui/ele");
var dist_1 = require("../../dist");
var ColorPalette_1 = require("./colorPalette/ColorPalette");
var demo_helloworld_1 = __importDefault(require("./demo_helloworld"));
var demo_rect_n_oval_1 = __importDefault(require("./demo_rect_n_oval"));
var utils_1 = require("../../dist/utils");
var whiteBoard;
var factory = dist_1.FactoryMgr.createFactory(dist_1.FactoryEnum.Default);
var _recorder;
var _player;
var initState = {
    count: 1,
    width: 2048,
    height: 2048,
};
window.ui = new ele_1.UI(document.body, initState, function (ui) {
    var toolBtn = function (toolType) {
        var _a = (dist_1.FactoryMgr.toolInfo(toolType) || {}).name, name = _a === void 0 ? toolType : _a;
        ui.dynamic('button', {
            className: 'tool_button',
            innerText: name,
            disabled: (whiteBoard === null || whiteBoard === void 0 ? void 0 : whiteBoard.toolType) === toolType,
            onclick: function () { return whiteBoard === null || whiteBoard === void 0 ? void 0 : whiteBoard.setToolType(toolType); }
        });
    };
    ui.dynamic('div', {
        className: 'root'
    }, function (div) {
        ui.dynamic('div', {
            className: 'tool_bar'
        }, function (div) {
            toolBtn(dist_1.ToolEnum.Selector);
            toolBtn(dist_1.ToolEnum.Pen);
            toolBtn(dist_1.ToolEnum.Rect);
            toolBtn(dist_1.ToolEnum.Oval);
            toolBtn(dist_1.ToolEnum.Text);
            ui.static('br');
            ui.dynamic('button', { className: 'tool_button', innerText: 'select all', onclick: function () { return whiteBoard.selectAll(); } });
            ui.dynamic('button', { className: 'tool_button', innerText: 'remove selected', onclick: function () { return whiteBoard.removeSelected(); } });
            ui.dynamic('button', { className: 'tool_button', innerText: 'remove all', onclick: function () { return whiteBoard.removeAll(); } });
            ui.dynamic('br');
            ui.dynamic('button', {
                className: 'tool_button',
                innerText: '随机加1000个矩形', onclick: function () {
                    var items = [];
                    for (var i = 0; i < 1000; ++i) {
                        var item = whiteBoard.factory.newShape(dist_1.ShapeEnum.Rect);
                        item.geo(Math.floor(Math.random() * ui.state.width), Math.floor(Math.random() * ui.state.height), 50, 50);
                        var r = Math.floor(Math.random() * 255);
                        var g = Math.floor(Math.random() * 255);
                        var b = Math.floor(Math.random() * 255);
                        item.data.fillStyle = "rgb(".concat(r, ",").concat(g, ",").concat(b, ")");
                        items.push(item);
                    }
                    whiteBoard.add.apply(whiteBoard, items);
                }
            });
            ui.dynamic('button', {
                className: 'tool_button',
                innerText: '随机加1000个圆', onclick: function () {
                    var items = [];
                    for (var i = 0; i < 1000; ++i) {
                        var item = whiteBoard.factory.newShape(dist_1.ShapeEnum.Oval);
                        item.geo(Math.floor(Math.random() * ui.state.width), Math.floor(Math.random() * ui.state.height), 50, 50);
                        var r = Math.floor(Math.random() * 255);
                        var g = Math.floor(Math.random() * 255);
                        var b = Math.floor(Math.random() * 255);
                        item.data.fillStyle = "rgb(".concat(r, ",").concat(g, ",").concat(b, ")");
                        items.push(item);
                    }
                    whiteBoard.add.apply(whiteBoard, items);
                }
            });
            ui.dynamic('button', {
                className: 'tool_button',
                innerText: '随机画1000笔', onclick: function () {
                    var items = [];
                    for (var i = 0; i < 1000; ++i) {
                        var item = whiteBoard.factory.newShape(dist_1.ShapeEnum.Pen);
                        var x = Math.floor(Math.random() * ui.state.width);
                        var y = Math.floor(Math.random() * ui.state.height);
                        var lenth = Math.floor(Math.random() * 100);
                        for (var j = 0; j < lenth; ++j) {
                            x += Math.floor(Math.random() * 5);
                            y += Math.floor(Math.random() * 5);
                            item.appendDot({ x: x, y: y, p: 0.5 });
                        }
                        var r = Math.floor(Math.random() * 255);
                        var g = Math.floor(Math.random() * 255);
                        var b = Math.floor(Math.random() * 255);
                        item.data.strokeStyle = "rgb(".concat(r, ",").concat(g, ",").concat(b, ")");
                        items.push(item);
                    }
                    whiteBoard.add.apply(whiteBoard, items);
                }
            });
            ui.dynamic('br');
            ui.dynamic('button', {
                className: 'tool_button',
                innerText: 'JSON化', onclick: function () {
                    _json_textarea.value = whiteBoard.toJsonStr();
                }
            });
            ui.dynamic('button', {
                className: 'tool_button',
                innerText: '反JSON化', onclick: function () {
                    whiteBoard.fromJsonStr(_json_textarea.value);
                }
            });
            var _json_textarea = ui.dynamic('textarea');
            var startRecord = function () {
                _recorder === null || _recorder === void 0 ? void 0 : _recorder.destory();
                _recorder = new dist_1.Recorder();
                _recorder.start(whiteBoard);
            };
            var endRecord = function () {
                if (!_recorder_textarea || !_recorder)
                    return;
                _recorder_textarea.value = _recorder.toJsonStr();
                _recorder === null || _recorder === void 0 ? void 0 : _recorder.destory();
                _recorder = undefined;
            };
            var replay = function (str) {
                _player === null || _player === void 0 ? void 0 : _player.stop();
                _player = new dist_1.Player();
                whiteBoard && _player.start(whiteBoard, JSON.parse(str));
            };
            ui.dynamic('br');
            ui.dynamic('button', {
                className: 'tool_button',
                innerText: '开始录制', onclick: startRecord
            });
            ui.dynamic('button', {
                className: 'tool_button',
                innerText: '停止录制', onclick: endRecord
            });
            ui.dynamic('button', {
                className: 'tool_button',
                innerText: '回放', onclick: function () {
                    endRecord();
                    replay(_recorder_textarea.value);
                }
            });
            ui.dynamic('button', {
                className: 'tool_button',
                innerText: "replay: write \"hello world\"", onclick: function () {
                    endRecord();
                    replay(demo_helloworld_1.default);
                }
            });
            ui.dynamic('button', {
                className: 'tool_button',
                innerText: "replay: rect & oval", onclick: function () {
                    endRecord();
                    replay(demo_rect_n_oval_1.default);
                }
            });
            var _recorder_textarea = ui.dynamic('textarea');
            ui.static('canvas', function (canvas) {
                canvas.width = 180;
                canvas.height = 100;
                canvas.style.minWidth = canvas.width + 'px';
                canvas.style.minHeight = canvas.height + 'px';
                canvas.style.maxWidth = canvas.width + 'px';
                canvas.style.maxHeight = canvas.height + 'px';
                var a = new ColorPalette_1.ColorPalette(canvas);
                a._onChanged = function (v) {
                    var _a;
                    var shape = (_a = dist_1.FactoryMgr.toolInfo(whiteBoard.toolType)) === null || _a === void 0 ? void 0 : _a.shape;
                    if (!shape)
                        return;
                    var template = whiteBoard.factory.shapeTemplate(shape);
                    template.strokeStyle = '' + v;
                };
            });
        });
        ui.dynamic('div', {
            className: 'blackboard'
        }, function (div) {
            var offscreen = ui.static('canvas', {
                width: ui.state.width,
                height: ui.state.height,
                offscreen: true
            });
            ui.static('canvas', function (onscreen) {
                onscreen.width = offscreen.width;
                onscreen.height = offscreen.height;
                onscreen.style.position = 'relative';
                onscreen.style.touchAction = 'none';
                whiteBoard = factory.newWhiteBoard({ onscreen: onscreen, offscreen: offscreen });
                whiteBoard.on(dist_1.EventEnum.ToolChanged, function () { return ui.refresh(); });
                var _loop_1 = function (key) {
                    var v = dist_1.EventEnum[key];
                    whiteBoard.on(v, function (e) { return console.log(v, e); });
                };
                for (var key in dist_1.EventEnum) {
                    _loop_1(key);
                }
                var pickRect = new utils_1.Rect(Math.ceil(Math.random() * (onscreen.width - 20) / 2), Math.ceil(Math.random() * (onscreen.height - 20) / 2), Math.ceil(Math.random() * (onscreen.width) / 2), Math.ceil(Math.random() * (onscreen.height) / 2));
                var pickRange = { from: pickRect.top, to: pickRect.bottom };
                var ctx = onscreen.getContext('2d');
                // class RectInTree extends Rect {
                //   tree: BinaryTree<RectInTree> | undefined
                // }
                // const tree = new BinaryTree<RectInTree>({
                //   range: new BinaryRange(0, onscreen.height),
                //   getItemRange: v => new BinaryRange(v.top, v.bottom),
                //   onTreeChanged(item, from, to) {
                //     item.tree = to
                //   },
                //   getTree: v => v.tree
                // })
                // const drawTreeNode = (tree: BinaryTree<RectInTree>) => {
                //   if (!ctx) return
                //   ctx.lineWidth = 1
                //   if (tree.range.hit(pickRange))
                //     ctx.strokeStyle = 'yellow'
                //   else
                //     ctx.strokeStyle = 'white'
                //   ctx.strokeRect(
                //     0,
                //     tree.range.from - .5,
                //     onscreen.width,
                //     tree.range.to - tree.range.from)
                //   if (tree.range.hit(pickRange)) {
                //     ctx.strokeStyle = 'green'
                //     ctx.fillStyle = 'red'
                //     tree.items.forEach(v => {
                //       if (v.hit(pickRect))
                //         ctx.fillRect(v.x, v.y, v.w, v.h)
                //       else
                //         ctx.strokeRect(v.x, v.y, v.w, v.h)
                //     })
                //   } else {
                //     ctx.strokeStyle = 'gray'
                //     tree.items.forEach(v => ctx.strokeRect(v.x - 0.5, v.y - 0.5, v.w, v.h))
                //   }
                //   tree.child0 && drawTreeNode(tree.child0)
                //   tree.child1 && drawTreeNode(tree.child1)
                // }
                // class RectInTree extends Rect {
                //   tree: QuadTree<RectInTree> | undefined
                // }
                // const tree = new QuadTree<RectInTree>({
                //   rect: new Rect(0, 0, onscreen.width, onscreen.height),
                //   getItemRect: v => v,
                //   onTreeChanged(item, from, to) {
                //     item.tree = to
                //   },
                //   getTree: v => v.tree
                // })
                // const drawTreeNode = (tree: QuadTree<RectInTree>) => {
                //   if (!ctx) return
                //   ctx.lineWidth = 1
                //   if (tree.rect.hit(pickRect))
                //     ctx.strokeStyle = 'yellow'
                //   else
                //     ctx.strokeStyle = 'white'
                //   ctx.strokeRect(tree.rect.x - .5, tree.rect.y - .5, tree.rect.w, tree.rect.h)
                //   if (tree.rect.hit(pickRect)) {
                //     ctx.strokeStyle = 'green'
                //     ctx.fillStyle = 'red'
                //     tree.items.forEach(v => {
                //       if (v.hit(pickRect))
                //         ctx.fillRect(v.x, v.y, v.w, v.h)
                //       else
                //         ctx.strokeRect(v.x - 0.5, v.y - 0.5, v.w, v.h)
                //     })
                //   } else {
                //     ctx.strokeStyle = 'gray'
                //     tree.items.forEach(v => ctx.strokeRect(v.x - 0.5, v.y - 0.5, v.w, v.h))
                //   }
                //   tree.child0 && drawTreeNode(tree.child0)
                //   tree.child1 && drawTreeNode(tree.child1)
                //   tree.child2 && drawTreeNode(tree.child2)
                //   tree.child3 && drawTreeNode(tree.child3)
                // }
                // drawTreeNode(tree)
                // const rects: RectInTree[] = []
                // const ttt = setInterval(() => {
                //   for (let i = 0; i < 1; ++i) {
                //     const rect = new RectInTree(
                //       Math.ceil(Math.random() * (onscreen.width - 50)),
                //       Math.ceil(Math.random() * (onscreen.height - 50)),
                //       Math.ceil(5 + Math.random() * 50),
                //       Math.ceil(5 + Math.random() * 50)
                //     )
                //     rects.push(rect)
                //     rect.tree = tree.insert(rect)
                //     if (rect.tree.items.indexOf(rect) < 0) {
                //       alert('!')
                //     }
                //   }
                //   ctx?.clearRect(0, 0, onscreen.width, onscreen.height)
                //   console.log(tree.itemCount)
                //   drawTreeNode(tree)
                //   if (ctx) {
                //     ctx.lineWidth = 1
                //     ctx.strokeStyle = 'blue'
                //     ctx.strokeRect(pickRect.x - 0.5, pickRect.y - 0.5, pickRect.w, pickRect.h)
                //   }
                //   if (tree.itemCount > 9999) {
                //     clearInterval(ttt)
                //   }
                // }, 1)
            });
        });
    });
});

},{"../../dist":11,"../../dist/utils":48,"./colorPalette/ColorPalette":50,"./demo_helloworld":51,"./demo_rect_n_oval":52,"./ui/ele":54}],54:[function(require,module,exports){
"use strict";
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
exports.UI = void 0;
var UI = /** @class */ (function () {
    function UI(container, initState, render) {
        this.eleStack = [];
        this.eles = {};
        this.eleStack = [container];
        this.render = render;
        this.state = (typeof initState !== 'function') ? initState : initState();
        this.render(this);
    }
    UI.prototype.setState = function (state) {
        this.state = (typeof state !== 'function') ? state : state(this.state);
        this.render(this);
    };
    UI.prototype.refresh = function () {
        this.render(this);
    };
    UI.prototype.null = function () {
        var parent = this.eleStack[this.eleStack.length - 1];
        var child = document.createElement('div');
        child.style.display = 'none';
        this.appendChild(parent, child);
    };
    UI.prototype.applyOptions = function (ele, options) {
        if (!ele || !options)
            return;
        for (var key in options) {
            if (key === 'style' || key === 'attributes')
                continue;
            ele[key] = options[key];
        }
        for (var key in options === null || options === void 0 ? void 0 : options.style)
            ele.style[key] = (options === null || options === void 0 ? void 0 : options.style)[key];
        for (var key in options === null || options === void 0 ? void 0 : options.attrs)
            ele.setAttribute(key, options.attrs[key]);
    };
    UI.prototype.appendChild = function (parent, child, options) {
        if (parent === this.eleStack[0]) {
            if (!(options === null || options === void 0 ? void 0 : options.offscreen))
                this.root ? parent.replaceChild(child, this.root) : parent.appendChild(child);
            this.root = child;
        }
        else {
            !(options === null || options === void 0 ? void 0 : options.offscreen) && parent.appendChild(child);
        }
    };
    UI.prototype.dynamic = function (tagName, arg2, arg3) {
        var updater = typeof arg2 === 'function' ? arg2 : arg3;
        var options = typeof arg2 === 'function' ? undefined : __assign({}, arg2);
        var endIdx = this.eleStack.length - 1;
        var parent = this.eleStack[endIdx];
        var key = "".concat(tagName, "_").concat(endIdx, "_").concat(parent.childNodes.length, "_").concat(!!(options === null || options === void 0 ? void 0 : options.offscreen));
        var prev = this.eles[key];
        var child = document.createElement(tagName);
        this.eleStack.push(child);
        this.eles[key] = child;
        this.applyOptions(child, options);
        updater && updater(child, prev);
        this.appendChild(parent, child, options);
        this.eleStack.pop();
        return child;
    };
    UI.prototype.static = function (tagName, arg2, arg3, arg4) {
        var options = typeof arg2 !== 'function' ? arg2 : undefined;
        var init = typeof arg2 === 'function' ? arg2 : arg3;
        var updater = typeof arg2 === 'function' ? arg3 : arg4;
        var endIdx = this.eleStack.length - 1;
        var parent = this.eleStack[endIdx];
        var key = "".concat(tagName, "_").concat(endIdx, "_").concat(parent.childNodes.length, "_").concat(!!(options === null || options === void 0 ? void 0 : options.offscreen));
        var child = this.eles[key] || document.createElement(tagName);
        this.applyOptions(child, options);
        if (key in this.eles) {
            this.eleStack.push(child);
            updater && updater(child);
        }
        else {
            this.eles[key] = child;
            this.eleStack.push(child);
            init && init(child);
        }
        this.appendChild(parent, child, options);
        this.eleStack.pop();
        return child;
    };
    return UI;
}());
exports.UI = UI;

},{}]},{},[53]);
