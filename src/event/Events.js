"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToolChangedEvent = exports.ShapesGeoEvent = exports.pickShapeGeoData = exports.ShapesMovedEvent = exports.pickShapePositionData = exports.ShapesChangedEvent = exports.ShapesChangedEnum = exports.ShapesRemovedEvent = exports.ShapesAddedEvent = exports.ShapesEvent = exports.BaseEvent = void 0;
const EventDataVisitor_1 = require("./EventDataVisitor");
const EventType_1 = require("./EventType");
class BaseEvent {
    get operator() { return this._operator; }
    get detail() { return this._detail; }
    get type() { return this._type; }
    constructor(type, operator, detail) {
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
        this._type = type;
        this._operator = operator;
        this._detail = detail;
    }
    get bubbles() { return this._bubbles; }
    get cancelBubble() { return this._cancelBubble; }
    get cancelable() { return this._cancelable; }
    get composed() { return this._composed; }
    get currentTarget() { return this._currentTarget; }
    get defaultPrevented() { return this._defaultPrevented; }
    get eventPhase() { return this._eventPhase; }
    get isTrusted() { return this._isTrusted; }
    get returnValue() { return this._returnValue; }
    get srcElement() { return this._srcElement; }
    get target() { return this._target; }
    get timeStamp() { return this._timeStamp; }
    set target(v) {
        this._target = v;
        this._currentTarget = v;
    }
    composedPath() { return []; }
    initEvent(type, bubbles, cancelable) {
        this._type = type;
        this._bubbles = !!bubbles;
        this._cancelable = !!cancelable;
    }
    preventDefault() {
        this._defaultPrevented = true;
    }
    stopImmediatePropagation() { }
    stopPropagation() { }
    pure() {
        return EventDataVisitor_1.EventDataVisitor.create(this);
    }
}
exports.BaseEvent = BaseEvent;
class ShapesEvent extends BaseEvent {
    constructor(type, operator, detail) {
        super(type, operator, detail);
    }
}
exports.ShapesEvent = ShapesEvent;
class ShapesAddedEvent extends ShapesEvent {
    constructor(operator, detail) {
        super(EventType_1.EventEnum.ShapesAdded, operator, detail);
    }
}
exports.ShapesAddedEvent = ShapesAddedEvent;
class ShapesRemovedEvent extends ShapesEvent {
    constructor(operator, detail) {
        super(EventType_1.EventEnum.ShapesRemoved, operator, detail);
    }
}
exports.ShapesRemovedEvent = ShapesRemovedEvent;
var ShapesChangedEnum;
(function (ShapesChangedEnum) {
    ShapesChangedEnum[ShapesChangedEnum["Invalid"] = 0] = "Invalid";
    ShapesChangedEnum[ShapesChangedEnum["Any"] = 1] = "Any";
    ShapesChangedEnum[ShapesChangedEnum["Moved"] = 2] = "Moved";
    ShapesChangedEnum[ShapesChangedEnum["Resized"] = 3] = "Resized";
})(ShapesChangedEnum = exports.ShapesChangedEnum || (exports.ShapesChangedEnum = {}));
class ShapesChangedEvent extends BaseEvent {
    get changedType() { return this._changedType; }
    constructor(operator, detail) {
        super(EventType_1.EventEnum.ShapesChanged, operator, detail);
        this._changedType = ShapesChangedEnum.Any;
    }
}
exports.ShapesChangedEvent = ShapesChangedEvent;
function pickShapePositionData(data) {
    return {
        i: data.i,
        x: data.x,
        y: data.y
    };
}
exports.pickShapePositionData = pickShapePositionData;
class ShapesMovedEvent extends ShapesChangedEvent {
    constructor(operator, detail) {
        super(operator, detail);
        this._changedType = ShapesChangedEnum.Moved;
    }
}
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
class ShapesGeoEvent extends ShapesChangedEvent {
    constructor(operator, detail) {
        super(operator, detail);
        this._changedType = ShapesChangedEnum.Resized;
    }
}
exports.ShapesGeoEvent = ShapesGeoEvent;
class ToolChangedEvent extends BaseEvent {
    constructor(operator, detail) {
        super(EventType_1.EventEnum.ToolChanged, operator, detail);
    }
}
exports.ToolChangedEvent = ToolChangedEvent;
//# sourceMappingURL=Events.js.map