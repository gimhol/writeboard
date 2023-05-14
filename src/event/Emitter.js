"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Emitter = void 0;
const Array_1 = require("../utils/Array");
;
class Emitter {
    constructor() {
        this._listenersMap = {};
    }
    addEventListener(type, callback) {
        const listeners = this._listenersMap[type] || [];
        const canceller = () => this.removeEventListener(type, callback);
        const listener = { times: -1, callback, type, target: this, canceller };
        listeners.push(listener);
        this._listenersMap[type] = listeners;
        return listener;
    }
    removeEventListener(type, callback) {
        const listeners = this._listenersMap[type];
        const idx = listeners && (0, Array_1.findIndex)(listeners, v => v.type === type && v.callback === callback);
        if (idx !== undefined && idx >= 0)
            this._listenersMap[type] = listeners === null || listeners === void 0 ? void 0 : listeners.filter((_, i) => (i !== idx));
    }
    dispatchEvent(e) {
        const listeners = this._listenersMap[e.type];
        if (!listeners) {
            return;
        }
        for (let i = 0; i < listeners.length; ++i) {
            const listener = listeners[i];
            if (listener.target instanceof Emitter) {
                const { times, callback } = listener;
                if (times > 1) {
                    listeners[i].times = times - 1;
                }
                else if (times === 0) {
                    listeners.splice(i, 1);
                }
                callback(e);
            }
        }
        return;
    }
    on(type, callback) {
        const listener = this.addEventListener(type, callback);
        return listener.canceller;
    }
    once(type, callback) {
        const listener = this.addEventListener(type, callback);
        listener.times = 0;
        return listener.canceller;
    }
    emit(e) {
        this.dispatchEvent(e);
    }
}
exports.Emitter = Emitter;
//# sourceMappingURL=Emitter.js.map