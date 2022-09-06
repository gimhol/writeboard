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
//# sourceMappingURL=Observer.js.map