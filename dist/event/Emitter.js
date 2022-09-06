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
//# sourceMappingURL=Emitter.js.map