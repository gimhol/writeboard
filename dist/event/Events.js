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
//# sourceMappingURL=Events.js.map